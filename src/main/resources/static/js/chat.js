// HTML 요소들 가져오기
const chatButton = document.getElementById('chatButton');
const chatPanel = document.getElementById('chatPanel');
const chatModalEl = document.getElementById('chatModal');
const createChatRoomBtn = document.getElementById('createChatRoomBtn');
const roomList = document.getElementById('roomList');
const userList = document.getElementById('userList');
const startChatBtn = document.getElementById('startChatBtn');
const chatModalLabel = document.getElementById('chatModalLabel');
const messageList = document.getElementById('messageList');
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessageButton');

let selectedUser = null;
let currentUser = {};
let chatRooms = [];
let currentRoomId = null;

// 버튼 클릭 시 채팅 패널 표시/숨기기
chatButton.addEventListener('click', () => {
    chatPanel.classList.toggle('open');
});

// 서버에서 로그인된 사용자 정보 가져오기
function fetchCurrentUser() {
    axios.get('/api/chat/auth/currentUser')
        .then(response => {
            currentUser = response.data;
            console.log("현재 사용자 정보:", currentUser);
        })
        .catch(error => {
            console.error("현재 사용자 정보 불러오기 실패:", error);
        });
}

// 페이지가 로드되면 서버에서 현재 사용자와 채팅방 목록 불러오기
document.addEventListener('DOMContentLoaded', function () {
    fetchCurrentUser();
    loadChatRooms();
});

// 채팅방 목록 불러오기
function loadChatRooms() {
    axios.get('/api/chat/rooms')
        .then(response => {
            const rooms = response.data;
            chatRooms = rooms;
            renderChatRooms(rooms);
        })
        .catch(error => {
            console.error('채팅방 목록 불러오기 실패:', error);
        });
}

// 채팅방 목록 렌더링
function renderChatRooms() {
    roomList.innerHTML = '';
    chatRooms.forEach(room => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'chat-room-item');
        li.setAttribute('data-room-id', room.id);
        li.textContent = room.roomName;

        const recentMessage = document.createElement('span');
        recentMessage.classList.add('recent-message');
        recentMessage.textContent = room.messages && room.messages.length > 0
            ? room.messages[room.messages.length - 1].content
            : '메시지가 없습니다.';

        li.appendChild(recentMessage);

        li.addEventListener('click', () => openChatRoom(room.id));
        roomList.appendChild(li);
    });
}

// 채팅방을 클릭하여 모달 열기
function openChatRoom(roomId) {
    currentRoomId = roomId;
    const room = chatRooms.find(r => r.id === roomId);
    chatModalLabel.textContent = room.roomName;

    axios.get(`/api/chat/rooms/${roomId}/messages`)
        .then(response => {
            renderMessages(response.data);

            // 중앙에 위치한 채팅 모달 열기 (data-bs-toggle 활용)
            const chatModalTrigger = document.createElement('button');
            chatModalTrigger.setAttribute('data-bs-toggle', 'modal');
            chatModalTrigger.setAttribute('data-bs-target', '#chatModal');
            chatModalTrigger.style.display = 'none';
            document.body.appendChild(chatModalTrigger);
            chatModalTrigger.click();
            document.body.removeChild(chatModalTrigger);
        })
        .catch(error => {
            console.error('메시지 불러오기 실패:', error);
        });
}


// 메시지 렌더링
function renderMessages(messages) {
    messageList.innerHTML = '';
    messages.forEach(message => addMessageToChat(message));
}

// 메시지 추가 함수
function addMessageToChat(message) {
    const li = document.createElement('li');
    li.classList.add('message-item', message.senderId === currentUser.mid ? 'right' : 'left');
    li.textContent = message.senderId !== currentUser.mid
        ? `${message.senderName}: ${message.content}`
        : message.content;
    messageList.appendChild(li);
    messageList.scrollTop = messageList.scrollHeight;
}

// 메시지 전송
sendMessageButton.addEventListener('click', () => {
    const message = messageInput.value.trim();

    if (!message || !currentRoomId) {
        alert('메시지를 보내기 전에 채팅방을 선택하세요.');
        return;
    }

    axios.post(`/api/chat/rooms/${currentRoomId}/messages`, {
        content: message,
        senderId: currentUser.mid
    })
        .then(response => {
            addMessageToChat(response.data);
            messageInput.value = '';
        })
        .catch(error => {
            console.error('메시지 전송 실패:', error);
        });
});
