package hy.spring.b.springbootdeveloper.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name="LectureReview")
public class LectureReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lectureReviewId;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String lectureName;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String content;

    @Column(name = "regdate", nullable = false, updatable = false, insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime regdate;

    @ManyToOne
    @JoinColumn(name = "lectureName", referencedColumnName = "lectureName", insertable = false, updatable = false)
    private Lecture lecture;

    @ManyToOne
    @JoinColumn(name="email", referencedColumnName = "email", insertable = false, updatable = false)
    private User user;
}
