package com.novayazilim.service;

import com.novayazilim.entity.Employee;
import com.novayazilim.entity.Task;
import com.novayazilim.repository.EmployeeRepository;
import com.novayazilim.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;

    public TaskService(TaskRepository taskRepository, EmployeeRepository employeeRepository) {
        this.taskRepository = taskRepository;
        this.employeeRepository = employeeRepository;
    }

    public Task save(Task task) {
        if (task.getEmployee() == null || task.getEmployee().getId() == null) {
            throw new RuntimeException("Görev kaydedilirken geçerli bir Employee ID belirtilmelidir.");
        }
        
        Employee employee = employeeRepository.findById(task.getEmployee().getId())
                .orElseThrow(() -> new RuntimeException("Belirtilen Employee ID bulunamadı: " + task.getEmployee().getId()));
                
        task.setEmployee(employee);
        
        return taskRepository.save(task);
    }

    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    public Optional<Task> findById(Long id) {
        return taskRepository.findById(id);
    }

    public List<Task> findByEmployeeId(Long employeeId) {
        return taskRepository.findByEmployeeId(employeeId);
    }

    public Task update(Long id, Task taskDetails) {
        return taskRepository.findById(id)
                .map(existingTask -> {
                    existingTask.setTitle(taskDetails.getTitle());
                    existingTask.setDescription(taskDetails.getDescription());
                    existingTask.setStatus(taskDetails.getStatus());
                    
                    if (taskDetails.getEmployee() != null && taskDetails.getEmployee().getId() != null) {
                        Employee employee = employeeRepository.findById(taskDetails.getEmployee().getId())
                                .orElseThrow(() -> new RuntimeException("Belirtilen Employee ID bulunamadı: " + taskDetails.getEmployee().getId()));
                        existingTask.setEmployee(employee);
                    }
                    
                    return taskRepository.save(existingTask);
                })
                .orElseThrow(() -> new RuntimeException("Görev bulunamadı ID: " + id));
    }

    public void deleteById(Long id) {
        taskRepository.deleteById(id);
    }
}
