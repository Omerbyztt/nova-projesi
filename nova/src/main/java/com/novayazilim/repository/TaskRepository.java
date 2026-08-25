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
    
    long countByDepartmentIdAndStatusNot(Long departmentId, com.novayazilim.entity.TaskStatus status);
    long countByDepartmentIdAndStatus(Long departmentId, com.novayazilim.entity.TaskStatus status);
    List<Task> findTop4ByDepartmentIdOrderByDueDateAsc(Long departmentId);
    
    long countByAssignedToIdAndStatusNot(Long assignedToId, com.novayazilim.entity.TaskStatus status);
    long countByAssignedToIdAndStatus(Long assignedToId, com.novayazilim.entity.TaskStatus status);
    List<Task> findTop4ByAssignedToIdOrderByDueDateAsc(Long assignedToId);
}
