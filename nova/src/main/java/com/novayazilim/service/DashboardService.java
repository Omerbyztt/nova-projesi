package com.novayazilim.service;

import com.novayazilim.dto.DashboardDto;
import com.novayazilim.dto.TaskBasicDto;
import com.novayazilim.entity.Employee;
import com.novayazilim.entity.Task;
import com.novayazilim.entity.TaskStatus;
import com.novayazilim.repository.EmployeeRepository;
import com.novayazilim.repository.TaskRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final TaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;
    private final com.novayazilim.repository.CalendarEventRepository calendarEventRepository;
    private final com.novayazilim.repository.DepartmentRepository departmentRepository;

    public DashboardService(TaskRepository taskRepository, EmployeeRepository employeeRepository, com.novayazilim.repository.CalendarEventRepository calendarEventRepository, com.novayazilim.repository.DepartmentRepository departmentRepository) {
        this.taskRepository = taskRepository;
        this.employeeRepository = employeeRepository;
        this.calendarEventRepository = calendarEventRepository;
        this.departmentRepository = departmentRepository;
    }

    public DashboardDto getDashboardData() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();
        Employee employee = employeeRepository.findFirstByEmail(email)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        DashboardDto dto = new DashboardDto();

        if (employee.getRole().name().equals("EMPLOYEE")) {
            long openTasks = taskRepository.countByAssignedToIdAndStatusNot(employee.getId(), TaskStatus.DONE);
            long completedTasks = taskRepository.countByAssignedToIdAndStatus(employee.getId(), TaskStatus.DONE);
            
            dto.setOpenTasksCount(openTasks);
            dto.setCompletedTasksCount(completedTasks);
            
            dto.setRecentTasks(
                taskRepository.findTop4ByAssignedToIdOrderByDueDateAsc(employee.getId()).stream().map(this::mapToBasicDto).collect(Collectors.toList())
            );
        } else if (employee.getDepartment() != null) {
            Long deptId = employee.getDepartment().getId();
            
            // Count open tasks (Not DONE)
            long openTasks = taskRepository.countByDepartmentIdAndStatusNot(deptId, TaskStatus.DONE);
            
            // Count completed tasks (DONE)
            long completedTasks = taskRepository.countByDepartmentIdAndStatus(deptId, TaskStatus.DONE);
            
            dto.setOpenTasksCount(openTasks);
            dto.setCompletedTasksCount(completedTasks);
            
            dto.setRecentTasks(
                taskRepository.findTop4ByDepartmentIdOrderByDueDateAsc(deptId).stream().map(this::mapToBasicDto).collect(Collectors.toList())
            );
        } else {
            // Default 0 for employees with no department and not EMPLOYEE role (e.g. Admins without dept viewing this, though they usually use summary)
            dto.setOpenTasksCount(0);
            dto.setCompletedTasksCount(0);
            dto.setRecentTasks(java.util.Collections.emptyList());
        }

        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        java.time.LocalDateTime in10Days = now.plusDays(10);
        
        dto.setUpcomingEvents(
            calendarEventRepository.findByEmployeeIdAndStartDateBetweenOrderByStartDateAsc(employee.getId(), now, in10Days)
                .stream()
                .map(com.novayazilim.dto.DtoMapper::toCalendarEventDto)
                .collect(Collectors.toList())
        );

        return dto;
    }

    public com.novayazilim.dto.AdminSummaryDto getAdminSummary() {
        com.novayazilim.dto.AdminSummaryDto summary = new com.novayazilim.dto.AdminSummaryDto();
        summary.setTotalEmployees(employeeRepository.count());
        summary.setTotalDepartments(departmentRepository.count());
        
        java.util.Map<String, Long> depMap = new java.util.HashMap<>();
        employeeRepository.findAll().forEach(emp -> {
            String depName = emp.getDepartment() != null ? emp.getDepartment().getName() : "Atanmadı";
            depMap.put(depName, depMap.getOrDefault(depName, 0L) + 1);
        });
        summary.setEmployeesByDepartment(depMap);
        
        summary.setRecentEmployees(
            employeeRepository.findTop5ByOrderByIdDesc().stream()
                .map(com.novayazilim.dto.DtoMapper::toEmployeeDto)
                .collect(Collectors.toList())
        );
        
        return summary;
    }

    private TaskBasicDto mapToBasicDto(Task task) {
        TaskBasicDto dto = new TaskBasicDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setStatus(task.getStatus());
        dto.setPriority(task.getPriority());
        dto.setDueDate(task.getDueDate());
        return dto;
    }
}
