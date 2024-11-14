let patientInfos = JSON.parse(sessionStorage.getItem('selectedPatient'));

let cnumGlogal = null;
document.addEventListener("DOMContentLoaded", function () {
    let SearchModal = document.getElementById('Search-Modal');
    let mTooth = document.querySelector("#Search-container"); // id로 수정
    let saveToothBtn = document.getElementById('search-save-tooth');  // 치아 저장 버튼 ID 수정
    let mUpTooth = document.querySelector(".modal-up-control");
    let mUpToothValues = document.querySelectorAll(".modal-up-tooth");
    let mDownTooth = document.querySelector(".modal-down-control");
    let mDownToothValues = document.querySelectorAll(".modal-down-tooth");
    let mAllTooth = document.querySelector(".modal-all-control");
    let mUpToothY = document.querySelector(".modal-y-up-control");
    let mDownToothY = document.querySelector(".modal-y-down-control");
    let mAllToothY = document.querySelector(".modal-y-all-control");
    let mYUpToothValues = document.querySelectorAll(".modal-y-up-tooth");
    let mYDownToothValues = document.querySelectorAll(".modal-y-down-tooth");
    let selectedPTag = null;
    let modalToothList = [];
    let toothValues = [];
    // 전역 변수 선언
    // 전역 변수 선언
    let selectedTeethValue = '';
    let appointmentDateStart = '';
    let appointmentDateEnd = '';
    let selectedDoctor = '';
    let selectedMedicalDivision = '';
    let keyword = '';


    setupEventListeners();

    function setupEventListeners() {
        if (SearchModal) {
            SearchModal.addEventListener('click', handleModalClick);
        }
        document.addEventListener("click", handleDocumentClick);
        if (saveToothBtn) saveToothBtn.addEventListener('click', saveSelectedTeeth); // 치아 저장 버튼 이벤트 리스너 추가
        if (mTooth) mTooth.addEventListener("click", handleToothClick); // 수정된 mTooth
    }

    function handleModalClick(event) {
        const target = event.target;
        if (target.closest('button')) {
            const button = target.closest('button');
            const checkbox = SearchModal.querySelector(`button[type="button"][value="${button.value}"]`);
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
            }
        }
    }

    function handleDocumentClick(e) {
        const target = e.target;
        if (target.classList.contains("select-pTag")) {
            savePTag(target);
        }
    }

    function savePTag(pTag) {
        selectedPTag = pTag;
    }

    function handleToothClick(e) {
        modalToothList = [];
        modalToothList.push(e.target.value);
        if (e.target.tagName === "BUTTON" && e.target.id === '') {
            e.target.classList.toggle("opacity-50");
        } else if (e.target.tagName === "BUTTON") {
            toothTerminal(e.target.id);
        }
    }

    function toothTerminal(id) {
        let targetElements = []; // 대상 치아 버튼 저장

        // ID에 따른 치아 그룹 설정
        switch (id) {
            case "search-modal-upTooth":
                targetElements = mUpToothValues;
                handleGroupSelection(mUpTooth, targetElements, "상악");
                break;
            case "search-modal-allTooth":
                targetElements = [...mUpToothValues, ...mDownToothValues];
                handleGroupSelection(mAllTooth, targetElements, "전체 치아");
                break;
            case "search-modal-downTooth":
                targetElements = mDownToothValues;
                handleGroupSelection(mDownTooth, targetElements, "하악");
                break;
            case "search-modal-upToothY":
                targetElements = mYUpToothValues;
                handleGroupSelection(mUpToothY, targetElements, "유치 상악");
                break;
            case "search-modal-allToothY":
                targetElements = [...mYUpToothValues, ...mYDownToothValues];
                handleGroupSelection(mAllToothY, targetElements, "유치 전체 치아");
                break;
            case "search-modal-downToothY":
                targetElements = mYDownToothValues;
                handleGroupSelection(mDownToothY, targetElements, "유치 하악");
                break;
            default:
                alert("올바르지 않은 버튼을 선택하였습니다.");
                return;
        }
    }


    function handleGroupSelection(button, elements, groupName) {
        const isCurrentlySelected = button.classList.contains("opacity-50");

        // 전체 치아, 상악, 하악에 대한 그룹 처리
        if (["전체 치아", "상악", "하악"].includes(groupName)) {
            if (groupName === "전체 치아") {
                // 전체 치아 선택/해제
                if (!isCurrentlySelected) {
                    button.classList.add("opacity-50");
                    // 전체 치아가 선택되면 상악과 하악 치아 모두 선택
                    [...mUpToothValues, ...mDownToothValues].forEach(element => {
                        element.classList.add("opacity-50");
                    });
                    // 상악/하악 버튼도 선택 상태로 변경
                    mUpTooth.classList.add("opacity-50");
                    mDownTooth.classList.add("opacity-50");
                } else {
                    button.classList.remove("opacity-50");
                    // 전체 치아 해제 시 상악과 하악 치아 모두 해제
                    [...mUpToothValues, ...mDownToothValues].forEach(element => {
                        element.classList.remove("opacity-50");
                    });
                    // 상악/하악 버튼 해제
                    mUpTooth.classList.remove("opacity-50");
                    mDownTooth.classList.remove("opacity-50");
                }
            }

            if (groupName === "상악") {
                // 상악 선택/해제
                if (!isCurrentlySelected) {
                    button.classList.add("opacity-50");
                    elements.forEach(element => element.classList.add("opacity-50"));
                    // 전체 치아 선택 버튼 해제
                    mAllTooth.classList.remove("opacity-50");
                } else {
                    button.classList.remove("opacity-50");
                    elements.forEach(element => element.classList.remove("opacity-50"));
                }
                // 전체 치아 상태 반영
                if (mDownTooth.classList.contains("opacity-50")) {
                    mAllTooth.classList.add("opacity-50");
                }
            } else if (groupName === "하악") {
                // 하악 선택/해제
                if (!isCurrentlySelected) {
                    button.classList.add("opacity-50");
                    elements.forEach(element => element.classList.add("opacity-50"));
                    // 전체 치아 선택 버튼 해제
                    mAllTooth.classList.remove("opacity-50");
                } else {
                    button.classList.remove("opacity-50");
                    elements.forEach(element => element.classList.remove("opacity-50"));
                }
                // 전체 치아 상태 반영
                if (mUpTooth.classList.contains("opacity-50")) {
                    mAllTooth.classList.add("opacity-50");
                }
            }

            // 상악과 하악 둘 중 하나라도 선택되지 않으면 전체 치아 선택 버튼 해제
            if (!mUpTooth.classList.contains("opacity-50") || !mDownTooth.classList.contains("opacity-50")) {
                mAllTooth.classList.remove("opacity-50");
            }
        }

        // 유치 치아 그룹 처리
        if (["유치 전체 치아", "유치 상악", "유치 하악"].includes(groupName)) {
            if (groupName === "유치 전체 치아") {
                // 전체 치아 선택/해제
                if (!isCurrentlySelected) {
                    button.classList.add("opacity-50");
                    // 전체 치아가 선택되면 상악과 하악 치아 모두 선택
                    [...mYUpToothValues, ...mYDownToothValues].forEach(element => {
                        element.classList.add("opacity-50");
                    });
                    // 상악/하악 버튼도 선택 상태로 변경
                    mUpToothY.classList.add("opacity-50");
                    mDownToothY.classList.add("opacity-50");
                } else {
                    button.classList.remove("opacity-50");
                    // 전체 치아 해제 시 상악과 하악 치아 모두 해제
                    [...mYUpToothValues, ...mYDownToothValues].forEach(element => {
                        element.classList.remove("opacity-50");
                    });
                    // 상악/하악 버튼 해제
                    mUpToothY.classList.remove("opacity-50");
                    mDownToothY.classList.remove("opacity-50");
                }
            }

            if (groupName === "유치 상악") {
                // 상악 선택/해제
                if (!isCurrentlySelected) {
                    button.classList.add("opacity-50");
                    elements.forEach(element => element.classList.add("opacity-50"));
                    // 전체 치아 선택 버튼 해제
                    mAllToothY.classList.remove("opacity-50");
                } else {
                    button.classList.remove("opacity-50");
                    elements.forEach(element => element.classList.remove("opacity-50"));
                }
                // 전체 치아 상태 반영
                if (mDownToothY.classList.contains("opacity-50")) {
                    mAllToothY.classList.add("opacity-50");
                }
            } else if (groupName === "유치 하악") {
                // 하악 선택/해제
                if (!isCurrentlySelected) {
                    button.classList.add("opacity-50");
                    elements.forEach(element => element.classList.add("opacity-50"));
                    // 전체 치아 선택 버튼 해제
                    mAllToothY.classList.remove("opacity-50");
                } else {
                    button.classList.remove("opacity-50");
                    elements.forEach(element => element.classList.remove("opacity-50"));
                }
                // 전체 치아 상태 반영
                if (mUpToothY.classList.contains("opacity-50")) {
                    mAllToothY.classList.add("opacity-50");
                }
            }

            // 상악과 하악 둘 중 하나라도 선택되지 않으면 전체 치아 선택 버튼 해제
            if (!mUpToothY.classList.contains("opacity-50") || !mDownToothY.classList.contains("opacity-50")) {
                mAllToothY.classList.remove("opacity-50");
            }
        }

    // 현재 버튼 상태 토글 (선택 해제)
        if (isCurrentlySelected) {
            button.classList.remove("opacity-50");
            elements.forEach(element => element.classList.remove("opacity-50"));
        }
    }


    window.searchList = async function searchList() {
        if(patientInfos){
            try {
                // 필터 데이터가 없으면 기본 값을 설정
                const requestData = {
                    mdTimeStart: appointmentDateStart || null,
                    mdTimeEnd: appointmentDateEnd || null,
                    checkDoc: selectedDoctor || null,
                    medicalDivision: selectedMedicalDivision || null,
                    teethNum: selectedTeethValue || [],
                    chartNum: patientInfos.chartNum || null, // chartNum은 환자 세션에서 가져옴
                    keyword: keyword || null
                };

                const response = await axios.post('/medical_chart/search', requestData);

                let tableBody1 = $("#paChart-list");
                tableBody1.empty();
                let previousMdTime = null;

                // 각 사분면별 치아 번호와 색상
                const upperLeftRed = [18, 17, 16, 15, 14, 13, 12, 11];
                const upperLeftBlack = [55, 54, 53, 52, 51];
                const upperRightRed = [21, 22, 23, 24, 25, 26, 27, 28];
                const upperRightBlack = [61, 62, 63, 64, 65];
                const lowerLeftRed = [48, 47, 46, 45, 44, 43, 42, 41];
                const lowerLeftBlack = [85, 84, 83, 82, 81];
                const lowerRightRed = [31, 32, 33, 34, 35, 36, 37, 38];
                const lowerRightBlack = [71, 72, 73, 74, 75];

                // 1의 자리를 문자로 변환하는 함수
                function convertDigitToLetter(digit) {
                    switch (digit) {
                        case 1:
                            return 'A';
                        case 2:
                            return 'B';
                        case 3:
                            return 'C';
                        case 4:
                            return 'D';
                        case 5:
                            return 'E';
                        default:
                            return digit; // 변환되지 않는 경우 숫자를 그대로 사용
                    }
                }

                // 치아 번호에 따라 색상 및 표시할 문자 처리
                function getTeethCellContent(teethNum, isRed) {
                    let displayNum = isRed ? teethNum % 10 : convertDigitToLetter(teethNum % 10); // 빨간색은 숫자, 검은색은 문자 변환
                    return `<span style="color: ${isRed ? 'red' : 'black'};">${displayNum}</span>`;
                }

                // 데이터를 순회하여 테이블에 추가
                response.data.forEach(chart => {
                    let mdTimeCell = (previousMdTime === chart.mdTime) ? '' : chart.mdTime;

                    // 각 치아 번호를 분할하여 사분면 형식으로 정렬
                    let teethNums = chart.teethNum.split(',').map(num => parseInt(num.trim()));

                    // 각 사분면의 텍스트를 빨간색과 검은색으로 분리하여 정렬
                    let upperLeftRedText = teethNums.filter(num => upperLeftRed.includes(num)).map(num => getTeethCellContent(num, true)).join(', ');
                    let upperLeftBlackText = teethNums.filter(num => upperLeftBlack.includes(num)).map(num => getTeethCellContent(num, false)).join(', ');

                    let upperRightRedText = teethNums.filter(num => upperRightRed.includes(num)).map(num => getTeethCellContent(num, true)).join(', ');
                    let upperRightBlackText = teethNums.filter(num => upperRightBlack.includes(num)).map(num => getTeethCellContent(num, false)).join(', ');

                    let lowerLeftBlackText = teethNums.filter(num => lowerLeftBlack.includes(num)).map(num => getTeethCellContent(num, false)).join(', ');
                    let lowerLeftRedText = teethNums.filter(num => lowerLeftRed.includes(num)).map(num => getTeethCellContent(num, true)).join(', ');

                    let lowerRightBlackText = teethNums.filter(num => lowerRightBlack.includes(num)).map(num => getTeethCellContent(num, false)).join(', ');
                    let lowerRightRedText = teethNums.filter(num => lowerRightRed.includes(num)).map(num => getTeethCellContent(num, true)).join(', ');

                    // 사분면 형식으로 테이블 셀 생성
                    let teethNumCell = `
                        <td style="font-size: 0.9rem; width: 100px">
                            <div class="quadrant-container">
                                <div class="quadrant upper-left">${upperLeftRedText}<br>${upperLeftBlackText}</div>
                                <div class="quadrant upper-right">${upperRightRedText}<br>${upperRightBlackText}</div>
                                <div class="quadrant lower-left">${lowerLeftBlackText}<br>${lowerLeftRedText}</div>
                                <div class="quadrant lower-right">${lowerRightBlackText}<br>${lowerRightRedText}</div>
                            </div>
                        </td>
                    `;

                    // 행 생성
                    let row = $(`
                        <tr>
                            <td class="text-center">${mdTimeCell}</td>
                            ${teethNumCell}
                            <td class="text-center">${chart.medicalDivision}</td>
                            <td class="text-center">${chart.medicalContent}</td>
                            <td class="text-center medical-content-cell">${chart.checkDoc}</td>
                        </tr>
                    `);

                    row.on('dblclick', function () {
                        cnumGlogal = chart.cnum;
                        loadDataIntoFields(cnumGlogal);
                    });

                    // 각 데이터 클릭 이벤트 추가
                    row.on('click', function () {
                        $('.medical-content-cell .delete-icon').remove();
                        let medicalContentCell = row.find('.medical-content-cell');
                        if (!medicalContentCell.find('.delete-icon').length) {
                            medicalContentCell.append('<span class="delete-icon"><i class="bi bi-trash"></i></span>');
                        }
                        medicalContentCell.on('click', '.delete-icon', function (event) {
                            event.stopPropagation();
                            let cnum = chart.cnum;
                            $.ajax({
                                url: '/medical_chart/deleteChart',
                                type: 'DELETE',
                                data: {cnum: cnum},
                                success: function (response) {
                                    searchList();
                                },
                                error: function (xhr, status, error) {
                                    console.error('Error:', error);
                                }
                            });
                        });
                    });

                    tableBody1.append(row);
                    previousMdTime = chart.mdTime;
                });
                if (appointmentDateStart || appointmentDateEnd || selectedDoctor || selectedMedicalDivision || selectedTeethValue.length > 0) {
                    const filterButton = document.querySelector('.select-pTag');
                    filterButton.innerHTML = '<i class="bi bi-hourglass-split"></i> 필터 적용중';
                }

            } catch (error) {
                console.error("검색 요청 중 오류 발생:", error);
            }
        }

    }

    async function saveSelectedTeeth() {
        if (selectedPTag) {
            const buttons = SearchModal.querySelectorAll('button.opacity-50');
            selectedTeethValue = []; // 전역 변수 초기화
            buttons.forEach(button => {
                if (button.value && !isNaN(button.value) && button.value !== '치아 선택') {
                    selectedTeethValue.push(button.value);

                }
            });
            buttons.forEach(button => {
                button.classList.remove('opacity-50');
            });

            // 선택된 치아 값을 selectedPTag에 저장하고 표시
            selectedPTag.value = selectedTeethValue.join(', ');

            appointmentDateStart = document.getElementById('appointmentDateStart').value;
            appointmentDateEnd = document.getElementById('appointmentDateEnd').value;
            selectedDoctor = document.getElementById('checkDoc').value;
            selectedMedicalDivision = document.getElementById('medicalDivision').value;
            keyword = document.getElementById('History_keyword').value;

            await searchList();

            // 모달 닫기
            const bootstrapModal = bootstrap.Modal.getInstance(SearchModal);
            bootstrapModal.hide();
        } else {
            console.error("No p tag was selected to display the results.");
        }
    }

    // 모달 열기 시 선택된 치아 버튼 상태 적용
    function initializeModal() {
        const buttons = SearchModal.querySelectorAll('button.tooth-btn, button.small-tooth-btn');

        // mUpToothValues, mDownToothValues 배열로 변환
        const mUpToothValuesArray = Array.from(mUpToothValues);  // 변환
        const mDownToothValuesArray = Array.from(mDownToothValues); // 변환

        // 개별 치아 버튼 선택 상태 복원
        buttons.forEach(button => {
            if (selectedTeethValue.includes(button.value)) {
                button.classList.add('opacity-50');
            } else {
                button.classList.remove('opacity-50');
            }
        });

        // 전체 치아, 상악 전체, 하악 전체 버튼 상태 복원
        const upperSelected = mUpToothValuesArray.every(button => selectedTeethValue.includes(button.value));
        const lowerSelected = mDownToothValuesArray.every(button => selectedTeethValue.includes(button.value));

        // 상악과 하악이 모두 선택된 경우 전체 치아 버튼 활성화
        if (upperSelected && lowerSelected) {
            mAllTooth.classList.add('opacity-50');
        } else {
            mAllTooth.classList.remove('opacity-50');
        }

        // 상악 전체 버튼 상태
        if (upperSelected) {
            mUpTooth.classList.add('opacity-50');
        } else {
            mUpTooth.classList.remove('opacity-50');
        }

        // 하악 전체 버튼 상태
        if (lowerSelected) {
            mDownTooth.classList.add('opacity-50');
        } else {
            mDownTooth.classList.remove('opacity-50');
        }

        // 진료일자 복원
        document.getElementById('appointmentDateStart').value = appointmentDateStart;
        document.getElementById('appointmentDateEnd').value = appointmentDateEnd;

        // 진료의 복원
        document.getElementById('checkDoc').value = selectedDoctor;

        // 구분 복원
        document.getElementById('medicalDivision').value = selectedMedicalDivision;
    }

// 모달 열 때 초기화와 상태 복원
    SearchModal.addEventListener('show.bs.modal', initializeModal);

    //검색 리셋
    document.getElementById('resetButton').addEventListener('click', function () {
        selectedTeethValue = '';
        appointmentDateStart = '';
        appointmentDateEnd = '';
        selectedDoctor = '';
        selectedMedicalDivision = '';
        keyword = '';
        document.getElementById('History_keyword').value = '';
        searchList();

        const filterButton = document.querySelector('.select-pTag');
        filterButton.innerHTML = ' <i class="bi bi-filter"></i> 검색 필터';
    });


// 엔터 키 입력 시 버튼 기능 실행
    document.getElementById('History_keyword').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') { // Enter 키 확인
            event.preventDefault(); // 기본 엔터 동작 방지 (필요 시)
            document.getElementById('searchButton').click(); // 버튼 클릭 실행
        }
    });

// 버튼 클릭 시 검색 함수 호출
    document.getElementById('searchButton').addEventListener('click', performSearch);

    // 검색 기능 함수
    async function performSearch() {
        keyword = document.getElementById('History_keyword').value;
        if (keyword.trim() !== "") { // 키워드가 비어있지 않을 경우에만 실행
            await searchList();

            // 여기서 원하는 검색 기능 또는 AJAX 요청을 추가할 수 있습니다.
        } else {
            console.log("Please enter a keyword to search.");
        }
    }
});


// 이벤트 리스너 등록
window.addEventListener('sessionStorageChanged', (event) => {
    patientInfos = JSON.parse(sessionStorage.getItem('selectedPatient'));
    searchList()
});
//세션 시작
// 세션 데이터 가져오기
function saveChartNum() {
    if (patientInfos) {
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
                console.error('Failed to add to sublist:', error);
            }
        });
    }
}


function fetchSessionItems() {
    $.ajax({
        url: '/medical_chart/get-session-items',
        method: 'GET',
        success: function (response) {
            renderItems(response);
        },
        error: function (xhr, status, error) {
            console.error('Failed to fetch session items:', error);
        }
    });

}

//창이 열릴때 session값을 갱신.
$(document).ready(function () {
    saveChartNum()
    searchList()
    fetchSessionItems();
});

function updateChartTable(chartNum) {
    $.ajax({
        url: '/medical_chart/PLANChartData?chartNum=' + chartNum,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            let tableBody = $("#plan-data");
            tableBody.empty();
            data.forEach(chart => {
                createTableRowWithData(chart, doctorNames, tableBody);
            });
            createNewTableRow(doctorNames, tableBody);
        },
        error: function (xhr, status, error) {
            console.error('데이터 갱신 실패:', error);
            alert('데이터 갱신 중 문제가 발생했습니다.');
        }
    });
}

// HTML에 데이터 렌더링
function renderItems(itemsArray) {

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



