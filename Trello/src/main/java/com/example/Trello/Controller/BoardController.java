package com.example.Trello.Controller;

import com.example.Trello.Model.Board;
import com.example.Trello.Service.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/board")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class BoardController {

    @Autowired
    BoardService boardService;

    @PostMapping("/add")
    public String create(@RequestBody Board board){
        boardService.creatBoard(board);
        return "Board Created..!";
    }

    @GetMapping("/get")
    public List<Board> get(){
        return boardService.getBoards();
    }

    @GetMapping("/get/{Id}")
    public List<Board> getBoard(@PathVariable("Id") Long userId){
       return boardService.getBoard(userId);
    }
}
