package hy.spring.b.springbootdeveloper.controller;

import hy.spring.b.springbootdeveloper.seconddomain.Admin;
import hy.spring.b.springbootdeveloper.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public String login(@RequestBody Admin admin) {
        boolean authenticated = adminService.authenticate(admin.getEmail(), admin.getPassword());
        if(authenticated) {
            return "Admin login successful";
        }
        else {
            return "Admin login failed";
        }
    }

    @PostMapping("/register")
    public String register(@RequestBody Admin admin) {
        adminService.save(admin);
        return "Admin registered successfuly";
    }
}
