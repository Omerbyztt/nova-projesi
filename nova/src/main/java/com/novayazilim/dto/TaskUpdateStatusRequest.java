package com.novayazilim.dto;

import com.novayazilim.entity.TaskStatus;

public class TaskUpdateStatusRequest {
    private TaskStatus status;

    public TaskUpdateStatusRequest() {}

    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }
}
