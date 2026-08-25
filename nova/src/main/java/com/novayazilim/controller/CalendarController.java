package com.novayazilim.controller;

import com.novayazilim.dto.CalendarEventDto;
import com.novayazilim.dto.CalendarEventRequest;
import com.novayazilim.service.CalendarService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    private final CalendarService calendarService;

    public CalendarController(CalendarService calendarService) {
        this.calendarService = calendarService;
    }

    @GetMapping
    public ResponseEntity<List<CalendarEventDto>> getMyEvents() {
        return ResponseEntity.ok(calendarService.getMyEvents());
    }

    @PostMapping
    public ResponseEntity<?> createEvent(@RequestBody CalendarEventRequest request) {
        try {
            CalendarEventDto event = calendarService.createEvent(request);
            return ResponseEntity.ok(event);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEvent(@PathVariable Long id, @RequestBody CalendarEventRequest request) {
        try {
            CalendarEventDto event = calendarService.updateEvent(id, request);
            return ResponseEntity.ok(event);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        try {
            calendarService.deleteEvent(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
