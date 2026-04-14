package com.example.TodoList.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.TodoList.model.Tasks;
import com.example.TodoList.repository.TaskRepository;

@Service
public class TaskServices {
    private final TaskRepository taskRepository ;
    
    public TaskServices(TaskRepository taskRepository){
        this.taskRepository=taskRepository;
    }
    public List<Tasks> getAllTask(){
        return taskRepository.findAll();
    }
    public void creatTask(String title){
        Tasks task=new Tasks();
        task.setTitle(title);
        task.setCompleted(false);
       taskRepository.save(task);
    }
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
    
    public void togleTask(Long id) {
        Tasks task=taskRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Invalid task id"));
        task.setCompleted(!task.isCompleted());
        taskRepository.save(task);
    }
}
