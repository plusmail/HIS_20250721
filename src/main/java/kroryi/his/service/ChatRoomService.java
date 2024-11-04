package kroryi.his.service;

import kroryi.his.dto.ChatMessageDTO;
import kroryi.his.dto.ChatRoomDTO;
import kroryi.his.dto.MemberJoinDTO;

import java.util.List;
import java.util.Set;

public interface ChatRoomService {
    ChatRoomDTO createChatRoom(String roomName, List<String> memberMids, String recipientId);

    List<ChatMessageDTO> getMessagesByRoomId(Long roomId);

    List<ChatRoomDTO> getAllChatRoomsForUserWithLastMessage(String userId);

    ChatMessageDTO createMessage(Long roomId, String content, String senderId, String recipientId);

    void deleteChatRoom(Long roomId);
}
