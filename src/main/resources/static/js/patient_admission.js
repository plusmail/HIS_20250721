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
                    <option value="doctor1">의사1</option>
                    <option value="doctor2">의사2</option>
                    <option value="doctor3">의사3</option>
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
        }
    });

    // 진료대기, 진료중, 진료완료 테이블 모두에 컨텍스트 메뉴 기능 추가
    addContextMenuToTable("#waitingPatientsTable");
    addContextMenuToTable("#treatmentPatientsTable");
    addContextMenuToTable("#completedPatientsTable");

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
                    updateRowCount();
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
        }
    }

    // 행을 첫 번째로 이동하는 함수
    function moveRowToFirst(row) {
        const tableBody = row.parentNode;
        tableBody.insertBefore(row, tableBody.firstChild);
    }

    // 행을 마지막으로 이동하는 함수
    function moveRowToLast(row) {
        const tableBody = row.parentNode;
        tableBody.appendChild(row);
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
        addContextMenuToRow(newRow); // 새 행에 컨텍스트 메뉴 추가
    }


    // 진료 완료 테이블로 행을 이동하는 함수
    function moveToCompletedTable(row) {
        const completedTable = document.querySelector("#completedPatientsTable tbody");

        // 진료 완료 테이블로 이동 시 필요한 정보 설정
        const completionTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // 완료 시간
        const receptionTimeCell = row.cells[5].textContent; // 접수 시간 (진료 중 테이블에서 가져오기)

        const newRow = completedTable.insertRow();
        newRow.innerHTML = `
        <td>${completedTable.rows.length}</td>
        <td>${row.cells[1].textContent}</td> <!-- 차트 번호 -->
        <td>${row.cells[2].textContent}</td> <!-- 환자 이름 -->
        <td>${row.cells[3].querySelector('.doctor-dropdown').value}</td> <!-- 의사 이름 -->
        <td>${"대기"}</td> <!-- 대기 시간 비워둠 -->
        <td>${receptionTimeCell}</td> <!-- 접수 시간 -->
        <td>${completionTime}</td> <!-- 완료 시간 (현재 시간) -->
    `;

        row.remove(); // 진료 중 테이블에서 행 제거
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





