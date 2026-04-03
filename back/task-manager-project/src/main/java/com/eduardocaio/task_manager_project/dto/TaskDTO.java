package com.eduardocaio.task_manager_project.dto;

import org.springframework.beans.BeanUtils;

import com.eduardocaio.task_manager_project.entities.TaskEntity;

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
    private boolean status;

    public TaskDTO(TaskEntity task){
        BeanUtils.copyProperties(task, this);
    }

    

}
