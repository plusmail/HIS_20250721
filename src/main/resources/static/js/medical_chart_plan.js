if (!window.MedicalPlanModule) {
    window.MedicalPlanModule = (() => {
        let selectedPTag = null;
        let modalToothList = [];
        let toothValues = [];

        let modal, toothModal, saveBtn, planData, mTooth, saveToothBtn;
        let mUpTooth, mUpToothValues, mDownTooth, mDownToothValues, mAllTooth;
        let mUpToothY, mDownToothY, mAllToothY, mYUpToothValues, mYDownToothValues;
        let mdTime, checkDoc;
        let patientInfos = JSON.parse(sessionStorage.getItem('selectedPatient'));

        function init() {
            modal = document.getElementById('Plan-cure-modal');
            toothModal = document.getElementById('Plan-tooth-Modal');
            saveBtn = document.getElementById('saveBtn');
            saveToothBtn = document.getElementById('save-tooth');  // 치아 저장 버튼 추가
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

            mdTime = document.getElementById("mdTime");
            checkDoc = document.getElementById("planCheckDoc");

            setupEventListeners();
            addNewRow();
        }

        function setupEventListeners() {
            if (modal) {
                modal.addEventListener('click', handleModalClick);
            }
            document.addEventListener("click", handleDocumentClick);
            saveBtn.addEventListener('click', saveSelectedLabels);
            saveToothBtn.addEventListener('click', saveSelectedTeeth); // 치아 저장 버튼 이벤트 리스너 추가
            mTooth.addEventListener("click", handleToothClick);

            planData.on('click', 'button.save-db-btn', handleSaveButtonClick);
            planData.on('click', 'button.del-db-btn', handleDeleteButtonClick);
        }

        function cleanup() {
            if (modal) {
                modal.removeEventListener('click', handleModalClick);
            }
            document.removeEventListener("click", handleDocumentClick);
            saveBtn.removeEventListener('click', saveSelectedLabels);
            saveToothBtn.removeEventListener('click', saveSelectedTeeth); // 치아 저장 버튼 이벤트 리스너 제거
            mTooth.removeEventListener("click", handleToothClick);

            planData.off('click', 'button.save-db-btn', handleSaveButtonClick);
            planData.off('click', 'button.del-db-btn', handleDeleteButtonClick);

            selectedPTag = null;
            modalToothList = [];
            toothValues = [];
        }

        function handleDocumentClick(e) {
            const target = e.target;
            if (target.classList.contains("select-pTag")) {
                savePTag(target);
            }
        }

        function savePTag(pTag) {
            selectedPTag = pTag;
        }

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

        function saveSelectedLabels() {
            if (selectedPTag) {
                const checkboxes = modal.querySelectorAll('input[type="checkbox"]:checked');
                const selectedLabels = Array.from(checkboxes).map(checkbox => {
                    const label = modal.querySelector(`label[for="${checkbox.id}"]`);
                    return label ? label.textContent : '';
                }).filter(text => text !== '');

                selectedPTag.textContent = selectedLabels.join(', ') || "치료계획 선택";
                checkboxes.forEach(checkbox => checkbox.checked = false);

                const bootstrapModal = bootstrap.Modal.getInstance(modal);
                bootstrapModal.hide();
            } else {
                console.error("No p tag was selected to display the results.");
            }
        }

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
            toothList = []; // Initialize an empty list to store only numeric tooth values

            switch (id) {
                case "modal-upTooth":
                    // Filter only numeric values for upper teeth
                    mUpToothValues.forEach(upToothValue => {
                        if (!isNaN(upToothValue.value)) {  // Ensure the value is numeric
                            toothList.push(upToothValue.value);
                        }
                    });
                    toggleOpacity(mUpTooth, mUpToothValues, "상악");
                    break;

                case "modal-allTooth":
                    // Filter only numeric values for both upper and lower teeth
                    mUpToothValues.forEach(upToothValue => {
                        if (!isNaN(upToothValue.value)) {
                            toothList.push(upToothValue.value);
                        }
                    });
                    mDownToothValues.forEach(downToothValue => {
                        if (!isNaN(downToothValue.value)) {
                            toothList.push(downToothValue.value);
                        }
                    });
                    toggleOpacity(mAllTooth, [...mUpToothValues, ...mDownToothValues], "전부");
                    break;

                case "modal-downTooth":
                    // Filter only numeric values for lower teeth
                    mDownToothValues.forEach(downToothValue => {
                        if (!isNaN(downToothValue.value)) {
                            toothList.push(downToothValue.value);
                        }
                    });
                    toggleOpacity(mDownTooth, mDownToothValues, "하악");
                    break;

                case "modal-upToothY":
                    // Filter only numeric values for deciduous upper teeth
                    mYUpToothValues.forEach(yUpToothValue => {
                        if (!isNaN(yUpToothValue.value)) {
                            toothList.push(yUpToothValue.value);
                        }
                    });
                    toggleOpacity(mUpToothY, mYUpToothValues, "유치상악");
                    break;

                case "modal-allToothY":
                    // Filter only numeric values for deciduous upper and lower teeth
                    mYUpToothValues.forEach(yUpToothValue => {
                        if (!isNaN(yUpToothValue.value)) {
                            toothList.push(yUpToothValue.value);
                        }
                    });
                    mYDownToothValues.forEach(yDownToothValue => {
                        if (!isNaN(yDownToothValue.value)) {
                            toothList.push(yDownToothValue.value);
                        }
                    });
                    toggleOpacity(mAllToothY, [...mYUpToothValues, ...mYDownToothValues], "유치전부");
                    break;

                case "modal-downToothY":
                    // Filter only numeric values for deciduous lower teeth
                    mYDownToothValues.forEach(yDownToothValue => {
                        if (!isNaN(yDownToothValue.value)) {
                            toothList.push(yDownToothValue.value);
                        }
                    });
                    toggleOpacity(mDownToothY, mYDownToothValues, "유치하악");
                    break;

                default:
                    alert("올바르지 않은 버튼을 선택하였습니다.");
                    break;
            }
            console.log("Filtered Tooth List:", toothList); // Verify the filtered list
        }

// Helper function to toggle opacity and log messages
        function toggleOpacity(button, elements, logMessage) {
            button.classList.toggle("opacity-50");
            elements.forEach(element => element.classList.toggle("opacity-50"));
            console.log(logMessage);
        }


        function saveSelectedTeeth() {
            if (selectedPTag) {
                const buttons = toothModal.querySelectorAll('button.opacity-50');
                let selectedButtons = [];

                buttons.forEach(button => {
                    // Only add the button's value if it's a valid number
                    if (button.value && !isNaN(button.value)) {
                        selectedButtons.push(button.value);  // Collect only numeric values
                    }
                });

                // Clear selection styles after collecting values
                buttons.forEach(button => {
                    button.classList.remove('opacity-50');
                });

                // Set the selected P tag's text content with only numeric values joined by ', '
                selectedPTag.textContent = selectedButtons.join(', ') || "치아 선택";

                // Close the modal
                const bootstrapModal = bootstrap.Modal.getInstance(toothModal);
                bootstrapModal.hide();
            } else {
                console.error("No p tag was selected to display the results.");
            }
        }


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
                    chartNum: patientInfos.chartNum,
                    paName: patientInfos.name,
                    teethNum: rowData[0],
                    medicalContent: rowData[1],
                    medicalDivision: "PLAN",
                    mdTime: mdTime.value,
                    checkDoc: checkDoc.value
                }),
                success: function (response) {
                    readPaChart();
                    addNewRow();
                },
                error: function (error) {
                    console.error('Error saving data:', error);
                }
            });

        }

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
                    teethNum: rowData[0],
                    medicalContent: rowData[1]
                }),
                success: function (response) {
                    console.log("Data deleted from DB:", response);
                    // 행이 없으면 새로운 행 추가
                    if ($('#plan-data tr').length === 0) {
                        addNewRow(); // 새로운 행 추가 함수 호출
                    }
                },
                error: function (error) {
                    console.error('Error deleting data:', error);
                }
            });
        }
console.log("!!!!!!!!")
        function ChartList() {

        }

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
