package kroryi.his.service.Impl;

import kroryi.his.domain.User;
import kroryi.his.dto.UserDTO;
import kroryi.his.mapper.UserMapper;
import kroryi.his.repository.UserRepository;
import kroryi.his.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Log4j2
public class UserServiceImpl implements UserService {


    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private UserMapper userMapper;



    @Override
    public User saveUser(UserDTO userDto) {
        User user = modelMapper.map(userDto, User.class);
        return userRepository.save(user);
    }

    @Override
    public void saveUserInfoRemove(List<Map<String, Object>> list) {

        //체크한 항목이 여러개일 수 있으므로
        //리스트로 전달받고 for문 돌려서 1개씩 삭제
        for (Map<String, Object> map : list) {
            userMapper.saveUserInfoRemove(map);
        }
    }

    @Override
    public void saveUserInfo(Map<String, Object> map) {

        String orgPassword = (String) map.get("userPwd");
        String userId = (String) map.get("userId");
        System.out.println("orgPassword: " + orgPassword);
//        String encPassword = initUserPassword(orgPassword, userId);
//        map.put("userPwd", encPassword);
        userMapper.saveUserInfo(map);
    }

    @Override
    public void saveModifyUserInfo(Map<String, Object> map) {

        String orgPassword = (String) map.get("userPwd");
        String userId = (String) map.get("userId");

        if ("".equals(orgPassword)) {
            //수정된 팝업에서 비밀번호를 입력하지 않은 경우에는 업데이트 되지 않도록 공백을 보내줌
            map.put("userPwd", orgPassword);
        } else {
            //비밀번호를 입력한 경우에는 암호화된 비밀번호로 map에 재세팅해서 보내줌

//            String encPassword = initUserPassword(orgPassword, userId);
//            map.put("userPwd", encPassword);
        }
        userMapper.saveModifyUserInfo(map);
    }

    @Override
    public User getUserById(Long id) {
        return null;
    }

    @Override
    public void deleteUser(Long id) {

    }

    @Override
    public Object findAllUsers() {
        return null;
    }





//    private String initUserPassword(String orgPassword, String userId) {
//        return passwordEncoder.encode(orgPassword);//비밀번호 암호화 된것을 리턴/    }
//
//
//     }
}
