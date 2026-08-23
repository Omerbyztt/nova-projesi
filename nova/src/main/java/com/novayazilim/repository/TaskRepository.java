package com.novayazilim.repository;

import com.novayazilim.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToId(Long employeeId);
    List<Task> findByDepartmentId(Long departmentId);
    List<Task> findByDepartmentCompanyId(Long companyId);
}
