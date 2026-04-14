package com.example.TodoList.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.TodoList.model.Tasks;

public interface TaskRepository extends JpaRepository<Tasks,Long>{
    
}
