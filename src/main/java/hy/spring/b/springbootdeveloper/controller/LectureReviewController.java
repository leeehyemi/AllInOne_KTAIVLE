package hy.spring.b.springbootdeveloper.controller;

import hy.spring.b.springbootdeveloper.domain.LectureReview;
import hy.spring.b.springbootdeveloper.service.LectureReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class LectureReviewController {

    @Autowired
    private LectureReviewService lectureReviewService;

    @PostMapping("/register")
    public LectureReview createReview(@RequestBody LectureReview review) {
        return lectureReviewService.saveReview(review);
    }

    @GetMapping("/views")
    public List<LectureReview> getAllReviews() {
        return lectureReviewService.getALLReviews();
    }
}
