package com.novayazilim.controller;

import com.novayazilim.dto.TaskCreateRequest;
import com.novayazilim.dto.TaskDto;
import com.novayazilim.dto.TaskUpdateStatusRequest;
import com.novayazilim.service.TaskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody TaskCreateRequest request) {
        try {
            TaskDto createdTask = taskService.createTask(request);
            return ResponseEntity.ok(createdTask);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<TaskDto>> getTasks() {
        return ResponseEntity.ok(taskService.getTasks());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateTaskStatus(@PathVariable Long id, @RequestBody TaskUpdateStatusRequest request) {
        try {
            TaskDto updatedTask = taskService.updateTaskStatus(id, request);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @RequestBody com.novayazilim.dto.TaskUpdateRequest request) {
        try {
            TaskDto updatedTask = taskService.updateTask(id, request);
            return ResponseEntity.ok(updatedTask);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        try {
            taskService.deleteTask(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
