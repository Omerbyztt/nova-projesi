package com.novayazilim.dto;

import java.util.List;

public class DashboardDto {
    private long openTasksCount;
    private long completedTasksCount;
    private List<TaskBasicDto> recentTasks;
    private List<CalendarEventDto> upcomingEvents;

    public DashboardDto() {}

    public long getOpenTasksCount() { return openTasksCount; }
    public void setOpenTasksCount(long openTasksCount) { this.openTasksCount = openTasksCount; }

    public long getCompletedTasksCount() { return completedTasksCount; }
    public void setCompletedTasksCount(long completedTasksCount) { this.completedTasksCount = completedTasksCount; }

    public List<TaskBasicDto> getRecentTasks() { return recentTasks; }
    public void setRecentTasks(List<TaskBasicDto> recentTasks) { this.recentTasks = recentTasks; }

    public List<CalendarEventDto> getUpcomingEvents() { return upcomingEvents; }
    public void setUpcomingEvents(List<CalendarEventDto> upcomingEvents) { this.upcomingEvents = upcomingEvents; }
}
