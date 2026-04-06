package com.eduardocaio.task_manager_project.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eduardocaio.task_manager_project.dto.MembersProjectDTO;
import com.eduardocaio.task_manager_project.dto.ProjectDTO;
import com.eduardocaio.task_manager_project.services.ProjectService;

@RestController
@RequestMapping(value = "/projects")
@CrossOrigin
public class ProjectController {

    @Autowired
    private ProjectService projectService;
    
    @GetMapping
    public ResponseEntity<List<ProjectDTO>> findAll(){
        return ResponseEntity.ok().body(projectService.findAll());
    }

    @GetMapping("/my-projects/{username}")
    public ResponseEntity<List<ProjectDTO>> findByMember(@PathVariable("username") String username){
        return ResponseEntity.ok().body(projectService.findByMember(username));
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody ProjectDTO project){
        projectService.create(project);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping(value = "/{id}")
    public ResponseEntity<Void> update(@RequestBody ProjectDTO project){
        projectService.update(project);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id){
        projectService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/add-members/{id}")
    public ResponseEntity<Void> addMembers(
            @PathVariable Long id,
            @RequestBody List<String> usernames) {

        projectService.addMembers(usernames, id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/find-members/{id}")
    public ResponseEntity<List<MembersProjectDTO>> findMembers(@PathVariable("id") Long id){
        return ResponseEntity.ok().body(projectService.findMembersProject(id));
    }
}
