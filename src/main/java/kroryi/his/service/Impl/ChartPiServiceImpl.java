package kroryi.his.service.Impl;

import kroryi.his.controller.ChartController;
import kroryi.his.dto.MedicalChartDTO;
import kroryi.his.dto.RequestData;
import kroryi.his.service.ChartPiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

@Log4j2
@Service
@RequiredArgsConstructor
public class ChartPiServiceImpl implements ChartPiService {

    private final ChartController chartController;

    private List<List<String>> toothList = new ArrayList<>();
    private List<List<String>> symptomList = new ArrayList<>();
    private List<List<String>> memoList = new ArrayList<>();
    private List<List<String>> arrayList = new ArrayList<>();
    private List<List<String>> piList = new ArrayList<>();
    private List<List<String>> dbSaveList;

    private int controllerListIndex = 0;

    private final WebClient webClient = WebClient.create("http://localhost:8080/");

    @Override
    public ResponseEntity<List<String>> addDeleteToSubList(RequestData data) {
        List<String> newValues = data.getNewValues();
        int subListIndex = data.getSubListIndex();
        boolean addOrDelete = data.isAddOrDelete();

        if (data.getListIndex() != controllerListIndex) {
            dataArray(newValues, subListIndex, data.getListIndex(), addOrDelete);
            return ResponseEntity.status(HttpStatus.CREATED).body(newValues);
        }

        dataArray(newValues, subListIndex, data.getListIndex(), addOrDelete);
        return ResponseEntity.ok(newValues);
    }

    private void dataArray(List<String> subArrayList, int subListIndex, int listIndex, boolean addOrDelete) {
        ensureListInitialized(listIndex);

        if (listIndex != controllerListIndex) {
            webDataServlet(dbSaveList);
            initializeNewSubLists();
            controllerListIndex++;
        }

        if (subArrayList != null) {
            switch (subListIndex) {
                case 0 -> toothList.set(listIndex, updateList(toothList.get(listIndex), subArrayList, addOrDelete));
                case 1 -> symptomList.set(listIndex, updateList(symptomList.get(listIndex), subArrayList, addOrDelete));
                case 2 -> memoList.set(listIndex, updateList(memoList.get(listIndex), subArrayList, addOrDelete));
                default -> throw new IllegalArgumentException("Invalid subListIndex.");
            }
        }
        refreshPiList();
    }

    private void ensureListInitialized(int listIndex) {
        while (toothList.size() <= listIndex) toothList.add(new ArrayList<>());
        while (symptomList.size() <= listIndex) symptomList.add(new ArrayList<>());
        while (memoList.size() <= listIndex) memoList.add(new ArrayList<>());
        while (arrayList.size() <= listIndex) arrayList.add(new ArrayList<>());
    }

    private void initializeNewSubLists() {
        toothList.add(new ArrayList<>());
        symptomList.add(new ArrayList<>());
        memoList.add(new ArrayList<>());
        arrayList.add(new ArrayList<>());
    }

    private List<String> updateList(List<String> baseList, List<String> updateItems, boolean addOrDelete) {
        if (addOrDelete) {
            for (String item : updateItems) {
                if (!baseList.contains(item)) baseList.add(item);
            }
        } else {
            baseList.removeAll(updateItems);
        }
        return baseList;
    }

    @Override
    public void refreshPiList() {
        dbSaveList = new ArrayList<>();
        piList.clear();
        for (int i = 0; i < toothList.size(); i++) {
            piList.add(toothList.get(i));
            piList.add(symptomList.get(i));
            piList.add(memoList.get(i));
            if (i == toothList.size() - 1) {
                dbSaveList.add(toothList.get(i));
                dbSaveList.add(symptomList.get(i));
                dbSaveList.add(memoList.get(i));
            }
        }
    }

    @Override
    public List<List<String>> getSessionItems(Object sessionAttribute) {
        List<List<String>> sessionList = (List<List<String>>) sessionAttribute;
        if (sessionList == null) {
            sessionList = new ArrayList<>();
            for (int i = 0; i < 4; i++) sessionList.add(new ArrayList<>());
        }
        if (piList == null) piList = new ArrayList<>();
        log.info("piList get -----> {}", piList);
        return piList;
    }

    @Override
    public MedicalChartDTO webDataServlet(List<List<String>> data) {
        MedicalChartDTO request = new MedicalChartDTO();
        request.setChartData(data);
        request.setPaName(chartController.getPaName());
        request.setChartNum(chartController.getChartNum());

        return webClient.post()
                .uri("/medical_chart/saveData")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(MedicalChartDTO.class)
                .block();
    }
}
