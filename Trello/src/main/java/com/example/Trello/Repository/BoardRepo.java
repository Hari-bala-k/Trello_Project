package com.example.Trello.Repository;

import com.example.Trello.Model.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepo extends JpaRepository<Board,Long> {
    List<Board> findByuserId(Long userId);
}

