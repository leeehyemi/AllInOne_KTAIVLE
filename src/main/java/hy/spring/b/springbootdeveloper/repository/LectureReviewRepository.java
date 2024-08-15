package hy.spring.b.springbootdeveloper.repository;

import hy.spring.b.springbootdeveloper.domain.LectureReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LectureReviewRepository extends JpaRepository<LectureReview, Long> {
}
