package hy.spring.b.springbootdeveloper.controller;

import hy.spring.b.springbootdeveloper.domain.LectureFocus;
import hy.spring.b.springbootdeveloper.dto.LectureFocusDTO;
import hy.spring.b.springbootdeveloper.service.LectureFocusService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class LectureFocusControllerTest {

    private MockMvc mockMvc;

    @Mock
    private LectureFocusService lectureFocusService;

    @InjectMocks
    private LectureFocusController lectureFocusController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(lectureFocusController).build();
    }

    @Test
    void testGetLectureFocus() throws Exception {
        LectureFocus lectureFocus1 = new LectureFocus();
        lectureFocus1.setEmail("test@example.com");
        lectureFocus1.setLectureId(1L);
        lectureFocus1.setUserFocus(123L);

        LectureFocus lectureFocus2 = new LectureFocus();
        lectureFocus2.setEmail("test@example.com");
        lectureFocus2.setLectureId(2L);
        lectureFocus2.setUserFocus(456L);

        List<LectureFocus> focusList = Arrays.asList(lectureFocus1, lectureFocus2);

        when(lectureFocusService.getLectureFocusByEmail(anyString())).thenReturn(focusList);

        mockMvc.perform(get("/api/lecture-focus/focus")
                        .param("email", "test@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].userFocus").value(123L))
                .andExpect(jsonPath("$[1].userFocus").value(456L));
    }

    @Test
    void testGetLastFocus() throws Exception {
        LectureFocus lastFocus = new LectureFocus();
        lastFocus.setEmail("test@example.com");
        lastFocus.setLectureId(1L);
        lastFocus.setUserFocus(123L);

        when(lectureFocusService.getLastFocus(anyString(), anyLong())).thenReturn(lastFocus);

        mockMvc.perform(get("/api/lecture-focus/last-focus")
                        .param("email", "test@example.com")
                        .param("lectureId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@example.com"))
                .andExpect(jsonPath("$.lectureId").value(1L))
                .andExpect(jsonPath("$.userFocus").value(123L));
    }
}
