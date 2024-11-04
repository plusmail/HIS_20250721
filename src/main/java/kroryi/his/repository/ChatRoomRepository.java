package kroryi.his.repository;

import kroryi.his.domain.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    @Query("SELECT r FROM ChatRoom r JOIN r.members m WHERE m.mid = :userId")
    List<ChatRoom> findAllByMemberId(@Param("userId") String userId);

    List<ChatRoom> findByMembers_Mid(String userId);
}
