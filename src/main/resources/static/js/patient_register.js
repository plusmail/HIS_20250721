console.log("reply 시작")



const patient_register = document.getElementById("patient_reg")
const name = document.getElementById("name")
const firstPaResidentNum = document.getElementById("firstPaResidentNum")
const lastPaResidentNum = document.getElementById("lastPaResidentNum")
const birthDate = document.getElementById("birthDate")
const gender = document.getElementById("gender")
const defaultAddress = document.getElementById("defaultAddress")
const detailedAddress = document.getElementById("detailedAddress")
const mainDoc = document.getElementById("mainDoc")
const visitPath = document.getElementById("visitPath")
const category = document.getElementById("category")
const tendency = document.getElementById("tendency")
const firstVisit = document.getElementById("firstVisit")
const lastVisit = document.getElementById("lastVisit")
const chartNum = document.querySelector("#chartNum")
const memo_date = document.getElementById("memo_date")
const memo_textarea = document.getElementById("memo_textarea")

const homeNum1 = document.getElementById("homeNum");
const homeNum2 = document.getElementById("homeNum2");
const homeNum3 = document.getElementById("homeNum3");
const phoneNum1 = document.getElementById("phoneNum");
const phoneNum2 = document.getElementById("phoneNum2");
const phoneNum3 = document.getElementById("phoneNum3");
const emailLocal = document.getElementById("emailLocal");
const emailDomain = document.getElementById("emailDomain");

patient_register.addEventListener("click", (e) => {
    const patientObj = {
        name: name.value,
        firstPaResidentNum: firstPaResidentNum.value,
        lastPaResidentNum: lastPaResidentNum.value,
        birthDate: birthDate.value,
        gender: gender.value,
        homeNum: `${homeNum1.value}-${homeNum2.value}-${homeNum3.value}`,
        phoneNum: `${phoneNum1.value}-${phoneNum2.value}-${phoneNum3.value}`,
        email: `${emailLocal.value}@${emailDomain.value}`,
        defaultAddress: defaultAddress.value,
        detailedAddress: detailedAddress.value,
        mainDoc: mainDoc.value,
        visitPath: visitPath.value,
        category: category.value,
        tendency: tendency.value,
        firstVisit: firstVisit.value,
        lastVisit: lastVisit.value
    };
    console.log(patientObj)
    addReply(patientObj).then(result => {
        console.log("Received result:", result);
        // 단일 필드 값 설정
        name.value = result.name || '';
        chartNum.value = result.chartNum || '';
        firstPaResidentNum.value = result.firstPaResidentNum || '';
        lastPaResidentNum.value = result.lastPaResidentNum || '';
        birthDate.value = result.birthDate || '';
        gender.value = result.gender || '';
        defaultAddress.value = result.defaultAddress || '';
        mainDoc.value = result.mainDoc || '';
        visitPath.value = result.visitPath || '';
        category.value = result.category || '';
        tendency.value = result.tendency || '';
        firstVisit.value = result.firstVisit || '';
        lastVisit.value = result.lastVisit || '';

        // 자택전화 나누기
        const [homeNum1, homeNum2, homeNum3] = result.homeNum.split('-');
        document.getElementById("homeNum").value = homeNum1 || '';
        document.getElementById("homeNum2").value = homeNum2 || '';
        document.getElementById("homeNum3").value = homeNum3 || '';

        // 휴대전화 나누기
        const [phoneNum1, phoneNum2, phoneNum3] = result.phoneNum.split('-');
        document.getElementById("phoneNum").value = phoneNum1 || '';
        document.getElementById("phoneNum2").value = phoneNum2 || '';
        document.getElementById("phoneNum3").value = phoneNum3 || '';

        // 이메일 나누기
        const [emailLocalPart, emailDomainPart] = result.email.split('@');
        document.getElementById("emailLocal").value = emailLocalPart || '';
        document.getElementById("emailDomain").value = emailDomainPart || '';
    }).catch(e => {
        alert("Exception....")
        console.log(e)
    })
}, false)

// 주소등록
function execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function (data) {
            // 팝업을 통한 검색 결과 항목 클릭 시 실행
            var addr = ''; // 주소_결과값이 없을 경우 공백
            var extraAddr = ''; // 참고항목

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 도로명 주소를 선택
                addr = data.roadAddress;
            } else { // 지번 주소를 선택
                addr = data.jibunAddress;
            }

            if (data.userSelectedType === 'R') {
                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraAddr += data.bname;
                }
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }
                if (extraAddr !== '') {
                    extraAddr = ' (' + extraAddr + ')';
                }
            } else {
                document.getElementById("defaultAddress").value = '';
            }

            // 선택된 우편번호와 주소 정보를 input 박스에 넣는다.
            document.getElementById('zipp_code_id').value = data.zonecode;
            document.getElementById("defaultAddress").value = addr;
            document.getElementById("defaultAddress").value += extraAddr;
            document.getElementById("detailedAddress").focus(); // 우편번호 + 주소 입력이 완료되었음으로 상세주소로 포커스 이동
        }
    }).open();
}

// 테이블 기능-------------------------------------------------------------------------------
// 새 행 추가 함수
function addRow(date, content) {
    const table = document.getElementById('memoTable').getElementsByTagName('tbody')[0];
    const newRow = document.createElement('tr'); // 새 행 생성

    // 날짜 입력란 셀
    const dateCell = newRow.insertCell(0);
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.className = 'form-control';
    dateInput.value = date; // 메모의 값을 설정
    dateCell.appendChild(dateInput);

    // 내용 입력란 셀
    const memoCell = newRow.insertCell(1);
    const memoInput = document.createElement('textarea');
    memoInput.className = 'form-control';
    memoInput.value = content; // 메모의 값을 설정
    memoCell.appendChild(memoInput);

    // 삭제 버튼 셀
    const deleteCell = newRow.insertCell(2);
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger';
    deleteButton.innerText = '삭제';
    deleteButton.onclick = function () {
        deleteRow(this);
    };
    deleteCell.appendChild(deleteButton);

    // 기존 행들을 배열에 담아 정렬
    const rows = Array.from(table.getElementsByTagName('tr'));

    // 새 행의 날짜를 비교하여 삽입 위치 결정
    let inserted = false;
    for (let i = 0; i < rows.length; i++) {
        const rowDateInput = rows[i].cells[0].getElementsByTagName('input')[0];
        if (rowDateInput) {
            const rowDate = new Date(rowDateInput.value);
            const newDate = new Date(date);
            // 새로운 날짜가 기존 날짜보다 최신이라면
            if (newDate > rowDate) {
                table.insertBefore(newRow, rows[i]);
                inserted = true;
                break;
            }
        }
    }

    // 삽입되지 않았다면 가장 마지막에 추가
    if (!inserted) {
        table.appendChild(newRow);
    }
}

// 행 삭제 함수
function deleteRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

// 테이블 기능-----------------------------------------------------------------------------

// 생년월일 입력 필드와 나이 입력 필드 가져오기-----------------------
const birthDateInput = document.getElementById('birthDate');
const ageInput = document.getElementById('age');

function calculateAge(birthDate) {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = today.getMonth() - birthDateObj.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDateObj.getDate())) {
        age--;
    }
    return age;
}

birthDateInput.addEventListener('change', () => {
    const birthDate = birthDateInput.value;
    if (birthDate) {
        const age = calculateAge(birthDate);
        ageInput.value = age;
    } else {
        ageInput.value = '';
    }
});
// 생년월일 입력 필드와 나이 입력 필드 가져오기-----------------------
