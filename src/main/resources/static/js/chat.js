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
let currentRoomId = null;
let loggedInUserId = null;
let stompClient;
let selectedRooms = [];

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
            globalUserData = response.data; // 응답 데이터를 globalUserData에 할당
            loggedInUserId = globalUserData.username || globalUserData.mid; // mid 또는 username 사용
            console.log('로그인된 사용자 ID:', loggedInUserId);
        })
        .catch(error => {
            console.error('Error fetching user session:', error);
            alert("사용자 세션 정보를 불러오지 못했습니다. 다시 로그인해 주세요.");
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


// 채팅방 목록 렌더링 (최근 메시지 표시)
function renderChatRooms() {
    roomList.innerHTML = '';
    chatRooms.forEach(room => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'chat-room-item', 'd-flex', 'justify-content-between', 'align-items-center');

        // 채팅방 이름 표시
        const roomName = document.createElement('span');
        roomName.textContent = room.roomName;

        // 삭제를 위한 체크박스 추가
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('room-checkbox', 'me-2'); // 오른쪽에 약간의 여백 추가
        checkbox.setAttribute('data-room-id', room.id);

        // 최근 메시지 표시
        const recentMessage = document.createElement('span');
        recentMessage.classList.add('recent-message', 'text-muted', 'small');
        recentMessage.textContent = room.lastMessage ? room.lastMessage.content : '메시지가 없습니다.';

        // 체크박스, 채팅방 이름, 최근 메시지를 li에 추가
        li.appendChild(checkbox);
        li.appendChild(roomName);
        li.appendChild(recentMessage);

        // 클릭 시 채팅방 열기
        li.addEventListener('click', (event) => {
            if (event.target !== checkbox) { // 체크박스 클릭 시에는 열리지 않도록
                openChatRoom(room.id);
            }
        });

        roomList.appendChild(li);
    });
}

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

createChatRoomBtn.addEventListener('click', () => {
    console.log("createChatRoomBtn 클릭됨 - loadUsers 호출");
    loadUsers();
});

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

document.addEventListener('DOMContentLoaded', () => {
    const deleteChatRoomsBtn = document.getElementById('deleteChatRoomsBtn');

    if (deleteChatRoomsBtn) {
        deleteChatRoomsBtn.addEventListener('click', () => {
            const selectedRooms = Array.from(document.querySelectorAll('.room-checkbox:checked')).map(cb => cb.getAttribute('data-room-id'));

            if (selectedRooms.length === 0) {
                alert("삭제할 채팅방을 선택하세요.");
                return;
            }

            if (confirm("선택한 채팅방을 삭제하시겠습니까?")) {
                deleteSelectedRooms(selectedRooms);
            }
        });
    } else {
        console.error("삭제 버튼을 찾을 수 없습니다.");
    }
});

// 선택된 채팅방을 삭제하는 함수
function deleteSelectedRooms(selectedRooms) {
    selectedRooms.forEach(roomId => {
        axios.delete(`/api/chat/rooms/${roomId}`)
            .then(response => {
                console.log('채팅방이 삭제되었습니다.');
                loadChatRooms();
            })
            .catch(error => {
                console.error(`채팅방 ${roomId} 삭제 실패:`, error);
            });
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

// 방 생성 버튼 클릭 시 선택된 사용자 정보 활용
startChatBtn.addEventListener('click', () => {
    console.log("selectedUser:", selectedUser);
    console.log("loggedInUserId:", loggedInUserId);

    // 선택한 사용자 확인
    if (!selectedUser || !loggedInUserId) {
        alert('메시지를 보낼 사용자를 선택하세요.');
        return;
    }

    const roomName = `${selectedUser.name}와의 1:1 채팅`;
    const recipientId = selectedUser.mid;

    console.log("방 생성 요청:", roomName, recipientId, loggedInUserId);

    axios.post('/api/chat/rooms', {
        roomName: roomName,
        memberMids: [loggedInUserId, recipientId],
        recipientId: recipientId  // 수신자를 명확히 설정
    })
        .then(response => {
            const newRoom = response.data;
            chatRooms.push(newRoom); // 방 목록에 새로 생성된 방 추가
            renderChatRooms();
            openChatRoom(newRoom.id); // 생성한 방 열기
            // userSelectionModal 닫기 (선택한 사용자 정보 유지)
            const userSelectionModal = bootstrap.Modal.getInstance(document.getElementById('userSelectionModal'));
            userSelectionModal.hide();
        })
        .catch(error => {
            console.error('채팅방 생성 실패:', error);
        });
});

// 채팅방 열기
function openChatRoom(roomId) {
    // 이전 recipientId 초기화
    recipientId = null;

    // 현재 열리는 방의 ID 설정
    currentRoomId = roomId;
    const room = chatRooms.find(r => r.id === roomId);
    chatModalLabel.textContent = room.roomName;

    // 새로운 recipientId 설정
    if (room.recipientId) {
        recipientId = room.recipientId;
    } else if (selectedUser) {
        recipientId = selectedUser.mid; // 기본값으로 selectedUser를 사용
    } else {
        console.error("수신자 ID를 설정할 수 없습니다.");
        alert("수신자를 선택하세요.");
        return;
    }

    console.log("열린 채팅방 수신자 ID:", recipientId);

    // 채팅 메시지 가져오기
    axios.get(`/api/chat/rooms/${roomId}/messages`)
        .then(response => {
            renderMessages(response.data);
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

// 메시지 전송 버튼 클릭 이벤트 수정
sendMessageButton.addEventListener('click', () => {
    const message = messageInput.value.trim();

    if (!message || !currentRoomId || !recipientId) {
        alert('메시지를 보내기 전에 사용자를 선택하세요.');
        return;
    }

    axios.post(`/api/chat/rooms/${currentRoomId}/messages`, {
        content: message,
        senderId: loggedInUserId,
        recipientId: recipientId
    })
        .then(response => {
            const newMessage = response.data;
            addMessageToChat(newMessage);
            messageInput.value = '';
        })
        .catch(error => {
            console.error('메시지 전송 실패:', error);
        });
});















