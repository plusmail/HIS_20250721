package kroryi.his.service.Impl;

import kroryi.his.domain.ChatMessage;
import kroryi.his.domain.ChatRoom;
import kroryi.his.domain.Member;
import kroryi.his.dto.ChatMessageDTO;
import kroryi.his.dto.ChatRoomDTO;
import kroryi.his.repository.ChatRoomRepository;
import kroryi.his.repository.MemberRepository;
import kroryi.his.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static kroryi.his.domain.QChatRoom.chatRoom;

@Service
@RequiredArgsConstructor
public class ChatRoomServiceImpl implements ChatRoomService {

    private final ChatRoomRepository roomRepository;
    private final MemberRepository memberRepository;
    private final SimpMessagingTemplate messagingTemplate; // WebSocket 메시지 전송을 위한 템플릿

    @Override
    public ChatRoomDTO createChatRoom(String roomName, List<String> memberNames) {
        // 새로운 채팅방 생성
        ChatRoom chatRoom = new ChatRoom(roomName);

        // 먼저 채팅방을 저장하여 room_id가 생성되도록 함
        chatRoom = roomRepository.save(chatRoom);

        // 멤버 추가
        Set<Member> members = new HashSet<>();
        for (String name : memberNames) {
            Optional<Member> optionalMember = memberRepository.findFirstByName(name);
            Member member = optionalMember.orElseThrow(() -> new IllegalArgumentException("Member not found for name: " + name));
            members.add(member);
        }

        // 멤버가 추가된 채팅방을 다시 저장
        chatRoom.setMembers(members);
        roomRepository.save(chatRoom);

        // DTO로 변환하여 반환
        return ChatRoomDTO.builder()
                .id(chatRoom.getId())
                .roomName(chatRoom.getRoomName())
                .memberNames(members.stream().map(Member::getName).collect(Collectors.toSet()))
                .build();
    }




    @Override
    public List<ChatRoomDTO> getAllChatRooms() {
        return roomRepository.findAll().stream()
                .map(room -> ChatRoomDTO.builder()
                        .id(room.getId())
                        .roomName(room.getRoomName())
                        .memberNames(room.getMembers().stream()
                                .map(Member::getName)
                                .collect(Collectors.toSet()))
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<ChatMessageDTO> getMessagesByRoomId(Long roomId) {
        ChatRoom chatRoom = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found"));
        return chatRoom.getMessages().stream()
                .map(message -> ChatMessageDTO.builder()
                        .senderId(message.getSenderId().getName())
                        .content(message.getContent())
                        .timestamp(message.getTimestamp())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public void sendMessageToRoom(Long roomId, ChatMessageDTO messageDTO) {
        ChatRoom chatRoom = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found"));

        // 메시지 엔티티 생성 후 저장하는 로직 (예시)
        ChatMessage chatMessage = new ChatMessage(
                messageDTO.getContent(),
                messageDTO.getTimestamp(),
                memberRepository.findById(messageDTO.getSenderId())  // Assuming you send senderId in DTO
                        .orElseThrow(() -> new IllegalArgumentException("Sender not found")),
                chatRoom
        );

        chatRoom.getMessages().add(chatMessage);
        roomRepository.save(chatRoom);
    }

}
