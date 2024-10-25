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
    private Member senderId;

    @ManyToOne(fetch = FetchType.LAZY)
    private ChatRoom chatRoom;

    // 매개변수 있는 생성자
    public ChatMessage(String content, LocalDateTime timestamp, Member senderId, ChatRoom chatRoom) {
        this.content = content;
        this.timestamp = timestamp;
        this.senderId = senderId;
        this.chatRoom = chatRoom;
    }
}

