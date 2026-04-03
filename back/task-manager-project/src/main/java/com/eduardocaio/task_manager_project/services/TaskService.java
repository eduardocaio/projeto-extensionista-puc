package com.eduardocaio.task_manager_project.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eduardocaio.task_manager_project.dto.TaskDTO;
import com.eduardocaio.task_manager_project.entities.TaskEntity;
import com.eduardocaio.task_manager_project.repositories.TaskRepository;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<TaskDTO> findAll() {
        List<TaskEntity> tasks = taskRepository.findAll();
        return tasks.stream().map(TaskDTO::new).toList();
    }

    public void create(TaskDTO task) {
        taskRepository.save(new TaskEntity(task));
    }

    public void update(Long id) {
        TaskEntity task = taskRepository.findById(id).get();
        if(task.getStatus()){
            task.setStatus(false);
        }
        else{
            task.setStatus(true);
        }
        taskRepository.save(task);
    }

    public void delete(Long id) {
        TaskEntity task = taskRepository.findById(id).get();
        taskRepository.delete(task);
    }

}
