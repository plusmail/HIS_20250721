package kroryi.his.repository;

import kroryi.his.domain.Member;
import kroryi.his.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<Member, String> {


    static List<Member> findUsersByConditions(String userId, String userName, String userRole, String startDate) {
        return null;
    }

    Member findByName(String name);
    Member findByEmail(String email);
    Member findByNameAndPassword(String username, String password);
    Member findByEmailAndPassword(String email, String password);
}