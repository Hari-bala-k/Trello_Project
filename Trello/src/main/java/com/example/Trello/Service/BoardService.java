package com.example.Trello.Service;

import com.example.Trello.Model.Board;
import com.example.Trello.Repository.BoardRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BoardService {

    @Autowired
    BoardRepo boardRepo;

    public void creatBoard(Board board) {
        boardRepo.save(board);
    }

    public List<Board> getBoards() {
       return boardRepo.findAll();
    }

    public List<Board> getBoard(Long userId) {
        return boardRepo.findByuserId(userId);
    }
}
