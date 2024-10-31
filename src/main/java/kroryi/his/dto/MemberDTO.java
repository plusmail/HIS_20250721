package kroryi.his.dto;

import kroryi.his.domain.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberDTO {

    private String name;
    private String email;
    private String phone;
    private String tel;
    private boolean retirement;
    private String social;
    private int zipCode;
    private String address;
    private String detailAddress;
    private String note;

    private Set<String> roles; // roleSet을 String 형태로 단순화하여 포함

    // Member 엔티티로부터 MemberDTO를 생성하는 생성자
    public MemberDTO(Member member) {
        String mid = member.getMid();
        this.name = member.getName();
        this.email = member.getEmail();
        this.phone = member.getPhone();
        this.tel = member.getTel();
        this.retirement = member.isRetirement();
        this.social = member.getSocial();
        this.zipCode = member.getZipCode();
        this.address = member.getAddress();
        this.detailAddress = member.getDetailAddress();
        this.note = member.getNote();
        this.roles = member.getRoleSet().stream()
                .map(role -> role.getRoleSet().toString()) // 각 Role의 이름만 추출
                .collect(Collectors.toSet());
    }
}