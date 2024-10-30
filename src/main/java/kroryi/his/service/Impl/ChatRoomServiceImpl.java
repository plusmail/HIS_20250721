package kroryi.his.service.Impl;

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

    // MemberService에 모든 멤버를 가져오는 메서드 추가
    public List<MemberJoinDTO> getAllMembers() {
        List<Member> members = memberRepository.findAll(); // 모든 멤버를 가져옴
        return members.stream()
                .map(member -> new MemberJoinDTO(member.getMid(), member.getName())) // DTO로 변환
                .collect(Collectors.toList());
    }


    // 모든 채팅방 목록을 DTO로 반환하는 메서드
    public List<ChatRoomDTO> getAllChatRooms() {
        List<ChatRoom> chatRooms = chatRoomRepository.findAll();
        return chatRooms.stream()
                .map(this::convertToDto)  // 여기서 convertToDto 호출
                .collect(Collectors.toList());
    }

    // 개별 채팅방 조회 시에도 convertToDto 활용 가능
    public ChatRoomDTO getChatRoomById(Long roomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid room ID"));
        return convertToDto(chatRoom);
    }

    private ChatRoomDTO convertToDto(ChatRoom chatRoom) {
        // ChatRoomDTO 빌더를 사용하여 DTO 생성
        ChatRoomDTO dto = ChatRoomDTO.builder()
                .id(chatRoom.getId())
                .roomName(chatRoom.getRoomName())
                .memberMids(chatRoom.getMembers().stream()
                        .map(Member::getMid)  // 각 멤버의 ID만 가져옴
                        .collect(Collectors.toSet()))  // Set으로 변환
                .build();

        // 마지막 메시지를 가져와서 설정
        ChatMessage lastMessage = chatMessageRepository
                .findTopByChatRoomOrderByTimestampDesc(chatRoom);  // 최신 메시지를 가져오는 쿼리

        if (lastMessage != null) {
            // ChatMessageDTO로 변환하여 설정
            ChatMessageDTO lastMessageDto = ChatMessageDTO.builder()
                    .id(lastMessage.getId())
                    .content(lastMessage.getContent())
                    .timestamp(lastMessage.getTimestamp())
                    .senderId(lastMessage.getSender().getMid())  // 보낸 사람의 ID
                    .senderName(lastMessage.getSender().getName())  // 보낸 사람의 이름
                    .recipientId(lastMessage.getRecipient() != null ? lastMessage.getRecipient().getMid() : null)  // 수신자 ID
                    .build();

            dto.setLastMessage(lastMessageDto);  // DTO에 마지막 메시지 설정
        }

        return dto;
    }

    public List<ChatRoomDTO> getAllChatRoomsForUserWithLastMessage(String userId) {
        List<ChatRoom> chatRooms = chatRoomRepository.findByMembers_Mid(userId); // 사용자 ID로 필터링된 채팅방 조회

        return chatRooms.stream().map(room -> {
            ChatRoomDTO dto = new ChatRoomDTO();
            dto.setId(room.getId());
            dto.setRoomName(room.getRoomName());
            dto.setMemberMids(room.getMemberMids());

            // 각 채팅방의 최신 메시지 가져오기
            ChatMessage lastMessage = chatMessageRepository.findTopByChatRoomOrderByTimestampDesc(room);
            if (lastMessage != null) {
                dto.setLastMessage(new ChatMessageDTO(
                        lastMessage.getId(),
                        lastMessage.getContent(),
                        lastMessage.getTimestamp(),
                        room.getId(),
                        lastMessage.getSender().getMid(),  // senderId를 추출
                        lastMessage.getSender().getName(), // senderName을 추출
                        lastMessage.getRecipient() != null ? lastMessage.getRecipient().getMid() : null // recipientId가 있을 때만 추출
                ));
            }

            return dto;
        }).collect(Collectors.toList());
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


