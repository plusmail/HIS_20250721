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

let selectedUser = null;
let currentUser = {};  // 실제 사용자 정보 초기 설정
let chatRooms = [];
let currentRoomId = null;

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
    fetchCurrentUser();  // 로그인한 사용자 설정
    loadChatRooms();     // 채팅방 목록 로드
});

// 채팅 버튼 클릭 시 패널 열기/닫기
chatButton.addEventListener('click', () => {
    chatPanel.classList.toggle('open');
});

// 채팅방 목록 불러오기
function loadChatRooms() {
    axios.get('/api/chat/rooms')
        .then(response => {
            const rooms = response.data;
            chatRooms = rooms;  // 서버에서 받은 채팅방 목록 저장
            renderChatRooms(rooms);  // 채팅방 목록 렌더링
        })
        .catch(error => {
            console.error('채팅방 목록 불러오기 실패:', error);
        });
}

// 사용자 선택 모달이 열릴 때 사용자 목록 로드
createChatRoomBtn.addEventListener('click', () => {
    loadUsers();
});

// 사용자 목록 로드
function loadUsers() {
    axios.get('/api/chat/member/list')
        .then(response => {
            const users = response.data;
            renderUserList(users);
        })
        .catch(error => {
            console.error('사용자 목록 불러오기 실패:', error);
        });
}

// 사용자 목록 렌더링
function renderUserList(users) {
    userList.innerHTML = '';
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
    selectedUser = user;
    userList.querySelectorAll('li').forEach(li => li.classList.remove('active'));
    listItem.classList.add('active');
}

// 채팅방 생성 요청
startChatBtn.addEventListener('click', () => {
    if (!selectedUser) {
        alert('메시지를 보내기 전에 사용자를 선택해주세요.');
        return;
    }

    const roomName = `${selectedUser.name}와의 1:1 채팅`;

    axios.post('/api/chat/rooms', {
        roomName: roomName,
        memberMids: [selectedUser.mid]
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

// 채팅방 목록 렌더링
function renderChatRooms() {
    roomList.innerHTML = '';
    chatRooms.forEach(room => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = room.roomName;
        li.addEventListener('click', () => {
            if (!room.memberMids || room.memberMids.length === 0) {
                alert('채팅방에 사용자가 없습니다.');
                return;
            }

            openChatRoom(room.id);

            const recipientId = room.memberMids.find(mid => mid !== currentUser.mid);
            if (!recipientId) {
                alert('해당 방에 유효한 상대방이 없습니다.');
                return;
            }
            selectedUser = { mid: recipientId };
        });
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
        })
        .catch(error => {
            console.error('메시지 불러오기 실패:', error);
        });

    const chatModal = new bootstrap.Modal(document.getElementById('chatModal'));
    chatModal.show();
}

// 메시지 렌더링
function renderMessages(messages) {
    messageList.innerHTML = '';  // 기존 메시지 비우기
    messages.forEach(message => {
        addMessageToChat(message);
    });
}

// 메시지 추가 함수
function addMessageToChat(message) {
    const li = document.createElement('li');
    li.classList.add('message-item');

    // 현재 사용자의 ID와 비교해 메시지 보낸 사람이 상대방인지 확인
    if (message.senderId !== currentUser.mid) {
        li.classList.add('left'); // 상대방 메시지 스타일
        li.textContent = `${message.senderName}: ${message.content}`; // 상대방 이름과 메시지 표시
    } else {
        li.classList.add('right'); // 내 메시지 스타일
        li.textContent = `${message.content}`; // 내 메시지는 내용만 표시
    }

    messageList.appendChild(li);
    messageList.scrollTop = messageList.scrollHeight;  // 자동 스크롤
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
        senderId: currentUser.mid,
        recipientId: selectedUser.mid
    })
        .then(response => {
            const newMessage = response.data;
            addMessageToChat(newMessage);  // 새 메시지를 추가
            messageInput.value = '';
            console.log("메시지 전송 성공:", response.data);
        })
        .catch(error => {
            console.error('메시지 전송 실패:', error);
        });
});
