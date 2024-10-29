// 모든 의사 목록을 가져오는 함수
async function fetchDoctors() {
    try {
        const response = await fetch('reservation/doctorTimetable');
        return await response.json(); // 의사 목록 반환
    } catch (error) {
        console.error("의사 목록을 가져오는 데 오류가 발생했습니다:", error);
        return [];
    }
}

// 타임테이블 생성 함수
async function generateTimetable() {
    const doctors = await fetchDoctors(); // 의사 목록 가져오기
    const tableHead = document.querySelector("#timetable thead tr");
    const tableBody = document.querySelector("#timetable tbody");

    // 의사 헤더 셀 초기화
    tableHead.innerHTML = '<th>&nbsp;</th>'; // 기존 헤더 초기화
    tableBody.innerHTML = ""; // 기존 바디 초기화

    // 의사 헤더 셀 생성
    doctors.forEach(doctor => {
        const th = document.createElement("th");
        th.innerText = doctor; // 의사 이름 삽입
        tableHead.appendChild(th);
    });

    // 시간 슬롯 생성
    reservationTimes.forEach(slot => {
        const tr = document.createElement("tr");

        // 시간 셀 생성
        const timeCell = document.createElement("td");
        timeCell.innerText = slot;
        tr.appendChild(timeCell);

        // 각 의사에 대한 예약 정보 생성
        doctors.forEach(() => {
            const td = document.createElement("td");
            td.innerText = ""; // 현재 예약 정보는 비워둡니다
            tr.appendChild(td);
        });

        tableBody.appendChild(tr);
    });
}

// 페이지가 로드될 때 타임테이블 생성
generateTimetable();
