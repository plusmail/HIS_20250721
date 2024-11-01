let patientInfos = JSON.parse(sessionStorage.getItem('selectedPatient'));

// 이벤트 리스너 등록
window.addEventListener('sessionStorageChanged', (event) => {
    console.log('sessionStorage 값이 변경되었습니다1111:', event.detail.key, event.detail.value);
    patientInfos = JSON.parse(sessionStorage.getItem('selectedPatient'));
    readPaChart()
});
console.log(patientInfos);
//세션 시작
// 세션 데이터 가져오기
function saveChartNum() {
    $.ajax({
        url: '/medical_chart/savePaList',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            paName: patientInfos.name,
            chartNum: patientInfos.chartNum
        }),
        success: function (response) {

        }
        ,
        error: function (xhr, status, error) {
            console.log("fail")
            console.error('Failed to add to sublist:', error);
        }
    });
}




function fetchSessionItems() {
    $.ajax({
        url: '/medical_chart/get-session-items',
        method: 'GET',
        success: function (response) {renderItems(response);
        },
        error: function (xhr, status, error) {
            console.error('Failed to fetch session items:', error);
        }
    });

}

//창이 열릴때 session값을 갱신.
$(document).ready(function () {
    saveChartNum()
    readPaChart()
    fetchSessionItems();

    // 예시: 주기적으로 데이터 갱신 (5초마다)
    // setInterval(renderingItems, 5000);
});

function readPaChart() {
    $.ajax({
        url: '/medical_chart/getChartData?chartNum=' + patientInfos.chartNum,  // 서버에서 데이터를 가져올 API 경로
        type: 'GET',  // GET 요청
        dataType: 'json',  // 서버에서 JSON 응답을 기대
        success: function (data) {

            console.log("차트 보여주는 메소드 실행")
            let tableBody = $("#paChart-list");
            tableBody.empty();  // 기존 내용을 비움

            let previousMdTime = null;  // 이전 mdTime을 저장할 변수

// 데이터를 순회하여 테이블에 추가
            data.forEach(chart => {
                // 이전 mdTime과 현재 mdTime이 같은 경우 빈 값을 출력, 다르면 mdTime을 출력
                let mdTimeCell = (previousMdTime === chart.mdTime) ? '' : chart.mdTime;

                let row = `<tr>
                  <td>${mdTimeCell}</td>
                  <td>${chart.teethNum}</td>
                  <td>${chart.medicalDivision}</td>
                  <td>${chart.medicalContent}</td>
               </tr>`;
                tableBody.append(row);  // 새로운 행을 테이블에 추가

                // 현재 mdTime 값을 이전 값으로 저장
                previousMdTime = chart.mdTime;
            })


        },
        error: function (xhr, status, error) {
            console.error('Error:', error);  // 에러 처리
        }
    });
}
// HTML에 데이터 렌더링
function renderItems(itemsArray) {
    // readPaChart()

    var itemList = $('#nested-items-list');
    itemList.empty(); // 기존 내용 지우기
    let i = 0;
    while (i < itemsArray.length) {

        // 새로운 행 생성
        let row = $('<tr style="overflow-wrap: break-word">');

        // 행을 테이블에 추가
        itemList.append(row);
        // 3개의 itemsArray 값을 출력
        for (let j = 0; j < 3 && i < itemsArray.length; j++, i++) {
            let subListItem = $('<th scope="col" class="col-md-3" style="overflow-wrap: break-word">').text(itemsArray[i].join(','));
            row.append(subListItem);
        }


        let buttonCell = $('<th scope="col" class="col-md-3">' +
            '<button class="btn btn-sm" type="button">저장</button><br/>' +
            '<button type="button" class="btn btn-sm">삭제</button></th>');

        row.append(buttonCell);
    }
}