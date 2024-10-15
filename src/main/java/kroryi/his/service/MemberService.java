package kroryi.his.service;

import kroryi.his.domain.Member;
import kroryi.his.dto.MemberJoinDTO;

import java.util.List;
import java.util.Map;

public interface MemberService {

    static class MidExistException extends Exception {

    }
    void join(MemberJoinDTO memberJoinDTO) throws MidExistException;

    //등록된 사용자 정보 삭제
    void saveUserInfoRemove(List<Map<String, Object>> list);

    //신규 사용자 등록 saveUserInfo
    void saveUserInfo(Map<String, Object> map);

    //사용자 정보 수정
    void saveModifyUserInfo(Map<String, Object> map);

    Member getUserById(Long id);

    void deleteUser(Long id);

    List<Member> findAllUsers();
}
