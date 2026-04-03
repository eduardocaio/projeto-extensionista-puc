package com.eduardocaio.task_manager_project.dto;

import java.time.LocalDate;

import org.springframework.beans.BeanUtils;

import com.eduardocaio.task_manager_project.entities.ProjectEntity;

public class ProjectDTO {

    private Long id;
    private String name;
    private LocalDate deadLine;
    private LocalDate registrationDate;

    public ProjectDTO(ProjectEntity project){
        BeanUtils.copyProperties(project, this);
    }

}
