package com.novayazilim.service;

import com.novayazilim.dto.DtoMapper;
import com.novayazilim.dto.TaskCreateRequest;
import com.novayazilim.dto.TaskDto;
import com.novayazilim.dto.TaskUpdateStatusRequest;
import com.novayazilim.entity.Employee;
import com.novayazilim.entity.Department;
import com.novayazilim.entity.Company;
import com.novayazilim.entity.Role;
import com.novayazilim.entity.Task;
import com.novayazilim.entity.TaskStatus;
import com.novayazilim.repository.EmployeeRepository;
import com.novayazilim.repository.TaskRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;

    public TaskService(TaskRepository taskRepository, EmployeeRepository employeeRepository) {
        this.taskRepository = taskRepository;
        this.employeeRepository = employeeRepository;
    }

    private Employee getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return employeeRepository.findFirstByEmail(email)
                .orElseThrow(() -> new RuntimeException("Yetkilendirme hatası: Kullanıcı bulunamadı"));
    }

    public TaskDto createTask(TaskCreateRequest request) {
        Employee currentUser = getCurrentUser();

        if (currentUser.getRole() != Role.DEPARTMENT_MANAGER) {
            throw new RuntimeException("Yetkisiz işlem: Sadece Departman Yöneticileri görev atayabilir.");
        }

        Employee assignee = employeeRepository.findById(request.getAssignedToId())
                .orElseThrow(() -> new RuntimeException("Atanacak çalışan bulunamadı."));

        if (!assignee.getDepartment().getId().equals(currentUser.getDepartment().getId())) {
            throw new RuntimeException("Yetkisiz işlem: Sadece kendi departmanınızdaki çalışanlara görev atayabilirsiniz.");
        }

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setStatus(TaskStatus.TODO);
        task.setAssignedTo(assignee);
        task.setAssignedBy(currentUser);
        task.setDepartment(currentUser.getDepartment());

        Task savedTask = taskRepository.save(task);
        return DtoMapper.toTaskDto(savedTask);
    }

    public List<TaskDto> getTasks() {
        Employee currentUser = getCurrentUser();
        List<Task> tasks;

        if (currentUser.getRole() == Role.COMPANY_ADMIN || currentUser.getRole() == Role.SUPER_ADMIN) {
            tasks = taskRepository.findByDepartmentCompanyId(currentUser.getDepartment().getCompany().getId());
        } else if (currentUser.getRole() == Role.DEPARTMENT_MANAGER) {
            tasks = taskRepository.findByDepartmentId(currentUser.getDepartment().getId());
        } else {
            // EMPLOYEE
            tasks = taskRepository.findByAssignedToId(currentUser.getId());
        }

        return tasks.stream().map(DtoMapper::toTaskDto).collect(Collectors.toList());
    }

    public TaskDto updateTaskStatus(Long taskId, TaskUpdateStatusRequest request) {
        Employee currentUser = getCurrentUser();
        
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Görev bulunamadı."));

        if (currentUser.getRole() == Role.EMPLOYEE && !task.getAssignedTo().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Yetkisiz işlem: Sadece size atanan görevleri güncelleyebilirsiniz.");
        }
        
        if (currentUser.getRole() == Role.DEPARTMENT_MANAGER && !task.getDepartment().getId().equals(currentUser.getDepartment().getId())) {
            throw new RuntimeException("Yetkisiz işlem: Sadece kendi departmanınızdaki görevleri güncelleyebilirsiniz.");
        }

        if (currentUser.getRole() == Role.COMPANY_ADMIN) {
            throw new RuntimeException("Yetkisiz işlem: Şirket Yöneticileri görev durumunu güncelleyemez.");
        }

        task.setStatus(request.getStatus());
        Task savedTask = taskRepository.save(task);
        return DtoMapper.toTaskDto(savedTask);
    }
}
