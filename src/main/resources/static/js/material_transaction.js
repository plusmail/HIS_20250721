function populateTransactionForm(transaction) {
    document.getElementById('transactionDate').value = transaction.transactionDate;
    document.getElementById('twoCompanyCode').readOnly = true;
    document.getElementById('twoCompanyCode').readOnly = true;
    document.getElementById('twoMaterialName').readOnly = true;
    document.getElementById('twoMaterialCode').readOnly = true;
    document.getElementById('stockIn').value = transaction.stockIn;
    document.getElementById('stockOut').value = transaction.stockOut;
}

document.getElementById('saveTransaction').addEventListener('click', (event) => {
    event.preventDefault();

    const transactionDate = document.getElementById('transactionDate').value;
    let url, method;

    if (transactionDate) {
        url = `/transaction_management/updateTransaction`;
        method = "PUT";
    } else {
        url = `/transaction_management/addTransaction`;
        method = "POST";
    }

    const transactionData = {
        transactionDate: document.getElementById('transactionDate').value,
        companyName: document.getElementById('twoCompanyName').value,
        materialName: document.getElementById('twoMaterialName').value,
        materialCode: document.getElementById('twoMaterialCode').value,
        stockIn: parseInt(document.getElementById('stockIn').value, 10),
        stockOut: parseInt(document.getElementById('stockOut').value, 10),
        managerNumber: document.getElementById('managerNumber').value,
    };

    fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(transactionData)
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            loadTransactionList();
        })
        .catch(error => {
            alert(`오류 발생: ${error.message}`);
        });
});

function loadTransactionList() {
    fetch('/transaction_management/searchTransaction')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('transactionList');
            tbody.innerHTML = '';

            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7">현재 등록된 출납 내역이 없습니다.</td></tr>';
            } else {
                data.forEach(transaction => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${transaction.transactionDate}</td>
                        <td>${transaction.companyName}</td>
                        <td>${transaction.materialName}</td>
                        <td>${transaction.materialCode}</td>
                        <td>${transaction.stockIn}</td>
                        <td>${transaction.stockOut}</td>
                        <td>${transaction.managerNumber}</td>
                    `;
                    row.addEventListener('dblclick', () => populateTransactionForm(transaction));
                    tbody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error("출납 내역을 불러오는 중 오류 발생:", error);
        });
}

document.getElementById('deleteTransactionBtn').addEventListener('click', () => {
    const transactionDate = document.getElementById('transactionDate').value;

    if (confirm("이 출납 내역을 삭제하시겠습니까?")) {
        fetch(`/transaction_management/deleteTransaction?transactionDate=${encodeURIComponent(transactionDate)}`, {
            method: "DELETE"
        })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                resetTransactionForm();
                loadTransactionList();
            })
            .catch(error => {
                alert(`삭제 중 오류 발생: ${error.message}`);
            });
    }
});


function twoSearch() {
    const materialName = document.getElementById('twoMaterialNameSearch').value;
    const materialCode = document.getElementById('twoMaterialCodeSearch').value;

    let url = `/transaction_management/searchTransaction?`;
    if (materialName) url += `materialName=${encodeURIComponent(materialName)}&`;
    if (materialCode) url += `materialCode=${encodeURIComponent(materialCode)}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('transactionList');
            tbody.innerHTML = '';

            if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7">등록된 출납 내역이 없습니다.</td></tr>';
            } else {
                data.forEach(transaction => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${transaction.transactionDate}</td>
                        <td>${transaction.companyName}</td>
                        <td>${transaction.materialName}</td>
                        <td>${transaction.materialCode}</td>
                        <td>${transaction.stockIn}</td>
                        <td>${transaction.stockOut}</td>
                        <td>${transaction.managerNumber}</td>
                    `;
                    tbody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error("검색 중 오류 발생:", error);
        });
}
