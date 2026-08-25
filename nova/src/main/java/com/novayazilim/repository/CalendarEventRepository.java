package com.novayazilim.repository;

import com.novayazilim.entity.CalendarEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {
    List<CalendarEvent> findByEmployeeId(Long employeeId);
    List<CalendarEvent> findByEmployeeIdAndStartDateBetweenOrderByStartDateAsc(Long employeeId, LocalDateTime start, LocalDateTime end);
}
