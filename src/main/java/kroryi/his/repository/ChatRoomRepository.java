package kroryi.his.repository;

import kroryi.his.domain.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    List<ChatRoom> findByMembers_Mid(String userId);

    @Query("SELECT cr FROM ChatRoom cr " +
            "JOIN cr.members m1 " +
            "JOIN cr.members m2 " +
            "WHERE m1.mid = :member1 AND m2.mid = :member2 AND SIZE(cr.members) = 2")
    Optional<ChatRoom> findPrivateChatRoomBetween(@Param("member1") String member1Mid, @Param("member2") String member2Mid);
}
