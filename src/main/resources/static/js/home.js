
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
const socket = new SockJS("/ws");

document.addEventListener("DOMContentLoaded", function () {
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, function(frame) {
        console.log('WebSocket 연결됨:', frame);

        // 환자 수 업데이트 메시지 구독
        stompClient.subscribe('/topic/patientUpdates', function (message) {
            const datas = JSON.parse(message.body);
            console.log("환자 업데이트 데이터:", datas);
            updatePatientStatus(datas);
        });

        // 환자 수 메시지 구독
        stompClient.subscribe('/topic/patientCounts', function (message) {
            console.log("수신된 원본 메시지:", message.body);
            try {
                const counts = JSON.parse(message.body);
                console.log("업데이트된 환자 수:", counts);
                updatePatientCounts(counts);
            } catch (error) {
                console.error('메시지 파싱 오류:', error);
            }
        });

        // 환자 상태 가져오기
        fetchPatientStatus();
        requestPatientCounts();

    }, function(error) {
        console.error('WebSocket 연결 오류:', error);
    });
});

// 환자 상태 업데이트 함수
function updatePatientStatus(datas) {
    if (datas.status1 !== undefined) {
        document.getElementById('home-waitingCount').textContent = datas.status1;
    }
    if (datas.status2 !== undefined) {
        document.getElementById('home-inTreatmentCount').textContent = datas.status2;
    }
    if (datas.status3 !== undefined) {
        document.getElementById('home-completedCount').textContent = datas.status3;
    }
}

// 환자 상태 가져오기
function fetchPatientStatus() {
    fetch("/api/patient-admission/status")
        .then(response => {
            if (!response.ok) {
                throw new Error('네트워크 응답이 좋지 않습니다');
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                updatePatientStatus(data);
            }
        })
        .catch(error => console.error('환자 상태 가져오기 오류:', error));
}

// 환자 수 요청 함수
function requestPatientCounts() {
    fetch('/api/patient-status')
        .then(response => {
            if (!response.ok) {
                throw new Error('네트워크 응답이 좋지 않습니다');
            }
            return response.json();
        })
        .then(data => {
            console.log('환자---- 수:', data);
            updatePatientCounts(data);
        })
        .catch(error => {
            console.error('가져오기 오류:', error);
        });
}

// 진료 접수 페이지로 이동
// 환자 수 업데이트를 위한 함수
function updatePatientCounts(counts) {
    console.log("updatePa----->", counts)
    console.log("updatePa----->", counts.homeGeneralPatientCount)
    const generalCount = counts.homeGeneralPatientCount !== undefined ? counts.homeGeneralPatientCount : 0;
    const surgeryCount = counts.homeSurgeryCount !== undefined ? counts.homeSurgeryCount : 0;
    const newCount = counts.homeNewPatientCount !== undefined ? counts.homeNewPatientCount : 0;

    document.getElementById('homeGeneralPatientCount').textContent = generalCount;
    document.getElementById('homeSurgeryCount').textContent = surgeryCount;
    document.getElementById('homeNewPatientCount').textContent = newCount;
}

// 진료 접수 페이지로 이동
function goToReception() {
    window.location.href = "/reception";
}

// 예약 페이지로 이동
function goToReservation() {
    window.location.href = "/reservation";
}


