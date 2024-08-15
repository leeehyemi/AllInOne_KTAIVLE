package hy.spring.b.springbootdeveloper.controller;

import hy.spring.b.springbootdeveloper.domain.User;
import hy.spring.b.springbootdeveloper.service.UserService;
import hy.spring.b.springbootdeveloper.utils.JwtTokenUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;


import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "https://allinnone.net", methods = {RequestMethod.POST, RequestMethod.OPTIONS, RequestMethod.GET, RequestMethod.HEAD})
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;

    public UserController(UserService userService, PasswordEncoder passwordEncoder, JwtTokenUtil jwtTokenUtil) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

//    @PostMapping("/register")
//    public ResponseEntity<String> registerUser(@RequestBody User user) {
//        userService.save(user);
//        return ResponseEntity.ok("User registered successfully");
//    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody Map<String, String> userMap) {
        String user_name = userMap.get("user_name");
        String email = userMap.get("email");
        String password = userMap.get("password");
        boolean agreeTerms = Boolean.parseBoolean(userMap.get("agreeTerms"));

        if(!agreeTerms) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("약관에 동의해주세요.");
        }

        if(password.length() < 8 || !password.matches(".*[!@#$%^&*()].*")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("비밀번호는 8자리 이상, 특수문자를 포함해주세요.");
        }

        User user = new User();
        user.setUser_name(user_name);
        user.setEmail(email);
        user.setPassword(password);

        userService.save(user);
        return ResponseEntity.ok("회원가입에 성공하였습니다.");
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@RequestBody User loginUser) {
        String email = loginUser.getEmail();
        String password = loginUser.getPassword();

        User user = userService.findByEmail(email);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "사용자를 찾을 수 없습니다."));
        }

        if (!passwordEncoder.matches(password, user.getPassword().replace("{bcrypt}", ""))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "잘못된 비밀번호입니다."));
        }

        String token = jwtTokenUtil.generateToken(email);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("message", "로그인 성공");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        String userEmail = request.get("email");
        User user = userService.findByEmail(userEmail);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
        }
        String token = UUID.randomUUID().toString();
        userService.createPasswordResetTokenForUser(user, token);
        userService.sendPasswordResetEmail(user, token);
        return ResponseEntity.ok("비밀번호 재설정 이메일을 전송했습니다.");
    }

    // UserController.java
    @GetMapping("/validate-token")
    public ResponseEntity<?> validateToken(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        System.out.println("Received token: " + token);  // 토큰 로깅

        if (jwtTokenUtil.validateToken(token)) {
            String email = jwtTokenUtil.getEmailFromToken(token);
            System.out.println("Token is valid for user: " + email);  // 유효한 토큰 로깅
            return ResponseEntity.ok(email);
        } else {
            System.out.println("Invalid token");  // 유효하지 않은 토큰 로깅
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");

        System.out.println("Received password change request - Token: " + token);

        if(newPassword.length() < 8 || !newPassword.matches(".*[!@#$%^&*()].*")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("비밀번호는 8자리 이상, 특수문자를 포함해야 합니다.");
        }

        String result = userService.validatePasswordResetToken(token);
        if (result != null) {
            System.out.println("Token validation failed: " + result);
            return ResponseEntity.badRequest().body("에러: " + result);
        }

        User user = userService.getUserByPasswordResetToken(token);
        if (user != null) {
            System.out.println("Changing password for user: " + user.getEmail());
            userService.changeUserPassword(user, newPassword);
            System.out.println("Password changed successfully");
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        } else {
            System.out.println("User not found for token: " + token);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("에러: 사용자를 찾을 수 없습니다.");
        }
    }

    @GetMapping("/user-info")
    public ResponseEntity<?> getUserInfo(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        if (jwtTokenUtil.validateToken(token)) {
            String email = jwtTokenUtil.getEmailFromToken(token);
            User user = userService.findByEmail(email);
            if (user != null) {
                Map<String, String> userInfo = new HashMap<>();
                userInfo.put("name", user.getUser_name());
                userInfo.put("email", user.getEmail());
                return ResponseEntity.ok(userInfo);
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
    }

    @GetMapping("/email/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userService.findByEmail(email);
    }

    @GetMapping("/username")
    public String getUserName(@RequestParam String email) {
        return userService.getUserNameByEmail(email);
    }
}
