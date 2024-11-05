if (!window.MedicalChartCCModule) {
    window.MedicalChartCCModule = (() => {
        let toothList = [];
        let symptomList = [];
        let listIndex = 0;

        let tooth, symptom, memo, saveCc, UpTooth, DownTooth, AllTooth, UpToothY, DownToothY, AllToothY;
        let UpToothValues, DownToothValues, YUpToothValues, YDownToothValues, modalData, allToothLists;

        // 초기화 함수
        function init() {
            tooth = document.querySelector(".tooth-container");
            symptom = document.querySelector(".cc-symptom");
            memo = document.querySelector(".ccMemo");
            saveCc = document.querySelector(".save-cc");
            UpTooth = document.querySelector(".up-control");
            DownTooth = document.querySelector(".down-control");
            AllTooth = document.querySelector(".all-control");
            UpToothY = document.querySelector(".y-up-control");
            DownToothY = document.querySelector(".y-down-control");
            AllToothY = document.querySelector(".y-all-control");

            UpToothValues = document.querySelectorAll(".up-tooth");
            DownToothValues = document.querySelectorAll(".down-tooth");
            YUpToothValues = document.querySelectorAll(".y-up-tooth");
            YDownToothValues = document.querySelectorAll(".y-down-tooth");
            modalData = document.querySelectorAll(".modal-tr");
            allToothLists = tooth.querySelectorAll('button');

            setupEventListeners();
        }

        // 주요 요소 이벤트 리스너 등록
        function setupEventListeners() {
            tooth.addEventListener("click", handleToothClickCc);
            symptom.addEventListener("dblclick", handleSymptomClickCc);

            // 저장 버튼 클릭 이벤트 리스너 추가
            saveCc.addEventListener('click', saveMedicalCcChart);
        }

        // 모듈 초기화 및 정리
        function cleanUp() {
            tooth.removeEventListener("click", handleToothClickCc);
            symptom.removeEventListener("click", handleSymptomClickCc);

            toothList = [];
            symptomList = [];
            listIndex = 0;
        }

        // 치아 버튼 클릭시 호출
        function handleToothClickCc(e) {
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
            } else if (e.target.tagName === "BUTTON") {
                toothTerminalCc(e.target.id);
            }
        }

        function toothTerminalCc(id) {
            toothList = [];

            switch (id) {
                case "upTooth":
                    UpToothValues.forEach(upToothValue => {
                        if (!isNaN(upToothValue.value)) {
                            toothList.push(upToothValue.value);
                        }
                    });
                    toggleOpacityCc(UpTooth, UpToothValues, "상악");
                    break;

                case "allTooth":
                    UpToothValues.forEach(upToothValue => {
                        if (!isNaN(upToothValue.value)) {
                            toothList.push(upToothValue.value);
                        }
                    });
                    DownToothValues.forEach(downToothValue => {
                        if (!isNaN(downToothValue.value)) {
                            toothList.push(downToothValue.value);
                        }
                    });
                    toggleOpacityCc(AllTooth, [...UpToothValues, ...DownToothValues], "전부");
                    break;

                case "downTooth":
                    DownToothValues.forEach(downToothValue => {
                        if (!isNaN(downToothValue.value)) {
                            toothList.push(downToothValue.value);
                        }
                    });
                    toggleOpacityCc(DownTooth, DownToothValues, "하악");
                    break;

                case "upToothY":
                    YUpToothValues.forEach(yUpToothValue => {
                        if (!isNaN(yUpToothValue.value)) {
                            toothList.push(yUpToothValue.value);
                        }
                    });
                    toggleOpacityCc(UpToothY, YUpToothValues, "유치상악");
                    break;

                case "allToothY":
                    YUpToothValues.forEach(yUpToothValue => {
                        if (!isNaN(yUpToothValue.value)) {
                            toothList.push(yUpToothValue.value);
                        }
                    });
                    YDownToothValues.forEach(yDownToothValue => {
                        if (!isNaN(yDownToothValue.value)) {
                            toothList.push(yDownToothValue.value);
                        }
                    });
                    toggleOpacityCc(AllToothY, [...YUpToothValues, ...YDownToothValues], "유치전부");
                    break;

                case "downToothY":
                    YDownToothValues.forEach(yDownToothValue => {
                        if (!isNaN(yDownToothValue.value)) {
                            toothList.push(yDownToothValue.value);
                        }
                    });
                    toggleOpacityCc(DownToothY, YDownToothValues, "유치하악");
                    break;

                default:
                    alert("올바르지 않은 버튼을 선택하였습니다.");
                    break;
            }
        }

        function toggleOpacityCc(button, elements, logMessage) {
            button.classList.toggle("opacity-50");
            elements.forEach(element => element.classList.toggle("opacity-50"));
        }

        // 증상 항목 클릭 시 메모에 추가하는 함수
        function handleSymptomClickCc(e) {
            if (e.target.tagName === "TD") {
                const symptomText = e.target.textContent.trim();

                // 메모에 해당 항목이 없을 경우 추가
                if (!memo.value.includes(symptomText)) {
                    memo.value += `${symptomText}\n`;
                }
            }
        }

        // 모든 치아와 증상 선택을 초기 상태로 돌림
        function toothValueResetCc() {
            allToothLists.forEach(button => button.classList.remove("opacity-50"));
            toothList = [];
            symptomList = [];
            memo.value = ''; // 메모 초기화
        }

        function saveMedicalCcChart() {
            let patientInfos = JSON.parse(sessionStorage.getItem('selectedPatient')) || {};

            const mdTime = document.getElementById('mdTime').value;
            const ccCheckDoc = document.getElementById('ccCheckDoc').value;

            const memoContent = memo.value;
            const paName = patientInfos.name || '';
            const chartNum = patientInfos.chartNum || '';

            const medicalChartData = {
                mdTime: mdTime,
                checkDoc: ccCheckDoc,
                teethNum: toothList.join(', '),
                medicalContent: memoContent,
                medicalDivision: "CC",
                chartNum: chartNum,
                paName: paName
            };

            fetch('/medical_chart/saveCcChart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(medicalChartData),
            })
                .then(response => {
                    if (response.ok) {
                        alert('저장되었습니다.');
                        toothValueResetCc();
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

        return { init, cleanUp };
    })();
}
