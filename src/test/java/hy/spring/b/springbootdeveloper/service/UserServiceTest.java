package hy.spring.b.springbootdeveloper.service;

import hy.spring.b.springbootdeveloper.domain.PasswordResetToken;
import hy.spring.b.springbootdeveloper.domain.User;
import hy.spring.b.springbootdeveloper.repository.PasswordResetTokenRepository;
import hy.spring.b.springbootdeveloper.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSaveUser() {
        User user = new User();
        user.setPassword("Password!123");

        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        User savedUser = userService.save(user);

        assertEquals("encodedPassword", savedUser.getPassword());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    public void testFindByEmail() {
        User user = new User();
        user.setEmail("test@example.com");

        when(userRepository.findByEmail(anyString())).thenReturn(user);

        User foundUser = userService.findByEmail("test@example.com");

        assertEquals("test@example.com", foundUser.getEmail());
        verify(userRepository, times(1)).findByEmail("test@example.com");
    }

    @Test
    public void testCreatePasswordResetTokenForUser() {
        User user = new User();
        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setToken("testToken");
        token.setExpiryDate(LocalDateTime.now().plusHours(24));

        userService.createPasswordResetTokenForUser(user, "testToken");

        verify(passwordResetTokenRepository, times(1)).save(any(PasswordResetToken.class));
    }

    @Test
    public void testSendPasswordResetEmail() {
        User user = new User();
        user.setEmail("test@example.com");

        userService.sendPasswordResetEmail(user, "testToken");

        verify(mailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    @Test
    public void testChangeUserPassword() {
        User user = new User();
        user.setPassword("oldPassword");

        when(passwordEncoder.encode(anyString())).thenReturn("newEncodedPassword");

        userService.changeUserPassword(user, "newPassword");

        assertEquals("newEncodedPassword", user.getPassword());
        verify(userRepository, times(1)).save(user);
    }

    // 추가적인 테스트 메소드들도 작성 가능
}
