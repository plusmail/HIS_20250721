package kroryi.his.service;

import kroryi.his.domain.User;
import kroryi.his.dto.UserDTO;

import java.util.List;
import java.util.Map;

public interface UserService {

//    @Autowired
//    private UserRepository userRepository;
//
//    public void saveUser(UserDTO userDto) {
//        // UserDTO 데이터를 User 엔티티로 변환 후 저장
//        User user = new User();
//        user.setId(userDto.getId());
//        user.setName(userDto.getName());
//        user.setEmail(userDto.getEmail());
//        user.setRole(userDto.getRole());
//        user.setPassword(userDto.getPassword());
//
//        // 데이터베이스에 사용자 저장
//        userRepository.save(user);
//    }


    User saveUser(UserDTO userDto);

    //등록된 사용자 정보 삭제
    void saveUserInfoRemove(List<Map<String, Object>> list);

    //신규 사용자 등록 saveUserInfo
    void saveUserInfo(Map<String, Object> map);

    //사용자 정보 수정
    void saveModifyUserInfo(Map<String, Object> map);

    User getUserById(Long id);

    void deleteUser(Long id);

    Object findAllUsers();

}

