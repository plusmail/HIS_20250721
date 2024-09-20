document.addEventListener('DOMContentLoaded', () => {
    // DB에서 저장된 회사 목록을 불러오는 함수
    function loadCompanyList() {
        fetch('/inventory_management/search?companyName=')  // 검색어를 빈 문자열로 전달해서 전체 목록 조회
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

    // 검색 함수
    function fourSearch() {
        const companyName = document.getElementById('fourCompanyNameSearch').value;

        fetch(`/inventory_management/search?companyName=${encodeURIComponent(companyName)}`)
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

    // 추가 버튼 클릭 시 데이터 전송
    document.getElementById('addCompanyBtn').addEventListener('click', (event) => {
        event.preventDefault();  // 기본 submit 동작 방지
        const companyData = {
            companyCode: document.getElementById('fourCompanyCode').value,
            companyName: document.getElementById('fourCompanyName').value,
            businessNumber: document.getElementById('businessNumber').value,
            companyNumber: document.getElementById('companyNumber').value,
            managerName: document.getElementById('managerName').value,
            managerNumber: document.getElementById('managerNumber').value,
            companyMemo: document.getElementById('companyMemo').value
        };

        fetch('/inventory_management/add', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(companyData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("업체가 저장되었습니다.");

                    // 폼 리셋
                    document.getElementById('companyForm').reset();

                    // 테이블 전체 다시 검색하여 업데이트
                    loadCompanyList();  // 전체 데이터 다시 불러오기
                } else {
                    alert(data.message);  // 중복된 경우 메시지 출력
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
    });

    // 페이지가 처음 로딩될 때 회사 목록을 자동으로 불러오기
    loadCompanyList();
});


// 테이블 업데이트 함수 (저장된 업체 리스트를 다시 불러와서 테이블에 표시)
function updateCompanyList() {
    fetch('/inventory_management/search?companyName=')  // companyName 파라미터를 빈 문자열로 전달
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('newCompanyList');
            tbody.innerHTML = ''; // 기존 테이블 내용 비우기

            // 데이터가 배열인지 확인하고, 역순으로 정렬
            const companies = Array.isArray(data) ? data.reverse() : data.companies.reverse();

            if (companies && companies.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7">현재 등록된 업체가 없습니다.</td></tr>';
            } else {
                companies.forEach(company => {
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
            console.error("Error fetching company list:", error);
        });
}

updateCompanyList();



