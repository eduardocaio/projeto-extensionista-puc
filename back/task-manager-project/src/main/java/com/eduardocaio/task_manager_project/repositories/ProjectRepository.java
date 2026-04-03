package com.eduardocaio.task_manager_project.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eduardocaio.task_manager_project.entities.ProjectEntity;

public interface ProjectRepository extends JpaRepository<ProjectEntity, Long>{

}
