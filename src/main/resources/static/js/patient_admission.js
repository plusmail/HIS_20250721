// 날짜
document.getElementById('currentDate').value = new Date().toISOString().substring(0,10);

// 접수 버튼 클릭 시 세션에서 데이터 가져와 테이블에 추가하는 코드
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".ReceptionBtn").addEventListener("click", () => {
        const retrievedPatient = JSON.parse(sessionStorage.getItem('selectedPatient'));
        if (retrievedPatient) {
            const table = document.querySelector("#waitingPatientsTable tbody");
            const newRow = table.insertRow();

            const receptionTime = new Date().toLocaleString(); // 전체 년월일시간
            const onlyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // 시간만 추출

            const waitingTime = "대기시간"; // 대기 시간

            const doctorDropdown = `
                <select class="doctor-dropdown">
                    <option value="doctor1">doctor1</option>
                    <option value="doctor2">doctor2</option>
                    <option value="doctor3">doctor3</option>
                </select>
            `;

            newRow.innerHTML = `
                <td>${table.rows.length}</td> <!-- 행 번호 -->
                <td>${retrievedPatient.chartNum}</td>
                <td>${retrievedPatient.name}</td>
                <td>${doctorDropdown}</td> <!-- 의사 선택 드롭다운 -->
                <td>${retrievedPatient.appointmentTime || ''}</td> <!-- 예약시간 비워둠 -->
                <td>${onlyTime}</td> <!-- 시간만 표시 (접수 시간) -->
                <td>${waitingTime}</td>
            `;

            // 새 행에 컨텍스트 메뉴 이벤트 리스너 추가
            addContextMenuToRow(newRow, receptionTime);
            updateRowCount(table); // 행 번호 업데이트 호출
        }
    });

    // 진료대기, 진료중, 진료완료 테이블 모두에 컨텍스트 메뉴 기능 추가
    addContextMenuToTable("#waitingPatientsTable");
    addContextMenuToTable("#treatmentPatientsTable");
    addContextMenuToTable("#completedPatientsTable");

    // 행 번호를 업데이트하는 함수
    function updateRowCount(table) {
        const rows = table.querySelectorAll("tbody tr");
        rows.forEach((row, index) => {
            row.cells[0].textContent = index + 1; // 첫 번째 셀에 행 번호 업데이트
        });
    }

    // 컨텍스트 메뉴 생성 및 설정 함수
    function createContextMenu(event, row, receptionTime) {
        removeContextMenu(); // 기존 메뉴 제거

        const menu = document.createElement("div");
        menu.classList.add("custom-context-menu");
        menu.style.display = "block";

        let x = event.clientX;
        let y = event.clientY;

        menu.style.top = `${y}px`;
        menu.style.left = `${x}px`;

        // 메뉴 옵션 설정
        const options = [
            { text: "첫 번째로 이동", action: () => moveRowToFirst(row) },
            { text: "위로 이동", action: () => moveRow(row, -1) },
            { text: "아래로 이동", action: () => moveRow(row, 1) },
            { text: "마지막으로 이동", action: () => moveRowToLast(row) },
            { text: "접수 취소", action: () => {
                    row.remove();
                    updateRowCount(table); // 행 삭제 후 행 번호 업데이트
                }},
            { text: "진료 중 테이블로 이동", action: () => moveToInTreatmentTable(row) },
            { text: "진료 완료 테이블로 이동", action: () => moveToCompletedTable(row) }
        ];

        options.forEach(option => {
            const div = document.createElement("div");
            div.textContent = option.text;
            div.addEventListener("click", () => {
                option.action();
                removeContextMenu();
            });
            menu.appendChild(div);
        });

        document.body.appendChild(menu);
    }

    // 행에 컨텍스트 메뉴 추가하는 함수
    function addContextMenuToRow(row, receptionTime) {
        row.addEventListener('contextmenu', function (e) {
            e.preventDefault(); // 기본 컨텍스트 메뉴 방지
            createContextMenu(e, this, receptionTime);
        });
    }

    // 테이블의 모든 행에 컨텍스트 메뉴 이벤트 리스너 추가
    function addContextMenuToTable(tableSelector) {
        const tableRows = document.querySelectorAll(`${tableSelector} tbody tr`);
        tableRows.forEach(row => {
            addContextMenuToRow(row); // 각 행에 컨텍스트 메뉴 추가
        });
    }

    // 행을 위아래로 이동하는 함수
    function moveRow(row, direction) {
        const tableBody = row.parentNode;
        const index = Array.prototype.indexOf.call(tableBody.children, row);
        const newIndex = index + direction;

        if (newIndex >= 0 && newIndex < tableBody.children.length) {
            const referenceRow = tableBody.children[newIndex];
            tableBody.insertBefore(row, referenceRow);
            updateRowCount(tableBody); // 이동 후 행 번호 업데이트
        }
    }

    // 행을 첫 번째로 이동하는 함수
    function moveRowToFirst(row) {
        const tableBody = row.parentNode;
        tableBody.insertBefore(row, tableBody.firstChild);
        updateRowCount(tableBody); // 첫 번째로 이동 후 행 번호 업데이트
    }

    // 행을 마지막으로 이동하는 함수
    function moveRowToLast(row) {
        const tableBody = row.parentNode;
        tableBody.appendChild(row);
        updateRowCount(tableBody); // 마지막으로 이동 후 행 번호 업데이트
    }

    // 진료 중 테이블로 행을 이동하는 함수
    function moveToInTreatmentTable(row) {
        const inTreatmentTable = document.querySelector("#treatmentPatientsTable tbody");

        // 진료 중 테이블로 이동 시 필요한 정보 설정
        const treatmentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // 진료 시작 시간
        const receptionTimeCell = row.cells[5].textContent; // 대기 테이블에서 접수 시간 가져오기

        const newRow = inTreatmentTable.insertRow();
        newRow.innerHTML = `
            <td>${inTreatmentTable.rows.length}</td> <!-- 행 번호 -->
            <td>${row.cells[1].textContent}</td> <!-- 차트 번호 -->
            <td>${row.cells[2].textContent}</td> <!-- 환자 이름 -->
            <td>${row.cells[3].querySelector('.doctor-dropdown').value}</td> <!-- 선택된 의사 이름 -->
            <td>${''}</td> <!-- 예약시간 비워둠 -->
            <td>${treatmentTime}</td> <!-- 진료 시작 시간 -->
            <td>${receptionTimeCell}</td> <!-- 접수 시간 -->
        `;

        row.remove(); // 대기 테이블에서 행 제거
        updateRowCount(inTreatmentTable); // 진료 중 테이블 행 번호 업데이트
        addContextMenuToRow(newRow); // 새 행에 컨텍스트 메뉴 추가
    }

    // 진료 완료 테이블로 행을 이동하는 함수
    function moveToCompletedTable(row) {
        const completedTable = document.querySelector("#completedPatientsTable tbody");

        // 진료 완료 테이블로 이동 시 필요한 정보 설정
        const completionTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // 완료 시간
        const receptionTimeCell = row.cells[5].textContent; // 접수 시간 (진료 중 테이블에서 가져오기)

        // 진료 중 테이블에서 의사 이름 가져오기
        const doctorNameCell = row.cells[3].textContent; // 진료 중 테이블에서 의사 이름 가져오기

        // 새 행 생성
        const newRow = completedTable.insertRow();
        newRow.innerHTML = `
            <td>${completedTable.rows.length}</td> <!-- 행 번호 -->
            <td>${row.cells[1].textContent}</td> <!-- 차트 번호 -->
            <td>${row.cells[2].textContent}</td> <!-- 환자 이름 -->
            <td>${doctorNameCell}</td> <!-- 의사 이름 -->
            <td>${"대기"}</td> <!-- 대기 시간 비워둠 -->
            <td>${receptionTimeCell}</td> <!-- 접수 시간 -->
            <td>${completionTime}</td> <!-- 완료 시간 (현재 시간) -->
        `;

        row.remove(); // 진료 중 테이블에서 행 제거
        updateRowCount(completedTable); // 완료 테이블 행 번호 업데이트
        addContextMenuToRow(newRow); // 새 행에 컨텍스트 메뉴 추가
    }

    // 컨텍스트 메뉴 제거 함수
    function removeContextMenu() {
        const existingMenu = document.querySelector(".custom-context-menu");
        if (existingMenu) {
            existingMenu.remove();
        }
    }

    // 페이지 클릭 시 컨텍스트 메뉴 제거
    document.addEventListener("click", removeContextMenu);
});

document.addEventListener("DOMContentLoaded", () => {
    const today = new Date().toISOString().substring(0, 10);
    document.getElementById('currentDate').value = today;

    // 페이지 로드 시 데이터 로드
    loadCompletedDataForSelectedDate();

    // 날짜 선택 시 해당 날짜의 데이터 로드
    document.getElementById('currentDate').addEventListener('change', loadCompletedDataForSelectedDate);

    // 진료 완료 데이터를 저장하는 함수
    function saveCompletedData() {
        const completedData = [];
        const tableRows = document.querySelectorAll("#completedPatientsTable tbody tr");

        tableRows.forEach(row => {
            const entry = {
                chartNum: row.cells[0].textContent, // 차트 번호
                name: row.cells[1].textContent, // 환자 이름
                doctor: row.cells[2].textContent, // 의사 이름
                receptionTime: row.cells[5].textContent, // 접수 시간
                completionTime: row.cells[6].textContent // 완료 시간
            };
            completedData.push(entry);
        });

        // localStorage에 저장
        const selectedDate = document.getElementById('currentDate').value;
        const allData = JSON.parse(localStorage.getItem('completedData')) || {};
        allData[selectedDate] = completedData; // 날짜별로 저장
        localStorage.setItem('completedData', JSON.stringify(allData));
    }

    // 날짜에 해당하는 진료 완료 데이터를 테이블에 표시
    function loadCompletedDataForSelectedDate() {
        const selectedDate = document.getElementById('currentDate').value; // 선택된 날짜
        const completedData = JSON.parse(localStorage.getItem('completedData')) || {};
        displayDataForDate(selectedDate, completedData);
    }

    // 테이블에 데이터 표시
    function displayDataForDate(date, data) {
        const tableBody = document.querySelector("#completedPatientsTable tbody");
        tableBody.innerHTML = ""; // 기존 데이터 초기화

        if (data[date]) {
            data[date].forEach(entry => {
                const newRow = tableBody.insertRow();
                newRow.innerHTML = `
                    <td>${entry.chartNum}</td>
                    <td>${entry.name}</td>
                    <td>${entry.doctor}</td>
                    <td>${entry.receptionTime}</td>
                    <td>${entry.completionTime}</td>
                `;
            });
        }
    }

    // 저장 버튼 클릭 이벤트
    document.getElementById('saveButton').addEventListener('click', () => {
        saveCompletedData(); // 테이블 데이터를 저장
        alert("진료 완료 데이터가 저장되었습니다.");
    });
});






