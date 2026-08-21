package com.novayazilim.dto;

import com.novayazilim.entity.Role;

public class EmployeeDto {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String title;
    private Role role;
    private DepartmentDto department;

    public EmployeeDto() {}

    public EmployeeDto(Long id, String firstName, String lastName, String email, String title, Role role, DepartmentDto department) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.title = title;
        this.role = role;
        this.department = department;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public DepartmentDto getDepartment() { return department; }
    public void setDepartment(DepartmentDto department) { this.department = department; }
}
