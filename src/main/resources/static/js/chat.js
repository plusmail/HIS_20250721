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
const deleteChatRoomsBtn = document.getElementById('deleteChatRoomsBtn');

let selectedUsers = []; // 선택된 사용자 ID 저장
let chatRooms = []; // 채팅방 목록
let currentRoomId = null; // 현재 열린 채팅방 ID
let loggedInUserId = null; // 현재 로그인된 사용자 ID
let recipientIds = []; // 현재 메시지의 수신자 목록

// WebSocket 설정 및 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.stompClient.connect({}, function (frame) {
        console.log('Connected to server:', frame);

        // 모든 채팅방의 새로운 메시지 수신 구독
        window.stompClient.subscribe(`/topic/rooms`, function (message) {
            const newMessage = JSON.parse(message.body);
            console.log("New message received:", newMessage);

            // 현재 열려 있는 채팅방이 아닌 경우 알림 증가
            if (currentRoomId !== newMessage.roomId) {
                incrementUnreadMessages(newMessage.roomId); // 읽지 않은 메시지 수 증가
                showNotificationBadge(newMessage.roomId, getUnreadMessagesCount(newMessage.roomId)); // 알림 배지 표시
            }

            updateChatRoomList(newMessage); // 채팅방 목록 업데이트
        });
    }, function (error) {
        console.error("WebSocket connection error:", error);
    });

    // 초기 사용자 정보 및 채팅방 목록 불러오기
    fetchCurrentUser(); // 현재 사용자 정보 불러오기
    loadChatRooms(); // 채팅방 목록 불러오기
    loadUnreadMessages(); // 읽지 않은 메시지 불러오기
    clearUnreadMessages(null, true); // 읽지 않은 메시지 초기화

    // 채팅방 삭제 버튼 이벤트
    if (deleteChatRoomsBtn) {
        deleteChatRoomsBtn.addEventListener('click', () => {
            const selectedRooms = Array.from(document.querySelectorAll('.room-checkbox:checked'))
                .map(cb => cb.getAttribute('data-room-id'));

            if (selectedRooms.length === 0) {
                alert("삭제할 채팅방을 선택하세요.");
                return;
            }

            if (confirm("선택한 채팅방을 삭제하시겠습니까?")) {
                deleteSelectedRooms(selectedRooms);
            }
        });
    }

    // 메시지 전송 버튼 클릭 이벤트
    sendMessageButton.addEventListener('click', sendMessage);

    // Enter 키로 메시지 전송
    messageInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // 기본 동작 방지
            sendMessageButton.click(); // 전송 버튼 클릭
        }
    });

    // 사용자 선택 모달이 닫힐 때 선택 초기화
    document.getElementById('userSelectionModal').addEventListener('hidden.bs.modal', () => {
        selectedUsers = []; // 선택 초기화
        document.querySelectorAll('#userList .list-group-item').forEach(item => item.classList.remove('selected'));
        console.log("사용자 선택이 초기화되었습니다.");
    });
});

// 읽지 않은 메시지 증가
function incrementUnreadMessages(roomId) {
    if (!roomId) return; // roomId가 없는 경우 실행 중단

    let unreadMessages = JSON.parse(localStorage.getItem('unreadMessages')) || {};
    unreadMessages[roomId] = (unreadMessages[roomId] || 0) + 1;

    localStorage.setItem('unreadMessages', JSON.stringify(unreadMessages));
    showNotificationBadge(roomId, unreadMessages[roomId]); // 알림 배지 표시
    console.log(`Unread messages updated for roomId ${roomId}:`, unreadMessages);
}

// 특정 채팅방의 읽지 않은 메시지 개수 반환
function getUnreadMessagesCount(roomId) {
    const unreadMessages = JSON.parse(localStorage.getItem('unreadMessages')) || {};
    return unreadMessages[roomId] || 0;
}

// `localStorage`에서 알림 상태 로드 및 알림 배지 표시
function loadUnreadMessages() {
    const unreadMessages = JSON.parse(localStorage.getItem('unreadMessages')) || {};
    Object.keys(unreadMessages).forEach(roomId => {
        if (unreadMessages[roomId] > 0) {
            showNotificationBadge(roomId, unreadMessages[roomId]);
        }
    });
    console.log("Unread messages loaded:", unreadMessages);
}

// 읽지 않은 메시지 초기화
function clearUnreadMessages(roomId, persist = false) {
    let unreadMessages = JSON.parse(localStorage.getItem('unreadMessages')) || {};

    if (roomId) {
        unreadMessages[roomId] = 0; // 특정 채팅방 초기화
        hideNotificationBadge(roomId); // 알림 배지 숨김
    } else if (!persist) {
        chatRooms.forEach(room => {
            unreadMessages[room.id] = 0;
            hideNotificationBadge(room.id);
        });
    }

    localStorage.setItem('unreadMessages', JSON.stringify(unreadMessages));
    showGlobalNotificationBadge(Object.values(unreadMessages).some(count => count > 0));
}

// 채팅 버튼 클릭 이벤트: 채팅 목록 열기/닫기
chatButton.addEventListener('click', (event) => {
    const chatPanel = document.getElementById('chatPanel');
    chatPanel.classList.toggle('open'); // 채팅 패널 열기/닫기 토글

    // 클릭 이벤트 전파 방지
    event.stopPropagation();
});

// 페이지 빈 공간 클릭 시 패널 닫기
document.addEventListener('click', (event) => {
    if (
        !chatPanel.contains(event.target) &&
        !chatButton.contains(event.target) &&
        !chatModalEl.contains(event.target) &&
        !event.target.closest('.chat-room-item') // 채팅방 목록 클릭은 허용
    ) {
        chatPanel.classList.remove('open');
    }
});

chatModalEl.addEventListener('hide.bs.modal', () => {
    const chatPanel = document.getElementById("chatPanel");
    chatPanel.classList.add('open'); // 채팅 패널 열기 유지
    loadChatRooms(); // 채팅방 목록 갱신

    // `backdrop`이 남아있을 가능성 제거
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
    document.body.classList.remove('modal-open');
});



// 현재 사용자 정보 가져오기
function fetchCurrentUser() {
    axios.get('/api/user/session')
        .then(response => {
            globalUserData = response.data;
            loggedInUserId = globalUserData.username || globalUserData.mid; // 사용자 ID 설정
            loadUsers(); // 사용자 목록 불러오기
        })
        .catch(error => {
            console.error('Error fetching user session:', error);
            alert("사용자 정보를 불러오지 못했습니다.");
        });
}

// 채팅방 목록 불러오기
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
    roomList.innerHTML = ''; // 기존 목록 초기화
    chatRooms.forEach(room => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'chat-room-item');
        li.dataset.roomId = room.id; // 각 채팅방에 고유 ID 설정

        // 채팅방 제목과 컨테이너
        const titleContainer = document.createElement('div');
        titleContainer.classList.add('room-title-container');

        const title = document.createElement('div');
        title.classList.add('room-title');
        title.textContent = room.roomName;

        // 최근 메시지와 알림 배지를 포함할 컨테이너 생성
        const messageAndBadgeContainer = document.createElement('div');
        messageAndBadgeContainer.classList.add('message-and-badge-container');

        // 최근 메시지 (왼쪽 정렬)
        const recentMessage = document.createElement('div');
        recentMessage.classList.add('recent-message');
        recentMessage.textContent = typeof room.lastMessage === 'string' ? room.lastMessage : (room.lastMessage?.content || '메시지가 없습니다.');

        // 알림 배지 (오른쪽 정렬)
        const badge = document.createElement('span');
        badge.classList.add('notification-badge');
        badge.style.display = 'none'; // 기본적으로 숨김

        // 요소들 추가
        messageAndBadgeContainer.appendChild(recentMessage);
        messageAndBadgeContainer.appendChild(badge);
        titleContainer.appendChild(title);
        titleContainer.appendChild(messageAndBadgeContainer);
        li.appendChild(titleContainer);

        // 체크박스 추가
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.classList.add('room-checkbox');
        checkbox.dataset.roomId = room.id;

        // 체크박스 클릭 시 이벤트 전파 방지
        checkbox.addEventListener('click', event => {
            event.stopPropagation(); // 클릭 이벤트가 부모 요소로 전파되지 않음
        });

        li.prepend(checkbox);

        // 채팅방 클릭 이벤트
        li.addEventListener('click', () => openChatRoom(room.id));
        roomList.appendChild(li);

        // 알림 배지 초기화
        const unreadCount = getUnreadMessagesCount(room.id);
        if (unreadCount > 0) {
            showNotificationBadge(room.id, unreadCount);
        }
    });

    // 스크롤 동작 추가
    const chatPanel = document.getElementById('chatPanel');
    if (chatPanel) {
        // 새 채팅방이 추가된 후, 스크롤을 맨 아래로 이동
        chatPanel.scrollTop = chatPanel.scrollHeight;
    }
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

// 선택한 채팅방을 삭제하는 함수
function deleteSelectedRooms(selectedRooms) {
    const unreadMessages = JSON.parse(localStorage.getItem('unreadMessages')) || {}; // 읽지 않은 메시지 정보 로드

    selectedRooms.forEach(roomId => {
        // 채팅방 삭제 API 호출
        axios.delete(`/api/chat/rooms/${roomId}`)
            .then(response => {
                console.log(`채팅방 ${roomId}이 삭제되었습니다.`);

                // 읽지 않은 메시지 정보에서 해당 채팅방 제거
                delete unreadMessages[roomId];
                localStorage.setItem('unreadMessages', JSON.stringify(unreadMessages)); // 업데이트

                // 전역 알림 배지 갱신
                const hasUnreadMessages = Object.values(unreadMessages).some(count => count > 0);
                showGlobalNotificationBadge(hasUnreadMessages);

                // 채팅방 목록 다시 렌더링
                loadChatRooms();
            })
            .catch(error => {
                console.error(`채팅방 ${roomId} 삭제 실패:`, error);
            });
    });
}

// 새 채팅방을 시작하는 버튼의 클릭 이벤트 핸들러
startChatBtn.addEventListener('click', () => {
    if (selectedUsers.length === 0) {
        alert("채팅에 추가할 사용자를 선택하세요.");
        return;
    }

    // 현재 사용자와 선택한 사용자들의 Set 생성
    const selectedUserSet = new Set([loggedInUserId, ...selectedUsers]);

    // 기존에 동일한 멤버로 구성된 방이 있는지 확인
    const existingRoom = chatRooms.find(room => {
        const roomMembers = new Set(room.memberMids);
        return (
            roomMembers.size === selectedUserSet.size &&
            [...selectedUserSet].every(user => roomMembers.has(user))
        );
    });

    if (existingRoom) {
        // 동일한 방이 존재하면 경고하고 해당 방으로 이동
        alert("이미 동일한 멤버로 구성된 채팅방이 존재합니다.");
        openChatRoom(existingRoom.id);
        return;
    }

    // 새 채팅방 이름 생성 (선택된 사용자들의 이름 기반)
    const roomName = selectedUsers.map(userId => {
        const userElement = userList.querySelector(`[data-user-id="${userId}"]`);
        if (userElement) {
            return userElement.textContent.split(' (')[0]; // 이름만 추출
        }
        return userId; // 예외 처리로 ID 반환
    }).join(", ") + "와의 그룹 채팅";

    console.log("새 채팅방 요청:", roomName, selectedUsers);

    // 채팅방 생성 API 호출
    axios.post('/api/chat/rooms', {
        roomName: roomName,
        memberMids: [loggedInUserId, ...selectedUsers],
        recipientIds: selectedUsers
    })
        .then(response => {
            const newRoom = response.data;
            chatRooms.push(newRoom); // 새 채팅방 추가
            renderChatRooms(); // 채팅방 목록 렌더링
            openChatRoom(newRoom.id); // 새 채팅방 열기
            selectedUsers = []; // 선택 초기화
        })
        .catch(error => {
            console.error('채팅방 생성 실패:', error);
        });
});

// 스크롤을 맨 아래로 이동시키는 함수
function scrollToBottom() {
    setTimeout(() => {
        messageList.scrollTop = messageList.scrollHeight; // 메시지 목록의 최하단으로 이동
    }, 300); // 300ms 지연 후 실행
}

// 전역 알림 배지 표시 여부를 제어하는 함수
function showGlobalNotificationBadge(show) {
    notificationBadge.style.display = show ? 'inline-flex' : 'none';
}

// 특정 채팅방의 알림 배지를 표시하는 함수
function showNotificationBadge(roomId, count) {
    console.log(`Displaying notification badge for roomId ${roomId} with count ${count}`);
    const roomElement = document.querySelector(`[data-room-id="${roomId}"]`);
    if (roomElement) {
        let badge = roomElement.querySelector('.notification-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.classList.add('notification-badge');
            roomElement.querySelector('.message-and-badge-container').appendChild(badge);
        }
        badge.textContent = count; // 알림 개수 설정
        badge.style.display = count > 0 ? 'inline-flex' : 'none';

        showGlobalNotificationBadge(true); // 전역 배지 갱신
    } else {
        console.error(`Room element for roomId ${roomId} not found.`);
        loadChatRooms(); // 채팅방 목록 갱신 시도
    }
}

// 특정 채팅방의 알림 배지를 숨기는 함수
function hideNotificationBadge(roomId) {
    const roomElement = document.querySelector(`[data-room-id="${roomId}"]`);
    if (roomElement) {
        const badge = roomElement.querySelector('.notification-badge');
        if (badge) {
            badge.style.display = 'none';
        }
    }
    // 읽지 않은 메시지가 없으면 전역 배지도 숨김
    const unreadMessages = JSON.parse(localStorage.getItem('unreadMessages')) || {};
    const hasUnreadMessages = Object.values(unreadMessages).some(count => count > 0);
    showGlobalNotificationBadge(hasUnreadMessages);
}

// 채팅방 열기 함수
function openChatRoom(roomId) {
    if (!window.stompClient.connected) {
        console.error("WebSocket connection not established yet.");
        return;
    }

    // 기존 구독 해제
    if (window.currentSubscription) {
        window.currentSubscription.unsubscribe();
    }

    // 서버에서 채팅방 존재 여부 확인
    axios.get(`/api/chat/rooms/${roomId}`)
        .then(response => {
            const room = response.data;

            if (!room) {
                alert("채팅방이 삭제되었습니다.");
                closeChatRoom(); // 채팅방 닫기
                loadChatRooms(); // 채팅방 목록 갱신
                return;
            }

            // 채팅방 정보 설정
            currentRoomId = roomId;
            chatModalLabel.textContent = room.roomName;
            recipientIds = room.recipientIds || [];

            // 메시지 입력란 초기화
            const messageInput = document.getElementById('messageInput');
            if (messageInput) {
                messageInput.value = ''; // 메시지 입력란 초기화
            }

            // 현재 채팅방의 읽지 않은 메시지 초기화
            clearUnreadMessages(roomId);
            hideNotificationBadge(roomId);

            // 채팅 패널 열기
            const chatPanel = document.getElementById('chatPanel');
            chatPanel.classList.add('open');

            // WebSocket 구독 설정
            window.currentSubscription = window.stompClient.subscribe(`/topic/rooms/${roomId}`, function (message) {
                const newMessage = JSON.parse(message.body);
                console.log("실시간 메시지 수신:", newMessage);

                if (newMessage.content === "더 이상 채팅방이 존재하지 않습니다.") {
                    alert("더 이상 채팅방이 존재하지 않습니다. 목록으로 돌아갑니다.");
                    closeChatRoom(); // 채팅방 닫기 및 UI 초기화
                    loadChatRooms(); // 채팅방 목록 갱신
                } else {
                    addMessageToChat(newMessage); // 정상적인 메시지 추가
                }

                // 알림 배지 업데이트
                if (!document.getElementById('chatModal').classList.contains('show')) {
                    incrementUnreadMessages(roomId);
                    showNotificationBadge(roomId, getUnreadMessagesCount(roomId));
                }

                // 채팅방 목록 업데이트
                updateChatRoomList(newMessage);
            });

            // 기존 메시지 로드
            axios.get(`/api/chat/rooms/${roomId}/messages`)
                .then(response => {
                    renderMessages(response.data);
                    setTimeout(scrollToBottom, 100);

                    // 채팅 모달 열기
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
        })
        .catch(error => {
            if (error.response && error.response.status === 404) {
                alert("채팅방이 존재하지 않습니다. 목록을 새로 고칩니다.");
                closeChatRoom(); // 채팅방 닫기
                loadChatRooms(); // 채팅방 목록 갱신
            } else {
                console.error("채팅방 정보를 불러오는 중 오류 발생:", error);
            }
        });
}


// 채팅방 목록 업데이트 함수
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

function addMessageToChat(message) {
    // 메시지 리스트가 올바르게 선택되었는지 확인
    if (!messageList) {
        console.error("messageList 요소가 없습니다.");
        return;
    }

    const messageContainer = document.createElement('div');
    messageContainer.classList.add('message-container');

    // 보낸 사람과 로그인한 사용자를 비교하여 위치와 스타일 설정
    if (message.senderId === loggedInUserId) {
        messageContainer.classList.add('right-message'); // 오른쪽 메시지
    } else {
        messageContainer.classList.add('left-message'); // 왼쪽 메시지
    }

    // 채팅방 멤버 수에 따라 이름 표시 여부 결정
    const room = chatRooms.find(r => r.id === message.roomId);
    if (room && room.memberMids.length > 2) {
        // 다중 채팅의 경우, 이름 추가
        const senderName = document.createElement('div');
        senderName.classList.add('sender-name');
        senderName.textContent = message.senderName || "알 수 없는 사용자"; // 이름이 없는 경우 기본값 설정
        messageContainer.appendChild(senderName);
    }

    // 메시지 내용 설정
    const messageContent = document.createElement('div');
    messageContent.classList.add('message-item');
    messageContent.textContent = message.content || "메시지 내용이 없습니다."; // `content`가 없으면 기본 텍스트

    // 메시지 내용 추가
    messageContainer.appendChild(messageContent);

    // 메시지 목록에 추가
    messageList.appendChild(messageContainer);
    messageList.scrollTop = messageList.scrollHeight; // 스크롤을 맨 아래로
}

// 메세지 전송 함수
function sendMessage() {
    const message = messageInput.value.trim();

    if (!message || !currentRoomId) {
        return;
    }

    const newMessage = {
        roomId: currentRoomId,
        content: message,
        senderId: loggedInUserId,
        recipientIds: recipientIds.length ? recipientIds : null, // 다중 채팅 수신자 설정
        timestamp: new Date().toISOString()
    };

    console.log("전송하는 메시지:", newMessage);

    // WebSocket을 통해 메시지 전송
    stompClient.send(`/app/chat.send/${currentRoomId}`, {}, JSON.stringify(newMessage));

    // 입력란 초기화
    messageInput.value = '';
}

function closeChatRoom() {
    if (currentRoomId) {
        console.log(`Closing chat room with ID: ${currentRoomId}`);
        // 나갈 때 읽지 않은 메시지 초기화
        clearUnreadMessages(currentRoomId);
    }

    // WebSocket 구독 해제
    if (window.currentSubscription) {
        console.log(`Unsubscribing from room: ${currentRoomId}`);
        window.currentSubscription.unsubscribe();
        window.currentSubscription = null;
    }

    // 현재 방 ID 초기화
    currentRoomId = null;

    // UI 초기화
    messageList.innerHTML = '';
    chatModalLabel.textContent = '채팅방을 선택해주세요.';
    const chatPanel = document.getElementById('chatPanel');
    chatPanel.classList.remove('open');

    // 채팅 모달 닫기
    const chatModal = document.getElementById('chatModal');
    if (chatModal) {
        chatModal.classList.remove('show');
        chatModal.style.display = 'none';
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
    }

    console.log("Chat room closed and WebSocket subscription cleared.");
}