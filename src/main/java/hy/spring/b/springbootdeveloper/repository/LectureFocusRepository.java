package hy.spring.b.springbootdeveloper.repository;

import hy.spring.b.springbootdeveloper.domain.LectureFocus;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LectureFocusRepository extends JpaRepository<LectureFocus, Long> {
    Optional<LectureFocus> findByEmailAndLectureId(String email, Long lectureId);

    @Modifying
    @Transactional
    @Query("UPDATE LectureFocus lf SET lf.userFocus = :userFocus WHERE lf.email = :email AND lf.lectureId = :lectureId")
    int updateLectureFocus(@Param("email") String email, @Param("lectureId") Long lectureId, @Param("userFocus") Long userFocus);

    LectureFocus findFirstByEmailAndLectureIdOrderByLectureFocusIdDesc(String email, Long lectureId);

    List<LectureFocus> findByEmail(String email);
}
