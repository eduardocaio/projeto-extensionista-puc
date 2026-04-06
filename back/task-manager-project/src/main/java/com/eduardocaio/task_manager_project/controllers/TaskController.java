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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eduardocaio.task_manager_project.dto.TaskDTO;
import com.eduardocaio.task_manager_project.services.TaskService;

@RestController
@RequestMapping(value = "/tasks")
@CrossOrigin
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskDTO>> findAll(){
        return ResponseEntity.ok().body(taskService.findAll());
    }

    @GetMapping("/find-by-project-user/{projectId}")
    public ResponseEntity<List<TaskDTO>> findByProjectAndUser(@PathVariable("projectId") Long projectId, @RequestParam(value = "username", required = false) String username) {
        return ResponseEntity.ok().body(taskService.findByProjectAndUser(projectId, username));
    }

    @PostMapping
    public ResponseEntity<Void> create(@RequestBody TaskDTO taskDTO){
        taskService.create(taskDTO);
        return ResponseEntity.ok().build();
    }

    @PutMapping(value = "/{id}")
    public ResponseEntity<Void> update(@RequestBody TaskDTO taskDTO, @PathVariable("id") Long id){
        taskDTO.setId(id);
        taskService.update(taskDTO, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id){
        taskService.delete(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("update-status/{id}")
    public ResponseEntity<Void> updateStatus(
            @PathVariable Long id,
            @RequestBody TaskDTO taskDto) {
        taskService.updateStatus(id, taskDto.getStatus());
        return ResponseEntity.ok().build();
    }

}
