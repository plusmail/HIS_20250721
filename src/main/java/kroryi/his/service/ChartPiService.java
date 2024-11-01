package kroryi.his.service;

import kroryi.his.dto.MedicalChartDTO;
import kroryi.his.dto.RequestData;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ChartPiService {

    ResponseEntity<List<String>> addDeleteToSubList(RequestData data);

    List<List<String>> getSessionItems(Object sessionAttribute);

    void refreshPiList();

    MedicalChartDTO webDataServlet(List<List<String>> data);
}
