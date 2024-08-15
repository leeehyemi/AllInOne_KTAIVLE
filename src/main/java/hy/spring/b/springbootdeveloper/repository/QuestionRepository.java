package hy.spring.b.springbootdeveloper.repository;

import hy.spring.b.springbootdeveloper.domain.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByLectureName(String lectureName);
}

