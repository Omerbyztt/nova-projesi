package com.novayazilim.repository;

import com.novayazilim.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Employee entity'si için veritabanı işlemlerini yürüten Repository arayüzü.
 */
@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
}
