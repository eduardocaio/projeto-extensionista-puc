package com.eduardocaio.task_manager_project.dto;

import java.time.LocalDate;

import org.springframework.beans.BeanUtils;

import com.eduardocaio.task_manager_project.entities.ProjectEntity;
import com.eduardocaio.task_manager_project.enums.ProjectStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProjectDTO {

    private Long id;
    private String name;
    private LocalDate deadLine;
    private LocalDate registrationDate;
    private ProjectStatus status;

    public ProjectDTO(ProjectEntity project){
        BeanUtils.copyProperties(project, this);
    }

}
