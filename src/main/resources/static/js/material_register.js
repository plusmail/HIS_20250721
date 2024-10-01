function populateMaterialForm(material) {
    document.getElementById('threeMaterialCode').value = material.materialCode;
    document.getElementById('threeMaterialName').value = material.materialName;
    document.getElementById('materialUnit').value = material.materialUnit;
    document.getElementById('materialUnitPrice').value = material.materialUnitPrice;
    document.getElementById('minQuantity').value = material.minQuantity;

    // 재고관리여부 설정
    const stockManagementItemElement = document.getElementById('threeStockManagementItem');
    if(material.stockManagementItem === true){
        stockManagementItemElement.selectedIndex = 1;
    }else{
        stockManagementItemElement.selectedIndex = 2;
    }

    document.getElementById('threeCompanyName').value = material.companyName;
    document.getElementById('threeCompanyCode').value = material.companyCode;
}


// 재료 목록 로딩 함수
function loadMaterialList() {
    fetch('/inventory_management/searchMaterial?materialName=')  // 검색어를 빈 문자열로 전달해서 전체 목록 조회
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('materialCompanyList');
            tbody.innerHTML = '';

            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7">현재 등록된 재료가 없습니다.</td></tr>';
            } else {
                data.forEach(material => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${material.companyName}</td>
                        <td>${material.companyCode}</td> 
                        <td>${material.materialName}</td>
                        <td>${material.materialCode}</td>
                        <td>${material.materialUnit}</td>
                        <td>${material.materialUnitPrice}</td>
                        <td>${material.minQuantity}</td>
                        <td>${material.stockManagementItem ? "예" : "아니오"}</td>
                      
                    `;
                    row.addEventListener('dblclick', () => populateMaterialForm(material));
                    tbody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error("재료 목록을 불러오는 중 오류 발생:", error);
        });
}

// 페이지 로드 시 재료 목록을 불러오는 함수 호출
loadMaterialList(); // 추가



// 업체 등록 버튼 클릭 시 데이터 전송
document.getElementById('addMaterialBtn').addEventListener('click', (event) => {
    event.preventDefault();  // 기본 submit 동작 방지
    event.stopPropagation();

    const stockManagementItemValue = document.getElementById('threeStockManagementItem').value;
    const stockManagementItem = stockManagementItemValue === 'y'; // 'y'는 true, 'n'은 false로 변환
    const materialData = {
        materialCode: document.getElementById('threeMaterialCode').value,
        materialName: document.getElementById('threeMaterialName').value,
        materialUnit: document.getElementById('materialUnit').value,
        materialUnitPrice: document.getElementById('materialUnitPrice').value,
        minQuantity: document.getElementById('minQuantity').value,
        stockManagementItem: stockManagementItem,
        companyName: document.getElementById('threeCompanyName').value,
        companyCode: document.getElementById('threeCompanyCode').value// boolean 값으로 변환된 값
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
            const tbody = document.getElementById('materialCompanyList');
            tbody.innerHTML = ''; // 기존 행 제거

            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7">현재 등록된 재료가 없습니다.</td></tr>';
            } else {
                data.forEach(material => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${material.companyName}</td>
                        <td>${material.companyCode}</td>
                        <td>${material.materialName}</td>
                        <td>${material.materialCode}</td>
                        <td>${material.materialUnit}</td>
                        <td>${material.materialUnitPrice}</td>
                        <td>${material.minQuantity}</td>
                        <td>${material.stockManagementItem ? "예" : "아니오"}</td>
                    `;
                    tbody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error("검색 중 오류 발생:", error);
        });
}


// 업체 목록을 더블클릭했을 때 선택된 업체 정보를 input 필드에 채우는 함수
function selectCompany(companyCode, companyName) {
    // 선택한 업체 정보를 input 필드에 채우기
    document.getElementById('threeCompanyCode').value = companyCode;
    document.getElementById('threeCompanyName').value = companyName;

    // 모달 닫기
    const modal = bootstrap.Modal.getInstance(document.getElementById('companyModal'));
    modal.hide();
}

// 서버에서 업체 목록을 불러오는 함수
async function fetchCompanies() {
    try {
        const response = await fetch('/inventory_management/searchCompanies'); // 서버에서 업체 목록을 가져오는 API 호출
        const companies = await response.json();

        const companyList = document.getElementById('companyList');
        companyList.innerHTML = ''; // 기존 목록 초기화

        // 서버에서 받은 업체 데이터를 테이블에 추가
        companies.forEach(company => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${company.companyCode}</td>
                <td>${company.companyName}</td>
                <td>${company.companyNumber}</td>
                <td>${company.managerName}</td>
                <td>${company.managerNumber}</td>
            `;

            // 행을 더블클릭했을 때 업체 선택 함수 호출
            row.addEventListener('dblclick', function() {
                selectCompany(company.companyCode, company.companyName);
            });

            companyList.appendChild(row);
        });
    } catch (error) {
        console.error("재료 목록을 불러오는 중 오류 발생:", error);
    }
}

// 모달이 열릴 때마다 업체 목록을 불러오기
document.getElementById('companyModal').addEventListener('show.bs.modal', fetchCompanies);

// 돋보기 버튼 클릭 시 모달을 띄우는 함수
document.getElementById('companySearchIcon').addEventListener('click', function() {
    const companyModal = new bootstrap.Modal(document.getElementById('companyModal'));
    companyModal.show(); // 모달을 띄우기
});



// 재료 삭제 버튼 클릭 시 데이터 전송
document.getElementById('deleteMaterialBtn').addEventListener('click', function() {
    const materialCode = document.getElementById('threeMaterialCode').value;

    if (confirm("정말로 이 재료를 삭제하시겠습니까?")) {
        fetch(`/inventory_management/deleteMaterial?materialCode=${encodeURIComponent(materialCode)}`, {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                alert(data);  // 서버로부터 삭제 성공 메시지 받음
                // 폼 초기화 및 목록 새로고침
                document.getElementById('materialForm').reset();
                loadMaterialList();
            })
            .catch(error => {
                console.error("삭제 요청 중 오류 발생:", error);
                alert("재료 삭제에 실패했습니다. 다시 시도해주세요.");
            });
    }
});


