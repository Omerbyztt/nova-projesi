package com.novayazilim.dto;

import com.novayazilim.entity.TaskPriority;
import com.novayazilim.entity.TaskStatus;
import java.time.LocalDate;

public class TaskBasicDto {
    private Long id;
    private String title;
    private TaskStatus status;
    private TaskPriority priority;
    private LocalDate dueDate;

    public TaskBasicDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }

    public TaskPriority getPriority() { return priority; }
    public void setPriority(TaskPriority priority) { this.priority = priority; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
}
