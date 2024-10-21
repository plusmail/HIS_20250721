package kroryi.his.controller;

import jakarta.servlet.http.HttpSession;
import kroryi.his.dto.ChartPaData;
import kroryi.his.dto.MedicalChartDTO;
import kroryi.his.dto.RequestData;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;


@Log4j2
@RequiredArgsConstructor
@RestController
public class ChartPiController {
    //치아의 List를 관리하긴 2중 List
    List<List<String>> toothList = null;
    //치아의 증상을 관리하기위한 2중 List
    List<List<String>> symptomList = null;
    //치아의 메모를 관리하기위한 2중 List
    List<List<String>> memoList = null;
    //위 List들의 데이터 위치를 관리하기위한 List
    List<List<String>> arrayList = null;
    // List들의 종합적인 데이터 관리를 위한 2중List
    List<List<String>> piList = null;
    List<List<String>> nestedList;
    final int plusNum = 3;
    int controllerListIndex = 0;
    String paName;
    String chartNum;

   final WebClient webClient = WebClient.create("http://localhost:8080/");

    List<List<String>> dbSaveList;


    @PostMapping("/medical_chart/addDelete-to-subList")
    private ResponseEntity<?> addDeleteToSubList(@RequestBody RequestData data) {
        List<String> newValues = data.getNewValues();
        int subListIndex = data.getSubListIndex();
        boolean addOrDelete = data.isAddOrDelete();

        if (data.getListIndex() != controllerListIndex) {
            dataArray(newValues, subListIndex, data.getListIndex(), addOrDelete);
            return ResponseEntity.status(HttpStatus.CREATED).body("OK");
        }

        dataArray(newValues, subListIndex, data.getListIndex(), addOrDelete);
        return ResponseEntity.ok(newValues);


    }

    @PostMapping("/medical_chart/savePaList")
    private ResponseEntity<?> savePaList(@RequestBody ChartPaData paData) {
         paName = paData.getPaName();
        chartNum = paData.getChartNum();




        return ResponseEntity.ok(paName);


    }


    // 세션에서 배열을 가져오는 엔드포인트
    @GetMapping("/medical_chart/get-session-items")
    public List<List<String>> getSessionItems(HttpSession session) {

        // 세션에서 "nestedList" 가져오기
        nestedList = (List<List<String>>) session.getAttribute("nestedList");
        // 세션에 값이 없을 경우 빈 이중 리스트를 반환
        if (nestedList == null) {
            nestedList = new ArrayList<>();
            for (int i = 0; i < 4; i++) {
                nestedList.add(new ArrayList<>());
            }
        }

        if (piList == null) {
//            piList = new ArrayList<>();
//            for (int i = 0; i < 4; i++) {
//                piList.add(new ArrayList<>());
//            }
            piList = new ArrayList<>();
        }

//        nestedList = piList;
        log.info("piList get -----> {}", piList);
        return piList;
    }


    private ResponseEntity<?> dataArray(List<String> subArrayList, int subListIndex, int listIndex, boolean addOrDelete) {

        int listNum = listIndex + 3;

        List<String> listIndexList = new ArrayList<>();
        listIndexList.add(String.valueOf(listIndex));

        if (toothList == null) {
            toothList = new ArrayList<>();
            toothList.add(new ArrayList<>());
        }
        ;
        if (symptomList == null) {
            symptomList = new ArrayList<>();
            symptomList.add(new ArrayList<>());
        }
        ;
        if (memoList == null) {
            memoList = new ArrayList<>();
            memoList.add(new ArrayList<>());
        }
        if (arrayList == null) {
            arrayList = new ArrayList<>();
            arrayList.add(new ArrayList<>());
        }

        if (piList == null) {
            piList = new ArrayList<>();
        }

        if (listIndex != controllerListIndex) {
            webDataServlet(dbSaveList);
            toothList.add(new ArrayList<>());
            symptomList.add(new ArrayList<>());
            memoList.add(new ArrayList<>());
            arrayList.add(new ArrayList<>());
            controllerListIndex++;


        }

        if (subArrayList != null) {
            switch (subListIndex) {
                case 0:
                    toothList.set(listIndex, returnList(toothList.get(listIndex), subArrayList, addOrDelete));
//                piList.set(listIndex, toothList.get(listIndex));
                    arrayList.set(listIndex, listIndexList);
//                piList.set(listNum, arrayList.get(listIndex));
                    break;
                case 1:
//                symptomList.set(listIndex, subArrayList);
                    symptomList.set(listIndex, returnList(symptomList.get(listIndex), subArrayList, addOrDelete));
//                piList.set(subListIndex, symptomList.get(listIndex));
                    arrayList.set(listIndex, listIndexList);
//                piList.set(listNum, arrayList.get(listIndex));
                    log.info("symptomList ----> {}", symptomList);
                    break;
                case 2:
//                memoList.set(listIndex, subArrayList);
                    memoList.set(listIndex, returnList(memoList.get(listIndex), subArrayList, addOrDelete));
//                piList.set(subListIndex, memoList.get(listIndex));
                    arrayList.set(listIndex, listIndexList);
//                piList.set(listNum, arrayList.get(listIndex));
                    log.info("memoList ----> {}", memoList);
                    break;

                default:
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid subListIndex.");
            }
        }
        dbSaveList = new ArrayList<>();
        piList = new ArrayList<>();
        for (int i = 0; i < toothList.size(); i++) {
            piList.add(toothList.get(i));
            piList.add(symptomList.get(i));
            piList.add(memoList.get(i));
            if(i == toothList.size()-1){
                dbSaveList.add(toothList.get(i));
                dbSaveList.add(symptomList.get(i));
                dbSaveList.add(memoList.get(i));
            }
        }


        log.info("toothList get -----> {}", toothList);
        log.info("symptomList get -----> {}", symptomList);
        log.info("memoList get -----> {}", memoList);

        log.info("piList-set -----> {}", piList);


        return null;
    }

    private List<String> returnList(List<String> firstList, List<String> secondList, boolean addOrDelete) {
        if (addOrDelete) {
            secondList.forEach(item -> {
                if (!firstList.contains(item)) {
                    firstList.add(item);
                }
            });
        } else {
            secondList.forEach(item -> {
                if (firstList.contains(item)) {
                    firstList.remove(item);
                }
            });
        }
        return firstList;
    }

    private void webDataServlet(List<List<String>> data) {

        MedicalChartDTO request = new MedicalChartDTO();
        request.setChartData(data);
        request.setPaName(paName);
        request.setChartNum(chartNum);

        webClient.post()
                .uri("/medical_chart/saveData")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

}