package hy.spring.b.springbootdeveloper.repository;

import hy.spring.b.springbootdeveloper.domain.Quizresults;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface QuizresultsRepository extends JpaRepository<Quizresults, Long> {
    @Modifying
    @Transactional
    @Query("UPDATE Quizresults q SET q.user_answer = :user_answer, q.correct = :correct, q.quiz_score = :quiz_score WHERE q.email = :email AND q.question_id = :question_id AND q.lecture_id = :lecture_id")
    int updateQuizResult(@Param("user_answer") String user_answer,
                         @Param("correct") boolean correct,
                         @Param("quiz_score") Integer quiz_score,
                         @Param("email") String email,
                         @Param("question_id") Long question_id,
                         @Param("lecture_id") Long lecture_id);

    @Query("SELECT qr FROM Quizresults qr WHERE qr.email = :email AND qr.question_id = (SELECT MAX(q.question_id) FROM Quizresults q WHERE q.lecture_id = qr.lecture_id AND q.email = :email)")
    List<Quizresults> findLatestQuizResultsByEmail(@Param("email") String email);

    @Query("SELECT qr FROM Quizresults qr JOIN qr.question q WHERE qr.email = :email AND qr.lecture_id = :lecture_id AND qr.correct = false")
    List<Quizresults> findIncorrectAnswersByEmailAndLectureId(@Param("email") String email, @Param("lecture_id") Long lectureId);


}