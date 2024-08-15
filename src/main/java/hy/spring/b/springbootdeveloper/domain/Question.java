package hy.spring.b.springbootdeveloper.domain;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "Question")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long questionId;

    private String question;
    private String options;
    private String answer;
    private String subject;
    private String time;
    @Column(name = "lectureName")
    private String lectureName;


    @ManyToOne
    @JoinColumn(name = "lectureName", referencedColumnName = "lectureName", insertable = false, updatable = false)
    private Lecture lecture;
}
