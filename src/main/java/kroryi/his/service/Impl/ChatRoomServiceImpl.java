package kroryi.his.service.Impl;

import jakarta.transaction.Transactional;
import kroryi.his.domain.ChatMessage;
import kroryi.his.domain.ChatRoom;
import kroryi.his.domain.Member;
import kroryi.his.dto.ChatMessageDTO;
import kroryi.his.dto.ChatRoomDTO;
import kroryi.his.dto.MemberJoinDTO;
import kroryi.his.repository.ChatMessageRepository;
import kroryi.his.repository.ChatRoomRepository;
import kroryi.his.repository.MemberRepository;
import kroryi.his.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class ChatRoomServiceImpl implements ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final MemberRepository memberRepository;

    @Override
    public ChatRoomDTO createChatRoom(String roomName, List<String> memberMids, String recipientId) {
        log.info("Starting createChatRoom with roomName: {} and memberMids: {}", roomName, memberMids);

        String senderId = memberMids.get(0); // 첫 번째 사용자를 방 생성자 (보내는 사람)로 설정

        log.info("SenderId determined as: {}, RecipientId determined as: {}", senderId, recipientId);

        ChatRoom chatRoom = ChatRoom.builder()
                .roomName(roomName)
                .recipientId(recipientId) // 대화 상대를 기본 수신자로 설정
                .build();
        chatRoom = chatRoomRepository.save(chatRoom);

        Set<Member> members = new HashSet<>();
        for (String mid : memberMids) {
            Member member = memberRepository.findById(mid)
                    .orElseThrow(() -> new IllegalArgumentException("Member not found for ID: " + mid));
            members.add(member);
        }

        chatRoom.setMembers(members);
        chatRoom = chatRoomRepository.save(chatRoom); // 업데이트된 멤버와 함께 다시 저장

        ChatRoomDTO chatRoomDTO = ChatRoomDTO.builder()
                .id(chatRoom.getId())
                .roomName(chatRoom.getRoomName())
                .memberMids(members.stream().map(Member::getMid).collect(Collectors.toSet()))
                .recipientId(chatRoom.getRecipientId()) // 생성된 방의 recipientId 설정
                .lastMessage(null)
                .build();

        log.info("Created chat room DTO with recipientId: {}", chatRoomDTO.getRecipientId());

        return chatRoomDTO;
    }

    // 모든 채팅방 목록을 DTO로 반환하는 메서드
    public List<ChatRoomDTO> getAllChatRoomsForUserWithLastMessage(String userId) {
        List<ChatRoom> chatRooms = chatRoomRepository.findByMembers_Mid(userId);
        return chatRooms.stream()
                .map(chatRoom -> convertToDto(chatRoom, userId))
                .collect(Collectors.toList());
    }


    private ChatRoomDTO convertToDto(ChatRoom chatRoom, String currentUserId) {
        String recipientId = chatRoom.getMembers().stream()
                .filter(member -> !member.getMid().equals(currentUserId))
                .map(Member::getMid)
                .findFirst()
                .orElse(null);

        ChatRoomDTO dto = ChatRoomDTO.builder()
                .id(chatRoom.getId())
                .roomName(chatRoom.getRoomName())
                .memberMids(chatRoom.getMembers().stream()
                        .map(Member::getMid)
                        .collect(Collectors.toSet()))
                .recipientId(recipientId) // 기본 recipientId 설정
                .build();

        ChatMessage lastMessage = chatMessageRepository.findTopByChatRoomOrderByTimestampDesc(chatRoom);
        if (lastMessage != null) {
            ChatMessageDTO lastMessageDto = ChatMessageDTO.builder()
                    .roomId(lastMessage.getId())
                    .content(lastMessage.getContent())
                    .timestamp(lastMessage.getTimestamp())
                    .senderId(lastMessage.getSender().getMid())
                    .senderName(lastMessage.getSender().getName())
                    .recipientId(lastMessage.getRecipient() != null ? lastMessage.getRecipient().getMid() : null)
                    .build();

            dto.setLastMessage(lastMessageDto);
        }

        return dto;
    }

    @Override
    @Transactional // 트랜잭션을 시작하는 어노테이션
    public void deleteChatRoom(Long roomId) {
        // 먼저 해당 채팅방의 메시지를 삭제
        chatMessageRepository.deleteByChatRoomId(roomId);

        // 채팅방 삭제
        chatRoomRepository.deleteById(roomId);
    }

    @Override
    public List<ChatMessageDTO> getMessagesByRoomId(Long roomId) {
        List<ChatMessage> messages = chatMessageRepository.findByChatRoomId(roomId);
        return messages.stream()
                .map(message -> ChatMessageDTO.builder()
                        .roomId(message.getId())
                        .content(message.getContent())
                        .timestamp(message.getTimestamp())
                        .senderId(message.getSender().getMid())
                        .senderName(message.getSender().getName())
                        .recipientId(message.getRecipient() != null ? message.getRecipient().getMid() : null)
                        .build())
                .collect(Collectors.toList());
    }

    public ChatMessageDTO createMessage(Long roomId, String content, String senderId, String recipientId, String sendName, LocalDateTime timestamp ) {
        if (recipientId == null) {
            throw new IllegalArgumentException("Recipient ID must be provided to send a message.");
        }

        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid room ID"));

        Member sender = memberRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
//        Member recipient = memberRepository.findById(recipientId)
//                .orElseThrow(() -> new IllegalArgumentException("Recipient not found"));

        ChatMessage message = ChatMessage.builder()
                .content(content)
                .timestamp(LocalDateTime.now())
                .sender(sender)
//                .recipient(recipient)
                .chatRoom(chatRoom)
                .build();

        chatMessageRepository.save(message);

        return ChatMessageDTO.builder()
                .roomId(message.getId())
                .content(message.getContent())
                .senderId(sender.getMid())
                .senderName(sender.getName())
                .recipientId(sender.getMid())
                .timestamp(message.getTimestamp())
                .build();
    }

}



