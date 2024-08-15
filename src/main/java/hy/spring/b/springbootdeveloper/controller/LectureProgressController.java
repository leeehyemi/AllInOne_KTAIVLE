package hy.spring.b.springbootdeveloper.controller;

import hy.spring.b.springbootdeveloper.domain.LectureProgress;
import hy.spring.b.springbootdeveloper.dto.LectureProgressDTO;
import hy.spring.b.springbootdeveloper.service.LectureProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lecture-progress")
public class LectureProgressController {
    @Autowired
    private LectureProgressService lectureProgressService;

    @PostMapping
    public ResponseEntity<LectureProgress> saveLectureProgress(@RequestBody LectureProgress lectureProgress) {
        LectureProgress savedProgress = lectureProgressService.saveLectureProgress(lectureProgress);
        return ResponseEntity.ok(savedProgress);
    }

    @GetMapping("/last-watched")
    public ResponseEntity<LectureProgress> getLastWatchedTime(@RequestParam String email, @RequestParam Long lectureId) {
        LectureProgress lastWatched = lectureProgressService.getLastWatchedTime(email, lectureId);
        if (lastWatched != null) {
            return ResponseEntity.ok(lastWatched);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<LectureProgressDTO>> getAllLectureProgress(@RequestParam String email) {
        List<LectureProgressDTO> progressList = lectureProgressService.getLectureProgressByEmail(email);
        return ResponseEntity.ok(progressList);
    }
}
