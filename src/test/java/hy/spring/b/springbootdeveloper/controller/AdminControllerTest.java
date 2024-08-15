/* 단위 테스트 */
package hy.spring.b.springbootdeveloper.controller;

import hy.spring.b.springbootdeveloper.seconddomain.Admin;
import hy.spring.b.springbootdeveloper.service.AdminService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminController.class)
@AutoConfigureMockMvc
class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AdminService adminService;

    @Test
    @WithMockUser
    void testLoginSuccess() throws Exception {
        Admin admin = new Admin();
        admin.setEmail("admin@example.com");
        admin.setPassword("password");

        when(adminService.authenticate(admin.getEmail(), admin.getPassword())).thenReturn(true);

        mockMvc.perform(post("/admin/login")
                        .with(csrf())  // CSRF 토큰 추가
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@example.com\",\"password\":\"password\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Admin login successful"));
    }

    @Test
    @WithMockUser
    void testLoginFailure() throws Exception {
        Admin admin = new Admin();
        admin.setEmail("admin@example.com");
        admin.setPassword("wrongpassword");

        when(adminService.authenticate(admin.getEmail(), admin.getPassword())).thenReturn(false);

        mockMvc.perform(post("/admin/login")
                        .with(csrf())  // CSRF 토큰 추가
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@example.com\",\"password\":\"wrongpassword\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Admin login failed"));
    }

    @Test
    @WithMockUser
    void testRegister() throws Exception {
        Admin admin = new Admin();
        admin.setEmail("admin@example.com");
        admin.setPassword("password");

        when(adminService.save(any(Admin.class))).thenReturn(admin);

        mockMvc.perform(post("/admin/register")
                        .with(csrf())  // CSRF 토큰 추가
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@example.com\",\"password\":\"password\"}"))
                .andExpect(status().isOk())
                .andExpect(content().string("Admin registered successfuly"));
    }
}