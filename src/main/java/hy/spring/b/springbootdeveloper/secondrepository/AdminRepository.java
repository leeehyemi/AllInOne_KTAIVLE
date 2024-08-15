package hy.spring.b.springbootdeveloper.secondrepository;

import hy.spring.b.springbootdeveloper.seconddomain.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Admin findByEmail(String email);
}
