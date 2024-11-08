if (!window.MedicalChartPIModule) {
    window.MedicalChartPIModule = (() => {
        let toothList = [];
        let symptomList = [];
        let listIndex = 0;

        let tooth, symptom, memo, savePi, mUpTooth, mDownTooth, mAllTooth, mUpToothY, mDownToothY, mAllToothY;
        let mUpToothValues, mDownToothValues, mYUpToothValues, mYDownToothValues, modalData, allToothLists;

        // 초기화 함수
        function init() {
            tooth = document.querySelector(".tooth-container");
            symptom = document.querySelector(".pi-symptom");
            memo = document.querySelector(".memo");
            savePi = document.querySelector(".save-pi");
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
        }

        // 주요 요소 이벤트 리스너 등록
        function setupEventListeners() {
            tooth.addEventListener("click", handleToothClick);
            symptom.addEventListener("click", handleSymptomClick);

            // 체크박스에 이벤트 리스너 추가
            const checkboxes = document.querySelectorAll('.form-check-input');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', updateTextarea);
            });

            // 저장 버튼 클릭 이벤트 리스너 추가
            savePi.addEventListener('click', saveMedicalPiChart);
        }

        // 모듈 초기화 및 정리
        function cleanup() {
            tooth.removeEventListener("click", handleToothClick);
            symptom.removeEventListener("click", handleSymptomClick);

            toothList = [];
            symptomList = [];
            listIndex = 0;
        }

        // 치아 버튼 클릭시 호출
        function handleToothClick(e) {
            modalToothList = [];
            modalToothList.push(e.target.value);
            if (e.target.tagName === "BUTTON" && e.target.id === '') {
                const toothValue = e.target.value;

                // 치아 리스트에 추가하거나 제거
                if (toothList.includes(toothValue)) {
                    toothList = toothList.filter(tooth => tooth !== toothValue);
                } else {
                    toothList.push(toothValue);
                }

                // 버튼의 스타일을 업데이트
                e.target.classList.toggle("opacity-50");
            }else if (e.target.tagName === "BUTTON") {
                toothTerminal(e.target.id);
            }
        }
        function toothTerminal(id) {
            toothList = [];

            switch (id) {
                case "upTooth":
                    mUpToothValues.forEach(upToothValue => {
                        if (!isNaN(upToothValue.value)) {
                            toothList.push(upToothValue.value);
                        }
                    });
                    toggleOpacity(mUpTooth, mUpToothValues, "상악");
                    break;

                case "allTooth":
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

                case "downTooth":
                    mDownToothValues.forEach(downToothValue => {
                        if (!isNaN(downToothValue.value)) {
                            toothList.push(downToothValue.value);
                        }
                    });
                    toggleOpacity(mDownTooth, mDownToothValues, "하악");
                    break;

                case "upToothY":
                    mYUpToothValues.forEach(yUpToothValue => {
                        if (!isNaN(yUpToothValue.value)) {
                            toothList.push(yUpToothValue.value);
                        }
                    });
                    toggleOpacity(mUpToothY, mYUpToothValues, "유치상악");
                    break;

                case "allToothY":
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

                case "downToothY":
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
        }

        function toggleOpacity(button, elements, logMessage) {
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

        // 모든 치아와 증상 선택을 초기 상태로 돌림
        function toothValueReset() {
            allToothLists.forEach(button => button.classList.remove("opacity-50"));
            toothList = [];
            symptomList = [];
            memo.value = ''; // 메모 초기화
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

            const medicalChartData = {
                mdTime: mdTime,
                checkDoc: piCheckDoc,
                teethNum: toothList.join(', '),
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
                        alert('저장되었습니다.');
                        toothValueReset();
                        readPaChart();
                    } else {
                        alert('저장 실패.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('저장 중 오류가 발생했습니다.');
                });
        }


        return { init, cleanup };
    })();
}
