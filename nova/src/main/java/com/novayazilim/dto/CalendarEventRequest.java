package com.novayazilim.dto;

import java.time.LocalDateTime;

public class CalendarEventRequest {
    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;

    public CalendarEventRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }
}
