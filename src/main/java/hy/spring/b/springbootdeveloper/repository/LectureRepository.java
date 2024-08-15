package hy.spring.b.springbootdeveloper.repository;

import hy.spring.b.springbootdeveloper.domain.Lecture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LectureRepository extends JpaRepository<Lecture, Long> {
    Optional<Lecture> findByUrl(String url); // URL로 강의를 찾는 메서드 추가
    Optional<Lecture> findByLectureName(String lectureName);
}
