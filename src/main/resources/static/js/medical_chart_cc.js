if (!window.MedicalChartCCModule) {
    window.MedicalChartCCModule = (() => {
        let toothList = [];
        let listIndex = 0;

        let tooth, symptom, memo, saveCc, resetCc, UpTooth, DownTooth, AllTooth, UpToothY, DownToothY, AllToothY;
        let UpToothValues, DownToothValues, YUpToothValues, YDownToothValues, allToothLists;

        // 초기화 함수
        function init() {
            tooth = document.querySelector(".tooth-container");
            symptom = document.querySelector(".cc-symptom");
            memo = document.querySelector(".ccMemo");
            saveCc = document.querySelector(".save-cc");
            resetCc = document.querySelector(".reset-cc");
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
            allToothLists = tooth.querySelectorAll('button');

            setupEventListeners();

            updateToothButtonStyles(window.toothList || []);

            // 날짜를 오늘 날짜로 설정
            const mdTime = document.getElementById("mdTime");
            const today = new Date().toISOString().split("T")[0];
            mdTime.value = today;

            // 주치의 목록에서 첫 번째 항목이 선택되도록 설정
            const ccCheckDoc = document.getElementById("ccCheckDoc");
            if (!ccCheckDoc.value) {
                ccCheckDoc.selectedIndex = 1;
            }
        }

        // 주요 요소 이벤트 리스너 등록
        function setupEventListeners() {
            tooth.addEventListener("click", handleToothClickCc);
            symptom.addEventListener("dblclick", handleSymptomClickCc);

            saveCc.addEventListener('click', saveMedicalCcChart);
            resetCc.addEventListener('click', resetFormFields);
        }

        function cleanUp() {
            tooth.removeEventListener("click", handleToothClickCc);
            symptom.removeEventListener("click", handleSymptomClickCc);

            toothList = [];
            listIndex = 0;
        }

        // 치아 선택
        function handleToothClickCc(e) {
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
                // 잘못된 ID를 처리하지 않도록 검증
                if (document.getElementById(e.target.id)) {
                    toothTerminalCc(e.target.id);
                } else {
                    console.warn("유효하지 않은 버튼 ID:", e.target.id);
                }
            }
        }

// 치아 영역 선택
        function toothTerminalCc(id) {
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
                    selectedTeethValues = Array.from(UpToothValues || []).map(tooth => tooth.value || '');
                    toggleOpacityCc(UpTooth, UpToothValues, "상악");
                    break;
                case "allTooth":
                    selectedTeethValues = [
                        ...Array.from(UpToothValues || []).map(tooth => tooth.value || ''),
                        ...Array.from(DownToothValues || []).map(tooth => tooth.value || '')
                    ];
                    toggleOpacityCc(AllTooth, [...UpToothValues, ...DownToothValues], "전부");
                    break;
                case "downTooth":
                    selectedTeethValues = Array.from(DownToothValues || []).map(tooth => tooth.value || '');
                    toggleOpacityCc(DownTooth, DownToothValues, "하악");
                    break;
                case "upToothY":
                    selectedTeethValues = Array.from(YUpToothValues || []).map(tooth => tooth.value || '');
                    toggleOpacityCc(UpToothY, YUpToothValues, "유치상악");
                    break;
                case "allToothY":
                    selectedTeethValues = [
                        ...Array.from(YUpToothValues || []).map(tooth => tooth.value || ''),
                        ...Array.from(YDownToothValues || []).map(tooth => tooth.value || '')
                    ];
                    toggleOpacityCc(AllToothY, [...YUpToothValues, ...YDownToothValues], "유치전부");
                    break;
                case "downToothY":
                    selectedTeethValues = Array.from(YDownToothValues || []).map(tooth => tooth.value || '');
                    toggleOpacityCc(DownToothY, YDownToothValues, "유치하악");
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




        function toggleOpacityCc(button, elements, logMessage) {
            button.classList.toggle("opacity-50");
            elements.forEach(element => element.classList.toggle("opacity-50"));
        }

        function handleSymptomClickCc(e) {
            if (e.target.tagName === "TD") {
                const symptomText = e.target.textContent.trim();

                if (!memo.value.includes(symptomText)) {
                    memo.value += `${symptomText}\n`;
                }
            }
        }

        // 모든 치아와 증상 선택을 초기 상태로 돌림
        function toothValueResetCc() {
            allToothLists.forEach(button => button.classList.remove("opacity-50"));
            toothList = [];
            memo.value = ''; // 메모 초기화
        }

        function resetFormFields() {
            cnumGlogal = null;

            const ccCheckDoc = document.getElementById("ccCheckDoc");
            if (ccCheckDoc) {
                ccCheckDoc.selectedIndex = 0;
            }

            const today = new Date().toISOString().split("T")[0];
            const mdTime = document.getElementById("mdTime");
            if (mdTime) {
                mdTime.value = today;
            }
            const memo = document.querySelector(".ccMemo");
            if (memo) {
                memo.value = '';
            }
            window.toothList = [];
            toothValueResetCc();
        }


        function saveMedicalCcChart() {
            let patientInfos = JSON.parse(sessionStorage.getItem('selectedPatient')) || {};

            const mdTime = document.getElementById('mdTime').value;
            const ccCheckDoc = document.getElementById('ccCheckDoc').value;
            const memoContent = memo.value;
            const paName = patientInfos.name || '';
            const chartNum = patientInfos.chartNum || '';
            const cnum = cnumGlogal;


            let updatedToothList = [...window.toothList];

            toothList.forEach(tooth => {
                if (!updatedToothList.includes(tooth)) {
                    updatedToothList.push(tooth);
                }
            });

            const medicalChartData = {
                cnum: cnum,
                mdTime: mdTime,
                checkDoc: ccCheckDoc,
                teethNum: updatedToothList.join(', '),
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
                        alert(cnum ? '수정되었습니다.' : '저장되었습니다.');
                        resetFormFields();
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

        return { init, cleanUp, resetFormFields };
    })();
}
