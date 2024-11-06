let patientInfos = JSON.parse(sessionStorage.getItem('selectedPatient'));

// 이벤트 리스너 등록
window.addEventListener('sessionStorageChanged', (event) => {
    patientInfos = JSON.parse(sessionStorage.getItem('selectedPatient'));
    readPaChart()
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
    readPaChart()
    fetchSessionItems();

    // 예시: 주기적으로 데이터 갱신 (5초마다)
    // setInterval(renderingItems, 5000);
});

function readPaChart() {
    if (patientInfos) {
        $.ajax({
            url: '/medical_chart/getChartData?chartNum=' + patientInfos.chartNum,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                let tableBody = $("#paChart-list");
                tableBody.empty();
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
                            return digit;  // 변환되지 않는 경우 숫자를 그대로 사용
                    }
                }

// 치아 번호에 따라 색상 및 표시할 문자 처리
                function getTeethCellContent(teethNum) {
                    let color = 'black';
                    let displayNum;

                    // 빨간색으로 표시할 치아 번호
                    if (upperLeftRed.includes(teethNum) || lowerLeftRed.includes(teethNum) || upperRightRed.includes(teethNum) || lowerRightRed.includes(teethNum)) {
                        color = 'red';
                        displayNum = teethNum % 10;  // 1의 자리 숫자만 표시
                    }
                    // 검은색으로 표시할 치아 번호
                    else {
                        displayNum = convertDigitToLetter(teethNum % 10);  // 1의 자리 숫자를 문자로 변환
                    }

                    return `<span style="color: ${color};">${displayNum}</span>`;
                }

// 데이터를 순회하여 테이블에 추가
                data.forEach(chart => {
                    let mdTimeCell = (previousMdTime === chart.mdTime) ? '' : chart.mdTime;

                    // 각 치아 번호를 분할하여 사분면 형식으로 정렬
                    let teethNums = chart.teethNum.split(',').map(num => parseInt(num.trim()));
                    let upperLeft = teethNums.filter(num => upperLeftRed.includes(num) || upperLeftBlack.includes(num)).map(getTeethCellContent).join(', ');
                    let upperRight = teethNums.filter(num => upperRightRed.includes(num) || upperRightBlack.includes(num)).map(getTeethCellContent).join(', ');
                    let lowerLeft = teethNums.filter(num => lowerLeftRed.includes(num) || lowerLeftBlack.includes(num)).map(getTeethCellContent).join(', ');
                    let lowerRight = teethNums.filter(num => lowerRightRed.includes(num) || lowerRightBlack.includes(num)).map(getTeethCellContent).join(', ');

                    // 사분면 형식으로 테이블 셀 생성
                    let teethNumCell = `
        <td style="font-size: 0.9rem; width: 100px">
            <div class="quadrant-container">
                <div class="quadrant upper-left">${upperLeft}</div>
                <div class="quadrant upper-right">${upperRight}</div>
                <div class="quadrant lower-left">${lowerLeft}</div>
                <div class="quadrant lower-right">${lowerRight}</div>
            </div>
        </td>
    `;

                    // 행 생성
                    let row = $(`
                        <tr>
                            <td>${mdTimeCell}</td>
                            ${teethNumCell}
                            <td>${chart.medicalDivision}</td>
                            <td>${chart.medicalContent}</td>
                            <td class="medical-content-cell">${chart.checkDoc}</td>
                        </tr>
                    `);

                    // 각 데이터 클릭 이벤트 추가
                    row.on('click', function () {
                        $('.medical-content-cell .delete-icon').remove();
                        let medicalContentCell = row.find('.medical-content-cell');
                        if (!medicalContentCell.find('.delete-icon').length) {
                            medicalContentCell.append('<span class="delete-icon">X</span>');
                        }
                        medicalContentCell.on('click', '.delete-icon', function (event) {
                            event.stopPropagation();
                            let cnum = chart.cnum;
                            $.ajax({
                                url: '/medical_chart/deleteChart',
                                type: 'DELETE',
                                data: {cnum: cnum},
                                success: function (response) {
                                    $.ajax({
                                        url: '/medical_chart/PLANChartData?chartNum=' + patientInfos.chartNum,
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
                                            console.error('Error:', error);
                                        }
                                    });
                                    readPaChart();
                                },
                                error: function (xhr, status, error) {
                                    console.error('Error:', error);
                                }
                            });
                        });
                    });

                    tableBody.append(row);
                    previousMdTime = chart.mdTime;
                });
            },
            error: function (xhr, status, error) {
                console.error('Error:', error);
            }
        });
    }
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
