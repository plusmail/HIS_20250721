//치아 선택
const tooth = document.querySelector(".tooth-container")
//pi 증상 선택
const symptom = document.querySelector(".pi-symptom")
//memo 선택
const memo = document.querySelector(".memo")
// 메모 저장버튼 선택
const saveMemo = document.querySelector(".save-memo")
// 성인 윗니 모두 선택할 수 있는 btn
const upTooth = document.querySelector(".up-control")

// 상악 치아 모두 선택
const upToothValues = document.querySelectorAll(".up-tooth")
// 성인 아랫니 모두 선택하는 btn
const downTooth = document.querySelector(".down-control")
// 성인 하악 모두 선택
const downToothValues = document.querySelectorAll(".down-tooth")
// 성인 치아 모두 선택하는 btn
const allTooth = document.querySelector(".all-control")
// 유치 상악 모두 선택 할 수 있는 btn
const upToothY = document.querySelector(".y-up-control")
// 유치 하악 모두 선택 할 수 있는 btn
const downToothY = document.querySelector(".y-down-control")
// 유치 상하악 모두 선택 할 수 있는 btn
const allToothY = document.querySelector(".y-all-control")
// 유치 상악 모두 선택
const yUpToothValues = document.querySelectorAll(".y-up-tooth")
// 유치 하악 모두 선택
const yDownToothValues = document.querySelectorAll(".y-down-tooth")
// 모달 데이터 선택
const modalData = document.querySelectorAll(".modal-tr")
// 모달 메모 데이터 전송 btn
const modalInMemo = document.querySelector(".modal-in-memo")
const allToothLists = tooth.querySelectorAll('button')
const allsymptomLists = symptom.querySelectorAll('input')

const piModalBtn = document.querySelector("#pi_modal_onOff")
const piMemoAdd = document.querySelector("#pi_memo_add")
const piMemoAddBtn = document.querySelector("#pi_memo_add_btn")


// 치아 동적 배열 선언
let toothList = []
//선택된 pi 증상을 저장하기위한 변수
let symptomList = []
// memo 데이터 저장을 위한 선언
let memoList = [];
// 의사의 자주쓰는 멘트 저장을 위한 동적 배열 선언
let frequentlyUsedPhrases = [];
// 데이터가 저장될때 배열의 index값을 재 지정하기위한 변수.
let listIndex = 0;
// 세션 데이터(환자정보) 를 가지고옴.


let patientInfos = JSON.parse(sessionStorage.getItem('selectedPatient'));

// 이벤트 리스너 등록
window.addEventListener('sessionStorageChanged', (event) => {
    console.log('sessionStorage 값이 변경되었습니다1111:', event.detail.key, event.detail.value);
    patientInfos = JSON.parse(sessionStorage.getItem('selectedPatient'));
    readPaChart()

});


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


// 데이터 배열을 세션에 등록.
function masterToSubList(subListIndex, newValue, listIndex, trueFalse) {
    $.ajax({
        url: '/medical_chart/addDelete-to-subList',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            subListIndex: subListIndex,
            newValues: newValue,
            listIndex: listIndex,
            addOrDelete: trueFalse
        }),
        success: function (response) {
            fetchSessionItems(); // 변경된 세션 데이터를 가져와 화면에 갱신
        },
        error: function (xhr, status, error) {
            console.log("fail")
            console.error('Failed to add to sublist:', error);
        }
    });
}


// HTML에 데이터 렌더링
function renderItems(itemsArray) {
    readPaChart()

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


//창이 열릴때 session값을 갱신.
$(document).ready(function () {
    saveChartNum()
    readPaChart()
    fetchSessionItems();

    // 예시: 주기적으로 데이터 갱신 (5초마다)
    // setInterval(renderingItems, 5000);
});

//세션구문 끝

function toothValueReset() {
    allToothLists.forEach(allToothList => {
        if (allToothList.classList.contains("opacity-50")) {
            allToothList.classList.remove("opacity-50")
        }
    })
    allsymptomLists.forEach(allsymptomList => {
        allsymptomList.checked = false
    })
}


// 데이터 받아서 세션으로 전송하는 구문 시작
// 치아 클릭 시 선택된 치아 value 값을 session에 저장.
tooth.addEventListener("click", e => {
    toothList = []
    toothList.push(e.target.value)
    if (e.target.tagName === "BUTTON" && e.target.id === '') {
        if (e.target.classList.contains("opacity-50")) {
            masterToSubList(0, toothList, listIndex, false)
            e.target.classList.remove("opacity-50")
        } else {
            masterToSubList(0, toothList, listIndex, true);
            e.target.classList.add("opacity-50")
        }
    } else {
        if (e.target.tagName === "BUTTON") {
            toothTerminal(e.target.id)
        }
    }
})

//증상 데이터를 저장.
symptom.addEventListener("click", e => {
    if (e.target.tagName === "INPUT") {
        symptomList = []
        symptomList.push(e.target.value);
        if (e.target.checked) {
            masterToSubList(1, symptomList, listIndex, true);
        } else {
            masterToSubList(1, symptomList, listIndex, false);
        }
    }

})
// 메모 데이터 저장
saveMemo.addEventListener("click", e => {
    if (e.target.tagName === "BUTTON" && memo.tagName === "TEXTAREA") {
        memoList = []
        memoList.push(memo.value)
    }
    masterToSubList(2, memoList, listIndex, true)
    memo.value = ''

    listIndex++;
    masterToSubList(null, null, listIndex, true)
    toothValueReset()

})

function toothTerminal(id) {
    toothList = []
    switch (id) {
        case "upTooth":
            for (i = 0; i < upToothValues.length; i++) {
                toothList[i] = upToothValues[i].value;
            }
            if (upTooth.classList.contains("opacity-50")) {
                masterToSubList(0, toothList, listIndex, false)
                upTooth.classList.remove("opacity-50")
                upToothValues.forEach(upToothValue =>
                    upToothValue.classList.remove("opacity-50"))
            } else {
                masterToSubList(0, toothList, listIndex, true)
                upTooth.classList.add("opacity-50")
                upToothValues.forEach(upToothValue =>
                    upToothValue.classList.add("opacity-50"))
            }
            console.log("상악")

            break;
        case "allTooth":
            for (i = 0; i < upToothValues.length; i++) {
                toothList.push(upToothValues[i].value)
                toothList.push(downToothValues[i].value)
            }
            if (allTooth.classList.contains("opacity-50")) {
                masterToSubList(0, toothList, listIndex, false)
                allTooth.classList.remove("opacity-50")
                upToothValues.forEach(upToothValue =>
                    upToothValue.classList.remove("opacity-50"))
                downToothValues.forEach(downToothValue =>
                    downToothValue.classList.remove("opacity-50"))
            } else {
                masterToSubList(0, toothList, listIndex, true)
                allTooth.classList.add("opacity-50")
                downToothValues.forEach(downToothValue =>
                    downToothValue.classList.add("opacity-50"))
                upToothValues.forEach(upToothValue =>
                    upToothValue.classList.add("opacity-50"))
            }
            console.log("전부")
            break;
        case "downTooth":
            for (i = 0; i < downToothValues.length; i++) {
                toothList[i] = downToothValues[i].value;
            }
            if (downTooth.classList.contains("opacity-50")) {
                masterToSubList(0, toothList, listIndex, false)
                downTooth.classList.remove("opacity-50")
                downToothValues.forEach(downToothValue =>
                    downToothValue.classList.remove("opacity-50"))
            } else {
                masterToSubList(0, toothList, listIndex, true)
                downTooth.classList.add("opacity-50")
                downToothValues.forEach(downToothValue =>
                    downToothValue.classList.add("opacity-50"))
            }
            console.log("하악")
            break;
        case "upToothY":
            for (i = 0; i < yUpToothValues.length; i++) {
                toothList[i] = yUpToothValues[i].value;
            }
            if (upToothY.classList.contains("opacity-50")) {
                masterToSubList(0, toothList, listIndex, false)
                upToothY.classList.remove("opacity-50")
                yUpToothValues.forEach(yUpToothValue =>
                    yUpToothValue.classList.remove("opacity-50"))
            } else {
                masterToSubList(0, toothList, listIndex, true)
                upToothY.classList.add("opacity-50")
                yUpToothValues.forEach(yUpToothValue =>
                    yUpToothValue.classList.add("opacity-50"))
            }
            console.log("유치상악")
            break;
        case "allToothY":

            console.log("유치전부")
            break;
        case "downToothY":
            for (i = 0; i < yDownToothValues.length; i++) {
                toothList[i] = yDownToothValues[i].value;
            }
            if (downToothY.classList.contains("opacity-50")) {
                masterToSubList(0, toothList, listIndex, false)
                downToothY.classList.remove("opacity-50")
                yDownToothValues.forEach(yDownToothValue =>
                    yDownToothValue.classList.remove("opacity-50"))
            } else {
                masterToSubList(0, toothList, listIndex, true)
                downToothY.classList.add("opacity-50")
                yDownToothValues.forEach(yDownToothValue =>
                    yDownToothValue.classList.add("opacity-50"))
            }
            console.log("유치하악")
            break;
        default:
            console.log("올바르지 않은 버튼을 선택하였습니다.")
            alert("올바르지 않은 버튼은을 선택하였습니다.")
            break;
    }
}

// 모달 테이블 행에 클릭 이벤트 추가
modalData.forEach(function (row) {
    console.log("1112121212")
    row.addEventListener('click', function () {
        if (this.classList.contains("selected-row")) {
            this.classList.remove("selected-row")
            this.querySelectorAll(".rowMemo").forEach(function (cell, index) {
                if (index === 1) {
                    frequentlyUsedPhrases = frequentlyUsedPhrases.filter(item => item !== cell.textContent)
                }
            })
            console.log(frequentlyUsedPhrases)
        } else {
            // 현재 클릭된 행에 클래스 추가
            this.classList.add('selected-row');
            this.querySelectorAll("td").forEach(function (cell, index) {
                if (index === 1) {
                    frequentlyUsedPhrases.push(cell.textContent)
                }
            })
            console.log(frequentlyUsedPhrases)
        }
    });
});

modalInMemo.addEventListener("click", e => {
    let k = 1;
    const selectedRows = document.querySelectorAll('tr.selected-row');  // 'selected-row' 클래스를 가진 모든 <tr> 선택

    frequentlyUsedPhrases=[];
    // 선택된 <tr>들에서 데이터 추출
    selectedRows.forEach(function(row) {
        row.querySelectorAll('td').forEach(function(cell) {
            if(k%2===0) {
                frequentlyUsedPhrases.push(cell.textContent);  // 각 <td>의 텍스트를 배열에 저장
            }
            k++
        });
    });


    memo.textContent = frequentlyUsedPhrases
    const closeModal = document.querySelector("#piModal")
    let modalInstance = bootstrap.Modal.getInstance(closeModal)
    if (!modalInstance) {
        modalInstance = new bootstrap.modal(closeModal);
    }
    modalInstance.hide();
})

// 서버에서 Medical Charts 데이터를 가져오는 함수

piModalBtn.addEventListener("click", e => {
    readChartMemo()
});


document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('pi_modal_table'); // <tbody> 요소의 ID가 'table-body'인 경우

    if (tableBody) {  // tableBody가 null이 아닌 경우에만 addEventListener 호출
        tableBody.addEventListener('click', function(event) {
            if (event.target && event.target.closest('tr')) {
                const clickedRow = event.target.closest('tr');


                // 클릭된 tr에 'selected-row' 클래스 추가
                clickedRow.classList.toggle('selected-row');
            }
        });
    } else {
        console.error("tableBody가 존재하지 않습니다. 확인해보세요.");
    }
});

function readChartMemo() {
    let k = 1;
    $.ajax({
        url: '/medical_chart/getMemo',  // 서버에서 데이터를 가져올 API 경로
        type: 'GET',  // GET 요청
        dataType: 'json',  // 서버에서 JSON 응답을 기대
        success: function (data) {
            let tableBody = $("#pi_modal_table");
            tableBody.empty();  // 기존 내용을 비움

            // 데이터를 순회하여 테이블에 추가
            data.forEach(memo => {
                let row = `<tr class="modal-tr">
                              <td>${k}</td>
                              <td>${memo.memo}</td>
                           </tr>`;
                tableBody.append(row);  // 새로운 행을 테이블에 추가
                k++;
            });
        },
        error: function (xhr, status, error) {
            console.error('Error:', error);  // 에러 처리
        }
    });
}

piMemoAddBtn.addEventListener("click", e => {
    $.ajax({
        url: '/medical_chart/saveMemos',  // 서버의 API 엔드포인트
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            memo: piMemoAdd.value, // 서버로 전송할 데이터
            doc: "의사"// 추후에 계정정보에서 의사 이름을 가져와서 저장.
        }),
        success: function (response) {
            console.log('Success:', response);  // 성공 시 서버의 응답 처리
            // 서버에서 데이터를 다시 불러와서 테이블 갱신하거나 다른 작업 수행
            readChartMemo()

            piMemoAdd.value === '';

        },
        error: function (xhr, status, error) {
            console.error('Error:', error);  // 오류 처리
        }
    });

});

function readPaChart() {
    console.log("ccccccccccc->"+patientInfos.chartNum)
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


            // // 데이터를 순회하여 테이블에 추가
            // data.forEach(chart => {
            //     let row = `<tr>
            //                   <td>${chart.mdTime}</td>
            //                   <td>${chart.teethNum}</td>
            //                   <td>${chart.medicalDivision}</td>
            //                   <td>${chart.medicalContent}</td>
            //                </tr>`;
            //     tableBody.append(row);  // 새로운 행을 테이블에 추가
            // });


        },
        error: function (xhr, status, error) {
            console.error('Error:', error);  // 에러 처리
        }
    });
}