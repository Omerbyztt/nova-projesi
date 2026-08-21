package com.novayazilim.service;

import com.novayazilim.entity.Company;
import com.novayazilim.entity.Department;
import com.novayazilim.repository.CompanyRepository;
import com.novayazilim.repository.DepartmentRepository;
import com.novayazilim.repository.EmployeeRepository;
import com.novayazilim.entity.Employee;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final CompanyRepository companyRepository;
    private final EmployeeRepository employeeRepository;

    public DepartmentService(DepartmentRepository departmentRepository, CompanyRepository companyRepository, EmployeeRepository employeeRepository) {
        this.departmentRepository = departmentRepository;
        this.companyRepository = companyRepository;
        this.employeeRepository = employeeRepository;
    }

    public Department save(Department department) {
        if (department.getCompany() == null || department.getCompany().getId() == null) {
            throw new RuntimeException("Departman kaydedilirken geçerli bir Company ID belirtilmelidir.");
        }
        
        Company company = companyRepository.findById(department.getCompany().getId())
                .orElseThrow(() -> new RuntimeException("Belirtilen Company ID bulunamadı: " + department.getCompany().getId()));
                
        department.setCompany(company);
        return departmentRepository.save(department);
    }

    public List<Department> findAll() {
        return departmentRepository.findAll();
    }

    public Optional<Department> findById(Long id) {
        return departmentRepository.findById(id);
    }

    public List<Department> findByCompanyId(Long companyId) {
        return departmentRepository.findByCompanyId(companyId);
    }

    public Department update(Long id, Department departmentDetails) {
        return departmentRepository.findById(id)
                .map(existingDepartment -> {
                    existingDepartment.setName(departmentDetails.getName());
                    
                    if (departmentDetails.getCompany() != null && departmentDetails.getCompany().getId() != null) {
                        Company company = companyRepository.findById(departmentDetails.getCompany().getId())
                                .orElseThrow(() -> new RuntimeException("Belirtilen Company ID bulunamadı: " + departmentDetails.getCompany().getId()));
                        existingDepartment.setCompany(company);
                    }
                    
                    if (departmentDetails.getManager() != null && departmentDetails.getManager().getId() != null) {
                        Employee manager = employeeRepository.findById(departmentDetails.getManager().getId())
                                .orElseThrow(() -> new RuntimeException("Yönetici ID bulunamadı: " + departmentDetails.getManager().getId()));
                        existingDepartment.setManager(manager);
                    } else {
                        existingDepartment.setManager(null);
                    }
                    
                    return departmentRepository.save(existingDepartment);
                })
                .orElseThrow(() -> new RuntimeException("Departman bulunamadı ID: " + id));
    }

    public void deleteById(Long id) {
        departmentRepository.deleteById(id);
    }
}
