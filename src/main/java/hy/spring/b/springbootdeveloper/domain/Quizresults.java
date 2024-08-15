package hy.spring.b.springbootdeveloper.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "QuizResults")
@Data
@NoArgsConstructor
public class Quizresults {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long quizresults_id;

    @Column(name = "email", insertable = false, updatable = false, nullable = false)
    private String email;

    @Column(name = "question_id", insertable = false, updatable = false)
    private Long question_id;

    @Column(name = "lecture_id", insertable = false, updatable = false)
    private Long lecture_id;

    @ManyToOne
    @JoinColumn(name = "email", referencedColumnName = "email", insertable = true, updatable = true)
    private User user;

    @ManyToOne
    @JoinColumn(name = "question_id", referencedColumnName = "questionId", insertable = true, updatable = true)
    private Question question;

    @ManyToOne
    @JoinColumn(name = "lecture_id", referencedColumnName = "lecture_id", insertable = true, updatable = true)
    private Lecture lecture;

    @Column(name = "user_answer", nullable = false)
    private String user_answer;
    @Column(name = "correct", nullable = false)
    private boolean correct;
    @Column(name = "quiz_score")
    private Integer quiz_score;
}
