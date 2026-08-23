package com.novayazilim.controller;

import com.novayazilim.entity.Employee;
import com.novayazilim.service.EmployeeService;
import com.novayazilim.dto.EmployeeDto;
import com.novayazilim.dto.DtoMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping
    public ResponseEntity<EmployeeDto> createEmployee(@RequestBody Employee employee) {
        try {
            Employee saved = employeeService.save(employee);
            return ResponseEntity.ok(DtoMapper.toEmployeeDto(saved));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<EmployeeDto> getCurrentEmployee() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(401).build();
        }
        String email = auth.getName();
        return employeeService.findByEmail(email)
                .map(DtoMapper::toEmployeeDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<EmployeeDto>> getAllEmployees() {
        List<EmployeeDto> dtos = employeeService.findAll().stream()
                .map(DtoMapper::toEmployeeDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeDto> getEmployeeById(@PathVariable Long id) {
        return employeeService.findById(id)
                .map(DtoMapper::toEmployeeDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<EmployeeDto>> getEmployeesByDepartmentId(@PathVariable Long departmentId) {
        List<EmployeeDto> dtos = employeeService.findByDepartmentId(departmentId).stream()
                .map(DtoMapper::toEmployeeDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<?> getEmployeesByCompanyId(@PathVariable Long companyId) {
        try {
            List<EmployeeDto> dtos = employeeService.findByCompanyId(companyId).stream()
                    .map(DtoMapper::toEmployeeDto)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            java.io.StringWriter sw = new java.io.StringWriter();
            java.io.PrintWriter pw = new java.io.PrintWriter(sw);
            e.printStackTrace(pw);
            return ResponseEntity.status(500).body("HATA: " + e.getMessage() + "\n" + sw.toString());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeDto> updateEmployee(@PathVariable Long id, @RequestBody Employee employeeDetails) {
        try {
            Employee updatedEmployee = employeeService.update(id, employeeDetails);
            return ResponseEntity.ok(DtoMapper.toEmployeeDto(updatedEmployee));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        try {
            employeeService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body("Bu çalışan bir departmanın yöneticisi veya görevlere atanmış olduğu için silinemez. Lütfen önce bağlarını koparın.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Çalışan silinirken bir hata oluştu.");
        }
    }
}
