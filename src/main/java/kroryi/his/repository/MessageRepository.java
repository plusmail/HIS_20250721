package kroryi.his.repository;

import kroryi.his.domain.ChatMessage;
import org.apache.logging.log4j.message.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<ChatMessage, String> {

    List<ChatMessage> findByChatRoomId(Long roomId);
}
