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
let chatRooms = [];
let currentRoomId = null;
let loggedInUserId = null;


// WebSocket 설정 및 연결
document.addEventListener('DOMContentLoaded', () => {
    // 중복 방지를 위해 한 번만 초기화
    if (!socket && !stompClient) {
        socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, function (frame) {
            console.log('Connected to server:', frame);

            // 현재 열려 있는 채팅방의 메시지를 수신하고 목록을 업데이트
            stompClient.subscribe(`/topic/rooms/${currentRoomId}`, function (message) {
                const newMessage = JSON.parse(message.body);
                addMessageToChat(newMessage); // 새로운 메시지를 채팅 UI에 추가
                loadChatRooms(); // 채팅방 목록을 업데이트하여 최신 메시지 표시
            });
        });
    }

    // 사용자 정보 가져오기 및 채팅방 목록 초기화
    fetchCurrentUser();
    loadChatRooms();
});

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


// 채팅방 목록 렌더링 함수 (수정된 부분)
function renderChatRooms() {
    roomList.innerHTML = '';
    chatRooms.forEach(room => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'chat-room-item');

        // 채팅방 제목과 최근 메시지 컨테이너
        const titleContainer = document.createElement('div');
        titleContainer.classList.add('room-title-container');

        const title = document.createElement('span');
        title.classList.add('room-title');
        title.textContent = room.roomName;

        const recentMessage = document.createElement('span');
        recentMessage.classList.add('recent-message');
        recentMessage.textContent = room.lastMessage ? room.lastMessage.content : '메시지가 없습니다.';

        // 제목과 최근 메시지를 컨테이너에 추가
        titleContainer.appendChild(title);
        titleContainer.appendChild(recentMessage);
        li.appendChild(titleContainer);

        // 체크박스 추가
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('room-checkbox');
        checkbox.dataset.roomId = room.id;
        li.prepend(checkbox);

        // 클릭 이벤트
        li.addEventListener('click', () => openChatRoom(room.id));
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

// 메시지 추가 함수
function addMessageToChat(message) {
    const li = document.createElement('li');

    // 보낸 사람과 로그인한 사용자를 비교하여 위치와 스타일 설정
    if (message.senderId === loggedInUserId) {
        li.classList.add('message-item', 'right-message');
    } else {
        li.classList.add('message-item', 'left-message');
    }

    // 메시지 내용 설정
    li.textContent = message.content;

    // 메시지 목록에 추가
    messageList.appendChild(li);
    messageList.scrollTop = messageList.scrollHeight; // 스크롤을 맨 아래로
}



// 메시지 전송 버튼 클릭 이벤트
sendMessageButton.addEventListener('click', () => {
    const message = messageInput.value.trim();

    if (!message || !currentRoomId || !recipientId) {
        alert('메시지를 보내기 전에 사용자를 선택하세요.');
        return;
    }

    const newMessage = {
        content: message,
        senderId: loggedInUserId,
        recipientId: recipientId,
        timestamp: new Date().toISOString()
    };

    // WebSocket을 통해 서버로 메시지 전송
    stompClient.send(`/app/chat/${currentRoomId}`, {}, JSON.stringify(newMessage));

    // UI에 메시지 추가
    addMessageToChat(newMessage);
    messageInput.value = '';
});


















