// 예약 테이블 나오는 부분
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
async function generateTimetable(data) {
    console.log("입력된 데이터:", data); // 데이터 확인
    const doctors = await fetchDoctors(); // 의사 목록 가져오기
    console.log("의사 목록:", doctors); // 의사 목록 확인

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

    // 예약 데이터 처리
    const reservations = data.map(item => {
        const time = item.reservationDate.split('T')[1].substring(0, 5); // 'HH:MM' 형식으로 추출
        return {
            time: time,
            doctor: item.doctor,
            info: `${item.department} <br> ${item.patientNote} (${item.treatmentType})` // 여러 정보 결합
        };
    });

    console.log("예약 정보:", reservations); // 예약 정보 확인

    // 시간 슬롯 생성
    reservationTimes.forEach(slot => {
        const tr = document.createElement("tr");

        // 시간 셀 생성
        const timeCell = document.createElement("td");
        timeCell.innerText = slot;
        tr.appendChild(timeCell);

        // 각 의사에 대한 예약 정보 생성
        doctors.forEach(doctor => {
            const td = document.createElement("td");

            // 현재 시간과 의사에 맞는 예약 찾기
            const matchedReservations = reservations.filter(r => r.time === slot && r.doctor === doctor);
            console.log(`슬롯: ${slot}, 의사: ${doctor}, 예약:`, matchedReservations); // 예약 정보 확인

            // 모든 예약 정보를 줄바꿈으로 결합
            td.innerHTML = matchedReservations.length > 0
                ? matchedReservations.map(r => r.info).join('<br>')
                : ""; // 예약 정보 또는 비워둠

            tr.appendChild(td);
        });

        tableBody.appendChild(tr); // 행을 테이블 바디에 추가
    });
}


// 페이지가 로드될 때 타임테이블 생성
async function Timetable() {
    const doctors = await fetchDoctors(); // Fetch the list of doctors
    const tableHead = document.querySelector("#timetable thead tr");
    const tableBody = document.querySelector("#timetable tbody");

    // Clear existing table content
    tableHead.innerHTML = '<th>&nbsp;</th>'; // Initialize header
    tableBody.innerHTML = ""; // Initialize body

    // Create doctor header cells
    doctors.forEach(doctor => {
        const th = document.createElement("th");
        th.innerText = doctor; // Insert doctor's name
        tableHead.appendChild(th);
    });

    // Create time slots
    reservationTimes.forEach(slot => {
        const tr = document.createElement("tr");

        // Create time cell
        const timeCell = document.createElement("td");
        timeCell.innerText = slot;
        tr.appendChild(timeCell);

        // Create reservation cells for each doctor
        doctors.forEach(() => {
            const td = document.createElement("td");
            td.innerText = ""; // 현재 예약 정보는 비워둡니다
            tr.appendChild(td);
        });
        tableBody.appendChild(tr); // Append the row to the table body
    });
}

Timetable();