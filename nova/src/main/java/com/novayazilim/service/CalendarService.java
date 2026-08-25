package com.novayazilim.service;

import com.novayazilim.dto.CalendarEventDto;
import com.novayazilim.dto.CalendarEventRequest;
import com.novayazilim.dto.DtoMapper;
import com.novayazilim.entity.CalendarEvent;
import com.novayazilim.entity.Employee;
import com.novayazilim.repository.CalendarEventRepository;
import com.novayazilim.repository.EmployeeRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CalendarService {

    private final CalendarEventRepository calendarEventRepository;
    private final EmployeeRepository employeeRepository;

    public CalendarService(CalendarEventRepository calendarEventRepository, EmployeeRepository employeeRepository) {
        this.calendarEventRepository = calendarEventRepository;
        this.employeeRepository = employeeRepository;
    }

    private Employee getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return employeeRepository.findFirstByEmail(email)
                .orElseThrow(() -> new RuntimeException("Yetkilendirme hatası: Kullanıcı bulunamadı"));
    }

    public List<CalendarEventDto> getMyEvents() {
        Employee currentUser = getCurrentUser();
        return calendarEventRepository.findByEmployeeId(currentUser.getId())
                .stream()
                .map(DtoMapper::toCalendarEventDto)
                .collect(Collectors.toList());
    }

    public CalendarEventDto createEvent(CalendarEventRequest request) {
        Employee currentUser = getCurrentUser();
        
        CalendarEvent event = new CalendarEvent();
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartDate(request.getStartDate());
        event.setEndDate(request.getEndDate());
        event.setEmployee(currentUser);
        
        CalendarEvent savedEvent = calendarEventRepository.save(event);
        return DtoMapper.toCalendarEventDto(savedEvent);
    }

    public CalendarEventDto updateEvent(Long id, CalendarEventRequest request) {
        Employee currentUser = getCurrentUser();
        CalendarEvent event = calendarEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etkinlik bulunamadı."));
                
        if (!event.getEmployee().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Yetkisiz işlem: Sadece kendi etkinliklerinizi güncelleyebilirsiniz.");
        }
        
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartDate(request.getStartDate());
        event.setEndDate(request.getEndDate());
        
        CalendarEvent savedEvent = calendarEventRepository.save(event);
        return DtoMapper.toCalendarEventDto(savedEvent);
    }

    public void deleteEvent(Long id) {
        Employee currentUser = getCurrentUser();
        CalendarEvent event = calendarEventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Etkinlik bulunamadı."));
                
        if (!event.getEmployee().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Yetkisiz işlem: Sadece kendi etkinliklerinizi silebilirsiniz.");
        }
        
        calendarEventRepository.delete(event);
    }
}
