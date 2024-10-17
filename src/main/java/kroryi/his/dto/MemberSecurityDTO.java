package kroryi.his.dto;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class MemberSecurityDTO extends User {
    public MemberSecurityDTO(String username,
                             String password,
                             String email,
                             boolean retirement,
                             String social,
                             Collection<? extends GrantedAuthority> authorities) {
        super(username, password, authorities);


    }

}