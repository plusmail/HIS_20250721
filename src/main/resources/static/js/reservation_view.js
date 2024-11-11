
renderCalendar();
function dateReservationList(selectedDate) {
    fetch('reservation/selectedDatePatientList', {

        method: 'POST', // POST 요청
        headers: {
            'Content-Type': 'application/json' // JSON 형식으로 데이터 전송
        },
        body: JSON.stringify({
            reservationDate: selectedDate
        }) // JSON 객체로 전송
    })
        .then(response => {
            // 응답 상태가 성공적인 경우 JSON으로 변환
            if (!response.ok) {
                throw new Error('네트워크 응답이 실패했습니다.');
            }
            return response.json(); // JSON 데이터로 변환
        })
        .then(data => {
            // 환자 데이터가 들어갈 ID값 보관
            const tableBody = document.querySelector('#reservationTableList');

            // 테이블의 기존 데이터를 지우고 새 데이터를 추가
            // 해당 작업은 다른 날짜를 클릭했을때 기존 내용을 지워야 하기 때문임
            tableBody.innerHTML = ''; // 기존 내용 제거

            const timetable = document.getElementById('timetable');
            // 선택된 날짜를 화면에 표시
            if(timetable){
                document.getElementById('selectedDate').innerText = `선택된 날짜: ${selectedDate}`;
                generateTimetable(data);
            }
            // 데이터 배열을 순회하여 테이블에 추가
            data.forEach(item => {

                // 시간만 추출 (예: "2024-10-21T00:13" -> "00:13")
                const time = new Date(item.reservationDate).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                });


                const row = document.createElement('tr'); // 새로운 행 생성
                row.id = 'reservationTableListParent'; // ID 추가
                row.innerHTML = `
                                <td>${time}</td>
                                <td>${item.department}</td>
                                <td>${item.patientNote}</td>
                                `; // 각 열에 데이터 삽입
                row.onclick = function () {

                    if(PageName === 'registerAdd'){
                        selectList(item.seq);
                    }
                };
                tableBody.appendChild(row); // tbody에 행 추가
            });

        })
        .catch(error => {
            // 에러 처리
            console.error('에러 발생:', error);
        });
}

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

    // 예약 데이터 처리
    const reservations = data.map(item => {
        const time = item.reservationDate.split('T')[1].substring(0, 5); // 'HH:MM' 형식으로 추출
        return {
            time: time,
            doctor: item.doctor,
            info: `${item.department} <br> ${item.patientNote} (${item.treatmentType})` // 여러 정보 결합
        };
    });


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

async function generateTimetable(data) {
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

    // 예약 데이터 처리
    const reservations = data.map(item => {
        const time = item.reservationDate.split('T')[1].substring(0, 5); // 'HH:MM' 형식으로 추출

        // 예약 타입에 맞는 클래스 이름을 설정
        let treatmentClass = '';
        if (item.treatmentType === '리콜') {
            treatmentClass = 'recall';  // 리콜 예약
        } else if (item.treatmentType === '수술') {
            treatmentClass = 'surgery'; // 수술 예약
        } else {
            treatmentClass = 'general'; // 일반 예약
        }

        return {
            time: time,
            doctor: item.doctor,
            info: `
            <div class="reservation ${treatmentClass}" style="display: flex; padding-right: 10px;">
    <div style="flex: 3; padding-right: 20px; border-right: 2px solid gray; display: flex; justify-content: center; align-items: center;">
        ${item.department}
    </div>
    <div style="flex: 7; padding-left: 20px;">
        ${item.patientNote} <br> ${item.treatmentType}
    </div>
</div>

        `, // HTML로 나누어 표시
            treatmentType: item.treatmentType // treatmentType 추가
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
            // console.log(`슬롯: ${slot}, 의사: ${doctor}, 예약:`, matchedReservations); // 예약 정보 확인

            // 모든 예약 정보를 줄바꿈으로 결합하고, 각 예약에 대해 treatmentType에 맞는 클래스를 추가
            td.innerHTML = matchedReservations.length > 0
                ? matchedReservations.map(r => {
                    const reservationDiv = document.createElement("div");
                    reservationDiv.classList.add("reservation"); // 기본 스타일 클래스 추가

                    // treatmentType에 따라 스타일 클래스 추가
                    if (r.treatmentType === "리콜") {
                        reservationDiv.classList.add("recall"); // 리콜 예약 스타일
                    } else if (r.treatmentType === "수술") {
                        reservationDiv.classList.add("surgery"); // 수술 예약 스타일
                    } else if (r.treatmentType === "일반") {
                        reservationDiv.classList.add("general"); // 일반 예약 스타일
                    }

                    reservationDiv.innerHTML = r.info; // 예약 정보 추가
                    return reservationDiv.outerHTML; // 예약 항목을 HTML로 반환
                }).join('<br>') // 여러 예약 항목을 <br>로 구분하여 출력
                : ""; // 예약 정보가 없으면 빈 값으로 둡니다.

            tr.appendChild(td); // 의사별 예약 셀 추가
        });

        tableBody.appendChild(tr); // 행을 테이블 바디에 추가
    });
}

Timetable();