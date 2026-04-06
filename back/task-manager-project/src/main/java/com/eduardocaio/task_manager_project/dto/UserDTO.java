package com.eduardocaio.task_manager_project.dto;

import com.eduardocaio.task_manager_project.entities.UserEntity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;
    private String name;
    private String lastName;
    private String username;
    private String role; 

    public UserDTO(UserEntity user){
        this.id = user.getId();
        this.name = user.getName();
        this.lastName = user.getLastName();
        this.username = user.getUsername();
        this.role = user.getRole().name(); 
    }
}
