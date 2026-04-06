package com.eduardocaio.task_manager_project.dto;

import org.springframework.beans.BeanUtils;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MembersProjectDTO {

    private Long id;
    private String username;
    private String name;
    private boolean inProject;

    public MembersProjectDTO(UserDTO user){
        BeanUtils.copyProperties(user, this);
    }
}
