if (!window.MedicalChartModule) {
    window.MedicalChartModule = (() => {
        // 내부 변수 (모듈 내에서만 접근 가능)
        let toothList = [];
        let symptomList = [];
        let memoList = [];
        let frequentlyUsedPhrases = [];
        let listIndex = 0;

        // DOM 요소 변수
        let tooth, symptom, memo, saveMemo, upTooth, downTooth, allTooth, upToothY, downToothY, allToothY;
        let upToothValues, downToothValues, yUpToothValues, yDownToothValues, modalData, allToothLists, allsymptomLists;

        // 초기화 함수
        function init() {
            // DOM 요소 선택
            tooth = document.querySelector(".tooth-container");
            symptom = document.querySelector(".pi-symptom");
            memo = document.querySelector(".memo");
            saveMemo = document.querySelector(".save-memo");
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

            // 이벤트 리스너 설정
            setupEventListeners();
        }

        // 이벤트 리스너 설정 함수
        function setupEventListeners() {
            tooth.addEventListener("click", handleToothClick);
            symptom.addEventListener("click", handleSymptomClick);
            saveMemo.addEventListener("click", handleSaveMemo);
            modalData.forEach(row => row.addEventListener('click', handleModalRowClick));
        }

        // 정리 함수 (이벤트 리스너 제거 및 변수 초기화)
        function cleanup() {
            tooth.removeEventListener("click", handleToothClick);
            symptom.removeEventListener("click", handleSymptomClick);
            saveMemo.removeEventListener("click", handleSaveMemo);
            modalData.forEach(row => row.removeEventListener('click', handleModalRowClick));

            // 변수 초기화
            toothList = [];
            symptomList = [];
            memoList = [];
            frequentlyUsedPhrases = [];
            listIndex = 0;
        }

        // 치아 선택 이벤트 핸들러
        function handleToothClick(e) {
            toothList = [];
            toothList.push(e.target.value);
            if (e.target.tagName === "BUTTON" && e.target.id === '') {
                if (e.target.classList.contains("opacity-50")) {
                    masterToSubList(0, toothList, listIndex, false);
                    e.target.classList.remove("opacity-50");
                } else {
                    masterToSubList(0, toothList, listIndex, true);
                    e.target.classList.add("opacity-50");
                }
            } else {
                if (e.target.tagName === "BUTTON") {
                    toothTerminal(e.target.id);
                }
            }
        }

        // 증상 클릭 이벤트 핸들러
        function handleSymptomClick(e) {
            if (e.target.tagName === "INPUT") {
                symptomList = [];
                symptomList.push(e.target.value);
                if (e.target.checked) {
                    masterToSubList(1, symptomList, listIndex, true);
                } else {
                    masterToSubList(1, symptomList, listIndex, false);
                }
            }
        }

        // 메모 저장 클릭 이벤트 핸들러
        function handleSaveMemo(e) {
            if (e.target.tagName === "BUTTON" && memo.tagName === "TEXTAREA") {
                memoList = [];
                memoList.push(memo.value);
            }
            masterToSubList(2, memoList, listIndex, true);
            memo.value = '';

            listIndex++;
            masterToSubList(null, null, listIndex, true);
            toothValueReset();
        }

        // 모달 행 클릭 이벤트 핸들러
        function handleModalRowClick() {
            if (this.classList.contains("selected-row")) {
                this.classList.remove("selected-row");
                this.querySelectorAll(".rowMemo").forEach((cell, index) => {
                    if (index === 1) {
                        frequentlyUsedPhrases = frequentlyUsedPhrases.filter(item => item !== cell.textContent);
                    }
                });
            } else {
                this.classList.add('selected-row');
                this.querySelectorAll("td").forEach((cell, index) => {
                    if (index === 1) {
                        frequentlyUsedPhrases.push(cell.textContent);
                    }
                });
            }
        }

        // 치아 상태 초기화
        function toothValueReset() {
            allToothLists.forEach(allToothList => {
                if (allToothList.classList.contains("opacity-50")) {
                    allToothList.classList.remove("opacity-50");
                }
            });
            allsymptomLists.forEach(allsymptomList => {
                allsymptomList.checked = false;
            });
        }

        // 데이터 전송을 위한 AJAX 함수
        function masterToSubList(subListIndex, newValue, listIndex, trueFalse) {
            $.ajax({
                url: '/medical_chart/addDelete-to-subList',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    subListIndex: subListIndex,
                    newValues: newValue,
                    listIndex: listIndex,
                    addOrDelete: trueFalse
                }),
                success: function () {
                    fetchSessionItems(); // 변경된 세션 데이터를 가져와 화면에 갱신
                },
                error: function (xhr, status, error) {
                    console.error('Failed to add to sublist:', error);
                }
            });
        }

        // 외부에 노출할 메서드
        return {
            init,
            cleanup
        };
    })();

}