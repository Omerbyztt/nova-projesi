package com.novayazilim.repository;

import com.novayazilim.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Department entity'si için veritabanı işlemlerini yürüten Repository arayüzü.
 */
@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
}
