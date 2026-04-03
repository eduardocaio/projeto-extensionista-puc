package com.eduardocaio.task_manager_project.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.eduardocaio.task_manager_project.entities.UserEntity;
import com.eduardocaio.task_manager_project.exceptions.UserAlreadyExistsException;
import com.eduardocaio.task_manager_project.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void register(UserEntity user) {
        if (findByUsername(user.getUsername()) != null) 
            throw new UserAlreadyExistsException("Usuário já cadastrado");

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public UserEntity findByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    public List<UserEntity> findAllByUsernameIn(List<String> usernames){
        List<UserEntity> users = userRepository.findAllByUsernameIn(usernames);

        if (users.isEmpty()) 
            throw new RuntimeException("Nenhum usuário encontrado na lista");

        return users;
    }

}
