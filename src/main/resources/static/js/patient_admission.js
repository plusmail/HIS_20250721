// // 검색 버튼 클릭 시 환자 정보를 세션에 저장하는 코드
// document.querySelector(".SearchBtn").addEventListener("click", key => {
//     const name = "환자 이름";  // 실제 검색된 환자 정보로 변경
//     const chartNum = "차트 번호";
//
//     // 세션에 저장
//     sessionStorage.getItem('retrievedPatient', JSON.stringify({
//         name: name,
//         chartNum: chartNum
//     }));
//     console.log('환자 정보가 세션에 저장되었습니다.');
// });

// 접수 버튼 클릭 시 세션에서 데이터 가져와 테이블에 추가하는 코드
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM이 로드되었습니다.");

    // 접수 버튼 클릭 시 환자 추가
    document.querySelector(".ReceptionBtn").addEventListener("click", () => {
        console.log("접수 버튼이 클릭되었습니다.");
        const retrievedPatient = JSON.parse(sessionStorage.getItem('selectedPatient'));

        if (retrievedPatient) {
            console.log('가져온 환자 정보:', retrievedPatient.name, retrievedPatient.chartNum);

            const table = document.querySelector("#waitingPatientsTable tbody");

            let rowCount = table.rows.length + 1;

            const newRow = table.insertRow();

            // 추가할 데이터 로그
            console.log('추가할 데이터:', retrievedPatient.chartNum, retrievedPatient.name);

            const waitTime = "대기 시간";

            newRow.innerHTML = `
                <td>${rowCount}</td>
                <td>${retrievedPatient.chartNum}</td>
                <td>${retrievedPatient.name}</td>
                <td>${retrievedPatient.doctorName || '의사 이름'}</td>
                <td>${retrievedPatient.appointmentTime || '예약 시간'}</td>
                <td>${new Date().toLocaleTimeString()}</td>
                <td>${waitTime}</td>
            `;

            // 행 클릭 시 선택 시각적 효과 추가
            newRow.addEventListener('click', function () {
                // 선택된 행의 배경색 변경
                table.querySelectorAll('tr').forEach(row => row.classList.remove('selected'));
                this.classList.add('selected');
            });

            // 우클릭 시 컨텍스트 메뉴 표시
            newRow.addEventListener('contextmenu', function (e) {
                e.preventDefault(); // 기본 우클릭 메뉴 방지

                // 컨텍스트 메뉴 생성
                createContextMenu(e, this);
            });

            // 대기 환자 수 업데이트
            const countCell = document.querySelector("#waitingPatientsTable thead tr:first-child th[colspan='7']");
            const currentCount = parseInt(countCell.textContent.match(/\d+/)[0]) || 0;
            countCell.textContent = `진료 대기 환자: ${currentCount + 1}명`;

            console.log('환자 정보가 테이블에 추가되었습니다.');
        } else {
            console.log('세션에 저장된 환자 정보가 없습니다.');
        }
    });

    // 컨텍스트 메뉴 생성 함수
    function createContextMenu(event, row) {
        // 기존 컨텍스트 메뉴 제거
        removeContextMenu();

        // 컨텍스트 메뉴 요소 생성
        const menu = document.createElement("div");
        menu.classList.add("custom-context-menu");
        menu.style.top = `${event.clientY}px`;
        menu.style.left = `${event.clientX}px`;

        // 메뉴 항목 - 접수 취소
        const cancelReception = document.createElement("div");
        cancelReception.textContent = "접수 취소";
        cancelReception.addEventListener("click", function () {
            row.remove(); // 해당 행 삭제
            updatePatientCount(-1);
            removeContextMenu(); // 메뉴 삭제
        });

        // 메뉴 항목 - 진료중 테이블로 이동
        const moveToTreatment = document.createElement("div");
        moveToTreatment.textContent = "진료중 테이블로 이동";
        moveToTreatment.addEventListener("click", function () {
            moveToTreatmentTable(row); // 진료중 테이블로 이동 함수 호출
            removeContextMenu(); // 메뉴 삭제
        });

        // 메뉴에 항목 추가
        menu.appendChild(cancelReception);
        menu.appendChild(moveToTreatment);

        // 문서에 메뉴 추가
        document.body.appendChild(menu);
    }

    // 기존 컨텍스트 메뉴 제거 함수
    function removeContextMenu() {
        const existingMenu = document.querySelector(".custom-context-menu");
        if (existingMenu) {
            existingMenu.remove();
        }
    }

    // 진료중 테이블로 이동 함수 (임의로 기능 구현 가능)
    function moveToTreatmentTable(row) {
        console.log("진료중 테이블로 이동:", row);
        // 진료중 테이블로 이동하는 로직 구현
        row.remove(); // 현재 대기 테이블에서 삭제
        updatePatientCount(-1);
        // 여기서 진료중 테이블에 해당 데이터를 추가하는 코드를 작성할 수 있습니다.
    }

    // 대기 환자 수 업데이트 함수
    function updatePatientCount(change) {
        const countCell = document.querySelector("#waitingPatientsTable thead tr:first-child th[colspan='7']");
        const currentCount = parseInt(countCell.textContent.match(/\d+/)[0]) || 0;
        countCell.textContent = `진료 대기 환자: ${currentCount + change}명`;
    }

    // 문서 전체에서 우클릭 시 컨텍스트 메뉴 제거
    document.addEventListener("click", function () {
        removeContextMenu();
    });
});

