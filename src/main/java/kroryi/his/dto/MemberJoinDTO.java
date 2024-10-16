package kroryi.his.dto;

import kroryi.his.domain.MemberRole;
import lombok.Data;

import java.util.Set;

@Data
public class MemberJoinDTO {
    private String mid;
    private String name;
    private String password;
    private String email;
    private boolean retirement;
    private String social;

    private Set<MemberRole> roles;

    // 새로운 생성자 추가
    public MemberJoinDTO(String mid, String name, String password, String email, boolean retirement, String social, Set<MemberRole> roles) {
        this.mid = mid;
        this.name = name;
        this.password = password;
        this.email = email;
        this.retirement = retirement;
        this.social = social;
        this.roles = roles;
    }
}
