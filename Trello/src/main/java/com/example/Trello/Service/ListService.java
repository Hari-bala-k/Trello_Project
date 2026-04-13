package com.example.Trello.Service;

import com.example.Trello.Model.ListEntity;
import com.example.Trello.Repository.ListRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ListService {

    @Autowired
    ListRepo listRepo;

    public void createList(ListEntity list) {
        listRepo.save(list);
    }

    public List<ListEntity> getLists() {
        return listRepo.findAll();
    }

    public List<ListEntity> getList(Long boardId) {
        return listRepo.findByboardId(boardId);
    }
}
