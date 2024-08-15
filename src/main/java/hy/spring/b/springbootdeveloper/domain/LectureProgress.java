package hy.spring.b.springbootdeveloper.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

@Entity
@Table(name = "LectureProgress")
@Getter
@Setter
public class LectureProgress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lectureProgressId;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private Long lectureId;

    @Column(nullable = false)
    private int userProgress;

    @Column(nullable = false)
    private LocalTime lectureTime;

    @ManyToOne
    @JoinColumn(name = "email", referencedColumnName = "email", insertable = false, updatable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "lectureId", referencedColumnName = "lecture_id", insertable = false, updatable = false)
    private Lecture lecture;
}
