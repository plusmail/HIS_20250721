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
// WebSocket 연결 설정
const socket = new SockJS('/ws');

let selectedUser = null;
let currentUser = {};
let chatRooms = [];
let currentUserData = {};
let currentRoomId = null;
let loggedInUserId = null;
let stompClient;

function connectWebSocket(roomId) {
    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function (frame) {
        console.log('Connected to server:', frame);
        stompClient.subscribe(`/user/topic/rooms/${roomId}`, function (message) {
            renderMessages([JSON.parse(message.body)]);
        });
    }, function (error) {
        console.error('WebSocket connection error:', error);
        setTimeout(() => connectWebSocket(roomId), 5000); // 연결 실패 시 재시도
    });
}

chatButton.addEventListener('click', () => {
    const chatPanel = document.getElementById('chatPanel');
    chatPanel.classList.toggle('open');
});

// 현재 사용자 정보 가져오기
function fetchCurrentUser() {
    axios.get('/api/user/session')
        .then(response => {
            currentUserData = response.data;
            loggedInUserId = globalUserData.username || globalUserData.mid; // mid 사용
            console.log('로그인된 사용자 ID:', loggedInUserId);
        })
        .catch(error => {
            console.error('Error fetching user session:', error);
        });
}

// 페이지 로드 시 사용자 정보 가져오기
document.addEventListener('DOMContentLoaded', fetchCurrentUser);

// DOMContentLoaded 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    fetchCurrentUser();
    loadChatRooms();
});

function loadChatRooms() {
    axios.get(window.location.origin + '/api/chat/rooms')
        .then(response => {
            const rooms = response.data;
            chatRooms = rooms;
            renderChatRooms(rooms);
        })
        .catch(error => {
            console.error('채팅방 목록 불러오기 실패:', error);
        });
}


// 채팅방 목록 렌더링 함수
function renderChatRooms() {
    roomList.innerHTML = '';
    chatRooms.forEach(room => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'chat-room-item');
        li.textContent = room.roomName;

        const recentMessage = document.createElement('span');
        recentMessage.classList.add('recent-message');
        recentMessage.textContent = room.lastMessage ? room.lastMessage.content : '메시지가 없습니다.';

        li.appendChild(recentMessage);
        li.addEventListener('click', () => openChatRoom(room.id));
        roomList.appendChild(li);
    });
}

// 채팅방 열기
function openChatRoom(roomId) {
    currentRoomId = roomId;
    const room = chatRooms.find(r => r.id === roomId);
    chatModalLabel.textContent = room.roomName;

    axios.get(`/api/chat/rooms/${roomId}/messages`)
        .then(response => {
            renderMessages(response.data);
            connectWebSocket(roomId); // 채팅방에 맞는 WebSocket 구독

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


// 메시지를 렌더링하는 함수
function renderMessages(messages) {
    messageList.innerHTML = ''; // 기존 메시지 목록 초기화
    messages.forEach(message => addMessageToChat(message));
}

// 개별 메시지를 채팅 목록에 추가하는 함수
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
    if (!message || !currentRoomId || !selectedUser) {
        alert('메시지를 보내기 전에 사용자를 선택하세요.');
        return;
    }

    axios.post(`/api/chat/rooms/${currentRoomId}/messages`, {
        content: message,
        senderId: loggedInUserId,
        recipientId: selectedUser.mid
    })
        .then(response => {
            addMessageToChat(response.data);
            messageInput.value = '';
        })
        .catch(error => {
            console.error('메시지 전송 실패:', error);
        });
});

createChatRoomBtn.addEventListener('click', () => {
    loadUsers();
});

// 사용자 불러오기
function loadUsers() {
    axios.get('/api/chat/member/list')
        .then(response => {
            console.log("사용자 목록:", response.data); // 디버깅 로그 추가
            const users = response.data;
            renderUserList(users);
        })
        .catch(error => {
            console.error('사용자 목록 불러오기 실패:', error);
        });
}

// 사용자 리스트 렌더링
function renderUserList(users) {
    const userList = document.getElementById('userList');
    userList.innerHTML = ''; // 기존 목록 초기화

    users.forEach(user => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = user.name;
        li.addEventListener('click', () => selectUser(user, li));
        userList.appendChild(li);
    });
}

// 사용자 선택 함수
function selectUser(user, listItem) {
    selectedUser = user; // 선택된 사용자 설정
    recipientId = selectedUser.mid; // 선택된 사용자의 ID를 recipientId로 설정
    console.log("선택된 수신자 ID:", recipientId);

    // 선택한 사용자 스타일 업데이트
    userList.querySelectorAll('li').forEach(li => li.classList.remove('active'));
    listItem.classList.add('active');
}

startChatBtn.addEventListener('click', () => {
    console.log("selectedUser:", selectedUser);
    console.log("loggedInUserId:", loggedInUserId);

    if (!selectedUser || !loggedInUserId) {
        alert('사용자를 찾을 수 없습니다.');
        return;
    }

    const roomName = `${selectedUser.name}와의 1:1 채팅`;
    const recipientId = selectedUser.mid;

    console.log("방 생성 요청:", roomName, recipientId, loggedInUserId);

    axios.post('/api/chat/rooms', {
        roomName: roomName,
        memberMids: [loggedInUserId, recipientId],
        recipientId: recipientId
    })
        .then(response => {
            const newRoom = response.data;
            chatRooms.push(newRoom);
            renderChatRooms();
            openChatRoom(newRoom.id);
            selectedUser = null;

            const userSelectionModal = bootstrap.Modal.getInstance(document.getElementById('userSelectionModal'));
            userSelectionModal.hide();
        })
        .catch(error => {
            console.error('채팅방 생성 실패:', error);
        });
});








