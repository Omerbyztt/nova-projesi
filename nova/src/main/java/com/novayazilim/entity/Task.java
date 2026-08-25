package com.novayazilim.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import java.time.LocalDate;

@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    
    private String description;
    
    @Enumerated(EnumType.STRING)
    private TaskStatus status;
    
    @Enumerated(EnumType.STRING)
    private TaskPriority priority;
    
    private LocalDate dueDate;

    @ManyToOne
    @JoinColumn(name = "assigned_to_id")
    private Employee assignedTo;

    @ManyToOne
    @JoinColumn(name = "assigned_by_id")
    private Employee assignedBy;
    
    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    public Task() {}

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

    public Employee getAssignedTo() { return assignedTo; }
    public void setAssignedTo(Employee assignedTo) { this.assignedTo = assignedTo; }

    public Employee getAssignedBy() { return assignedBy; }
    public void setAssignedBy(Employee assignedBy) { this.assignedBy = assignedBy; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }

    public TaskPriority getPriority() { return priority; }
    public void setPriority(TaskPriority priority) { this.priority = priority; }
}
