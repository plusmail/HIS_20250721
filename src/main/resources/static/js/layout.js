// const navLinks = document.querySelectorAll('.nav-link');

// // 페이지 로드 시 localStorage에서 active 상태를 복원
// const activeLinkId = localStorage.getItem('activeLinkId');
// if (activeLinkId) {
//     document.getElementById(activeLinkId).classList.add('active');
// }

// 각 nav-link에 클릭 이벤트를 추가
// navLinks.forEach(link => {
//     link.addEventListener('click', function() {
//         // 모든 nav-link에서 active 클래스를 제거합니다.
//         navLinks.forEach(link => link.classList.remove('active'));
//
//         // 클릭된 요소에 active 클래스를 추가합니다.
//         this.classList.add('active');
//
//         // 클릭된 링크의 ID를 localStorage에 저장합니다.
//         localStorage.setItem('activeLinkId', this.id);
//     });
// });

const searchModal = new bootstrap.Modal(document.querySelector(".SearchModal"))
const searchBtn = document.querySelector(".SearchBtn")
const closeBtn = document.querySelector(".closeBtn")
const patient_name_keyword=document.querySelector("#patient_name_keyword")



let selectedRow = null; // 클릭된 행을 저장할 변수

document.querySelector("#addReplyBtn").addEventListener("click", (e) => {
    const keyword = {
        "keyword": patient_name_keyword.value
    };
    console.log(keyword);

    patientSearch(keyword).then(result => {
        let found = false;
        const tableBody = document.querySelector("#patientTableBody");
        tableBody.innerHTML = "";  // 기존 행을 지웁니다

        result.forEach((patient, index) => {
            if (patient.name === keyword.keyword) {
                found = true;

                // 새 행 생성
                const row = document.createElement("tr");

                // 생일 값이 null 또는 빈 문자열인 경우 처리
                const birthDate = patient.birthDate ? patient.birthDate : '-';

                // 셀 생성 및 추가
                row.innerHTML = `
                    <th scope="row">${index + 1}</th>
                    <td>${patient.name}</td>
                    <td>${calculateAge(birthDate)}</td>
                    <td>${patient.gender === 'm' ? '남성' : '여성'}</td>
                    <td>${patient.chartNum}</td>
                    <td>${birthDate}</td>
                    <td>${patient.phoneNum}</td>
                `;

                // 클릭 이벤트 추가
                row.addEventListener("click", () => {
                    // 이전 선택된 행에서 'selected' 클래스 제거
                    if (selectedRow) {
                        selectedRow.classList.remove('selected');
                    }
                    // 현재 클릭된 행에 'selected' 클래스 추가
                    selectedRow = row;
                    selectedRow.classList.add('selected');
                });

                // 행을 테이블 바디에 추가
                tableBody.appendChild(row);

                // 모달을 표시합니다
                searchModal.show();
            }
        });

        if (!found) {
            // 오류 메시지 표시
            alert("환자가 존재하지 않습니다.");
        }
    }).catch(error => {
        // patientSearch에서 발생한 오류 처리
        console.error("환자 데이터 가져오기 오류:", error);
    });
}, false);

document.querySelector(".SearchBtn").addEventListener("click", () => {
    if (selectedRow) {
        // 선택된 행의 데이터 가져오기
        const name = selectedRow.querySelector("td:nth-child(2)").textContent;
        const age = calculateAge(selectedRow.querySelector("td:nth-child(6)").textContent);
        const gender = selectedRow.querySelector("td:nth-child(4)").textContent;
        const chartNum = selectedRow.querySelector("td:nth-child(5)").textContent;
        const birthDate = selectedRow.querySelector("td:nth-child(6)").textContent;

        // HTML 요소에 데이터 삽입
        document.querySelector("#patientInfo").innerHTML = `
            <div class="text-center row">
                <label>이름: ${name} (${age}, ${gender})</label>
                <label>차트번호: ${chartNum}</label>
                <label>생일: ${birthDate || '-'}</label>
            </div>
        `;

        // 세션 저장
        sessionStorage.setItem('selectedPatient', JSON.stringify({
            name: name,
            age: age,
            gender: gender,
            chartNum: chartNum,
            birthDate: birthDate
        }));


        // 모달 창 닫기
        searchModal.hide();
    } else {
        console.log("선택된 행이 없습니다.");
    }
}, false);

// 생일로부터 나이 계산 함수
function calculateAge(birthDate) {
    if (!birthDate || birthDate === '-') return '-'; // 생일이 없거나 '-'인 경우
    const birthYear = new Date(birthDate).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
}





closeBtn.addEventListener("click", (e) => {
    searchModal.hide()
}, false)