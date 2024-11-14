package kroryi.his.service;

import kroryi.his.dto.ChatMessageDTO;
import kroryi.his.dto.ChatRoomDTO;
import kroryi.his.dto.MemberJoinDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public interface ChatRoomService {
    ChatRoomDTO createChatRoom(String roomName, List<String> memberMids, List<String> recipientIds);

    List<ChatMessageDTO> getMessagesByRoomId(Long roomId);

    List<ChatRoomDTO> getAllChatRoomsForUserWithLastMessage(String userId);

    ChatMessageDTO createMessage(
                                 Long roomId,
                                 String content,
                                 String senderId,
                                 List<String> recipientId,
                                 String senderName,
                                 LocalDateTime timestamp);

    void deleteChatRoom(Long roomId);

    ChatRoomDTO createOrGetPrivateChatRoom(String member1Mid, String member2Mid);
}
