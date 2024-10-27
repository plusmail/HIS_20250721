package kroryi.his.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;
    private LocalDateTime timestamp;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private Member sender; // Member 타입으로 선언

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chatRoom;

    // 매개변수 있는 생성자
    public ChatMessage(String content, LocalDateTime timestamp, Member senderId, ChatRoom chatRoom) {
        this.content = content;
        this.timestamp = timestamp;
        this.sender = senderId;
        this.chatRoom = chatRoom;
    }
}

