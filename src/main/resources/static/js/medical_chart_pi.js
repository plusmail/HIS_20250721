if (!window.MedicalChartPIModule) {
    window.MedicalChartPIModule = (() => {
        let toothList = [];
        let symptomList = [];
        let listIndex = 0;

        let tooth, symptom, memo, savePi, resetPi, mUpTooth, mDownTooth, mAllTooth, mUpToothY, mDownToothY, mAllToothY;
        let mUpToothValues, mDownToothValues, mYUpToothValues, mYDownToothValues, modalData, allToothLists;

        // 초기화 함수
        function init() {
            tooth = document.querySelector(".tooth-container");
            symptom = document.querySelector(".pi-symptom");
            memo = document.querySelector(".memo");
            savePi = document.querySelector(".save-pi");
            resetPi = document.querySelector(".reset-pi");
            mUpTooth = document.querySelector(".up-control");
            mDownTooth = document.querySelector(".down-control");
            mAllTooth = document.querySelector(".all-control");
            mUpToothY = document.querySelector(".y-up-control");
            mDownToothY = document.querySelector(".y-down-control");
            mAllToothY = document.querySelector(".y-all-control");

            mUpToothValues = document.querySelectorAll(".up-tooth");
            mDownToothValues = document.querySelectorAll(".down-tooth");
            mYUpToothValues = document.querySelectorAll(".y-up-tooth");
            mYDownToothValues = document.querySelectorAll(".y-down-tooth");
            modalData = document.querySelectorAll(".modal-tr");
            allToothLists = tooth.querySelectorAll('button');

            setupEventListeners();

            // 날짜를 오늘 날짜로 설정
            const mdTime = document.getElementById("mdTime");
            const today = new Date().toISOString().split("T")[0];
            mdTime.value = today;

            // 주치의 목록에서 첫 번째 항목이 선택되도록 설정
            const piCheckDoc = document.getElementById("piCheckDoc");
            if (!piCheckDoc.value) {
                piCheckDoc.selectedIndex = 1;
            }

            cnumGlobal = null;

        }

        // 주요 요소 이벤트 리스너 등록
        function setupEventListeners() {
            tooth.addEventListener("click", handleToothClickPi);
            symptom.addEventListener("click", handleSymptomClick);

            // 체크박스에 이벤트 리스너 추가
            const checkboxes = document.querySelectorAll('.form-check-input');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', updateTextarea);
            });

            savePi.addEventListener('click', saveMedicalPiChart);
            resetPi.addEventListener('click', resetFormFields);
        }

        // 모듈 초기화 및 정리
        function cleanup() {
            tooth.removeEventListener("click", handleToothClickPi);
            symptom.removeEventListener("click", handleSymptomClick);

            toothList = [];
            symptomList = [];
            listIndex = 0;
        }

        // 치아 버튼 클릭시 호출
        function handleToothClickPi(e) {
            if (e.target.tagName === "BUTTON" && e.target.id === '') {
                const toothValue = e.target.value;

                // 배열 초기화 확인
                if (!Array.isArray(window.toothList)) {
                    window.toothList = [];
                }

                // 치아 값 추가/제거
                if (window.toothList.includes(toothValue)) {
                    window.toothList = window.toothList.filter(tooth => tooth !== toothValue);
                } else {
                    window.toothList.push(toothValue);
                }

                // 버튼 스타일 토글
                e.target.classList.toggle("opacity-50");

                // 스타일 업데이트
                updateToothButtonStyles(window.toothList);
            } else if (e.target.tagName === "BUTTON") {
                // ID 유효성 검증
                if (document.getElementById(e.target.id)) {
                    toothTerminalPi(e.target.id);
                } else {
                    console.warn("유효하지 않은 버튼 ID:", e.target.id);
                }
            }
        }

// 치아 영역 선택
        function toothTerminalPi(id) {
            // 배열 초기화 확인
            if (!Array.isArray(window.toothList)) {
                window.toothList = [];
            }

            const button = document.getElementById(id);
            if (!button) {
                console.error("올바르지 않은 ID:", id);
                return;
            }

            const isSelected = button.classList.contains("opacity-50");
            let selectedTeethValues = [];

            // 각 ID에 따른 치아 목록 설정
            switch (id) {
                case "upTooth":
                    selectedTeethValues = Array.from(mUpToothValues || []).map(tooth => tooth.value || '');
                    toggleOpacityPi(mUpTooth, mUpToothValues, "상악");
                    break;
                case "allTooth":
                    selectedTeethValues = [
                        ...Array.from(mUpToothValues || []).map(tooth => tooth.value || ''),
                        ...Array.from(mDownToothValues || []).map(tooth => tooth.value || '')
                    ];
                    toggleOpacityPi(mAllTooth, [...mUpToothValues, ...mDownToothValues], "전부");
                    break;
                case "downTooth":
                    selectedTeethValues = Array.from(mDownToothValues || []).map(tooth => tooth.value || '');
                    toggleOpacityPi(mDownTooth, mDownToothValues, "하악");
                    break;
                case "upToothY":
                    selectedTeethValues = Array.from(mYUpToothValues || []).map(tooth => tooth.value || '');
                    toggleOpacityPi(mUpToothY, mYUpToothValues, "유치상악");
                    break;
                case "allToothY":
                    selectedTeethValues = [
                        ...Array.from(mYUpToothValues || []).map(tooth => tooth.value || ''),
                        ...Array.from(mYDownToothValues || []).map(tooth => tooth.value || '')
                    ];
                    toggleOpacityPi(mAllToothY, [...mYUpToothValues, ...mYDownToothValues], "유치전부");
                    break;
                case "downToothY":
                    selectedTeethValues = Array.from(mYDownToothValues || []).map(tooth => tooth.value || '');
                    toggleOpacityPi(mDownToothY, mYDownToothValues, "유치하악");
                    break;
                default:
                    console.error("올바르지 않은 ID:", id);
                    return;
            }

            // 선택 상태 업데이트
            if (isSelected) {
                window.toothList = window.toothList.filter(tooth => !selectedTeethValues.includes(tooth));
            } else {
                selectedTeethValues.forEach(tooth => {
                    if (!window.toothList.includes(tooth)) {
                        window.toothList.push(tooth);
                    }
                });
            }

            // 버튼 스타일 업데이트
            updateToothButtonStyles(window.toothList);
        }

        function toggleOpacityPi(button, elements, logMessage) {
            button.classList.toggle("opacity-50");
            elements.forEach(element => element.classList.toggle("opacity-50"));
        }


        // 증상 체크박스 클릭
        function handleSymptomClick(e) {
            if (e.target.tagName === "INPUT") {
                const symptomValue = e.target.value;

                // 증상 리스트에 추가하거나 제거
                if (symptomList.includes(symptomValue)) {
                    symptomList = symptomList.filter(symptom => symptom !== symptomValue);
                } else {
                    symptomList.push(symptomValue);
                }
            }
        }

        function toothValueResetPi() {
            allToothLists.forEach(button => button.classList.remove("opacity-50"));
            toothList = [];
            symptomList = [];
            memo.value = ''; // 메모 초기화
        }

        function resetCheckboxes() {
            const checkboxes = document.querySelectorAll('.form-check-input');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;  // Uncheck all checkboxes
            });
        }

        function resetFormFields() {
            cnumGlobal = null;
            const piCheckDoc = document.getElementById('piCheckDoc');
            if (piCheckDoc) {
                piCheckDoc.selectedIndex = 0;
                if (!piCheckDoc.value) {
                    piCheckDoc.selectedIndex = 1;
                }
            }
            const mdTime = document.getElementById('mdTime');
            if (mdTime) {
                const today = new Date().toISOString().split("T")[0];
                mdTime.value = today;
            }

            const memo = document.querySelector('.memo');
            if (memo) {
                memo.value = '';
            }

            window.toothList = [];

            if (typeof resetCheckboxes === 'function') {
                resetCheckboxes();
            }

            if (typeof toothValueResetPi === 'function') {
                toothValueResetPi();
            }
        }



        function updateTextarea() {
            const memoTextarea = document.getElementById('pi-textarea');
            const checkboxes = document.querySelectorAll('.form-check-input');
            const selectedValues = [];

            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    selectedValues.push(checkbox.value);
                }
            });

            memoTextarea.value = selectedValues.join(', ');
        }

        function saveMedicalPiChart() {
            let patientInfos = JSON.parse(sessionStorage.getItem('selectedPatient')) || {};

            const mdTime = document.getElementById('mdTime').value;
            const piCheckDoc = document.getElementById('piCheckDoc').value;
            const memoContent = memo.value;
            const paName = patientInfos.name || '';
            const chartNum = patientInfos.chartNum || '';
            const cnum = cnumGlobal;

            let updatedToothList = [...window.toothList];

            // 모든 필드가 입력되었는지 확인
            if (!mdTime) {
                alert("진료 날짜를 선택해주세요.");
                return;
            }
            if (!piCheckDoc) {
                alert("진료의를 선택해주세요.");
                return;
            }
            if (updatedToothList.length === 0) {
                alert("치식을 선택해주세요.");
                return;
            }
            if (!memoContent) {
                alert("PI 내역을 입력해주세요.");
                return;
            }

            toothList.forEach(tooth => {
                if (!updatedToothList.includes(tooth)) {
                    updatedToothList.push(tooth);
                }
            });

            const medicalChartData = {
                cnum: cnum,
                mdTime: mdTime,
                checkDoc: piCheckDoc,
                teethNum: updatedToothList.join(', '),
                medicalContent: memoContent,
                medicalDivision: "PI",
                chartNum: chartNum,
                paName: paName
            };

            fetch('/medical_chart/savePiChart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(medicalChartData),
            })
                .then(response => {
                    if (response.ok) {
                        alert(cnum ? '수정되었습니다.' : '저장되었습니다.');
                        resetFormFields();
                        searchList();
                    } else {
                        alert('저장 실패.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('저장 중 오류가 발생했습니다.');
                });
        }


        return { init, cleanup, resetFormFields };
    })();
}
