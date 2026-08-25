package com.novayazilim.repository;

import com.novayazilim.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findFirstByEmail(String email);
    List<Employee> findByDepartmentId(Long departmentId);
    List<Employee> findByDepartmentCompanyId(Long companyId);
    List<Employee> findTop5ByOrderByIdDesc();
}
