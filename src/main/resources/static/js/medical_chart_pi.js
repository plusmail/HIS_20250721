if (!window.MedicalChartModule) {
    window.MedicalChartModule = (() => {
        let toothList = [];
        let symptomList = [];
        let memoList = [];
        let frequentlyUsedPhrases = [];
        let listIndex = 0;

        let tooth, symptom, memo, savePi, upTooth, downTooth, allTooth, upToothY, downToothY, allToothY;
        let upToothValues, downToothValues, yUpToothValues, yDownToothValues, modalData, allToothLists, allsymptomLists;

        // 초기화 함수
        function init() {
            tooth = document.querySelector(".tooth-container");
            symptom = document.querySelector(".pi-symptom");
            memo = document.querySelector(".memo");
            savePi = document.querySelector(".save-pi");
            upTooth = document.querySelector(".up-control");
            downTooth = document.querySelector(".down-control");
            allTooth = document.querySelector(".all-control");
            upToothY = document.querySelector(".y-up-control");
            downToothY = document.querySelector(".y-down-control");
            allToothY = document.querySelector(".y-all-control");

            upToothValues = document.querySelectorAll(".up-tooth");
            downToothValues = document.querySelectorAll(".down-tooth");
            yUpToothValues = document.querySelectorAll(".y-up-tooth");
            yDownToothValues = document.querySelectorAll(".y-down-tooth");
            modalData = document.querySelectorAll(".modal-tr");

            allToothLists = tooth.querySelectorAll('button');
            allsymptomLists = symptom.querySelectorAll('input');

            setupEventListeners();
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
            memoList = [];
            frequentlyUsedPhrases = [];
            listIndex = 0;
        }

        // 치아 버튼 클릭시 호출
        function handleToothClick(e) {
            if (e.target.tagName === "BUTTON") {
                const toothValue = e.target.value;

                // 치아 리스트에 추가하거나 제거
                if (toothList.includes(toothValue)) {
                    toothList = toothList.filter(tooth => tooth !== toothValue);
                } else {
                    toothList.push(toothValue);
                }

                // 버튼의 스타일을 업데이트
                e.target.classList.toggle("opacity-50");
            }
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
            allsymptomLists.forEach(input => input.checked = false);
            toothList = [];
            symptomList = [];
            memo.value = ''; // 메모 초기화
        }

        function updateTextarea() {
            const memoTextarea = document.getElementById('memo-textarea');
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
            const checkDoc = document.getElementById('checkDoc').value;
            console.log('주치의 확인11111111:', checkDoc);

            const memoContent = memo.value;
            const paName = patientInfos.name || '';
            const chartNum = patientInfos.chartNum || '';

            const medicalChartData = {
                mdTime: mdTime,
                checkDoc: checkDoc,
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
                        toothValueReset();
                        alert('저장되었습니다.');
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
