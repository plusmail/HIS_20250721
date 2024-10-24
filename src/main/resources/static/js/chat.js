// HTML 요소들 가져오기
const chatButton = document.getElementById('chatButton');
const chatPanel = document.getElementById('chatPanel');
const createChatRoomBtn = document.getElementById('createChatRoomBtn');
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

document.addEventListener('DOMContentLoaded', function () {
    const createRoomBtn = document.getElementById('createChatRoomBtn');

    // 사용자 선택 모달이 열릴 때 사용자 목록 로드 (서버에서 axios 사용)
    if (createRoomBtn) {
        createRoomBtn.addEventListener('click', () => {
            loadUsers();  // 채팅방 생성 모달이 열릴 때 사용자 목록 로드
        });
    } else {
        console.error('createChatRoomBtn 요소를 찾을 수 없습니다.');
    }
});

// 사용자 선택 모달에서 사용자 목록 로드 (서버에서 axios 사용)
function loadUsers() {
    axios.get('/member/list')  // 서버로부터 사용자 목록 가져오기
        .then(response => {
            const users = response.data;  // 받은 데이터를 저장
            renderUserList(users);  // 사용자 목록 렌더링
        })
        .catch(error => {
            console.error('사용자 목록 불러오기 실패:', error);
        });
}
// 사용자 목록 렌더링
function renderUserList(users) {
    userList.innerHTML = '';  // 기존 목록 비우기
    users.forEach(user => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = user.name;  // 사용자 이름 출력
        li.addEventListener('click', () => selectUser(user, li));  // 사용자 선택 시 해당 요소 강조
        userList.appendChild(li);
    });
}

// 사용자 선택
function selectUser(user, listItem) {
    selectedUser = user;
    userList.querySelectorAll('li').forEach(li => li.classList.remove('active'));  // 모든 요소에서 active 제거
    listItem.classList.add('active');  // 선택된 사용자에 active 클래스 추가
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

    renderChatRooms();  // 채팅방 목록 업데이트
    selectedUser = null;

    // 사용자 선택 모달 닫기
    const userSelectionModal = bootstrap.Modal.getInstance(document.getElementById('userSelectionModal'));
    userSelectionModal.hide();
});

// 채팅방 목록 렌더링
function renderChatRooms() {
    roomList.innerHTML = '';  // 기존 목록 비우기
    chatRooms.forEach(room => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = room.name;
        li.addEventListener('click', () => openChatRoom(room.id));  // 클릭하면 채팅방 열기
        roomList.appendChild(li);
    });
}

// 채팅방 열기
function openChatRoom(roomId) {
    currentRoomId = roomId;
    const room = chatRooms.find(r => r.id === roomId);
    chatModalLabel.textContent = room.name;  // 모달 제목을 채팅방 이름으로 설정
    renderMessages(room.messages);  // 메시지 렌더링

    const chatModal = new bootstrap.Modal(document.getElementById('chatModal'));
    chatModal.show();
}

// 메시지 렌더링
function renderMessages(messages) {
    messageList.innerHTML = '';  // 기존 메시지 비우기
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
    room.messages.push(message);  // 메시지 추가
    renderMessages(room.messages);
    messageInput.value = '';  // 입력창 비우기
});

