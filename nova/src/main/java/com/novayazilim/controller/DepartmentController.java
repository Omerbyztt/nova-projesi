package com.novayazilim.controller;

import com.novayazilim.entity.Department;
import com.novayazilim.service.DepartmentService;
import com.novayazilim.dto.DepartmentDto;
import com.novayazilim.dto.DtoMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.stream.Collectors;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @PostMapping
    public ResponseEntity<DepartmentDto> createDepartment(@RequestBody Department department) {
        try {
            Department saved = departmentService.save(department);
            return ResponseEntity.ok(DtoMapper.toDepartmentDto(saved));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<DepartmentDto>> getAllDepartments() {
        List<DepartmentDto> dtos = departmentService.findAll().stream()
                .map(DtoMapper::toDepartmentDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentDto> getDepartmentById(@PathVariable Long id) {
        return departmentService.findById(id)
                .map(DtoMapper::toDepartmentDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/company/{companyId}")
    public ResponseEntity<?> getDepartmentsByCompanyId(@PathVariable Long companyId) {
        try {
            List<DepartmentDto> dtos = departmentService.findByCompanyId(companyId).stream()
                    .map(DtoMapper::toDepartmentDto)
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
    public ResponseEntity<?> updateDepartment(@PathVariable Long id, @RequestBody Department departmentDetails) {
        try {
            Department updatedDepartment = departmentService.update(id, departmentDetails);
            return ResponseEntity.ok(DtoMapper.toDepartmentDto(updatedDepartment));
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Hata oluştu: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Long id) {
        try {
            departmentService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.badRequest().body("Bu departmana bağlı çalışanlar veya görevler olduğu için silinemez. Lütfen önce onları temizleyin.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Departman silinirken bir hata oluştu.");
        }
    }
}
