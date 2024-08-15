package hy.spring.b.springbootdeveloper.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable()
                .cors().and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/api/register", "/api/login", "/api/reset-password", "/api/reset-password/**",
                                "/api/change-password", "/upload/**", "/admin/**","/api/video-url/**","/lectures/**",
                                "/api/questions/**", "/api/validate-token","/admin/notices/**", "/api/user-info",
                                "/api/quiz/results/**","/create/process_initial/**","/create/create_pdf/**","/create/create_quiz/**",
                                "/api/lecture-progress/**", "/api/lecture-focus/focus", "api/lecture-focus/**",
                                "/api/lecture-focus/save-or-update", "api/lecture-focus/focus/","/api/quiz/reports/**",
                                "/api/quiz/reviews/**","/api/reviews/**","/api/email/**", "/api/username/**").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin().disable()
                .httpBasic().disable();

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}