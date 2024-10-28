package kroryi.his.service.Impl;

import kroryi.his.domain.ChatMessage;
import kroryi.his.domain.ChatRoom;
import kroryi.his.domain.Member;
import kroryi.his.dto.ChatMessageDTO;
import kroryi.his.dto.ChatRoomDTO;
import kroryi.his.repository.ChatMessageRepository;
import kroryi.his.repository.ChatRoomRepository;
import kroryi.his.repository.MemberRepository;
import kroryi.his.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatRoomServiceImpl implements ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final MemberRepository memberRepository;

    @Override
    public ChatRoomDTO createChatRoom(String roomName, List<String> memberMids) {
        // 채팅방을 먼저 생성 후 저장
        ChatRoom chatRoom = ChatRoom.builder()
                .roomName(roomName)
                .build();
        chatRoom = chatRoomRepository.save(chatRoom);

        // 멤버 추가
        Set<Member> members = new HashSet<>();
        for (String mid : memberMids) {
            Member member = memberRepository.findById(mid)
                    .orElseThrow(() -> new IllegalArgumentException("Member not found for ID: " + mid));
            members.add(member);
        }

        chatRoom.setMembers(members);
        chatRoom = chatRoomRepository.save(chatRoom); // 업데이트된 멤버와 함께 다시 저장

        return ChatRoomDTO.builder()
                .id(chatRoom.getId())
                .roomName(chatRoom.getRoomName())
                .memberMids(members.stream().map(Member::getMid).collect(Collectors.toSet()))
                .build();
    }
    
    @Override
    public List<ChatRoomDTO> getAllChatRooms() {
        return chatRoomRepository.findAll().stream()
                .map(room -> ChatRoomDTO.builder()
                        .id(room.getId())
                        .roomName(room.getRoomName())
                        .memberMids(room.getMembers().stream()
                                .map(Member::getMid)  // member의 mid를 가져옴
                                .collect(Collectors.toSet()))
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public List<ChatMessageDTO> getMessagesByRoomId(Long roomId) {
        List<ChatMessage> messages = chatMessageRepository.findByChatRoomId(roomId);
        return messages.stream()
                .map(message -> ChatMessageDTO.builder()
                        .senderId(message.getSender().getMid())
                        .content(message.getContent())
                        .timestamp(message.getTimestamp())
                        .build())
                .collect(Collectors.toList());
    }

    // 메시지 저장
    public ChatMessageDTO saveMessage(Long roomId, ChatMessageDTO messageDTO) {
        Member sender = memberRepository.findById(messageDTO.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("Sender not found for ID: " + messageDTO.getSenderId()));
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found for ID: " + roomId));

        ChatMessage message = ChatMessage.builder()
                .content(messageDTO.getContent())
                .timestamp(LocalDateTime.now())
                .sender(sender)
                .chatRoom(room)
                .build();

        ChatMessage savedMessage = chatMessageRepository.save(message);

        return ChatMessageDTO.builder()
                .id(savedMessage.getId())
                .content(savedMessage.getContent())
                .timestamp(savedMessage.getTimestamp())
                .roomId(savedMessage.getChatRoom().getId())
                .senderId(savedMessage.getSender().getMid())
                .senderName(savedMessage.getSender().getName()) // senderName 설정
                .build();
    }




    @Override
    public void sendMessageToRoom(Long roomId, ChatMessageDTO messageDTO) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found for ID: " + roomId));

        Member sender = memberRepository.findById(messageDTO.getSenderId())
                .orElseThrow(() -> new IllegalArgumentException("Member not found for ID: " + messageDTO.getSenderId()));

        // 메시지 저장 로직 (필요에 따라 추가)
        ChatMessage message = ChatMessage.builder()
                .content(messageDTO.getContent())
                .timestamp(LocalDateTime.now())
                .sender(sender)
                .chatRoom(chatRoom)
                .build();

        chatMessageRepository.save(message);
    }
}


