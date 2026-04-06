package com.eduardocaio.task_manager_project.dto;

import java.time.LocalDate;

import org.springframework.beans.BeanUtils;

import com.eduardocaio.task_manager_project.entities.TaskEntity;
import com.eduardocaio.task_manager_project.entities.UserEntity;
import com.eduardocaio.task_manager_project.enums.TaskPriority;
import com.eduardocaio.task_manager_project.enums.TaskStatus;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(of = "id")
public class TaskDTO {

    private Long id;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private String assignedTo; 
    private Long projectId;   
    private LocalDate deadLine;
    private LocalDate registrationDate;

    public TaskDTO(TaskEntity task){
        BeanUtils.copyProperties(task, this);
        if(task.getAssignedTo() != null) {
            this.assignedTo = task.getAssignedTo().getUsername();
        }
        if(task.getProject() != null){
            this.projectId = task.getProject().getId();
        }
    }
}
