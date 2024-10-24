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
    private Set<Member> members = new HashSet<>();

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL)
    private Set<ChatMessage> messages = new HashSet<>();

    public ChatRoom(String roomName) {
        this.roomName = roomName;
    }

}
