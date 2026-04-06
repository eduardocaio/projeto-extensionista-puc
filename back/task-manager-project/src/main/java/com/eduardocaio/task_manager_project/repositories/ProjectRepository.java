package com.eduardocaio.task_manager_project.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eduardocaio.task_manager_project.entities.ProjectEntity;
import com.eduardocaio.task_manager_project.entities.UserEntity;

public interface ProjectRepository extends JpaRepository<ProjectEntity, Long>{
    List<ProjectEntity> findByMembers(UserEntity user);
}
