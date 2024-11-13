package kroryi.his.service.Impl;

import jakarta.transaction.Transactional;
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
import lombok.extern.log4j.Log4j2;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class ChatRoomServiceImpl implements ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final MemberRepository memberRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public ChatRoomDTO createChatRoom(String roomName, List<String> memberMids, List<String> recipientIds) {
        log.info("Starting createChatRoom with roomName: {} and memberMids: {}", roomName, memberMids);

        // 다중 채팅방의 경우 recipientIds를 빈 리스트로 설정
        if (memberMids.size() > 2) {
            recipientIds = new ArrayList<>();
        }

        // 새로운 채팅방 객체 생성
        ChatRoom chatRoom = ChatRoom.builder()
                .roomName(roomName) // 채팅방 이름 설정
                .recipientIds(recipientIds) // 수신자 ID 설정
                .build();
        chatRoom = chatRoomRepository.save(chatRoom); // 채팅방 저장

        // 멤버 리스트를 조회하고 설정
        Set<Member> members = new HashSet<>();
        for (String mid : memberMids) {
            Member member = memberRepository.findById(mid)
                    .orElseThrow(() -> new IllegalArgumentException("Member not found for ID: " + mid));
            members.add(member); // 멤버를 Set에 추가
        }

        // 채팅방에 멤버 설정 후 저장
        chatRoom.setMembers(members);
        chatRoom = chatRoomRepository.save(chatRoom);

        // DTO로 변환하여 반환
        return ChatRoomDTO.builder()
                .id(chatRoom.getId())
                .roomName(chatRoom.getRoomName())
                .memberMids(members.stream().map(Member::getMid).collect(Collectors.toSet()))
                .recipientIds(new ArrayList<>(recipientIds)) // 다중 채팅방이면 빈 리스트로 설정됨
                .lastMessage(null) // 새로 생성된 방이므로 마지막 메시지는 없음
                .build();
    }

    public ChatRoomDTO createOrGetPrivateChatRoom(String member1Mid, String member2Mid) {
        // 기존 개인 채팅방 확인
        Optional<ChatRoom> existingRoom = chatRoomRepository.findPrivateChatRoomBetween(member1Mid, member2Mid);

        if (existingRoom.isPresent()) {
            // 기존 채팅방이 존재할 경우 DTO로 반환
            return convertToDTO(existingRoom.get());
        }

        // 기존 채팅방이 없으면 새 채팅방 생성
        Member member1 = memberRepository.findById(member1Mid)
                .orElseThrow(() -> new IllegalArgumentException("Member 1 not found"));
        Member member2 = memberRepository.findById(member2Mid)
                .orElseThrow(() -> new IllegalArgumentException("Member 2 not found"));

        // 새로운 채팅방 생성
        ChatRoom newRoom = ChatRoom.builder()
                .roomName(member2.getName() + "와의 채팅") // 상대방 이름으로 방 이름 설정
                .members(new HashSet<>(Set.of(member1, member2))) // 멤버 설정
                .memberMids(Set.of(member1Mid, member2Mid)) // 멤버 ID 설정
                .build();

        // 채팅방 저장 및 DTO 반환
        ChatRoom savedRoom = chatRoomRepository.save(newRoom);
        return convertToDTO(savedRoom);
    }

    private ChatRoomDTO convertToDTO(ChatRoom chatRoom) {
        // 채팅방 엔티티를 DTO로 변환
        return ChatRoomDTO.builder()
                .id(chatRoom.getId())
                .roomName(chatRoom.getRoomName())
                .memberMids(chatRoom.getMemberMids())
                .recipientIds(chatRoom.getRecipientIds())
                .lastMessage(chatRoom.getLastMessage() != null
                        ? new ChatMessageDTO(chatRoom.getLastMessage()) : null)
                .lastMessageTimestamp(chatRoom.getLastMessageTimestamp())
                .build();
    }

    @Override
    public List<ChatRoomDTO> getAllChatRoomsForUserWithLastMessage(String userId) {
        // 사용자와 연관된 모든 채팅방 조회
        List<ChatRoom> chatRooms = chatRoomRepository.findByMembers_Mid(userId);

        // 각 채팅방을 DTO로 변환
        return chatRooms.stream()
                .map(chatRoom -> {
                    // 채팅방 이름을 현재 사용자를 제외한 멤버 이름으로 설정
                    String roomName = chatRoom.getMembers().stream()
                            .filter(member -> !member.getMid().equals(userId)) // 현재 사용자를 제외한 멤버
                            .map(Member::getName) // 멤버 이름 추출
                            .collect(Collectors.joining(", ")) // 쉼표로 구분하여 조합
                            + (chatRoom.getMembers().size() > 2 ? "와의 그룹 채팅" : "와의 채팅");

                    return convertToDtoWithRoomName(chatRoom, roomName, userId);
                })
                .collect(Collectors.toList());
    }

    private ChatRoomDTO convertToDtoWithRoomName(ChatRoom chatRoom, String roomName, String currentUserId) {
        // 현재 사용자를 제외한 수신자 ID 목록 생성
        List<String> recipientIds = chatRoom.getMembers().stream()
                .filter(member -> !member.getMid().equals(currentUserId))
                .map(Member::getMid)
                .collect(Collectors.toList());

        // 채팅방의 최근 메시지 조회
        ChatMessage lastMessage = chatMessageRepository.findTopByChatRoomOrderByTimestampDesc(chatRoom);

        ChatMessageDTO lastMessageDto = null;
        if (lastMessage != null) {
            // 메시지가 존재하면 DTO로 변환
            lastMessageDto = ChatMessageDTO.builder()
                    .messageId(lastMessage.getMessageId())
                    .roomId(chatRoom.getId())
                    .content(lastMessage.getContent())
                    .timestamp(lastMessage.getTimestamp())
                    .senderId(lastMessage.getSender().getMid())
                    .senderName(lastMessage.getSender().getName())
                    .build();
        }

        // 채팅방 DTO 반환
        return ChatRoomDTO.builder()
                .id(chatRoom.getId())
                .roomName(roomName)
                .memberMids(chatRoom.getMembers().stream()
                        .map(Member::getMid)
                        .collect(Collectors.toSet()))
                .recipientIds(recipientIds)
                .lastMessage(lastMessageDto)
                .lastMessageTimestamp(chatRoom.getLastMessageTimestamp())
                .build();
    }

    @Override
    @Transactional // 트랜잭션으로 메시지 삭제와 채팅방 삭제를 묶음
    public void deleteChatRoom(Long roomId) {
        // 먼저 해당 채팅방의 메시지를 삭제
        chatMessageRepository.deleteByChatRoomId(roomId);

        // 채팅방 삭제
        chatRoomRepository.deleteById(roomId);
    }

    @Override
    public List<ChatMessageDTO> getMessagesByRoomId(Long roomId) {
        // 특정 채팅방의 메시지 조회
        List<ChatMessage> messages = chatMessageRepository.findByChatRoomId(roomId);

        // 메시지를 DTO로 변환
        return messages.stream()
                .map(message -> ChatMessageDTO.builder()
                        .messageId(message.getMessageId()) // 메시지 ID 설정
                        .roomId(message.getChatRoom().getId()) // 채팅방 ID 설정
                        .content(message.getContent())
                        .timestamp(message.getTimestamp())
                        .senderId(message.getSender().getMid())
                        .senderName(message.getSender().getName())
                        .recipientIds(message.getRecipient() != null
                                ? Collections.singletonList(message.getRecipient().getMid())
                                : Collections.emptyList()) // 수신자가 없을 경우 빈 리스트
                        .build())
                .collect(Collectors.toList());
    }

    public ChatMessageDTO createMessage(Long roomId, String content, String senderId, List<String> recipientIds, String senderName, LocalDateTime timestamp) {
        // 채팅방 및 발신자 확인
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid room ID"));

        Member sender = memberRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));

        log.info("Chat-----> {}", sender);

        // 메시지 객체 생성
        ChatMessage message = ChatMessage.builder()
                .content(content)
                .timestamp(timestamp != null ? timestamp : LocalDateTime.now())
                .sender(sender)
                .chatRoom(chatRoom)
                .build();

        // 메시지 저장
        ChatMessage savedMessage = chatMessageRepository.save(message);

        // 채팅방의 최근 메시지 업데이트
        chatRoom.setLastMessage(savedMessage.getContent());
        chatRoom.setLastMessageTimestamp(savedMessage.getTimestamp());
        chatRoomRepository.save(chatRoom);

        // 메시지 DTO 생성
        ChatMessageDTO messageDTO = ChatMessageDTO.builder()
                .messageId(savedMessage.getMessageId()) // 자동 생성된 messageId
                .roomId(chatRoom.getId())
                .content(savedMessage.getContent())
                .senderId(sender.getMid())
                .senderName(sender.getName())
                .recipientIds(recipientIds != null ? recipientIds : Collections.emptyList())
                .timestamp(savedMessage.getTimestamp())
                .build();

        // 메시지 저장 후 WebSocket을 통해 전송
        messagingTemplate.convertAndSend("/topic/rooms", messageDTO);

        // messageId를 포함하여 ChatMessageDTO 반환
        return messageDTO;
    }
}