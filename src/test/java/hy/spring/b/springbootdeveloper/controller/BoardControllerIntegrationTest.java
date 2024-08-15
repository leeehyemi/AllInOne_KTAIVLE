package hy.spring.b.springbootdeveloper.controller;

import hy.spring.b.springbootdeveloper.seconddomain.Board;
import hy.spring.b.springbootdeveloper.secondrepository.BoardRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class BoardControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BoardRepository boardRepository;

    @BeforeEach
    void setUp() {
        boardRepository.deleteAll();
    }

    @Test
    void testGetAllNotices() throws Exception {
        Board board1 = new Board();
        board1.setUsername("user1");
        board1.setTitle("Title 1");
        board1.setContent("Content 1");
        board1.setUpdatedate(LocalDateTime.now());
        boardRepository.save(board1);

        Board board2 = new Board();
        board2.setUsername("user2");
        board2.setTitle("Title 2");
        board2.setContent("Content 2");
        board2.setUpdatedate(LocalDateTime.now());
        boardRepository.save(board2);

        mockMvc.perform(get("/admin/notices"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void testGetNoticeById() throws Exception {
        Board board = new Board();
        board.setUsername("user1");
        board.setTitle("Title");
        board.setContent("Content");
        board.setUpdatedate(LocalDateTime.now());
        board = boardRepository.save(board);

        mockMvc.perform(get("/admin/notices/" + board.getBoard_id()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Title"))
                .andExpect(jsonPath("$.content").value("Content"));
    }

    @Test
    void testCreateNotice() throws Exception {
        mockMvc.perform(post("/admin/notices")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"user1\",\"title\":\"New Notice\",\"content\":\"New Content\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("user1"))
                .andExpect(jsonPath("$.title").value("New Notice"))
                .andExpect(jsonPath("$.content").value("New Content"));
    }

    @Test
    void testUpdateNotice() throws Exception {
        Board board = new Board();
        board.setUsername("user1");
        board.setTitle("Title");
        board.setContent("Content");
        board.setUpdatedate(LocalDateTime.now());
        board = boardRepository.save(board);

        mockMvc.perform(put("/admin/notices/" + board.getBoard_id())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"username\":\"user1\",\"title\":\"Updated Notice\",\"content\":\"Updated Content\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("user1"))
                .andExpect(jsonPath("$.title").value("Updated Notice"))
                .andExpect(jsonPath("$.content").value("Updated Content"));
    }
}
