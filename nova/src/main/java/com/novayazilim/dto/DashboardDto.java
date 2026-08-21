package com.novayazilim.dto;

import java.util.List;
import java.util.Map;

public class DashboardDto {
    private long totalEmployees;
    private long totalDepartments;
    private long totalCompanies;
    private List<EmployeeDto> recentEmployees;
    private Map<String, Long> employeesByDepartment;

    public DashboardDto() {}

    public DashboardDto(long totalEmployees, long totalDepartments, long totalCompanies, List<EmployeeDto> recentEmployees, Map<String, Long> employeesByDepartment) {
        this.totalEmployees = totalEmployees;
        this.totalDepartments = totalDepartments;
        this.totalCompanies = totalCompanies;
        this.recentEmployees = recentEmployees;
        this.employeesByDepartment = employeesByDepartment;
    }

    public long getTotalEmployees() { return totalEmployees; }
    public void setTotalEmployees(long totalEmployees) { this.totalEmployees = totalEmployees; }

    public long getTotalDepartments() { return totalDepartments; }
    public void setTotalDepartments(long totalDepartments) { this.totalDepartments = totalDepartments; }

    public long getTotalCompanies() { return totalCompanies; }
    public void setTotalCompanies(long totalCompanies) { this.totalCompanies = totalCompanies; }

    public List<EmployeeDto> getRecentEmployees() { return recentEmployees; }
    public void setRecentEmployees(List<EmployeeDto> recentEmployees) { this.recentEmployees = recentEmployees; }

    public Map<String, Long> getEmployeesByDepartment() { return employeesByDepartment; }
    public void setEmployeesByDepartment(Map<String, Long> employeesByDepartment) { this.employeesByDepartment = employeesByDepartment; }
}
