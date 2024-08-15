/* 단위 테스트 */
package hy.spring.b.springbootdeveloper.controller;

import hy.spring.b.springbootdeveloper.seconddomain.Board;
import hy.spring.b.springbootdeveloper.secondrepository.BoardRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BoardController.class)
@AutoConfigureMockMvc
class BoardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BoardRepository boardRepository;

    @Test
    @WithMockUser
    void testGetAllNotices() throws Exception {
        Board board1 = new Board();
        board1.setTitle("Notice 1");
        board1.setContent("Content 1");

        Board board2 = new Board();
        board2.setTitle("Notice 2");
        board2.setContent("Content 2");

        when(boardRepository.findAll()).thenReturn(Arrays.asList(board1, board2));

        mockMvc.perform(get("/admin/notices"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].title").value("Notice 1"))
                .andExpect(jsonPath("$[1].title").value("Notice 2"));
    }

    @Test
    @WithMockUser
    void testGetNoticeById() throws Exception {
        Board board = new Board();
        board.setTitle("Notice 1");
        board.setContent("Content 1");

        when(boardRepository.findById(1L)).thenReturn(Optional.of(board));

        mockMvc.perform(get("/admin/notices/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Notice 1"))
                .andExpect(jsonPath("$.content").value("Content 1"));
    }

    @Test
    @WithMockUser
    void testCreateNotice() throws Exception {
        Board board = new Board();
        board.setTitle("New Notice");
        board.setContent("New Content");

        when(boardRepository.save(any(Board.class))).thenReturn(board);

        mockMvc.perform(post("/admin/notices")
                        .with(csrf())  // CSRF 토큰 추가
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"New Notice\",\"content\":\"New Content\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("New Notice"))
                .andExpect(jsonPath("$.content").value("New Content"));
    }

    @Test
    @WithMockUser
    void testUpdateNotice() throws Exception {
        Board board = new Board();
        board.setTitle("Old Notice");
        board.setContent("Old Content");

        Board updatedBoard = new Board();
        updatedBoard.setTitle("Updated Notice");
        updatedBoard.setContent("Updated Content");
        updatedBoard.setUpdatedate(LocalDateTime.now());

        when(boardRepository.findById(1L)).thenReturn(Optional.of(board));
        when(boardRepository.save(any(Board.class))).thenReturn(updatedBoard);

        mockMvc.perform(put("/admin/notices/1")
                        .with(csrf())  // CSRF 토큰 추가
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Updated Notice\",\"content\":\"Updated Content\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Notice"))
                .andExpect(jsonPath("$.content").value("Updated Content"));
    }

    @Test
    @WithMockUser
    void testDeleteNotice() throws Exception {
        Board board = new Board();
        board.setTitle("Notice to Delete");
        board.setContent("Content to Delete");

        when(boardRepository.findById(1L)).thenReturn(Optional.of(board));

        mockMvc.perform(delete("/admin/notices/1")
                        .with(csrf()))  // CSRF 토큰 추가
                .andExpect(status().isOk());

        verify(boardRepository, times(1)).delete(board);
    }
}
