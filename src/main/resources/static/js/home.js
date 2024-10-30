
// 최소보관수량 미달 품목 리스트 로딩
$.ajax({
    type: 'GET',
    url: '/home/low-stock-items',
    success: function (data) {
        const lowStockList = $('#lowStockList');
        lowStockList.empty(); // 기존 내용을 지움

        if (data.length === 0) {
            lowStockList.append('<tr><td colspan="3">최소보관수량 미달품목이 없습니다.</td></tr>');
        } else {
            data.forEach(item => {
                const row = `
                        <tr>
                            <td>${item.materialName}</td>
                            <td>${item.materialCode}</td>
                            <td>${item.remainingStock}</td>
                        </tr>
                    `;
                lowStockList.append(row);
            });
        }
    },
    error: function (xhr, status, error) {
        console.error('Error fetching low stock items:', error);
    }
});


function goToMaterialManagementPage() {
    window.location.href = '/inventory_management';
}


// WebSocket을 위한 전역 변수 설정
const socket = new SockJS("http://localhost:8080/ws");

document.addEventListener("DOMContentLoaded", function () {
    const stompClient = Stomp.over(socket);

    fetchPatientStatus();

    stompClient.connect({}, function(frame) {
        console.log('WebSocket connected:', frame);

        // 환자 수 업데이트 메시지 구독
        stompClient.subscribe('/topic/patientUpdates', function (message) {
            console.log("11111111111111111111")
            const datas = JSON.parse(message.body);
            console.log(datas);
            const { status, count } = datas;

            // 상태 및 카운트를 출력하여 확인
            console.log(`Status: ${status}, Count: ${count}`);
            if(datas.status1 !== undefined){
                document.getElementById('home-waitingCount').textContent = datas.status1;
            }
            if(datas.status2 !== undefined){
                document.getElementById('home-inTreatmentCount').textContent = datas.status2;
            }
            if(datas.status3 !== undefined){
                document.getElementById('home-completedCount').textContent = datas.status3;
            }
            console.warn(`Unknown status: ${datas}`);

        });
    }, function(error) {
        console.error('WebSocket connection error:', error);
    });
});

function fetchPatientStatus() {
    fetch("/api/patient-admission/status") // API 엔드포인트를 호출
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // 초기 환자 상태 업데이트
            if (data) {
                document.getElementById('home-waitingCount').textContent = data.status1;
                document.getElementById('home-inTreatmentCount').textContent = data.status2;
                document.getElementById('home-completedCount').textContent = data.status3;
            }
        })
        .catch(error => console.error('Error fetching patient status:', error));
}


// 페이지 로드 시 호출
function goToReception() {
    window.location.href = "http://localhost:8080/reception";
}






