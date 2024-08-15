package hy.spring.b.springbootdeveloper.service;

import hy.spring.b.springbootdeveloper.domain.Lecture;
import hy.spring.b.springbootdeveloper.repository.LectureRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LectureService {
    private final LectureRepository lectureRepository;

    public Optional<Lecture> findLectureByName(String lectureName) {
        return lectureRepository.findByLectureName(lectureName);
    }

    public List<Lecture> getAllLectures() {
        return lectureRepository.findAll();
    }

    public Lecture getLectureById(Long id) {
        return lectureRepository.findById(id).orElse(null);
    }

    public Lecture saveLecture(Lecture lecture) {
        return lectureRepository.save(lecture);
    }

    public void deleteLecture(Long id) {
        lectureRepository.deleteById(id);
    }

    public void saveLecture(String fileName, String url) {
        Lecture lecture = new Lecture();
        //lecture.setName(fileName);
        lecture.setLectureName(fileName);
        lecture.setUrl(url);
        lectureRepository.save(lecture);
    }
}