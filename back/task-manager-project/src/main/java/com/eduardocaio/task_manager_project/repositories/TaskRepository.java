package com.eduardocaio.task_manager_project.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eduardocaio.task_manager_project.entities.TaskEntity;

public interface TaskRepository extends JpaRepository<TaskEntity, Long>{
    List<TaskEntity> findByProjectId(Long projectId);
    List<TaskEntity> findByProjectIdAndAssignedToId(Long projectId, Long userId);
}
