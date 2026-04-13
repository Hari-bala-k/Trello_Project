package com.example.Trello.Repository;

import com.example.Trello.Model.ListEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListRepo extends JpaRepository<ListEntity,Long> {
   List<ListEntity> findByboardId(Long boardId);
}
