package kroryi.his.service;

import kroryi.his.dto.MemberJoinDTO;

public interface MemberService {

    static class MidExistException extends Exception {

    }
    void join(MemberJoinDTO memberJoinDTO) throws MidExistException;
}
