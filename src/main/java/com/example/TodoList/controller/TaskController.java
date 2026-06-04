package com.example.TodoList.controller;

import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import com.example.TodoList.model.Tasks;
import com.example.TodoList.services.TaskServices;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;



@Controller
@RequestMapping("/tasks")
public class TaskController {

    private final TaskServices taskServices;

    public TaskController(TaskServices taskServices ){
        this.taskServices=taskServices;
    }
    @GetMapping
    public String getTasks(Model model){
     List<Tasks> tasks=taskServices.getAllTask();
     model.addAttribute("tasks",tasks);
     return"tasks";
    }
     @PostMapping("/create")
     public String creatTask(@RequestParam String title){
        taskServices.creatTask(title);
        return "redirect:/";
     }
    @GetMapping("/{id}/delete")
    public String deleteTask(@PathVariable Long id){
     taskServices.deleteTask(id);
     return"redirect:/";
    }
     @GetMapping("/{id}/toggle")
    public String togleTask(@PathVariable Long id){
     taskServices.togleTask(id);
     return"redirect:/";
    }
 }

   
