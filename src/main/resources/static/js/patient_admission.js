document.addEventListener("DOMContentLoaded", function () {
    const waitingPatientsTable = document.getElementById("waitingPatientsTable").getElementsByTagName("tbody")[0];
    let patientCount = 0; // 환자 수를 카운트할 변수

    // 오늘 날짜 기본값 설정
    const today = new Date();
    document.getElementById('currentDate').value = today.toISOString().substring(0, 10);

    // 날짜 변경 이벤트
    document.getElementById('currentDate').addEventListener("change", function () {
        const selectedDate = new Date(this.value);
        selectedDate.setHours(0, 0, 0, 0); // 선택한 날짜의 시간 부분을 00:00:00으로 설정

        // 세션에서 환자 데이터 가져오기
        const selectedPatient = JSON.parse(sessionStorage.getItem('selectedPatient'));

        // 환자 데이터가 있는 경우
        if (selectedPatient) {
            const patientData = {
                chartNum: selectedPatient.chartNum,
                paName: selectedPatient.name,
                mainDoc: selectedPatient.mainDoc || "N/A",  // 주치의 정보가 없다면 N/A로 설정
                rvTime: selectedPatient.rvTime,  // 예약시간
                receptionTime: new Date().toISOString(),  // 현재 시간
                viTime: null,
                completionTime: null,
                treatStatus: "1" // 대기 상태
            };

            // 선택한 날짜와 예약시간 비교
            const rvTime = new Date(patientData.rvTime);
            if (rvTime.toDateString() === selectedDate.toDateString()) {
                addPatientToWaitingTable(patientData);
            }
        }

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
                .then(response => response.text())
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
                });
        } else {
            console.log("세션에서 환자 정보가 없습니다.");
        }
    });

    function addPatientToWaitingTable(patient) {
        const row = waitingPatientsTable.insertRow();
        patientCount++; // 환자 수 증가
        row.innerHTML = `
            <td>${patientCount}</td>
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
        updateWaitingPatientCount();
    }

    function updateWaitingPatientCount() {
        const count = waitingPatientsTable.rows.length;
        const header = document.querySelector("#waitingPatientsTable th[colspan='6']");
        header.textContent = `진료 대기 환자: ${count}명`;
    }

    // DB에서 환자 목록을 가져오고 테이블에 표시하는 함수
    function fetchAndDisplayPatients(selectedDate) {
        // DB에서 모든 환자 데이터를 가져와서 필터링
        fetch("/api/patient-admission/waiting")
            .then(response => response.json())
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
            });
    }

    // 일정 간격으로 환자 목록 업데이트 (예: 5초마다)
    setInterval(() => {
        const selectedDate = new Date(document.getElementById('currentDate').value);
        fetchAndDisplayPatients(selectedDate);
    }, 5000);
});
