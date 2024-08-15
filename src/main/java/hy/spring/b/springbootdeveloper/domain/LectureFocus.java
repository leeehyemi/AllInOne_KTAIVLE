package hy.spring.b.springbootdeveloper.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="LectureFocus")
public class LectureFocus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lectureFocusId;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private Long lectureId; // Ensure this field is properly set

    @Column(nullable = false)
    private Long userFocus;

    @ManyToOne
    @JoinColumn(name = "lectureId", referencedColumnName = "lecture_id", insertable = false, updatable = false)
    private Lecture lecture;

    @ManyToOne
    @JoinColumn(name = "email", referencedColumnName = "email", insertable = false, updatable = false)
    private User user;
}
