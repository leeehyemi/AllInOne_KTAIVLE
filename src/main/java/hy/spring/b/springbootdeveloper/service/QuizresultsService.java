package hy.spring.b.springbootdeveloper.service;

import hy.spring.b.springbootdeveloper.domain.Lecture;
import hy.spring.b.springbootdeveloper.domain.Question;
import hy.spring.b.springbootdeveloper.domain.Quizresults;
import hy.spring.b.springbootdeveloper.domain.User;
import hy.spring.b.springbootdeveloper.dto.QuizResultDTO;
import hy.spring.b.springbootdeveloper.repository.LectureRepository;
import hy.spring.b.springbootdeveloper.repository.QuestionRepository;
import hy.spring.b.springbootdeveloper.repository.QuizresultsRepository;
import hy.spring.b.springbootdeveloper.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizresultsService {
    private final QuizresultsRepository quizresultsRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final LectureRepository lectureRepository;

    public QuizresultsService(QuizresultsRepository quizresultsRepository, UserRepository userRepository, QuestionRepository questionRepository, LectureRepository lectureRepository) {
        this.quizresultsRepository = quizresultsRepository;
        this.userRepository = userRepository;
        this.questionRepository = questionRepository;
        this.lectureRepository = lectureRepository;
    }

    @Transactional
    public void saveQuizResult(QuizResultDTO quizResultDTO) {
        int updateRows = quizresultsRepository.updateQuizResult(
                quizResultDTO.getUser_answer(),
                quizResultDTO.getCorrect(),
                quizResultDTO.getQuiz_score(),
                quizResultDTO.getEmail(),
                quizResultDTO.getQuestion_id(),
                quizResultDTO.getLecture_id()
        );
        if (updateRows == 0) {
            Quizresults quizResults = new Quizresults();

            User user = userRepository.findByEmail(quizResultDTO.getEmail());
            quizResults.setUser(user);

            Question question = questionRepository.findById(quizResultDTO.getQuestion_id())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid question ID: " + quizResultDTO.getQuestion_id()));
            quizResults.setQuestion(question);

            Lecture lecture = lectureRepository.findById(quizResultDTO.getLecture_id())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid lecture ID: " + quizResultDTO.getLecture_id()));
            quizResults.setLecture(lecture);

            quizResults.setQuestion_id(quizResultDTO.getQuestion_id());
            quizResults.setLecture_id(quizResultDTO.getLecture_id());
            quizResults.setUser_answer(quizResultDTO.getUser_answer());
            quizResults.setCorrect(quizResultDTO.getCorrect());
            quizResults.setQuiz_score(quizResultDTO.getQuiz_score());

            quizresultsRepository.save(quizResults);
        }
    }

    public List<QuizResultDTO> getAllQuizResults() {
        return quizresultsRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<QuizResultDTO> getQuizResultsByEmail(String email) {
        return quizresultsRepository.findLatestQuizResultsByEmail(email).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<QuizResultDTO> getIncorrectAnswerByEmailAndLectureId(String email, Long lectureId) {
        return quizresultsRepository.findIncorrectAnswersByEmailAndLectureId(email, lectureId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }



    private QuizResultDTO convertToDTO(Quizresults quizresults) {
        QuizResultDTO dto = new QuizResultDTO();
        dto.setEmail(quizresults.getEmail());
        dto.setQuestion_id(quizresults.getQuestion_id());
        dto.setLecture_id(quizresults.getLecture_id());
        dto.setUser_answer(quizresults.getUser_answer());
        dto.setCorrect(quizresults.isCorrect());
        dto.setQuiz_score(quizresults.getQuiz_score());
        dto.setLectureName(quizresults.getQuestion().getLectureName());
        dto.setQuestionText(quizresults.getQuestion().getQuestion());
        dto.setAnswer(quizresults.getQuestion().getAnswer());
        dto.setSubject(quizresults.getQuestion().getSubject());
        dto.setTime(quizresults.getQuestion().getTime());
        dto.setOptionText(quizresults.getQuestion().getOptions());
        return dto;
    }

}
