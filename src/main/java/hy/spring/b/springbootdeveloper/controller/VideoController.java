package hy.spring.b.springbootdeveloper.controller;

import hy.spring.b.springbootdeveloper.config.S3Config;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class VideoController {
    private final S3Config s3Config;

    @GetMapping("/api/video-url")
    public String getVideoUrl(@RequestParam("fileName") String fileName) {
        String url = s3Config.getVideoUrl(fileName);
        System.out.println("Video URL: " + url);
        return url;
    }
}
