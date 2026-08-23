package com.novayazilim.dto;

import com.novayazilim.entity.Company;
import com.novayazilim.entity.Department;
import com.novayazilim.entity.Employee;
import com.novayazilim.entity.Task;
import com.novayazilim.entity.TaskStatus;

public class DtoMapper {

    public static CompanyDto toCompanyDto(Company company) {
        if (company == null) return null;
        return new CompanyDto(company.getId(), company.getName());
    }

    public static EmployeeBasicDto toEmployeeBasicDto(Employee employee) {
        if (employee == null) return null;
        return new EmployeeBasicDto(employee.getId(), employee.getFirstName(), employee.getLastName());
    }

    public static DepartmentDto toDepartmentDto(Department department) {
        if (department == null) return null;
        DepartmentDto dto = new DepartmentDto();
        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setCompany(toCompanyDto(department.getCompany()));
        dto.setManager(toEmployeeBasicDto(department.getManager()));
        return dto;
    }

    public static EmployeeDto toEmployeeDto(Employee employee) {
        if (employee == null) return null;
        EmployeeDto dto = new EmployeeDto();
        dto.setId(employee.getId());
        dto.setFirstName(employee.getFirstName());
        dto.setLastName(employee.getLastName());
        dto.setEmail(employee.getEmail());
        dto.setTitle(employee.getTitle());
        dto.setRole(employee.getRole());
        dto.setDepartment(toDepartmentDto(employee.getDepartment()));
        return dto;
    }

    public static TaskDto toTaskDto(Task task) {
        if (task == null) return null;
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setDueDate(task.getDueDate());
        dto.setAssignedTo(toEmployeeDto(task.getAssignedTo()));
        dto.setAssignedBy(toEmployeeDto(task.getAssignedBy()));
        dto.setDepartment(toDepartmentDto(task.getDepartment()));
        return dto;
    }
}
