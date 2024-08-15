package hy.spring.b.springbootdeveloper.controller;

import hy.spring.b.springbootdeveloper.seconddomain.Admin;
import hy.spring.b.springbootdeveloper.secondrepository.AdminRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AdminControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AdminRepository adminRepository;

    @BeforeEach
    void setUp() {
        adminRepository.deleteAll();
    }

    @Test
    void testRegister() throws Exception {
        mockMvc.perform(post("/admin/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@example.com\",\"password\":\"password\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Admin registered successfully"));
    }

    @Test
    void testLoginSuccess() throws Exception {
        Admin admin = new Admin();
        admin.setEmail("admin@example.com");
        admin.setPassword("password");
        adminRepository.save(admin);

        mockMvc.perform(post("/admin/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@example.com\",\"password\":\"password\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Admin login successful"));
    }

    @Test
    void testLoginFailure() throws Exception {
        Admin admin = new Admin();
        admin.setEmail("admin@example.com");
        admin.setPassword("password");
        adminRepository.save(admin);

        mockMvc.perform(post("/admin/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@example.com\",\"password\":\"wrongpassword\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Admin login failed"));
    }
}
