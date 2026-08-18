package com.novayazilim.repository;

import com.novayazilim.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Task entity'si için veritabanı işlemlerini yürüten Repository arayüzü.
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
}
