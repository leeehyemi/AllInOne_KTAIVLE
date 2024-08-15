/* Lecture 통합 테스트*/
package hy.spring.b.springbootdeveloper.controller;

import hy.spring.b.springbootdeveloper.domain.Lecture;
import hy.spring.b.springbootdeveloper.service.LectureService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(LectureController.class)
@AutoConfigureMockMvc
@WithMockUser
class LectureControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private LectureService lectureService;

    @Test
    void testGetAllLectures() throws Exception {
        Lecture lecture1 = new Lecture();
        lecture1.setLectureName("Lecture 1");
        lecture1.setUrl("http://url1.com");

        Lecture lecture2 = new Lecture();
        lecture2.setLectureName("Lecture 2");
        lecture2.setUrl("http://url2.com");

        when(lectureService.getAllLectures()).thenReturn(Arrays.asList(lecture1, lecture2));

        mockMvc.perform(get("/lectures"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].lectureName").value("Lecture 1"))
                .andExpect(jsonPath("$[1].lectureName").value("Lecture 2"));
    }

    @Test
    void testGetLectureById() throws Exception {
        Lecture lecture = new Lecture();
        lecture.setLectureName("Lecture 1");
        lecture.setUrl("http://url1.com");

        when(lectureService.getLectureById(1L)).thenReturn(lecture);

        mockMvc.perform(get("/lectures/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lectureName").value("Lecture 1"))
                .andExpect(jsonPath("$.url").value("http://url1.com"));
    }
}
