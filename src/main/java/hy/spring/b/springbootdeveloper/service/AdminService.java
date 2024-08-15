package hy.spring.b.springbootdeveloper.service;

import hy.spring.b.springbootdeveloper.seconddomain.Admin;
import hy.spring.b.springbootdeveloper.secondrepository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    private final AdminRepository adminRepository;

    @Autowired
    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public Admin findByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    public Admin save(Admin admin) {
        return adminRepository.save(admin);
    }

    public boolean authenticate(String email, String password) {
        Admin admin = adminRepository.findByEmail(email);
        return admin != null && admin.getPassword().equals(password);
    }
}
