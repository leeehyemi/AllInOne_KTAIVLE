package hy.spring.b.springbootdeveloper.service;

import hy.spring.b.springbootdeveloper.domain.LectureReview;
import hy.spring.b.springbootdeveloper.repository.LectureReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LectureReviewService {

    @Autowired
    private LectureReviewRepository lectureReviewRepository;

    public LectureReview saveReview(LectureReview review) {
        return lectureReviewRepository.save(review);
    }

    public List<LectureReview> getALLReviews() {
        return lectureReviewRepository.findAll();
    }
}
