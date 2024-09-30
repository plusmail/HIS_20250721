document.addEventListener("DOMContentLoaded", function () {
    const waitingPatientsTable = document.getElementById("waitingPatientsTable").getElementsByTagName("tbody")[0];
    const treatmentPatientsTable = document.getElementById("treatmentPatientsTable").getElementsByTagName("tbody")[0]; // 진료 중 환자 테이블
    let waitingPatientCount = 0; // 대기 환자 수
    let treatmentPatientCount = 0; // 진료 중 환자 수

    // 오늘 날짜 기본값 설정
    const today = new Date();
    document.getElementById('currentDate').value = today.toISOString().substring(0, 10);

    // 날짜 변경 이벤트
    document.getElementById('currentDate').addEventListener("change", function () {
        const selectedDate = new Date(this.value);
        selectedDate.setHours(0, 0, 0, 0); // 선택한 날짜의 시간 부분을 00:00:00으로 설정

        // DB에서 모든 환자 데이터를 가져와서 필터링
        fetchAndDisplayPatients(selectedDate);
    });

    // 접수 버튼 클릭 이벤트 추가
    const receptionBtn = document.querySelector(".ReceptionBtn");
    receptionBtn.addEventListener("click", function () {
        console.log("접수 버튼이 클릭되었습니다.");

        // 세션에서 환자 데이터 가져오기
        const selectedPatient = JSON.parse(sessionStorage.getItem('selectedPatient'));

        if (selectedPatient) {
            console.log("가져온 환자 정보:", selectedPatient);

            // 환자 데이터 객체 생성
            const patientData = {
                chartNum: selectedPatient.chartNum,
                paName: selectedPatient.name,
                mainDoc: selectedPatient.mainDoc || "N/A",
                rvTime: selectedPatient.rvTime, // 예약시간
            };

            // API 호출하여 환자 접수
            fetch("/api/patient-admission/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(patientData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('환자 접수 실패'); // 에러 처리
                    }
                    return response.text();
                })
                .then(data => {
                    console.log(data); // 성공 메시지 출력
                    // 테이블에 추가
                    addPatientToWaitingTable({
                        ...patientData,
                        receptionTime: new Date().toISOString(),  // 현재 시간
                        treatStatus: "1" // 대기 상태
                    });
                })
                .catch(error => {
                    console.error("에러 발생:", error);
                    alert("환자 접수 중 오류가 발생했습니다. 다시 시도해 주세요."); // 사용자에게 에러 메시지 표시
                });
        } else {
            console.log("세션에서 환자 정보가 없습니다.");
            alert("선택된 환자가 없습니다."); // 사용자에게 알림
        }
    });

    // 진료중 버튼 클릭 이벤트 추가
    const startTreatmentButton = document.getElementById("startTreatmentButton");
    startTreatmentButton.addEventListener("click", function () {
        const selectedRow = waitingPatientsTable.querySelector('tr.selected'); // 선택된 환자 행

        if (selectedRow) {
            const chartNum = selectedRow.cells[1].textContent; // 환자 차트 번호
            const paName = selectedRow.cells[2].textContent; // 환자 이름
            const patientData = {
                chartNum: chartNum,
                paName: paName,
                treatStatus: "2" // 진료중 상태
            };

            // API 호출하여 환자 상태 변경
            fetch("/api/patient-admission/treatment/start", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(patientData)
            })
                .then(response => {
                    if (!response.ok) {
                        // 서버 오류 코드 처리
                        return response.json().then(err => {
                            throw new Error(err.message || '진료 시작 실패'); // 에러 처리
                        });
                    }



                    // 진료 중 환자 테이블에 추가
                    addPatientToTreatmentTable({
                        chartNum: chartNum,
                        paName: paName

                    });

                    // 대기 중 환자 테이블에서 해당 환자 삭제
                    waitingPatientsTable.deleteRow(selectedRow.rowIndex);
                    waitingPatientCount--; // 대기 환자 수 감소

                    alert("환자 진료가 시작되었습니다."); // 사용자에게 성공 메시지 표시
                })
                .catch(error => {
                    console.error("에러 발생:", error);
                    alert("진료 시작 중 오류가 발생했습니다: " + error.message); // 사용자에게 에러 메시지 표시
                });
        } else {
            console.log("환자가 선택되지 않았습니다.");
            alert("환자를 선택해 주세요."); // 사용자에게 알림
        }
    });

    function addPatientToWaitingTable(patient) {
        const row = waitingPatientsTable.insertRow();
        waitingPatientCount++; // 대기 환자 수 증가
        row.innerHTML = `
            <td>${waitingPatientCount}</td>
            <td>${patient.chartNum || 'N/A'}</td>
            <td>${patient.paName || 'N/A'}</td>
            <td>
                <select>
                    <option value="의사1">의사1</option>
                    <option value="의사2">의사2</option>
                    <option value="의사3">의사3</option>
                </select>
            </td>
            <td>${patient.rvTime ? new Date(patient.rvTime).toLocaleString() : 'N/A'}</td>
            <td>${patient.receptionTime ? new Date(patient.receptionTime).toLocaleTimeString() : 'N/A'}</td>
        `;
        row.addEventListener('click', () => {
            // 선택된 행에 클래스 추가 (CSS 스타일링을 위해)
            const previouslySelected = waitingPatientsTable.querySelector('tr.selected');
            if (previouslySelected) {
                previouslySelected.classList.remove('selected');
            }
            row.classList.add('selected');
        });
        updateWaitingPatientCount();
    }

    function addPatientToTreatmentTable(patient) {
        const row = treatmentPatientsTable.insertRow();
        treatmentPatientCount++; // 진료 중 환자 수 증가

        // 현재 시간 가져오기
        const currentTime = new Date().toISOString(); // 현재 시간을 ISO 포맷으로 변환

        // 대기 환자 테이블에서 선택한 의사 가져오기
        const doctorSelect = document.querySelector(`select[data-chart-num="${patient.chartNum}"]`);
        const selectedDoctor = doctorSelect ? doctorSelect.value : 'N/A';

        row.innerHTML = `
        <td>${treatmentPatientCount}</td>
        <td>${patient.chartNum || 'N/A'}</td>
        <td>${patient.paName || 'N/A'}</td>
        <td>${selectedDoctor || 'N/A'}</td> <!-- 선택한 의사 -->
        <td>${null || 'N/A'}</td> <!-- 예약시간: null -->
        <td>${currentTime ? new Date(currentTime).toLocaleString() : 'N/A'}</td> <!-- 진료 시작 시간: 현재 시간 -->
        <td>${patient.receptionTime ? new Date(patient.receptionTime).toLocaleString() : 'N/A'}</td> <!-- 접수 시간: 대기 테이블의 접수시간 -->
    `;
    }

    function updateWaitingPatientCount() {
        const count = waitingPatientsTable.rows.length;
        const header = document.querySelector("#waitingPatientsTable th[colspan='6']");
        header.textContent = `진료 대기 환자: ${count}명`;
    }

    // DB에서 환자 목록을 가져오고 테이블에 표시하는 함수
    function fetchAndDisplayPatients(selectedDate) {
        fetch("/api/patient-admission/waiting")
            .then(response => {
                if (!response.ok) {
                    throw new Error('환자 목록을 가져오는 데 실패했습니다.'); // 에러 처리
                }
                return response.json();
            })
            .then(data => {
                const currentPatients = Array.from(waitingPatientsTable.rows).map(row => ({
                    chartNum: row.cells[1].textContent,
                    rvTime: row.cells[4].textContent
                }));

                const filteredPatients = data.filter(patient => {
                    const rvTime = new Date(patient.rvTime);
                    return rvTime.toDateString() === selectedDate.toDateString();
                });

                // 필터링된 데이터를 테이블에 추가
                filteredPatients.forEach(patient => {
                    // 현재 테이블에 없는 환자만 추가
                    if (!currentPatients.some(current => current.chartNum === patient.chartNum && new Date(current.rvTime).toDateString() === new Date(patient.rvTime).toDateString())) {
                        addPatientToWaitingTable(patient);
                    }
                });
            })
            .catch(error => {
                console.error("에러 발생:", error);
                alert("환자 목록을 가져오는 중 오류가 발생했습니다. 다시 시도해 주세요."); // 사용자에게 에러 메시지 표시
            });
    }

    // 일정 간격으로 환자 목록 업데이트
    setInterval(() => {
        const selectedDate = new Date(document.getElementById('currentDate').value);
        fetchAndDisplayPatients(selectedDate);
    }, 10000); // 10초마다 업데이트
});



document.addEventListener("DOMContentLoaded", function () {
    const waitingPatientsTable = document.getElementById("waitingPatientsTable").getElementsByTagName("tbody")[0];
    let selectedRow = null; // 선택된 행을 저장할 변수

    // 모달 요소들
    const cancelModal = new bootstrap.Modal(document.getElementById('cancelModal'));
    const patientNameElement = document.getElementById("patientName");
    const confirmCancelBtn = document.getElementById("confirmCancelBtn");
    const closeModalBtn = document.querySelector('#cancelModal .btn-secondary'); // '아니오' 버튼

    // 접수 취소 버튼
    const cancelReceptionButton = document.getElementById("cancelReceptionButton");

    // 대기 환자 수 업데이트 함수
    function updateWaitingPatientCount() {
        const count = waitingPatientsTable.rows.length;
        const header = document.querySelector("#waitingPatientsTable th[colspan='6']");
        header.textContent = `진료 대기 환자: ${count}명`;
    }

    // 대기 환자 테이블의 행 클릭 시 해당 행 선택
    waitingPatientsTable.addEventListener("click", function (event) {
        const targetRow = event.target.closest("tr"); // 클릭한 셀의 행을 가져옴
        if (!targetRow || targetRow.rowIndex === 0) return; // 첫 번째 헤더는 무시

        // 선택된 행 저장
        selectedRow = targetRow;

        // 선택한 환자의 이름을 콘솔로 출력 (디버깅 용도)
        console.log("Selected patient:", selectedRow.cells[2].textContent);
    });

    // 접수 취소 버튼 클릭 시 모달 표시
    cancelReceptionButton.addEventListener("click", function () {
        if (selectedRow) {
            // 선택한 환자의 이름을 모달에 표시
            const patientName = selectedRow.cells[2].textContent;
            patientNameElement.textContent = `환자 이름: ${patientName}`;

            // 모달 표시
            cancelModal.show();
        } else {
            alert("취소할 환자를 먼저 선택하세요."); // 선택된 행이 없을 경우 경고 메시지
        }
    });

    // 모달에서 '예' 버튼 클릭 시 행 삭제
    confirmCancelBtn.addEventListener("click", function () {
        if (selectedRow) {
            selectedRow.remove(); // 선택된 행 삭제
            updateWaitingPatientCount(); // 환자 수 업데이트
        }

        // 모달 닫기
        cancelModal.hide();
    });

    // '아니요' 버튼 클릭 시 모달 닫기
    closeModalBtn.addEventListener("click", function () {
        cancelModal.hide();
    });
});


