//클릭된 p태그 를 저장.
let selectedPTag = null; // 클릭한 p 태그를 저장할 변수
const ptag = document.querySelectorAll(".select-pTag")
const modal = document.getElementById('Plan-cure-modal');
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


// DOM이 완전히 로드된 후 실행되도록 설정
document.addEventListener('DOMContentLoaded', function () {

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

            // p 태그에 선택된 값을 표시
            selectedPTag.textContent = selectedLabels.join(', ');

            // 모달 닫기
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            bootstrapModal.hide();
        } else {
            console.error("No p tag was selected to display the results.");
        }
    });
});
