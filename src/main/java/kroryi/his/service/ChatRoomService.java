package kroryi.his.service;

import kroryi.his.dto.ChatMessageDTO;
import kroryi.his.dto.ChatRoomDTO;

import java.util.List;
import java.util.Set;

public interface ChatRoomService {
    ChatRoomDTO createChatRoom(String roomName, List<String> memberNames);

    List<ChatRoomDTO> getAllChatRooms();

    List<ChatMessageDTO> getMessagesByRoomId(Long roomId);

    void sendMessageToRoom(Long roomId, ChatMessageDTO messageDTO);
}
