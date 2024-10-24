package kroryi.his.repository;

import kroryi.his.domain.Member;
import kroryi.his.domain.MemberRole;
import kroryi.his.repository.search.MemberSearch;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@EnableJpaRepositories
public interface MemberRepository extends JpaRepository<Member, String>, MemberSearch {

    @EntityGraph(attributePaths = "roleSet")
    @Query("select m from Member m where m.mid= :mid")
    Optional<Member> getWithRoles(String mid);

    List<Member> findByRoleSet(MemberRole role);

    @Query("SELECT m FROM Member m JOIN m.roleSet r WHERE " +
            "(m.mid = :mid OR m.name = :username OR m.email = :email) " +
            "AND r.roleSet IN :roles")
    List<Member> findByIdOrUsernameOrEmailAndRolesIn(@Param("mid") String id, @Param("username") String username, @Param("roles") String roles);

    boolean existsByMid(String mid);

    @Query("select m.mid, m.name from Member m")
    List<Object[]> findUserIdsAndNames();

    Optional<Member> findFirstByName(String name);
}
