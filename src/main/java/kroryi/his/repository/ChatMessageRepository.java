package kroryi.his.repository;

import kroryi.his.domain.ChatMessage;
import kroryi.his.domain.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    // 특정 채팅방의 메시지를 가져오는 메소드 (roomId 기준)
    List<ChatMessage> findByChatRoomId(Long roomId);

    ChatMessage findTopByChatRoomOrderByTimestampDesc(ChatRoom chatRoom);




}
