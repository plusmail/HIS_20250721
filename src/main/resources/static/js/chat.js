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
const notificationBadge = document.getElementById('notificationBadge');

let selectedUsers = []; // 선택된 사용자 목록을 저장할 배열
let chatRooms = [];
let currentRoomId = null;
let loggedInUserId = null;
let recipientIds = [];


// WebSocket 설정 및 구독
document.addEventListener('DOMContentLoaded', () => {
    window.stompClient.connect({}, function (frame) {
        console.log('Connected to server:', frame);

        // 모든 채팅방의 새로운 메시지 수신
        window.stompClient.subscribe(`/topic/rooms/`, function (message) {
            const newMessage = JSON.parse(message.body);
            console.log("New message received:", newMessage);
            updateChatRoomList(newMessage); // 새로운 메시지로 채팅방 목록 업데이트
        });
    });
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

            // 사용자 목록 로드
            loadUsers();
        })
        .catch(error => {
            console.error('Error fetching user session:', error);
            alert("사용자 세션 정보를 불러오지 못했습니다. 다시 로그인해 주세요.");
        });
}

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

        const title = document.createElement('div');
        title.classList.add('room-title');
        title.textContent = room.roomName;

        // 최근 메시지 표시
        const recentMessage = document.createElement('div');
        recentMessage.classList.add('recent-message');

        // lastMessage가 문자열인지 확인하고, 문자열이 아니면 content 속성을 사용
        recentMessage.textContent = typeof room.lastMessage === 'string' ? room.lastMessage : (room.lastMessage?.content || '메시지가 없습니다.');

        // 제목을 위에, 최근 메시지를 아래에 배치
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
        if (user.mid === loggedInUserId) return; // 로그인한 사용자는 제외

        const li = document.createElement('li');
        li.classList.add('list-group-item');

        // 이름과 ID 표시
        li.textContent = `${user.name} (${user.mid})`;
        li.dataset.userId = user.mid; // 각 사용자에 고유 ID 저장

        // 항목에 마우스를 올리면 파란색으로 강조 표시
        li.addEventListener('mouseenter', () => li.classList.add('hover'));
        li.addEventListener('mouseleave', () => li.classList.remove('hover'));

        // 클릭하면 선택 상태 토글
        li.addEventListener('click', () => {
            if (selectedUsers.includes(user.mid)) {
                // 이미 선택된 경우 선택 해제
                selectedUsers = selectedUsers.filter(id => id !== user.mid);
                li.classList.remove('selected');
            } else {
                // 선택되지 않은 경우 추가
                selectedUsers.push(user.mid);
                li.classList.add('selected');
            }
            console.log('현재 선택된 사용자:', selectedUsers);
        });

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

/// 방 생성 버튼 클릭 이벤트
startChatBtn.addEventListener('click', () => {
    if (selectedUsers.length === 0) {
        alert("채팅에 추가할 사용자를 선택하세요.");
        return;
    }

    const roomName = selectedUsers.map(userId => {
        const user = userList.querySelector(`[data-user-id="${userId}"]`).textContent;
        return user;
    }).join(", ") + "와의 채팅";

    console.log("방 생성 요청:", roomName, selectedUsers);

    axios.post('/api/chat/rooms', {
        roomName: roomName,
        memberMids: [loggedInUserId, ...selectedUsers], // 현재 사용자와 선택된 사용자들 포함
        recipientIds: selectedUsers // 선택된 사용자를 수신자 목록으로 추가
    })
        .then(response => {
            const newRoom = response.data;
            chatRooms.push(newRoom);
            renderChatRooms();
            openChatRoom(newRoom.id);
            selectedUsers = []; // 선택 초기화
        })
        .catch(error => {
            console.error('채팅방 생성 실패:', error);
        });
});

// 스크롤을 맨 아래로 이동시키는 함수
function scrollToBottom() {
    setTimeout(() => {
        messageList.scrollTop = messageList.scrollHeight;
    }, 300); // 지연 시간 300ms로 설정
}

// 새로운 메시지 수신 시 알림 배지를 표시하는 함수
function showNotificationBadge() {
    notificationBadge.style.display = 'inline'; // 알림 배지를 표시
}

// 채팅방 열기 시 알림 배지를 숨기는 함수
function hideNotificationBadge() {
    notificationBadge.style.display = 'none'; // 알림 배지를 숨김
}


document.addEventListener('DOMContentLoaded', () => {
    // WebSocket 설정 및 연결
    window.stompClient.connect({}, function (frame) {
        console.log('Connected to server:', frame);

        // 모든 채팅방의 새로운 메시지 수신
        window.stompClient.subscribe(`/topic/rooms`, function (message) {
            const newMessage = JSON.parse(message.body);

            // 현재 열려 있는 채팅방이 아닌 경우 알림 배지를 표시
            if (currentRoomId !== newMessage.roomId) {
                showNotificationBadge();
            }

            // 채팅방 목록에 최근 메시지 업데이트
            updateChatRoomList(newMessage);
        });
    }, function (error) {
        console.error("WebSocket connection error:", error);
    });
});

// 채팅방 열기 함수
function openChatRoom(roomId) {
    if (!window.stompClient.connected) {
        console.error("WebSocket connection not established yet.");
        return;
    }

    if (window.currentSubscription) {
        window.currentSubscription.unsubscribe();
    }

    currentRoomId = roomId;
    const room = chatRooms.find(r => r.id === roomId);
    chatModalLabel.textContent = room.roomName;
    recipientIds = room.recipientIds || [];

    window.currentSubscription = window.stompClient.subscribe(`/topic/rooms/${roomId}`, function (message) {
        const newMessage = JSON.parse(message.body);
        console.log("실시간 메시지 수신:", newMessage);

        addMessageToChat(newMessage);

        if (!document.getElementById('chatModal').classList.contains('show')) {
            showNotificationBadge();
        }

        // 열려 있는 채팅방에 새 메시지 표시 및 목록 업데이트
        updateChatRoomList(newMessage);
    });

    hideNotificationBadge();

    axios.get(`/api/chat/rooms/${roomId}/messages`)
        .then(response => {
            renderMessages(response.data);
            setTimeout(scrollToBottom, 100);

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

function updateChatRoomList(message) {
    const roomIndex = chatRooms.findIndex(room => room.id === message.roomId);

    if (roomIndex !== -1) {
        // 받은 메시지로 lastMessage와 lastMessageTimestamp 업데이트
        chatRooms[roomIndex].lastMessage = message.content;
        chatRooms[roomIndex].lastMessageTimestamp = message.timestamp;

        console.log('Updated chat room list with new message:', message.content); // 확인용 로그
        renderChatRooms(); // 업데이트된 채팅방 목록을 다시 렌더링
    } else {
        loadChatRooms(); // 방 목록이 없는 경우 전체 목록을 다시 로드
    }
}

// 메시지를 렌더링하는 함수
function renderMessages(messages) {
    messageList.innerHTML = ''; // 기존 메시지 목록 초기화
    messages.forEach(message => addMessageToChat(message));
}

// 메시지 추가 함수
function addMessageToChat(message) {
    console.log("화면에 메시지 추가:", message); // message 구조 확인

    // 메시지 리스트가 올바르게 선택되었는지 확인
    if (!messageList) {
        console.error("messageList 요소가 없습니다.");
        return;
    }

    const li = document.createElement('li');

    // 보낸 사람과 로그인한 사용자를 비교하여 위치와 스타일 설정
    if (message.senderId === loggedInUserId) {
        li.classList.add('message-item', 'right-message');
    } else {
        li.classList.add('message-item', 'left-message');
    }

    // 메시지 내용 설정
    li.textContent = message.content || "메시지 내용이 없습니다."; // `content`가 없으면 기본 텍스트

    // 메시지 목록에 추가
    messageList.appendChild(li);
    messageList.scrollTop = messageList.scrollHeight; // 스크롤을 맨 아래로
}

document.addEventListener('DOMContentLoaded', () => {
    // 메시지 전송 이벤트
    sendMessageButton.addEventListener('click', () => {
        const message = messageInput.value.trim();

        if (!message || !currentRoomId) {
            return;
        }

        const newMessage = {
            roomId: currentRoomId,
            content: message,
            senderId: loggedInUserId,
            recipientIds: recipientIds.length ? recipientIds : null,  // 다중 채팅 수신자 설정
            timestamp: new Date().toISOString()
        };

        console.log("전송하는 메시지:", newMessage);

        // WebSocket을 통해 메시지 전송
        stompClient.send(`/app/chat.send/${currentRoomId}`, {}, JSON.stringify(newMessage));

        // 입력란 초기화
        messageInput.value = '';
    });

    // Enter 키로 메시지 전송 기능 추가
    messageInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // 기본 엔터 동작 방지
            sendMessageButton.click(); // 전송 버튼 클릭 이벤트 트리거
        }
    });
});