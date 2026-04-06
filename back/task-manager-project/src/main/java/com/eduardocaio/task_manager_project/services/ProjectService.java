package com.eduardocaio.task_manager_project.services;

import java.lang.reflect.Member;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eduardocaio.task_manager_project.dto.MembersProjectDTO;
import com.eduardocaio.task_manager_project.dto.ProjectDTO;
import com.eduardocaio.task_manager_project.dto.TaskDTO;
import com.eduardocaio.task_manager_project.dto.UserDTO;
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

    public List<ProjectDTO> findByMember(String username) {
        UserEntity user = userService.findByUsername(username);
        List<ProjectEntity> projects = projectRepository.findByMembers(user);
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
        List<UserEntity> users = new ArrayList<>();

        if(!usernames.isEmpty())
            users = userService.findAllByUsernameIn(usernames);

        ProjectEntity project = findById(id);
        project.setMembers(users);
        projectRepository.save(project);
    }

    public List<MembersProjectDTO> findMembersProject(Long id){
        List<UserDTO> allUsers = userService.findAll();

        List<MembersProjectDTO> allMembers = allUsers.stream()
            .map(user -> {
                MembersProjectDTO dto = new MembersProjectDTO();
                dto.setId(user.getId());
                dto.setName(user.getName());
                dto.setUsername(user.getUsername());
                dto.setInProject(false); 
                return dto;
            })
            .toList();

        ProjectEntity project = findById(id);

        for(MembersProjectDTO user : allMembers){
            for(UserEntity member : project.getMembers()){
                if(user.getId() == member.getId())
                    user.setInProject(true);
            }
        }

        return allMembers;
    }


}
