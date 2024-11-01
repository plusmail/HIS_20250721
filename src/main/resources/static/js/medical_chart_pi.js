if (!window.MedicalChartModule) {
    window.MedicalChartModule = (() => {
        let toothList = [];
        let symptomList = [];
        let memoList = [];
        let frequentlyUsedPhrases = [];
        let listIndex = 0;

        let tooth, symptom, memo, saveMemo, upTooth, downTooth, allTooth, upToothY, downToothY, allToothY;
        let upToothValues, downToothValues, yUpToothValues, yDownToothValues, modalData, allToothLists, allsymptomLists;

        // 초기화 함수
        function init() {
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

            setupEventListeners();
        }

        //주요 요소 이벤트 리스너 등록
        function setupEventListeners() {
            tooth.addEventListener("click", handleToothClick);
            symptom.addEventListener("click", handleSymptomClick);
            saveMemo.addEventListener("click", handleSaveMemo);
            modalData.forEach(row => row.addEventListener('click', handleModalRowClick));
        }

        //모든 이벤트 리스너 제거 및 초기화
        function cleanup() {
            tooth.removeEventListener("click", handleToothClick);
            symptom.removeEventListener("click", handleSymptomClick);
            saveMemo.removeEventListener("click", handleSaveMemo);
            modalData.forEach(row => row.removeEventListener('click', handleModalRowClick));

            toothList = [];
            symptomList = [];
            memoList = [];
            frequentlyUsedPhrases = [];
            listIndex = 0;
        }

        //치아 버튼 클릭시 호출
        //선택치아 표시 -> opacity 50 추가 or 제거
        function handleToothClick(e) {
            toothList = [e.target.value];
            if (e.target.tagName === "BUTTON" && !e.target.id) {
                e.target.classList.toggle("opacity-50");
                masterToSubList(0, toothList, listIndex, e.target.classList.contains("opacity-50"));
            } else if (e.target.tagName === "BUTTON") {
                toothTerminal(e.target.id);
            }
        }

        //증상 체크박스 클릭
        //체크 상태를 서버에 전송하기 위해 masterToSubList를 호출
        function handleSymptomClick(e) {
            if (e.target.tagName === "INPUT") {
                symptomList = [e.target.value];
                masterToSubList(1, symptomList, listIndex, e.target.checked);
            }
        }

        //메모 서버에 전송
        function handleSaveMemo() {
            memoList = [memo.value];
            masterToSubList(2, memoList, listIndex, true);
            memo.value = '';
            listIndex++;
            toothValueReset();
        }

        //모달 내 특정 행 클릭시 호출
        function handleModalRowClick() {
            this.classList.toggle("selected-row");
            let cellContent = this.querySelectorAll("td")[1].textContent;
            if (this.classList.contains("selected-row")) {
                frequentlyUsedPhrases.push(cellContent);
            } else {
                frequentlyUsedPhrases = frequentlyUsedPhrases.filter(item => item !== cellContent);
            }
        }

        //모든 치아와 증상 선택을 초기 상태로 돌림
        function toothValueReset() {
            allToothLists.forEach(button => button.classList.remove("opacity-50"));
            allsymptomLists.forEach(input => input.checked = false);
        }

        //각종 데이터를 서버에 전송(JSON 형식인지 검증)
        //서버에 전송한 이후 fetchSessionItems를 호출해 화면을 갱신시킴
        function masterToSubList(subListIndex, newValue, listIndex, trueFalse) {
            fetch('/medical_chart/addDelete-to-subList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    subListIndex: subListIndex,
                    newValues: newValue,
                    listIndex: listIndex,
                    addOrDelete: trueFalse
                })
            })
                .then(response => response.text())
                .then(responseText => {
                    try {
                        const jsonResponse = JSON.parse(responseText);
                        console.log("JSON response:", jsonResponse);
                        return jsonResponse;
                    } catch (error) {
                        console.log("Non-JSON response:", responseText);
                        return responseText;
                    }
                })
                .then(() => {
                    fetchSessionItems(); // 변경된 세션 데이터를 가져와 화면에 갱신
                })
                .catch(error => console.error('Failed to add to sublist:', error));
        }

        return { init, cleanup };
    })();
}
