package com.novayazilim.dto;

public class DepartmentDto {
    private Long id;
    private String name;
    private CompanyDto company;
    private EmployeeBasicDto manager;

    public DepartmentDto() {}

    public DepartmentDto(Long id, String name, CompanyDto company, EmployeeBasicDto manager) {
        this.id = id;
        this.name = name;
        this.company = company;
        this.manager = manager;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public CompanyDto getCompany() { return company; }
    public void setCompany(CompanyDto company) { this.company = company; }
    public EmployeeBasicDto getManager() { return manager; }
    public void setManager(EmployeeBasicDto manager) { this.manager = manager; }
}
