package hy.spring.b.springbootdeveloper.controller;

import hy.spring.b.springbootdeveloper.domain.Lecture;
import hy.spring.b.springbootdeveloper.service.LectureService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lectures")
@RequiredArgsConstructor
public class LectureController {
    private final LectureService lectureService;

    @GetMapping
    public List<Lecture> getAllLectures() {
        return lectureService.getAllLectures();
    }

    @GetMapping("/{id}")
    public Lecture getLectureById(@PathVariable Long id) {
        return lectureService.getLectureById(id);
    }

    @PutMapping("/{id}")
    public Lecture updateLecture(@PathVariable Long id, @RequestBody Lecture lectureDetails) {
        Lecture lecture = lectureService.getLectureById(id);
        if (lecture != null) {
            //lecture.setName(lectureDetails.getName());
            lecture.setLectureName(lecture.getLectureName());
            lecture.setUrl(lectureDetails.getUrl());
            return lectureService.saveLecture(lecture);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteLecture(@PathVariable Long id) {
        lectureService.deleteLecture(id);
    }
}