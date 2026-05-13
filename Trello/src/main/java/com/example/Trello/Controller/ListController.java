package com.example.Trello.Controller;

import com.example.Trello.Model.ListEntity;
import com.example.Trello.Service.ListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/list")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class ListController {

    @Autowired
    ListService listService;

  @PostMapping("/add")
  public String create(@RequestBody ListEntity list){
      listService.createList(list);
      return "List created..!";
  }

  @GetMapping("/get")
    public List<ListEntity> get(){
      return listService.getLists();
  }

  @GetMapping("/get/{boardId}")
    public List<ListEntity> getList(@PathVariable Long boardId){
      return listService.getList(boardId);
  }
}
