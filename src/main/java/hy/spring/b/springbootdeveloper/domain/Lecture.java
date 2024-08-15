package hy.spring.b.springbootdeveloper.domain;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Lecture")
@Data
@NoArgsConstructor
@Setter
@Getter
public class Lecture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lecture_id;

    @Column(unique = true)
    private String lectureName;
    private String url;

    public Long getLectureId() {
        return lecture_id;
    }
}