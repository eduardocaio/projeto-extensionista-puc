package com.eduardocaio.task_manager_project.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eduardocaio.task_manager_project.entities.UserEntity;

public interface UserRepository extends JpaRepository<UserEntity, Long>{
    Optional<UserEntity> findByUsername(String username);   
    List<UserEntity> findAllByUsernameIn(List<String> usernames);
}
