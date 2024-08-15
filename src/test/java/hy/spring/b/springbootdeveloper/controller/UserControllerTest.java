package hy.spring.b.springbootdeveloper.controller;

import hy.spring.b.springbootdeveloper.controller.UserController;
import hy.spring.b.springbootdeveloper.domain.User;
import hy.spring.b.springbootdeveloper.service.UserService;
import hy.spring.b.springbootdeveloper.utils.JwtTokenUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenUtil jwtTokenUtil;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testRegisterUser() {
        Map<String, String> userMap = new HashMap<>();
        userMap.put("user_name", "testuser");
        userMap.put("email", "test@example.com");
        userMap.put("password", "Password!123");
        userMap.put("agreeTerms", "true");

        User user = new User();
        user.setUser_name("testuser");
        user.setEmail("test@example.com");
        user.setPassword("Password!123");

        when(userService.save(any(User.class))).thenReturn(user);

        ResponseEntity<String> response = userController.registerUser(userMap);

        verify(userService, times(1)).save(any(User.class));
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("회원가입에 성공하였습니다.", response.getBody());
    }

    @Test
    public void testLoginUser() {
        User loginUser = new User();
        loginUser.setEmail("test@example.com");
        loginUser.setPassword("Password!123");

        User user = new User();
        user.setEmail("test@example.com");
        String encodedPassword = "$2a$10$7EqJtq98hPqEX7fNZaFWoO.lH.W6M3h9xrFpjZlTQ8Rn8Be2vfZdm"; // 예제 암호화된 비밀번호
        user.setPassword(encodedPassword);

        when(userService.findByEmail(loginUser.getEmail())).thenReturn(user);
        when(passwordEncoder.matches(anyString(), eq(encodedPassword))).thenReturn(true);
        when(jwtTokenUtil.generateToken(loginUser.getEmail())).thenReturn("mockToken");

        ResponseEntity<Map<String, Object>> response = userController.loginUser(loginUser);

        verify(userService, times(1)).findByEmail(loginUser.getEmail());
        verify(passwordEncoder, times(1)).matches(anyString(), eq(encodedPassword));
        verify(jwtTokenUtil, times(1)).generateToken(loginUser.getEmail());
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("로그인 성공", response.getBody().get("message"));
        assertEquals("mockToken", response.getBody().get("token"));
    }

    // 추가적인 테스트 메소드들도 작성 가능
}
