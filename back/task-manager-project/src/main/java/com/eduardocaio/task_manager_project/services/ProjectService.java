package com.eduardocaio.task_manager_project.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eduardocaio.task_manager_project.dto.ProjectDTO;
import com.eduardocaio.task_manager_project.dto.TaskDTO;
import com.eduardocaio.task_manager_project.entities.ProjectEntity;
import com.eduardocaio.task_manager_project.entities.TaskEntity;
import com.eduardocaio.task_manager_project.entities.UserEntity;
import com.eduardocaio.task_manager_project.repositories.ProjectRepository;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserService userService;

    public List<ProjectDTO> findAll() {
        List<ProjectEntity> projects = projectRepository.findAll();
        return projects.stream().map(ProjectDTO::new).toList();
    }

    public ProjectEntity findById(Long id) {
        ProjectEntity project = projectRepository.findById(id).get();
        return project;
    }

    public void create(ProjectDTO project) {
        projectRepository.save(new ProjectEntity(project));
    }

    public void update(ProjectDTO projectDto) {
        ProjectEntity project = projectRepository.findById(projectDto.getId()).get();

        if(!project.getName().equals(projectDto.getName()))
            project.setName(projectDto.getName());

        if(project.getDeadLine() != projectDto.getDeadLine())
            project.setDeadLine(projectDto.getDeadLine());

        if(project.getStatus() != projectDto.getStatus())
            project.setStatus(projectDto.getStatus());

        projectRepository.save(project);
    }

    public void delete(Long id) {
        ProjectEntity project = projectRepository.findById(id).get();
        projectRepository.delete(project);
    }

    public void addMembers(List<String> usernames, Long id){
        List<UserEntity> users = userService.findAllByUsernameIn(usernames);
        ProjectEntity project = findById(id);
        project.setMembers(users);
        projectRepository.save(project);
    }

}
