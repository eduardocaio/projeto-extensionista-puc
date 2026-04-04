package com.eduardocaio.task_manager_project;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.eduardocaio.task_manager_project.entities.UserEntity;
import com.eduardocaio.task_manager_project.enums.UserRoles;
import com.eduardocaio.task_manager_project.repositories.UserRepository;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {

                UserEntity user = new UserEntity();
                user.setUsername("admin");
                user.setPassword(passwordEncoder.encode("sua-senha"));
                user.setName("Administrador");
                user.setLastName("Sistema");
                user.setRole(UserRoles.ADMIN);
                userRepository.save(user);

                System.out.println("Usuário admin criado!");
            }
        };
    }
}
