package kroryi.his;

import kroryi.his.domain.ChartMemo;
import kroryi.his.repository.ChartMemoRepository;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
@Log4j2
public class chartTest {

    @Autowired
    private ChartMemoRepository memoRepo;

    @Test
    public void test() {

        List<ChartMemo> memos = memoRepo.findAll();
        for(ChartMemo memo : memos) {

            log.info("memos memo ----> {}", memo.getMemo());
            log.info("memos doc -----> {}", memo.getDoc());
        }
    }
}
