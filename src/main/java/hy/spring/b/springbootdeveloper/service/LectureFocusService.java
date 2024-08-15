package hy.spring.b.springbootdeveloper.service;

import hy.spring.b.springbootdeveloper.domain.Lecture;
import hy.spring.b.springbootdeveloper.domain.LectureFocus;
import hy.spring.b.springbootdeveloper.dto.LectureFocusDTO;
import hy.spring.b.springbootdeveloper.repository.LectureFocusRepository;
import hy.spring.b.springbootdeveloper.repository.LectureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class LectureFocusService {

    @Autowired
    private LectureFocusRepository lectureFocusRepository;

    @Autowired
    private LectureRepository lectureRepository;

    @Transactional
    public LectureFocus saveOrUpdateLectureFocus(LectureFocusDTO request) {
        Optional<Lecture> optionalLecture = lectureRepository.findByLectureName(request.getLectureName());
        if (!optionalLecture.isPresent()) {
            throw new IllegalArgumentException("Lecture not found with name: " + request.getLectureName());
        }

        Lecture lecture = optionalLecture.get();
        Optional<LectureFocus> existingFocus = lectureFocusRepository.findByEmailAndLectureId(request.getEmail(), lecture.getLecture_id());

        LectureFocus lectureFocus;
        if (existingFocus.isPresent()) {
            lectureFocus = existingFocus.get();
            lectureFocus.setUserFocus(request.getUserFocus());
            lectureFocusRepository.updateLectureFocus(request.getEmail(), lecture.getLecture_id(), request.getUserFocus());
        } else {
            lectureFocus = new LectureFocus();
            lectureFocus.setEmail(request.getEmail());
            lectureFocus.setLectureId(lecture.getLecture_id());
            lectureFocus.setUserFocus(request.getUserFocus());
            lectureFocusRepository.save(lectureFocus);
        }
        return lectureFocus;
    }

    public LectureFocus getLastFocus(String email, Long lectureId) {
        return lectureFocusRepository.findFirstByEmailAndLectureIdOrderByLectureFocusIdDesc(email, lectureId);
    }

    public List<LectureFocus> getLectureFocusByEmail(String email) {
        return lectureFocusRepository.findByEmail(email);
    }

    public Optional<Lecture> findLectureByLectureName(String lectureName) {
        return lectureRepository.findByLectureName(lectureName);
    }
}
