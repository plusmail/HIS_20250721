package kroryi.his.service;

import kroryi.his.dto.ChatMessageDTO;
import kroryi.his.dto.ChatRoomDTO;
import kroryi.his.dto.MemberJoinDTO;

import java.util.List;
import java.util.Set;

public interface ChatRoomService {
    ChatRoomDTO createChatRoom(String roomName, List<String> memberNames);

    List<ChatRoomDTO> getAllChatRooms();

    List<ChatMessageDTO> getMessagesByRoomId(Long roomId);

    ChatMessageDTO saveMessage(Long roomId, ChatMessageDTO messageDTO);

    void sendMessageToRoom(Long roomId, ChatMessageDTO messageDTO);

    List<ChatRoomDTO> getAllChatRoomsForUserWithLastMessage(String userId);

}
