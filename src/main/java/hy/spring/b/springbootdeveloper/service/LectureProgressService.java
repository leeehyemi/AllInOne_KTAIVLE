package hy.spring.b.springbootdeveloper.service;

import hy.spring.b.springbootdeveloper.domain.LectureProgress;
import hy.spring.b.springbootdeveloper.dto.LectureProgressDTO;
import hy.spring.b.springbootdeveloper.repository.LectureProgressRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LectureProgressService {

    @Autowired
    private LectureProgressRepository lectureProgressRepository;

    @Transactional
    public LectureProgress saveLectureProgress(LectureProgress lectureProgress) {
        int updated = lectureProgressRepository.updateLectureProgress(
                lectureProgress.getEmail(),
                lectureProgress.getLectureId(),
                lectureProgress.getUserProgress(),
                lectureProgress.getLectureTime()
        );
        if (updated == 0) {
            return lectureProgressRepository.save(lectureProgress);
        } else {
            return lectureProgressRepository.findByEmailAndLectureId(
                    lectureProgress.getEmail(),
                    lectureProgress.getLectureId()
            );
        }
    }

    public LectureProgress getLastWatchedTime(String email, Long lectureId) {
        return lectureProgressRepository.findFirstByEmailAndLectureIdOrderByLectureProgressIdDesc(email, lectureId);
    }

    public List<LectureProgressDTO> getLectureProgressByEmail(String email) {
        return lectureProgressRepository.findAllByEmailWithLectureName(email);
    }
}
