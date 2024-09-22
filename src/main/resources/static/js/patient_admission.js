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
    console.log("DOM이 로드되었습니다.")
    document.querySelector(".ReceptionBtn").addEventListener("click", () => {
        console.log("접수 버튼이 클릭되었습니다.");
        const retrievedPatient = JSON.parse(sessionStorage.getItem('selectedPatient'));

        if (retrievedPatient) {
            console.log('가져온 환자 정보:', retrievedPatient.name, retrievedPatient.chartNum);

            const table = document.querySelector("#waitingPatientsTable tbody");
            const newRow = table.insertRow();

            // 추가할 데이터 로그
            console.log('추가할 데이터:', retrievedPatient.chartNum, retrievedPatient.name);

            const waitTime = "대기 시간";

            newRow.innerHTML = `
                <td>${retrievedPatient.chartNum}</td>
                <td>${retrievedPatient.name}</td>
                <td>${retrievedPatient.doctorName || '의사 이름'}</td>
                <td>${retrievedPatient.appointmentTime || '예약 시간'}</td>
                <td>${new Date().toLocaleTimeString()}</td>
                <td>${waitTime}</td>
            `;

            const countCell = document.querySelector("#waitingPatientsTable thead tr:first-child th");
            const currentCount = parseInt(countCell.textContent.match(/\d+/)[0]) || 0;
            countCell.textContent = `진료 대기 환자: ${currentCount + 1}명`;

            console.log('환자 정보가 테이블에 추가되었습니다.');
        } else {
            console.log('세션에 저장된 환자 정보가 없습니다.');
        }
    });
});




