// HTML 요소들 가져오기
const chatButton = document.getElementById('chatButton');
const chatPanel = document.getElementById('chatPanel');
const createRoomBtn = document.getElementById('createRoomBtn');
const roomList = document.getElementById('roomList');
const userList = document.getElementById('userList');
const startChatBtn = document.getElementById('startChatBtn');
const chatModalLabel = document.getElementById('chatModalLabel');
const messageList = document.getElementById('messageList');
const messageInput = document.getElementById('messageInput');
const sendMessageButton = document.getElementById('sendMessageButton');

let selectedUser = null;  // 선택된 사용자
let chatRooms = [];
let currentRoomId = null;

// 채팅 버튼 클릭 시 패널 열기/닫기
chatButton.addEventListener('click', () => {
    chatPanel.classList.toggle('open');
});

// 사용자 선택 모달에서 사용자 목록 로드
function loadUsers() {
    const users = [
        { id: 'user1', name: '사용자1' },
        { id: 'user2', name: '사용자2' },
        { id: 'user3', name: '사용자3' }
    ];
    renderUserList(users);
}

// 사용자 목록 렌더링
function renderUserList(users) {
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = user.name;
        li.addEventListener('click', () => selectUser(user));
        userList.appendChild(li);
    });
}

// 사용자 선택
function selectUser(user) {
    selectedUser = user;
    userList.querySelectorAll('li').forEach(li => li.classList.remove('active'));
    event.target.classList.add('active');
}

// 채팅방 생성
startChatBtn.addEventListener('click', () => {
    if (!selectedUser) {
        alert('사용자를 선택하세요.');
        return;
    }

    const roomName = `${selectedUser.name}와의 1:1 채팅`;
    const roomId = `room-${chatRooms.length + 1}`;

    chatRooms.push({
        id: roomId,
        name: roomName,
        users: [selectedUser],
        messages: []
    });

    renderChatRooms();
    selectedUser = null;

    const userSelectionModal = bootstrap.Modal.getInstance(document.getElementById('userSelectionModal'));
    userSelectionModal.hide();
});

// 채팅방 목록 렌더링
function renderChatRooms() {
    roomList.innerHTML = '';
    chatRooms.forEach(room => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = room.name;
        li.addEventListener('click', () => openChatRoom(room.id));
        roomList.appendChild(li);
    });
}

// 채팅방 열기
function openChatRoom(roomId) {
    currentRoomId = roomId;
    const room = chatRooms.find(r => r.id === roomId);
    chatModalLabel.textContent = room.name;
    renderMessages(room.messages);

    const chatModal = new bootstrap.Modal(document.getElementById('chatModal'));
    chatModal.show();
}

// 메시지 렌더링
function renderMessages(messages) {
    messageList.innerHTML = '';
    messages.forEach(message => {
        const li = document.createElement('li');
        li.classList.add('message-item');
        li.textContent = message;
        messageList.appendChild(li);
    });
}

// 메시지 전송
sendMessageButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (!message || !currentRoomId) return;

    const room = chatRooms.find(r => r.id === currentRoomId);
    room.messages.push(message);
    renderMessages(room.messages);
    messageInput.value = '';
});
