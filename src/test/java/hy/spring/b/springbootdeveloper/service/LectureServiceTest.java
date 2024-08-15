/* Lecture 단위 테스트 */
package hy.spring.b.springbootdeveloper.service;

import hy.spring.b.springbootdeveloper.domain.Lecture;
import hy.spring.b.springbootdeveloper.repository.LectureRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LectureServiceTest {

    @Mock
    private LectureRepository lectureRepository;

    @InjectMocks
    private LectureService lectureService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllLectures() {
        Lecture lecture1 = new Lecture();
        lecture1.setLectureName("Lecture 1");
        lecture1.setUrl("http://url1.com");

        Lecture lecture2 = new Lecture();
        lecture2.setLectureName("Lecture 2");
        lecture2.setUrl("http://url2.com");

        when(lectureRepository.findAll()).thenReturn(Arrays.asList(lecture1, lecture2));

        List<Lecture> lectures = lectureService.getAllLectures();
        assertEquals(2, lectures.size());
        assertEquals("Lecture 1", lectures.get(0).getLectureName());
        assertEquals("Lecture 2", lectures.get(1).getLectureName());
    }

    @Test
    void testGetLectureById() {
        Lecture lecture = new Lecture();
        lecture.setLectureName("Lecture 1");
        lecture.setUrl("http://url1.com");

        when(lectureRepository.findById(1L)).thenReturn(Optional.of(lecture));

        Lecture foundLecture = lectureService.getLectureById(1L);
        assertNotNull(foundLecture);
        assertEquals("Lecture 1", foundLecture.getLectureName());
    }

    @Test
    void testSaveLecture() {
        Lecture lecture = new Lecture();
        lecture.setLectureName("Lecture 1");
        lecture.setUrl("http://url1.com");

        when(lectureRepository.save(lecture)).thenReturn(lecture);

        Lecture savedLecture = lectureService.saveLecture(lecture);
        assertNotNull(savedLecture);
        assertEquals("Lecture 1", savedLecture.getLectureName());
    }

    @Test
    void testDeleteLecture() {
        lectureService.deleteLecture(1L);
        verify(lectureRepository, times(1)).deleteById(1L);
    }
}
