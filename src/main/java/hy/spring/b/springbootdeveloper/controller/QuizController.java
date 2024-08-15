package hy.spring.b.springbootdeveloper.controller;

import hy.spring.b.springbootdeveloper.domain.Question;
import hy.spring.b.springbootdeveloper.domain.Quizresults;
import hy.spring.b.springbootdeveloper.dto.QuizResultDTO;
import hy.spring.b.springbootdeveloper.service.QuestionService;
import hy.spring.b.springbootdeveloper.service.QuizresultsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class QuizController {
    private final QuizresultsService quizresultsService;
    private final QuestionService questionService;

    @GetMapping("/api/questions")
    public List<Question> getQuestionsByLecture(@RequestParam String lectureName) {
        return questionService.getQuestionsByLectureName(lectureName);
    }

    @PostMapping("/api/quiz/results")
    public void saveQuizResults(@RequestBody QuizResultDTO quizResultsDTO) {
        quizresultsService.saveQuizResult(quizResultsDTO);
    }

    @GetMapping("/api/quiz/reports")
    public List<QuizResultDTO> getQuizResults(@RequestParam String email) {
        return quizresultsService.getQuizResultsByEmail(email);
    }

    @GetMapping("/api/quiz/reviews")
    public List<QuizResultDTO> getIncorrectAnswer(@RequestParam String email, @RequestParam Long lectureId) {
        return quizresultsService.getIncorrectAnswerByEmailAndLectureId(email, lectureId);
    }


}

