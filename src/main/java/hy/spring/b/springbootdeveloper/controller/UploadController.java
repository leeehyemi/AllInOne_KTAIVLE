package hy.spring.b.springbootdeveloper.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import hy.spring.b.springbootdeveloper.config.S3Config;
import hy.spring.b.springbootdeveloper.domain.Lecture;
import hy.spring.b.springbootdeveloper.domain.Question;
import hy.spring.b.springbootdeveloper.repository.LectureRepository;
import hy.spring.b.springbootdeveloper.repository.QuestionRepository;
import hy.spring.b.springbootdeveloper.service.LectureService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@Controller
public class UploadController {
    private final S3Config s3Uploader;
    private final WebClient webClient;
    private final QuestionRepository questionRepository;
    private final LectureService lectureService;

    @GetMapping("/upload")
    public String index() {
        return "upload"; // 템플릿 파일 이름
    }

    @PostMapping("/upload")
    @ResponseBody
    public String upload(@RequestParam("file") MultipartFile multipartFile) throws IOException {
        String uploadUrl = s3Uploader.upload(multipartFile, "static");

        String fileName = multipartFile.getOriginalFilename();
        if (fileName != null && fileName.contains(".")) {
            fileName = fileName.substring(0, fileName.lastIndexOf('.'));
        }

        // 전처리
        webClient.post()
                .uri("/create/process_initial")
                .bodyValue(Map.of("file_name", fileName))
                .retrieve()
                .bodyToMono(String.class)
                .block();

        // pdf
        webClient.post()
                .uri("/create/create_pdf")
                .bodyValue(Map.of("file_name", fileName))
                .retrieve()
                .bodyToMono(String.class)
                .block();

        // 퀴즈 생성
        String quizJson = webClient.post()
                .uri("/create/create_quiz")
                .bodyValue(Map.of("file_name", fileName))
                .retrieve()
                .bodyToMono(String.class)
                .block();

        System.out.println("Received quiz data: " + quizJson);


        ObjectMapper objectMapper = new ObjectMapper();
        Question[] questions = objectMapper.readValue(quizJson, Question[].class);
        for (Question question : questions) {
            Optional<Lecture> lectureOptional  = lectureService.findLectureByName(fileName);  // Lecture 엔티티를 검색하여 설정
            question.setLecture(lectureOptional.get());
            questionRepository.save(question);
        }

        return uploadUrl;
    }
}
