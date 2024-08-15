package hy.spring.b.springbootdeveloper.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import hy.spring.b.springbootdeveloper.domain.Lecture;
import hy.spring.b.springbootdeveloper.service.LectureService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Objects;
import java.util.Optional;


@Slf4j
@Configuration
public class S3Config {

    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey;

    @Value("${cloud.aws.region.static}")
    private String region;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    private final LectureService lectureService;

    public S3Config(LectureService lectureService) {
        this.lectureService = lectureService;
    }

    @Bean
    public AmazonS3 amazonS3Client() {
        BasicAWSCredentials awsCredentials = new BasicAWSCredentials(accessKey, secretKey);
        return AmazonS3ClientBuilder.standard()
                .withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .build();
    }

    public String getVideoUrl(String fileName) {
        return amazonS3Client().getUrl(bucket, "static/" + fileName).toString();
    }

    public String upload(MultipartFile multipartFile, String dirName) throws IOException {
        File uploadFile = convert(multipartFile)
                .orElseThrow(() -> new IllegalArgumentException("MultipartFile -> File로 전환이 실패했습니다."));

        String originalFileName = multipartFile.getOriginalFilename();
        String fileNameWithoutExtension = Objects.requireNonNull(originalFileName).replaceAll("\\.mp4$", "");

        String uploadUrl = uploadToS3(uploadFile, dirName);
        saveLectureToDB(fileNameWithoutExtension, uploadUrl); //.mp4 제거 저장
        return uploadUrl;
    }

    private String uploadToS3(File uploadFile, String dirName) {
        String fileName = dirName + "/" + uploadFile.getName();
        String uploadImageUrl = putS3(uploadFile, fileName);
        removeNewFile(uploadFile);
        return uploadImageUrl;
    }

    private String putS3(File uploadFile, String fileName) {
        amazonS3Client().putObject(new PutObjectRequest(bucket, fileName, uploadFile).withCannedAcl(CannedAccessControlList.PublicRead));
        String filePath = "static/" + fileName;
        return amazonS3Client().getUrl(bucket, filePath).toString();
    }

    private void removeNewFile(File targetFile) {
        if (targetFile.delete()) {
            log.info("파일이 삭제되었습니다.");
        } else {
            log.info("파일이 삭제되지 못했습니다.");
        }
    }

    private Optional<File> convert(MultipartFile file) throws IOException {
        // 임시 디렉터리에 파일 저장
        File convertFile = new File(System.getProperty("java.io.tmpdir"), Objects.requireNonNull(file.getOriginalFilename()));
        if (convertFile.createNewFile()) {
            try (FileOutputStream fos = new FileOutputStream(convertFile)) {
                fos.write(file.getBytes());
            }
            return Optional.of(convertFile);
        }
        return Optional.empty();
    }

    private void saveLectureToDB(String fileName, String url) {
        Lecture lecture = new Lecture();
        //lecture.setName(fileName);
        lecture.setLectureName(fileName);
        lecture.setUrl(url);
        lectureService.saveLecture(lecture);
    }

    @Bean
    public WebClient webClient() {
        return WebClient.builder()
                .baseUrl("https://allinone-flask.com")
                .build();
    }
}