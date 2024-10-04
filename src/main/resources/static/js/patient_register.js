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
// const memoRegDate = document.getElementById("memoRegDate")
// const memoContent = document.getElementById("memoContent")
const homeNum1 = document.getElementById("homeNum");
const homeNum2 = document.getElementById("homeNum2");
const homeNum3 = document.getElementById("homeNum3");
const phoneNum1 = document.getElementById("phoneNum");
const phoneNum2 = document.getElementById("phoneNum2");
const phoneNum3 = document.getElementById("phoneNum3");
const emailLocal = document.getElementById("emailLocal");
const emailDomain = document.getElementById("emailDomain");

patient_register.addEventListener("click", (e) => {
    // 환자 정보를 담은 객체
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
        lastVisit: lastVisit.value,
        memos: [] // 메모 데이터를 담을 배열
    };

    function setPatientFields(result) {
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
    }

    if (chartNum.value) {
        modifyPatient(patientObj, chartNum.value).then(setPatientFields).catch(e => {
            alert("Exception....");
            console.log(e);
        });
    } else {
        // 메모 테이블에서 동적으로 추가된 모든 메모를 가져옴
        const table = document.getElementById('memoTable').getElementsByTagName('tbody')[0];
        const rows = Array.from(table.getElementsByTagName('tr')); // 모든 테이블 행 가져오기

        rows.forEach((row, index) => {
            // 각 행의 메모 날짜와 내용을 추출
            const memoRegDate = row.querySelector(`#memoRegDate_${index}`);
            const memoContent = row.querySelector(`#memoContent_${index}`);

            // 각 메모를 배열에 추가
            if (memoRegDate && memoContent) {
                patientObj.memos.push({
                    regDate: memoRegDate.value,
                    content: memoContent.value
                });
            }
        });
        addPatient(patientObj).then(setPatientFields).catch(e => {
            alert("Exception....");
            console.log(e);
        });
    }

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


const table = document.getElementById('memoTable').getElementsByTagName('tbody')[0];


function addRow(date, content) {
    const rowIndex = table.rows.length; // 현재 테이블의 행 개수를 이용해 고유한 인덱스 생성
    const memoRegDate = document.getElementById("memoRegDate_" + rowIndex);
    const memoContent = document.getElementById("memoContent_" + rowIndex);
    const newRow = document.createElement('tr') // 새 행 생성
    newRow.classList.add('new-row');
// 테이블에 추가한 후에 해당 요소를 참조해야 함

    // 날짜 입력란 셀
    const dateCell = newRow.insertCell(0);
    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    dateInput.className = 'form-control';
    dateInput.id = 'memoRegDate_' + rowIndex; // 고유 ID 부여
    dateInput.name = 'memoRegDate';
    dateInput.value = date; // 메모의 값을 설정
    dateCell.appendChild(dateInput);

    // 내용 입력란 셀
    const memoCell = newRow.insertCell(1);
    const memoInput = document.createElement('textarea');
    memoInput.className = 'form-control';
    memoInput.id = 'memoContent_' + rowIndex; // 고유 ID 부여
    memoInput.name = 'memoContent';
    memoInput.value = content || ''; // 메모의 값을 설정
    memoCell.appendChild(memoInput);

    // 삭제 및 수정 버튼이 들어갈 셀
    const deleteCell = newRow.insertCell(2);

    // 수정 버튼 생성 및 아이콘 추가
    const editButton = document.createElement('button');
    editButton.className = 'btn btn-primary m-1'; // 수정 버튼은 다른 색상을 사용
    editButton.innerHTML = '<i class="bi bi-pencil"></i>';
    editButton.onclick = function () {
        editRow(this); // 수정 기능을 처리하는 함수
    };
    deleteCell.appendChild(editButton);

    // 삭제 버튼 생성 및 아이콘 추가
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger';
    deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
    deleteButton.onclick = function () {
        deleteRow(this);
    };
    deleteCell.appendChild(deleteButton);

    // 새로운 행을 테이블에 추가
    table.appendChild(newRow);


    // 메모 저장 버튼 클릭 이벤트
    document.getElementById('memo_reg').addEventListener('click', (e) => {
        const memoObj = {
            memo_date: memoRegDate.value,
            memo_content: memoContent.value
        };
        console.log(memoObj);
    });

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

// 새로고침 버튼
document.querySelector("#refreshBtn").addEventListener("click", () => {
    name.value = '';
    chartNum.value = '';
    firstPaResidentNum.value = '';
    lastPaResidentNum.value = '';
    birthDate.value = '';
    gender.value = '';
    defaultAddress.value = '';
    mainDoc.value = '';
    visitPath.value = '';
    category.value = '';
    tendency.value = '';
    firstVisit.value = '';
    lastVisit.value = '';

    homeNum1.value = '';
    homeNum2.value = '';
    homeNum3.value = '';
    phoneNum1.value = '';
    phoneNum2.value = '';
    phoneNum3.value = '';
    emailLocal.value = '';
    emailDomain.value = '';

    const rows = table.getElementsByClassName('new-row');

    // Loop backwards to avoid index issues when removing
    while (rows.length > 0) {
        rows[0].parentNode.removeChild(rows[0]);
    }

});


document.querySelector("#patient_del").addEventListener("click", () => {
    removePatient(chartNum.value).then(result => {
        name.value = '';
        chartNum.value = '';
        firstPaResidentNum.value = '';
        lastPaResidentNum.value = '';
        birthDate.value = '';
        gender.value = '';
        defaultAddress.value = '';
        mainDoc.value = '';
        visitPath.value = '';
        category.value = '';
        tendency.value = '';
        firstVisit.value = '';
        lastVisit.value = '';

        homeNum1.value = '';
        homeNum2.value = '';
        homeNum3.value = '';
        phoneNum1.value = '';
        phoneNum2.value = '';
        phoneNum3.value = '';
        emailLocal.value = '';
        emailDomain.value = '';

        const rows = table.getElementsByClassName('new-row');

        // Loop backwards to avoid index issues when removing
        while (rows.length > 0) {
            rows[0].parentNode.removeChild(rows[0]);
        }
    }).catch(e => {
        alert("Exception....")
        console.log(e)
    })

}, false);
