package com.novayazilim.dto;

import com.novayazilim.entity.Role;

public class EmployeeCreateRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String title;
    private Role role;
    private DepartmentDto department;
    private String password;

    public EmployeeCreateRequest() {}

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

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
