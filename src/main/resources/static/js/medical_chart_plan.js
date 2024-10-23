

// 클릭된 p태그 를 저장.
let selectedPTag = null; // 클릭한 p 태그를 저장할 변수
const ptag = document.querySelectorAll(".select-pTag")
const modal = document.getElementById('Plan-cure-modal');
const toothModal = document.getElementById('Plan-tooth-Modal');
const toothValues = [];
// 성인 윗니 모두 선택할 수 있는 btn
const mUpTooth = document.querySelector(".modal-up-control")
// 상악 치아 모두 선택
const mUpToothValues = document.querySelectorAll(".modal-up-tooth")
// 성인 아랫니 모두 선택하는 btn
const mDownTooth = document.querySelector(".modal-down-control")
// 성인 하악 모두 선택
const mDownToothValues = document.querySelectorAll(".modal-down-tooth")
// 성인 치아 모두 선택하는 btn
const mAllTooth = document.querySelector(".modal-all-control")
// 유치 상악 모두 선택 할 수 있는 btn
const mUpToothY = document.querySelector(".modal-y-up-control")
// 유치 하악 모두 선택 할 수 있는 btn
const mDownToothY = document.querySelector(".modal-y-down-control")
// 유치 상하악 모두 선택 할 수 있는 btn
const mAllToothY = document.querySelector(".modal-y-all-control")
// 유치 상악 모두 선택
const mYUpToothValues = document.querySelectorAll(".modal-y-up-tooth")
// 유치 하악 모두 선택
const mYDownToothValues = document.querySelectorAll(".modal-y-down-tooth")
const mTooth = document.querySelector(".modal-tooth-container")
// 세션 데이터(환자정보) 를 가지고옴.


//세션 시작
// 세션 데이터 가져오기


// 치아 동적 배열 선언
let modalToothList = []

// DOM이 완전히 로드된 후 실행되도록 설정
document.addEventListener('DOMContentLoaded', function () {
});

if (modal) {
    // 모달 내부에서 클릭 이벤트 감지
    modal.addEventListener('click', function (event) {
        const target = event.target;

        // 클릭된 요소가 버튼인지 확인
        if (target.closest('button')) {
            const button = target.closest('button'); // 클릭된 버튼 가져오기

            // 버튼의 value와 일치하는 체크박스 선택
            const checkbox = modal.querySelector(`input[type="checkbox"][value="${button.value}"]`);

            // 체크박스가 존재하면 체크 상태 토글
            if (checkbox) {
                checkbox.checked = !checkbox.checked;
            }
        }
    });
} else {
    console.error("Modal not found in DOM.");
}

document.addEventListener("click", e => {
    const target = e.target;
    if (target.classList.contains("select-pTag")) {
        savePTag(target);
    }
})

// 모달을 열 때 호출되는 함수
function savePTag(pTag) {
    selectedPTag = pTag; // 클릭한 p 태그를 저장
    console.log(selectedPTag);
    // const modal = new bootstrap.Modal(document.getElementById('Plan-cure-modal'));
    // modal.show(); // 모달 열기
}

// 저장 버튼 클릭 시 선택된 체크박스 내용을 p 태그에 출력


// 선택된 checkbox와 매칭되는 라벨값 을 클릭 이벤트가 발생한 타겟에 출력.
document.getElementById('saveBtn').addEventListener('click', function () {
    if (selectedPTag) {
        const checkboxes = modal.querySelectorAll('input[type="checkbox"]:checked'); // 체크된 항목들 가져오기
        let selectedLabels = [];

        checkboxes.forEach(checkbox => {
            const label = modal.querySelector(`label[for="${checkbox.id}"]`);
            if (label) {
                selectedLabels.push(label.textContent); // label의 텍스트 값을 수집
            }
            // selectedValues.push(checkbox.value); // 체크된 값 수집
        });

        checkboxes.forEach(checkbox => {
            checkbox.checked =false
        })

        // p 태그에 선택된 값을 표시
        selectedPTag.textContent = selectedLabels.join(', ');

        if (selectedPTag.textContent === '' || selectedPTag.textContent === null) {
            selectedPTag.textContent = "치료계획 선택";
        }
        // 모달 닫기
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        bootstrapModal.hide();
    } else {
        console.error("No p tag was selected to display the results.");
    }
});


// 치아 클릭 시 선택된 치아 value 값을 저장.
mTooth.addEventListener("click", e => {
    toothList = []
    toothList.push(e.target.value)
    if (e.target.tagName === "BUTTON" && e.target.id === '') {
        if (e.target.classList.contains("opacity-50")) {
            e.target.classList.remove("opacity-50")
        } else {
            e.target.classList.add("opacity-50")
        }
    } else {
        if (e.target.tagName === "BUTTON") {
            toothTerminal(e.target.id)
        }
    }
})


function toothTerminal(id) {
    toothList = []
    switch (id) {
        case "modal-upTooth":
            for (i = 0; i < mUpToothValues.length; i++) {
                toothList[i] = mUpToothValues[i].value;
            }
            if (mUpTooth.classList.contains("opacity-50")) {
                mUpTooth.classList.remove("opacity-50")
                mUpToothValues.forEach(upToothValue =>
                    upToothValue.classList.remove("opacity-50"))
            } else {
                mUpTooth.classList.add("opacity-50")
                mUpToothValues.forEach(upToothValue =>
                    upToothValue.classList.add("opacity-50"))
            }
            console.log("상악")

            break;
        case "modal-allTooth":
            for (i = 0; i < mUpToothValues.length; i++) {
                toothList.push(mUpToothValues[i].value)
                toothList.push(mDownToothValues[i].value)
            }
            if (mAllTooth.classList.contains("opacity-50")) {
                mAllTooth.classList.remove("opacity-50")
                mUpToothValues.forEach(mUpToothValue =>
                    mUpToothValue.classList.remove("opacity-50"))
                mDownToothValues.forEach(mDownToothValue =>
                    mDownToothValue.classList.remove("opacity-50"))
            } else {
                mAllTooth.classList.add("opacity-50")
                mDownToothValues.forEach(mDownToothValue =>
                    mDownToothValue.classList.add("opacity-50"))
                mUpToothValues.forEach(upToothValue =>
                    upToothValue.classList.add("opacity-50"))
            }
            console.log("전부")
            break;
        case "modal-downTooth":
            for (i = 0; i < mDownToothValues.length; i++) {
                toothList[i] = mDownToothValues[i].value;
            }
            if (mDownTooth.classList.contains("opacity-50")) {
                mDownTooth.classList.remove("opacity-50")
                mDownToothValues.forEach(downToothValue =>
                    downToothValue.classList.remove("opacity-50"))
            } else {
                mDownTooth.classList.add("opacity-50")
                mDownToothValues.forEach(downToothValue =>
                    downToothValue.classList.add("opacity-50"))
            }
            console.log("하악")
            break;
        case "modal-upToothY":
            for (i = 0; i < mYUpToothValues.length; i++) {
                toothList[i] = mYUpToothValues[i].value;
            }
            if (mUpToothY.classList.contains("opacity-50")) {
                mUpToothY.classList.remove("opacity-50")
                mYUpToothValues.forEach(yUpToothValue =>
                    yUpToothValue.classList.remove("opacity-50"))
            } else {
                mUpToothY.classList.add("opacity-50")
                mYUpToothValues.forEach(yUpToothValue =>
                    yUpToothValue.classList.add("opacity-50"))
            }
            console.log("유치상악")
            break;
        case "modal-allToothY":

            console.log("유치전부")
            break;
        case "modal-downToothY":
            for (i = 0; i < mYDownToothValues.length; i++) {
                toothList[i] = mYDownToothValues[i].value;
            }
            if (mDownToothY.classList.contains("opacity-50")) {
                mDownToothY.classList.remove("opacity-50")
                mYDownToothValues.forEach(yDownToothValue =>
                    yDownToothValue.classList.remove("opacity-50"))
            } else {
                mDownToothY.classList.add("opacity-50")
                mYDownToothValues.forEach(yDownToothValue =>
                    yDownToothValue.classList.add("opacity-50"))
            }
            console.log("유치하악")
            break;
        default:
            console.log("올바르지 않은 버튼을 선택하였습니다.")
            alert("올바르지 않은 버튼은을 선택하였습니다.")
            break;
    }
}

// 선택된 checkbox와 매칭되는 라벨값 을 클릭 이벤트가 발생한 타겟에 출력.
document.getElementById('save-tooth').addEventListener('click', function () {
    if (selectedPTag) {
        const buttons = toothModal.querySelectorAll('button.opacity-50');
        let selectedbuttons = [];

        console.log(buttons);
        buttons.forEach(button => {
            selectedbuttons.push(button.textContent); // label의 텍스트 값을 수집

            // selectedValues.push(checkbox.value); // 체크된 값 수집
        });
        buttons.forEach(button => {
            button.classList.remove('opacity-50');
        })
        console.log(selectedbuttons)

        // p 태그에 선택된 값을 표시
        selectedPTag.textContent = selectedbuttons.join(', ');

        if (selectedPTag.textContent === '' || selectedPTag.textContent === null) {
            selectedPTag.textContent = "치아 선택";
        }
        // 모달 닫기
        const bootstrapModal = bootstrap.Modal.getInstance(toothModal);
        bootstrapModal.hide();
    } else {
        console.error("No p tag was selected to display the results.");
    }
});

$(document).ready(function() {
    saveChartNum();

    // 저장 버튼 클릭 이벤트
    $('#plan-data').on('click', 'button.save-db-btn', function() {
        // 클릭된 버튼의 부모 tr 요소를 찾음
        const row = $(this).closest('tr');

        // 현재 tr 안의 모든 p 태그의 값을 가져옴
        const rowData = [];
        row.find('p.select-pTag').each(function() {
            rowData.push($(this).text().trim()); // 각 p 태그의 내용을 수집
        });

        // DB 저장을 위한 데이터
        console.log(rowData); // rowData를 서버에 전송하여 DB에 저장하는 로직을 추가
        // AJAX를 이용해 DB에 저장
        $.ajax({
            url: '/medical_chart/savePlan',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({toothOne: rowData[[0]],
                planOne: rowData[[1]],
                toothTwo:rowData[[2]],
                planTwo:rowData[[3]]
            }),
            success: function(response) {
                console.log("Data saved to DB:", response);

                // 저장이 완료되면 새 행을 추가
                addNewRow();
            },
            error: function(error) {
                console.error('Error saving data:', error);
            }
        });
    });

    // 새로운 행 추가 함수
    function addNewRow() {
        const newRow = `
            <tr>
                <td><p style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#Plan-tooth-Modal" class="select-pTag">치아 선택</p></td>
                <td><p style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#Plan-cure-modal" class="select-pTag">치료계획 선택</p></td>
                <td><p style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#Plan-tooth-Modal" class="select-pTag">치아 선택</p></td>
                <td><p style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#Plan-cure-modal" class="select-pTag">치료계획 선택</p></td>
                <td><button class="btn" type="button">저장</button></td>
                <td><button class="btn" type="button">삭제</button></td>
            </tr>
        `;

        // 새로운 행을 tbody에 추가
        $('#plan-data').append(newRow);
    }
});