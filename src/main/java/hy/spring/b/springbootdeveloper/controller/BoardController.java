package hy.spring.b.springbootdeveloper.controller;

import hy.spring.b.springbootdeveloper.seconddomain.Board;
import hy.spring.b.springbootdeveloper.secondrepository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/admin/notices")
public class BoardController {

    @Autowired
    private BoardRepository boardRepository;

    @GetMapping
    public List<Board> getAllNotices() {
        return boardRepository.findAll();
    }

    @GetMapping("/{id}")
    public Board getNoticeById(@PathVariable Long id) {
        return boardRepository.findById(id).orElseThrow(() -> new RuntimeException("Notice not found with id " + id));
    }

    @PostMapping
    public Board createNotice(@RequestBody Board board) {
        return boardRepository.save(board);
    }

    @PutMapping("/{id}")
    public Board updateNotice(@PathVariable Long id, @RequestBody Board boardDetails) {
        Board board = boardRepository.findById(id).orElseThrow(() -> new RuntimeException("Notice not found with id " + id));

        board.setTitle(boardDetails.getTitle());
        board.setContent(boardDetails.getContent());
        board.setUpdatedate(LocalDateTime.now());

        return boardRepository.save(board);
    }

    @DeleteMapping("/{id}")
    public void deleteNotice(@PathVariable Long id) {
        Board board = boardRepository.findById(id).orElseThrow(() -> new RuntimeException("Notice not found with id " + id));
        boardRepository.delete(board);
    }
}
