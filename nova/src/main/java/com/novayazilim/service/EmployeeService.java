package com.novayazilim.service;

import com.novayazilim.entity.Department;
import com.novayazilim.entity.Employee;
import com.novayazilim.repository.DepartmentRepository;
import com.novayazilim.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    public EmployeeService(EmployeeRepository employeeRepository, DepartmentRepository departmentRepository, PasswordEncoder passwordEncoder) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Employee save(Employee employee) {
        if (employee.getDepartment() == null || employee.getDepartment().getId() == null) {
            throw new RuntimeException("Çalışan kaydedilirken geçerli bir Department ID belirtilmelidir.");
        }
        
        Department department = departmentRepository.findById(employee.getDepartment().getId())
                .orElseThrow(() -> new RuntimeException("Belirtilen Department ID bulunamadı: " + employee.getDepartment().getId()));
                
        employee.setDepartment(department);
        
        if (employee.getPassword() != null && !employee.getPassword().trim().isEmpty()) {
            employee.setPassword(passwordEncoder.encode(employee.getPassword()));
        } else {
            // Default password if not provided
            employee.setPassword(passwordEncoder.encode("123456"));
        }
        
        return employeeRepository.save(employee);
    }

    public List<Employee> findAll() {
        return employeeRepository.findAll();
    }

    public Optional<Employee> findById(Long id) {
        return employeeRepository.findById(id);
    }

    public Optional<Employee> findByEmail(String email) {
        return employeeRepository.findFirstByEmail(email);
    }

    public List<Employee> findByDepartmentId(Long departmentId) {
        return employeeRepository.findByDepartmentId(departmentId);
    }

    public List<Employee> findByCompanyId(Long companyId) {
        return employeeRepository.findByDepartmentCompanyId(companyId);
    }

    public Employee update(Long id, Employee employeeDetails) {
        return employeeRepository.findById(id)
                .map(existingEmployee -> {
                    existingEmployee.setFirstName(employeeDetails.getFirstName());
                    existingEmployee.setLastName(employeeDetails.getLastName());
                    existingEmployee.setEmail(employeeDetails.getEmail());
                    existingEmployee.setTitle(employeeDetails.getTitle());
                    
                    if (employeeDetails.getRole() != null) {
                        existingEmployee.setRole(employeeDetails.getRole());
                    }
                    
                    if (employeeDetails.getPassword() != null && !employeeDetails.getPassword().trim().isEmpty()) {
                        existingEmployee.setPassword(passwordEncoder.encode(employeeDetails.getPassword()));
                    }
                    
                    if (employeeDetails.getDepartment() != null && employeeDetails.getDepartment().getId() != null) {
                        Department department = departmentRepository.findById(employeeDetails.getDepartment().getId())
                                .orElseThrow(() -> new RuntimeException("Belirtilen Department ID bulunamadı: " + employeeDetails.getDepartment().getId()));
                        existingEmployee.setDepartment(department);
                    }
                    
                    return employeeRepository.save(existingEmployee);
                })
                .orElseThrow(() -> new RuntimeException("Çalışan bulunamadı ID: " + id));
    }

    public void deleteById(Long id) {
        employeeRepository.deleteById(id);
    }
}
