if (!window.MedicalPlanModule) {
    window.MedicalPlanModule = (() => {
        // 내부 변수 (모듈 내에서만 접근 가능)
        let selectedPTag = null;
        let modalToothList = [];
        let toothValues = [];

        // DOM 요소 변수
        let modal, toothModal, saveBtn, planData, mTooth;
        let mUpTooth, mUpToothValues, mDownTooth, mDownToothValues, mAllTooth, mUpToothY, mDownToothY, mAllToothY,
            mYUpToothValues, mYDownToothValues;

        // 초기화 함수
        function init() {
            // DOM 요소 선택
            modal = document.getElementById('Plan-cure-modal');
            toothModal = document.getElementById('Plan-tooth-Modal');
            saveBtn = document.getElementById('saveBtn');
            planData = $('#plan-data');
            mTooth = document.querySelector(".modal-tooth-container");

            mUpTooth = document.querySelector(".modal-up-control");
            mUpToothValues = document.querySelectorAll(".modal-up-tooth");
            mDownTooth = document.querySelector(".modal-down-control");
            mDownToothValues = document.querySelectorAll(".modal-down-tooth");
            mAllTooth = document.querySelector(".modal-all-control");
            mUpToothY = document.querySelector(".modal-y-up-control");
            mDownToothY = document.querySelector(".modal-y-down-control");
            mAllToothY = document.querySelector(".modal-y-all-control");
            mYUpToothValues = document.querySelectorAll(".modal-y-up-tooth");
            mYDownToothValues = document.querySelectorAll(".modal-y-down-tooth");

            // 이벤트 리스너 설정
            setupEventListeners();
            addNewRow();
        }

        // 이벤트 리스너 설정 함수
        function setupEventListeners() {
            if (modal) {
                modal.addEventListener('click', handleModalClick);
            }
            document.addEventListener("click", handleDocumentClick);
            saveBtn.addEventListener('click', saveSelectedLabels);
            mTooth.addEventListener("click", handleToothClick);

            // 저장 및 삭제 버튼 클릭 이벤트
            planData.on('click', 'button.save-db-btn', handleSaveButtonClick);
            planData.on('click', 'button.del-db-btn', handleDeleteButtonClick);
        }

        // 정리 함수 (이벤트 리스너 제거 및 변수 초기화)
        function cleanup() {
            if (modal) {
                modal.removeEventListener('click', handleModalClick);
            }
            document.removeEventListener("click", handleDocumentClick);
            saveBtn.removeEventListener('click', saveSelectedLabels);
            mTooth.removeEventListener("click", handleToothClick);

            // 저장 및 삭제 버튼 클릭 이벤트 해제
            planData.off('click', 'button.save-db-btn', handleSaveButtonClick);
            planData.off('click', 'button.del-db-btn', handleDeleteButtonClick);

            // 변수 초기화
            selectedPTag = null;
            modalToothList = [];
            toothValues = [];
        }

        // p 태그 클릭 시 호출되는 함수
        function handleDocumentClick(e) {
            const target = e.target;
            if (target.classList.contains("select-pTag")) {
                savePTag(target);
            }
        }

        // 클릭된 p태그를 저장하는 함수
        function savePTag(pTag) {
            selectedPTag = pTag;
        }

        // 모달 내에서 클릭 이벤트 처리
        function handleModalClick(event) {
            const target = event.target;
            if (target.closest('button')) {
                const button = target.closest('button');
                const checkbox = modal.querySelector(`input[type="checkbox"][value="${button.value}"]`);
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                }
            }
        }

        // 체크된 항목을 p 태그에 표시하는 함수
        function saveSelectedLabels() {
            if (selectedPTag) {
                const checkboxes = modal.querySelectorAll('input[type="checkbox"]:checked');
                const selectedLabels = Array.from(checkboxes).map(checkbox => {
                    const label = modal.querySelector(`label[for="${checkbox.id}"]`);
                    return label ? label.textContent : '';
                }).filter(text => text !== '');

                // p 태그에 선택된 값을 표시
                selectedPTag.textContent = selectedLabels.join(', ') || "치료계획 선택";

                // 체크박스 해제
                checkboxes.forEach(checkbox => checkbox.checked = false);

                // 모달 닫기
                const bootstrapModal = bootstrap.Modal.getInstance(modal);
                bootstrapModal.hide();
            } else {
                console.error("No p tag was selected to display the results.");
            }
        }

        // 치아 클릭 시 선택된 치아 value 값을 저장
        function handleToothClick(e) {
            modalToothList = [];
            modalToothList.push(e.target.value);
            if (e.target.tagName === "BUTTON" && e.target.id === '') {
                e.target.classList.toggle("opacity-50");
            } else if (e.target.tagName === "BUTTON") {
                toothTerminal(e.target.id);
            }
        }

        function toothTerminal(id) {
            modalToothList = [];
            switch (id) {
                case "modal-upTooth":
                    toggleOpacity(mUpTooth, mUpToothValues, "상악");
                    break;
                case "modal-allTooth":
                    toggleOpacity(mAllTooth, [...mUpToothValues, ...mDownToothValues], "전부");
                    break;
                case "modal-downTooth":
                    toggleOpacity(mDownTooth, mDownToothValues, "하악");
                    break;
                case "modal-upToothY":
                    toggleOpacity(mUpToothY, mYUpToothValues, "유치상악");
                    break;
                case "modal-downToothY":
                    toggleOpacity(mDownToothY, mYDownToothValues, "유치하악");
                    break;
                default:
                    alert("올바르지 않은 버튼을 선택하였습니다.");
                    break;
            }
        }

        function toggleOpacity(button, elements, logMessage) {
            modalToothList = Array.from(elements).map(element => element.value);
            button.classList.toggle("opacity-50");
            elements.forEach(element => element.classList.toggle("opacity-50"));
            console.log(logMessage);
        }

        // 저장 버튼 클릭 시 호출되는 함수
        function handleSaveButtonClick() {
            const rowData = [];
            $(this).closest('tr').find('p.select-pTag').each(function () {
                rowData.push($(this).text().trim());
            });

            $.ajax({
                url: '/medical_chart/savePlan',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    toothOne: rowData[0],
                    planOne: rowData[1],
                    toothTwo: rowData[2],
                    planTwo: rowData[3]
                }),
                success: function (response) {
                    console.log("Data saved to DB:", response);
                    addNewRow();
                },
                error: function (error) {
                    console.error('Error saving data:', error);
                }
            });
        }

        // 삭제 버튼 클릭 시 호출되는 함수
        function handleDeleteButtonClick() {
            const row = $(this).closest('tr');
            const rowData = [];
            row.find('p.select-pTag').each(function () {
                rowData.push($(this).text().trim());
            });

            row.remove();

            $.ajax({
                url: '/medical_chart/delPlan',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    toothOne: rowData[0],
                    planOne: rowData[1],
                    toothTwo: rowData[2],
                    planTwo: rowData[3]
                }),
                success: function (response) {
                    console.log("Data deleted from DB:", response);
                },
                error: function (error) {
                    console.error('Error deleting data:', error);
                }
            });
        }

        // 새로운 행 추가 함수
        function addNewRow() {
            const newRow = `
            <tr>
                <td><p style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#Plan-tooth-Modal" class="select-pTag">치아 선택</p></td>
                <td><p style="cursor: pointer;" data-bs-toggle="modal" data-bs-target="#Plan-cure-modal" class="select-pTag">치료계획 선택</p></td>
                <td><button class="btn save-db-btn" type="button">저장</button></td>
                <td><button class="btn del-db-btn" type="button">삭제</button></td>
            </tr>
        `;
            planData.append(newRow);
        }

        return {
            init,
            cleanup
        };
    })();
}