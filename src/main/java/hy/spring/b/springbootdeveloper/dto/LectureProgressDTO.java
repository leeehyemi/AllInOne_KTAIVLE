package hy.spring.b.springbootdeveloper.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LectureProgressDTO {
    // Getters and setters
    private Long lectureId;
    private String lectureName;
    private int userProgress;

    public LectureProgressDTO(Long lectureId, String lectureName, int userProgress) {
        this.lectureId = lectureId;
        this.lectureName = lectureName;
        this.userProgress = userProgress;
    }

}
