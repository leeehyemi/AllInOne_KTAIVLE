package hy.spring.b.springbootdeveloper.dto;

import hy.spring.b.springbootdeveloper.domain.Lecture;
import hy.spring.b.springbootdeveloper.domain.Question;
import hy.spring.b.springbootdeveloper.domain.Quizresults;
import hy.spring.b.springbootdeveloper.domain.User;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class QuizResultDTO {
    private String email;
    private Long question_id;
    private Long lecture_id;
    private String user_answer;
    private Boolean correct;
    private Integer quiz_score;
    private String lectureName;
    private String questionText;
    private String answer;
    private String subject;
    private String time;
    private String optionText;


}
