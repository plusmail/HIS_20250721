package kroryi.his.repository;

import kroryi.his.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, String> {


    static List<User> findUsersByConditions(String userId, String userName, String userRole, String startDate) {
        return null;
    }

    User findByUsername(String username);
    User findByEmail(String email);
    User findByUsernameAndPassword(String username, String password);
    User findByEmailAndPassword(String email, String password);
}