package com.novayazilim.controller;

import com.novayazilim.dto.DashboardDto;
import com.novayazilim.dto.EmployeeDto;
import com.novayazilim.dto.DepartmentDto;
import com.novayazilim.entity.Employee;
import com.novayazilim.entity.Department;
import com.novayazilim.repository.CompanyRepository;
import com.novayazilim.repository.DepartmentRepository;
import com.novayazilim.repository.EmployeeRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final CompanyRepository companyRepository;

    public DashboardController(EmployeeRepository employeeRepository, 
                               DepartmentRepository departmentRepository,
                               CompanyRepository companyRepository) {
        this.employeeRepository = employeeRepository;
        this.departmentRepository = departmentRepository;
        this.companyRepository = companyRepository;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardDto> getSummary() {
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        Employee me = employeeRepository.findFirstByEmail(email).orElse(null);
        
        long companyId = -1;
        if (me != null && me.getDepartment() != null && me.getDepartment().getCompany() != null) {
            companyId = me.getDepartment().getCompany().getId();
        }

        List<Employee> allEmps;
        long totalDepartments = 0;
        
        if (companyId != -1) {
            allEmps = employeeRepository.findByDepartmentCompanyId(companyId);
            totalDepartments = departmentRepository.findByCompanyId(companyId).size();
        } else {
            allEmps = employeeRepository.findAll();
            totalDepartments = departmentRepository.count();
        }

        long totalEmployees = allEmps.size();
        long totalCompanies = 1;

        // Son eklenen 5 çalışan (veritabanı büyükse query ile limitlenmeli ama şimdilik memory'de)
        List<EmployeeDto> recent = allEmps.stream()
                .filter(e -> e.getId() != null)
                .sorted((e1, e2) -> e2.getId().compareTo(e1.getId()))
                .limit(5)
                .map(this::convertToDto)
                .collect(Collectors.toList());

        // Departmanlara göre çalışan sayısı
        Map<String, Long> byDept = allEmps.stream()
                .filter(e -> e.getDepartment() != null && e.getDepartment().getName() != null)
                .collect(Collectors.groupingBy(
                        e -> e.getDepartment().getName(),
                        Collectors.counting()
                ));

        DashboardDto dto = new DashboardDto(totalEmployees, totalDepartments, totalCompanies, recent, byDept);
        return ResponseEntity.ok(dto);
    }

    private EmployeeDto convertToDto(Employee employee) {
        DepartmentDto deptDto = null;
        if (employee.getDepartment() != null) {
            Department d = employee.getDepartment();
            deptDto = new DepartmentDto(d.getId(), d.getName(), null, null);
        }
        return new EmployeeDto(
                employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getEmail(),
                employee.getTitle(),
                employee.getRole(),
                deptDto
        );
    }
}
