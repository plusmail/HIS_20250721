//재료 목록 로딩 함수
function loadMaterialList() {
    fetch('/inventory_management/searchMaterial?materialName=')  // 검색어를 빈 문자열로 전달해서 전체 목록 조회
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('newMaterialList');
            tbody.innerHTML = '';

            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7">현재 등록된 재료가 없습니다.</td></tr>';
            } else {
                data.forEach(material => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                            <td>${material.companyCode}</td>
                            <td>${material.companyName}</td>
                            <td>${material.materialCode}</td>
                            <td>${material.managerName}</td>
                            <td>${material.materialUnit}</td>
                            <td>${material.materialUnitPrice}</td>
                            <td>${material.minQuantity}</td>
                            <td>${material.stockManagementItem}</td>
                        `;
                    tbody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error("회사 목록을 불러오는 중 오류 발생:", error);
        });
}

loadMaterialList();


// 업체 등록 버튼 클릭 시 데이터 전송
document.getElementById('addMaterialBtn').addEventListener('click', (event) => {
    event.preventDefault();  // 기본 submit 동작 방지
    event.stopPropagation();

    const materialData = {
        companyCode: document.getElementById('threeCompanyCode').value,
        companyName: document.getElementById('threeCompanyName').value,
        materialName: document.getElementById('threeMaterialName').value,
        materialCode: document.getElementById('threeMaterialCode').value,
        materialUnit: document.getElementById('materialUnit').value,
        materialUnitPrice: document.getElementById('materialUnitPrice').value,
        minQuantity: document.getElementById('minQuantity').value,
        stockManagementItem: document.getElementById('threeStockManagementItem').value
    };

    fetch('/inventory_management/addMaterial', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(materialData)
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
                alert("재료가 저장되었습니다.");

                // 폼 리셋
                document.getElementById('materialForm').reset();

                // 전체 데이터 다시 불러오기
                loadMaterialList();
            } else {
                alert(data.message || "재료 등록에 실패했습니다.");  // 서버에서 전달된 메시지 출력
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert(`서버와의 통신 중 오류가 발생했습니다. 상세 내용: ${error.message}`);
        });
});


// 재료 검색 함수
function threeSearch() {
    const materialName = document.getElementById('threeMaterialNameSearch').value;

    fetch(`/inventory_management/searchMaterial?materialName=${encodeURIComponent(materialName)}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('newMaterialList');
            tbody.innerHTML = ''; // 기존 행 제거

            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7">현재 등록된 재료가 없습니다.</td></tr>';
            } else {
                data.forEach(material => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                            <td>${material.companyCode}</td>
                            <td>${material.companyName}</td>
                            <td>${material.materialCode}</td>
                            <td>${material.managerName}</td>
                            <td>${material.materialUnit}</td>
                            <td>${material.materialUnitPrice}</td>
                            <td>${material.minQuantity}</td>
                            <td>${material.stockManagementItem}</td>
                      
                        `;
                    tbody.appendChild(row);
                });
            }
        });
}





