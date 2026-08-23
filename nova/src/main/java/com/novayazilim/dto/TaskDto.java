package com.novayazilim.dto;

import com.novayazilim.entity.TaskStatus;
import java.time.LocalDate;

public class TaskDto {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private LocalDate dueDate;
    private EmployeeDto assignedTo;
    private EmployeeDto assignedBy;
    private DepartmentDto department;

    public TaskDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public EmployeeDto getAssignedTo() { return assignedTo; }
    public void setAssignedTo(EmployeeDto assignedTo) { this.assignedTo = assignedTo; }

    public EmployeeDto getAssignedBy() { return assignedBy; }
    public void setAssignedBy(EmployeeDto assignedBy) { this.assignedBy = assignedBy; }

    public DepartmentDto getDepartment() { return department; }
    public void setDepartment(DepartmentDto department) { this.department = department; }
}
