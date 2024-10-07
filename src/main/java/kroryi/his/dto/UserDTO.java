package kroryi.his.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    // Getters and Setters
    private String id;
    private String username;
    private String email;
    private String role;
    private String password;

   /* // 생성자, getter, setter 메소드 추가
    public UserDTO() {

    }

    public UserDTO(String id, String name, String email, String role,
                   String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.password = password;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", role='" + role + '\'' +
                '}';
    }*/

}

