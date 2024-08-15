package hy.spring.b.springbootdeveloper.service;

import hy.spring.b.springbootdeveloper.domain.PasswordResetToken;
import hy.spring.b.springbootdeveloper.domain.User;
import hy.spring.b.springbootdeveloper.repository.PasswordResetTokenRepository;
import hy.spring.b.springbootdeveloper.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Properties;


@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository,
                       PasswordResetTokenRepository passwordResetTokenRepository,
                       JavaMailSender mailSender,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;

        // SSL 인증서 신뢰 설정 추가
        if (mailSender instanceof JavaMailSenderImpl mailSenderImpl) {
            Properties props = mailSenderImpl.getJavaMailProperties();
            props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
        }
    }

    public User save(User user) {
        String rawPassword = user.getPassword();
        String encodedPassword = passwordEncoder.encode(rawPassword);
        user.setPassword(encodedPassword);
        return userRepository.save(user);
    }

    public String getUserNameByEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return user.getUser_name();  // 여기에서 user_name을 반환
    }


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        System.out.println("User found: " + user.getEmail() + ", Password hash: " + user.getPassword());
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles("USER")
                .build();
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public void createPasswordResetTokenForUser(User user, String token) {
        PasswordResetToken myToken = new PasswordResetToken();
        myToken.setUser(user);
        myToken.setToken(token);
        myToken.setExpiryDate(LocalDateTime.now().plusHours(24)); // 24시간 유효
        passwordResetTokenRepository.save(myToken);
    }

    public void sendPasswordResetEmail(User user, String token) {
        String resetUrl = "https://allinnone.net/reset-password?token=" + token;
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(user.getEmail());
        email.setSubject("비밀번호 재설정");
        email.setText("비밀번호를 재설정하려면 다음 링크를 클릭하세요: " + resetUrl);
        mailSender.send(email);
    }

    public String validatePasswordResetToken(String token) {
        final PasswordResetToken passToken = passwordResetTokenRepository.findByToken(token);
        return !isTokenFound(passToken) ? "invalidToken"
                : isTokenExpired(passToken) ? "expired"
                : null;
    }

    private boolean isTokenFound(PasswordResetToken passToken) {
        return passToken != null;
    }

    private boolean isTokenExpired(PasswordResetToken passToken) {
        return passToken.getExpiryDate().isBefore(LocalDateTime.now());
    }

    public User getUserByPasswordResetToken(String token) {
        return passwordResetTokenRepository.findByToken(token).getUser();
    }

    public void changeUserPassword(User user, String newPassword) {
        String encodedPassword = passwordEncoder.encode(newPassword);
        user.setPassword(encodedPassword);
        userRepository.save(user);
        System.out.println("Password updated in database for user: " + user.getEmail());
    }
}
