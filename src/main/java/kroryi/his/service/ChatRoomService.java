package kroryi.his.service;

import kroryi.his.dto.ChatMessageDTO;
import kroryi.his.dto.ChatRoomDTO;

import java.util.List;

public interface ChatRoomService {
    // 새로운 채팅방을 생성
    ChatRoomDTO createChatRoom(String roomName, List<String> memberIds);

    // 모든 채팅방 목록을 가져옴
    List<ChatRoomDTO> getAllChatRooms();

    // 특정 채팅방의 메시지를 가져옴
    List<ChatMessageDTO> getMessagesByRoomId(Long roomId);

    // 채팅 메시지를 특정 채팅방에 전송
    void sendMessageToRoom(Long roomId, ChatMessageDTO messageDTO);
}
