package kroryi.his.repository;

import kroryi.his.domain.Board;
import kroryi.his.dto.BoardDTO;
import kroryi.his.repository.search.BoardSearch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long>, BoardSearch {
    @Query("select b from Board b where b.title like concat('%',:keyword,'%')")
    Page<Board> findKeyword(String keyword, Pageable pageable);


    @Query(value = "select  now()", nativeQuery = true)
    String getTime();

    @Query("SELECT b FROM Board b ORDER BY b.regDate DESC")
    List<Board> findTop3ByOrderByRegDateDesc(Pageable pageable);




}
