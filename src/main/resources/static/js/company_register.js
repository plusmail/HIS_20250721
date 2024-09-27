//업체 목록 로딩 함수
function loadCompanyList() {
    fetch('/inventory_management/searchCompany?companyName=')  // 검색어를 빈 문자열로 전달해서 전체 목록 조회
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('newCompanyList');
            tbody.innerHTML = '';

            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7">현재 등록된 업체가 없습니다.</td></tr>';
            } else {
                data.forEach(company => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                            <td>${company.companyCode}</td>
                            <td>${company.companyName}</td>
                            <td>${company.companyNumber}</td>
                            <td>${company.managerName}</td>
                            <td>${company.managerNumber}</td>
                            <td>${company.companyMemo}</td>
                        `;
                    tbody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error("회사 목록을 불러오는 중 오류 발생:", error);
        });
}

loadCompanyList();


// 업체 등록 버튼 클릭 시 데이터 전송
document.getElementById('addCompanyBtn').addEventListener('click', (event) => {
    event.preventDefault();  // 기본 submit 동작 방지
    event.stopPropagation();

    const companyData = {
        companyCode: document.getElementById('fourCompanyCode').value,
        companyName: document.getElementById('fourCompanyName').value,
        businessNumber: document.getElementById('businessNumber').value,
        companyNumber: document.getElementById('companyNumber').value,
        managerName: document.getElementById('managerName').value,
        managerNumber: document.getElementById('managerNumber').value,
        companyMemo: document.getElementById('companyMemo').value
    };

    fetch('/inventory_management/addCompany', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(companyData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);  // 서버 응답 확인

            if (data.success) {
                alert("업체가 저장되었습니다.");

                // 폼 리셋
                document.getElementById('companyForm').reset();

                // 전체 데이터 다시 불러오기
                loadCompanyList();
            } else {
                alert(data.message || "업체 등록에 실패했습니다.");  // 서버에서 전달된 메시지 출력
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert(`서버와의 통신 중 오류가 발생했습니다. 상세 내용: ${error.message}`);
        });
});


// 업체 검색 함수
function fourSearch() {
    const companyName = document.getElementById('fourCompanyNameSearch').value;

    fetch(`/inventory_management/searchCompany?companyName=${encodeURIComponent(companyName)}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('newCompanyList');
            tbody.innerHTML = ''; // 기존 행 제거

            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7">현재 등록된 업체가 없습니다.</td></tr>';
            } else {
                data.forEach(company => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                            <td>${company.companyCode}</td>
                            <td>${company.companyName}</td>
                            <td>${company.companyNumber}</td>
                            <td>${company.managerName}</td>
                            <td>${company.managerNumber}</td>
                            <td>${company.companyMemo}</td>
                        `;
                    tbody.appendChild(row);
                });
            }
        });
}





