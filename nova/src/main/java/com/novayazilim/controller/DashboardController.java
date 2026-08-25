package com.novayazilim.controller;

import com.novayazilim.dto.DashboardDto;
import com.novayazilim.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<DashboardDto> getDashboardData() {
        return ResponseEntity.ok(dashboardService.getDashboardData());
    }

    @GetMapping("/summary")
    public ResponseEntity<com.novayazilim.dto.AdminSummaryDto> getAdminSummary() {
        return ResponseEntity.ok(dashboardService.getAdminSummary());
    }
}
