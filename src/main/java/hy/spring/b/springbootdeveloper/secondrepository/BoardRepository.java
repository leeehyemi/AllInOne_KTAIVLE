package hy.spring.b.springbootdeveloper.secondrepository;

import hy.spring.b.springbootdeveloper.seconddomain.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
}
