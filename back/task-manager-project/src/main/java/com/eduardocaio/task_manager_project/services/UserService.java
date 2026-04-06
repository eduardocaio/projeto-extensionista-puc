package com.eduardocaio.task_manager_project.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.eduardocaio.task_manager_project.dto.UserDTO;
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
        Optional<UserEntity> userOptional = userRepository.findByUsername(user.getUsername());

        if (userOptional.isPresent()) 
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

    public List<UserDTO> findAll() {
    List<UserEntity> users = userRepository.findAll();
    return users.stream()
            .map(user -> {
                UserDTO dto = new UserDTO();
                dto.setId(user.getId());
                dto.setName(user.getName());
                dto.setLastName(user.getLastName());
                dto.setUsername(user.getUsername());
                dto.setRole(user.getRole().name()); 
                return dto;
            })
            .toList();
    }

    public void delete(Long id) {
        UserEntity user = userRepository.findById(id).get();
        userRepository.delete(user);
    }

    public void update(UserEntity userEdit) {
        Optional<UserEntity> userOptional = userRepository.findByUsername(userEdit.getUsername());

        if (!userOptional.isPresent()) 
            throw new RuntimeException("Usuário não encontrado");

        UserEntity user = userOptional.get();
        userEdit.setId(user.getId());
        userEdit.setPassword(passwordEncoder.encode(userEdit.getPassword()));

        userRepository.save(userEdit);
    }
}
