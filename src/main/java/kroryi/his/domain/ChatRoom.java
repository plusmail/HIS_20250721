package kroryi.his.domain;

import jakarta.persistence.*;
import kroryi.his.dto.ChatMessageDTO;
import lombok.*;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomName;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "chat_room_members",  // 조인 테이블 이름
            joinColumns = @JoinColumn(name = "chat_room_id"),  // ChatRoom 쪽의 외래키
            inverseJoinColumns = @JoinColumn(name = "member_mid")  // Member 쪽의 외래키
    )
    private Set<Member> members = new HashSet<>();

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL)
    private Set<ChatMessage> messages = new HashSet<>();

    // Set으로 memberMids 필드 추가
    @ElementCollection
    private Set<String> memberMids;

    private String recipientId;  // 기본 수신자 ID

    public ChatRoom(String roomName) {
        this.roomName = roomName;
    }

}
