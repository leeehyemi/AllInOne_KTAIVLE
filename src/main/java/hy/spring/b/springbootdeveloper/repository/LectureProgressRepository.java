package hy.spring.b.springbootdeveloper.repository;

import hy.spring.b.springbootdeveloper.domain.LectureProgress;
import hy.spring.b.springbootdeveloper.dto.LectureProgressDTO;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface LectureProgressRepository extends JpaRepository<LectureProgress, Long> {
    LectureProgress findFirstByEmailAndLectureIdOrderByLectureProgressIdDesc(String email, Long lectureId);
    LectureProgress findByEmailAndLectureId(String email, Long lectureId);

    @Modifying
    @Transactional
    @Query("UPDATE LectureProgress lp SET lp.userProgress = :userProgress, lp.lectureTime = :lectureTime WHERE lp.email = :email AND lp.lectureId = :lectureId")
    int updateLectureProgress(@Param("email") String email, @Param("lectureId") Long lectureId, @Param("userProgress") int userProgress, @Param("lectureTime") LocalTime lectureTime);

    @Query("SELECT new hy.spring.b.springbootdeveloper.dto.LectureProgressDTO(lp.lectureId, l.lectureName, lp.userProgress) " +
            "FROM LectureProgress lp JOIN Lecture l ON lp.lectureId = l.lecture_id " +
            "WHERE lp.email = :email")
    List<LectureProgressDTO> findAllByEmailWithLectureName(@Param("email") String email);
}
