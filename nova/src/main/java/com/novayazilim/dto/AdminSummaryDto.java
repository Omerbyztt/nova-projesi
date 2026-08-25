package com.novayazilim.dto;

import java.util.List;
import java.util.Map;

public class AdminSummaryDto {
    private long totalEmployees;
    private long totalDepartments;
    private Map<String, Long> employeesByDepartment;
    private List<EmployeeDto> recentEmployees;

    public AdminSummaryDto() {}

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public long getTotalDepartments() {
        return totalDepartments;
    }

    public void setTotalDepartments(long totalDepartments) {
        this.totalDepartments = totalDepartments;
    }

    public Map<String, Long> getEmployeesByDepartment() {
        return employeesByDepartment;
    }

    public void setEmployeesByDepartment(Map<String, Long> employeesByDepartment) {
        this.employeesByDepartment = employeesByDepartment;
    }

    public List<EmployeeDto> getRecentEmployees() {
        return recentEmployees;
    }

    public void setRecentEmployees(List<EmployeeDto> recentEmployees) {
        this.recentEmployees = recentEmployees;
    }
}
