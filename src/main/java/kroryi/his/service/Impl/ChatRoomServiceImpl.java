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
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatRoomServiceImpl implements ChatRoomService {

    private final ChatRoomRepository roomRepository;
    private final MemberRepository memberRepository;
    private final SimpMessagingTemplate messagingTemplate; // WebSocket 메시지 전송을 위한 템플릿

    @Override
    public ChatRoomDTO createChatRoom(String roomName, List<String> memberIds) {
        ChatRoom chatRoom = new ChatRoom(roomName);

        // 사용자들을 멤버로 추가
        Set<Member> members = new HashSet<>();
        for (String memberId : memberIds) {
            Member member = memberRepository.findById(memberId)
                    .orElseThrow(() -> new IllegalArgumentException("Member not found"));
            members.add(member);
        }
        chatRoom.setMembers(members);

        ChatRoom savedRoom = roomRepository.save(chatRoom);

        // 저장 후 DTO로 변환
        return ChatRoomDTO.builder()
                .id(savedRoom.getId())
                .roomName(savedRoom.getRoomName())
                .memberNames(savedRoom.getMembers().stream()
                        .map(Member::getName)
                        .collect(Collectors.toSet()))
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

        // 메시지 엔티티 생성 후 저장하는 로직
        ChatMessage message = new ChatMessage();
        message.setContent(messageDTO.getContent());
        message.setSenderId(memberRepository.findById(messageDTO.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("Sender not found")));
        message.setChatRoom(chatRoom);
        message.setTimestamp(LocalDateTime.now());

        // 메시지를 채팅방에 추가
        chatRoom.getMessages().add(message);
        roomRepository.save(chatRoom);

        // WebSocket으로 메시지 브로드캐스트
        messagingTemplate.convertAndSend("/topic/rooms/" + roomId, messageDTO);
    }

}
