// HTML 요소들 가져오기
const chatButton = document.getElementById('chatButton');
const chatPanel = document.getElementById('chatPanel');
const roomList = document.getElementById('roomList');
const messageList = document.getElementById('messageList');
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessageButton');
const chatModalLabel = document.getElementById('chatModalLabel');

let currentRoomId = null;
let ws = null;

// 채팅 패널 슬라이드 토글
chatButton.addEventListener('click', () => {
    chatPanel.classList.toggle('open');
});

// 새로운 WebSocket 연결 생성
function connectWebSocket(roomId) {
    if (ws) {
        ws.close(); // 기존 연결이 있다면 닫기
    }

    ws = new WebSocket(`ws://localhost:8080/ws/chat/${roomId}`);

    ws.onopen = () => {
        console.log(`Connected to chat room ${roomId}`);
    };

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        displayMessage(message.sender, message.content);
    };

    ws.onclose = () => {
        console.log(`Disconnected from chat room ${roomId}`);
    };
}

// 메시지 표시
function displayMessage(sender, content) {
    const li = document.createElement('li');
    li.classList.add('message-item');
    li.textContent = `${sender}: ${content}`;
    messageList.appendChild(li);
}

// 메시지 전송
sendMessageButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message && ws) {
        ws.send(JSON.stringify({
            sender: '사용자1', // 사용자 ID 또는 이름
            content: message
        }));
        messageInput.value = ''; // 입력창 초기화
    }
});

// 채팅방 선택 시 WebSocket 연결
function openChatRoom(roomId) {
    currentRoomId = roomId;
    connectWebSocket(roomId);  // WebSocket 연결
    const chatModal = new bootstrap.Modal(document.getElementById('chatModal'));
    chatModal.show();
}