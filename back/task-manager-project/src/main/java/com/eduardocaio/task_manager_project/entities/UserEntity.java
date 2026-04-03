package com.eduardocaio.task_manager_project.entities;

import com.eduardocaio.task_manager_project.enums.UserRoles;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "tb_users")
@Getter
@Setter
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String lastName;

    @Column(unique = true)
    private String username;

    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRoles role;

}
