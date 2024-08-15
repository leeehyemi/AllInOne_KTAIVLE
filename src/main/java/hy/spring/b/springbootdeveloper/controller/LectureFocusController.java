package hy.spring.b.springbootdeveloper.controller;

import hy.spring.b.springbootdeveloper.domain.LectureFocus;
import hy.spring.b.springbootdeveloper.dto.LectureFocusDTO;
import hy.spring.b.springbootdeveloper.service.LectureFocusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lecture-focus")
public class LectureFocusController {

    @Autowired
    private LectureFocusService lectureFocusService;

    @PostMapping("/save-or-update")
    public ResponseEntity<LectureFocus> saveOrUpdateLectureFocus(@RequestBody LectureFocusDTO request) {
        try {
            LectureFocus savedFocus = lectureFocusService.saveOrUpdateLectureFocus(request);
            return ResponseEntity.ok(savedFocus);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/focus")
    public ResponseEntity<List<LectureFocus>> getLectureFocus(@RequestParam String email) {
        List<LectureFocus> focusList = lectureFocusService.getLectureFocusByEmail(email);
        if (focusList != null && !focusList.isEmpty()) {
            return ResponseEntity.ok(focusList);
        } else {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/last-focus")
    public ResponseEntity<LectureFocus> getLastFocus(@RequestParam String email, @RequestParam Long lectureId) {
        LectureFocus lastFocus = lectureFocusService.getLastFocus(email, lectureId);
        if (lastFocus != null) {
            return ResponseEntity.ok(lastFocus);
        } else {
            return ResponseEntity.noContent().build();
        }
    }
}
