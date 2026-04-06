package com.eduardocaio.task_manager_project.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.eduardocaio.task_manager_project.dto.TaskDTO;
import com.eduardocaio.task_manager_project.entities.ProjectEntity;
import com.eduardocaio.task_manager_project.entities.TaskEntity;
import com.eduardocaio.task_manager_project.entities.UserEntity;
import com.eduardocaio.task_manager_project.enums.TaskStatus;
import com.eduardocaio.task_manager_project.repositories.TaskRepository;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ProjectService projectService;

    public List<TaskDTO> findAll() {
        List<TaskEntity> tasks = taskRepository.findAll();
        return tasks.stream().map(TaskDTO::new).toList();
    }

    public List<TaskDTO> findByProjectAndUser(Long projectId, String username) {
        if (username != null && !username.equals("")) {
            UserEntity user = userService.findByUsername(username);
            return taskRepository.findByProjectIdAndAssignedToId(projectId, user.getId())
                                .stream()
                                .map(TaskDTO::new)
                                .toList();
        } else {
            return taskRepository.findByProjectId(projectId)
                                .stream()
                                .map(TaskDTO::new)
                                .toList();
        }
    }

    public void create(TaskDTO taskDTO) {
        TaskEntity task = new TaskEntity();
        task.setDescription(taskDTO.getDescription());
        task.setStatus(TaskStatus.TODO);
        task.setPriority(taskDTO.getPriority());
        task.setDeadLine(taskDTO.getDeadLine());

        UserEntity user = userService.findByUsername(taskDTO.getAssignedTo());
        task.setAssignedTo(user);

        ProjectEntity project = projectService.findById(taskDTO.getProjectId());
        task.setProject(project);

        taskRepository.save(task);
    }

    public void update(TaskDTO task, Long id) {
        TaskEntity taskEntity = taskRepository.findById(id).get();
        taskEntity.setDescription(task.getDescription());

        UserEntity user = userService.findByUsername(task.getAssignedTo());
        taskEntity.setAssignedTo(user);

        taskEntity.setPriority(task.getPriority());
        taskEntity.setDeadLine(task.getDeadLine());

        taskRepository.save(taskEntity);
    }

    public void delete(Long id) {
        TaskEntity task = taskRepository.findById(id).get();
        taskRepository.delete(task);
    }

    public void updateStatus(Long id, TaskStatus status) {
        TaskEntity task = taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        task.setStatus(status);
        taskRepository.save(task);
    }

}
