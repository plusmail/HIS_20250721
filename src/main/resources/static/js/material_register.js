document.addEventListener('DOMContentLoaded', () => {
    // DB에서 저장된 회사 목록을 불러오는 함수
    function searchMaterialCompany() {
        fetch('/inventory_management/search?materialName=')  // 검색어를 빈 문자열로 전달해서 전체 목록 조회
            .then(response => response.json())
            .then(data => {
                const tbody = document.getElementById('newCompanyList');
                tbody.innerHTML = '';

                if (data.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="7">현재 등록된 재료가 없습니다.</td></tr>';
                } else {
                    data.forEach(material => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                    <td>${material.materialCode}</td>
                    <td>${material.materialName}</td>
                    <td>${material.materialUnit}</td>
                    <td>${material.materialUnitPrice}</td>
                    <td>${material.minQuantity}</td>
                    <td>${material.stockManagementItem ? '예' : '아니오'}</td>
                    <td>${material.companyName}</td>
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

// 재료 등록 이벤트 핸들러
    document.getElementById('addMaterialBtn').addEventListener('click', (event) => {
        event.preventDefault();  // 기본 submit 동작 방지

        const materialData = {
            companyName: document.getElementById('threeCompanyName').value,
            companyCode: document.getElementById('threeCompanyCode').value,
            materialName: document.getElementById('threeMaterialName').value,
            materialCode: document.getElementById('threeMaterialCode').value,
            materialUnit: document.getElementById('materialUnit').value,
            materialUnitPrice: document.getElementById('materialUnitPrice').value,
            minQuantity: document.getElementById('minQuantity').value,
            stockManagementItem: document.getElementById('threeStockManagementItem').value
        };

        fetch('/inventory_management/material/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(materialData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('재료가 저장되었습니다.');
                    // form 입력값 리셋
                    document.getElementById('materialform').reset();  // 입력 폼 리셋 (올바르게 선택)
                    searchMaterialCompany();  // 저장 후 테이블 업데이트
                } else {
                    alert(data.message);  // 오류 메시지 출력
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        searchMaterialCompany();
    });

// 검색된 재료 목록 업데이트
    function updateMaterialList() {
        fetch('/inventory_management/material/search')
            .then(response => response.json())
            .then(data => {
                const tbody = document.getElementById('materialCompanyList');
                tbody.innerHTML = '';  // 테이블 초기화

                const materials = Array.isArray(data) ? data.reverse() : data.materials.reverse();

                if (materials && materials.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="7">현재 등록된 업체가 없습니다.</td></tr>';
                } else {
                    materials.forEach(material => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                    <td>${material.materialCode}</td>
                    <td>${material.materialName}</td>
                    <td>${material.materialUnit}</td>
                    <td>${material.materialUnitPrice}</td>
                    <td>${material.minQuantity}</td>
                    <td>${material.stockManagementItem ? '예' : '아니오'}</td>
                    <td>${material.companyName}</td>
                `;
                        tbody.appendChild(row);
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching material list:', error);
            });
    }
    updateMaterialList();
})
