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

// 페이지가 로드되면 서버에서 채팅방 목록 불러오기
document.addEventListener('DOMContentLoaded', function () {
    loadChatRooms();  // 채팅방 목록 로드
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
            renderChatRooms(rooms);  // 받아온 채팅방 목록 렌더링
        })
        .catch(error => {
            console.error('채팅방 목록 불러오기 실패:', error);
        });
}

// 사용자 선택 모달이 열릴 때 사용자 목록 로드 (서버에서 axios 사용)
createChatRoomBtn.addEventListener('click', () => {
    loadUsers();  // 채팅방 생성 모달이 열릴 때 사용자 목록 로드
});

// 사용자 목록 로드 (서버에서 axios 사용)
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
        li.addEventListener('click', () => selectUser(user, li));  // 사용자 객체 전체 전달
        userList.appendChild(li);
    });
}

// 사용자 선택 함수 수정
function selectUser(user, listItem) {
    selectedUser = user; // user 객체 전체를 저장하여 name과 mid 사용 가능하게 함
    userList.querySelectorAll('li').forEach(li => li.classList.remove('active'));
    listItem.classList.add('active');
}

// 채팅방 생성 요청 (memberMids와 roomName 설정 확인)
startChatBtn.addEventListener('click', () => {
    if (!selectedUser || !selectedUser.mid) { // 사용자와 mid 확인
        alert('사용자를 선택하세요.');
        return;
    }

    const roomName = `${selectedUser.name}와의 1:1 채팅`;

    // Axios로 POST 요청 보내기
    axios.post('/api/chat/rooms', {
        roomName: roomName,
        memberMids: [selectedUser.mid] // memberMids로 수정하여 mid를 전달
    })
        .then(response => {
            console.log('채팅방 생성 성공:', response.data);

            const newRoom = response.data;
            chatRooms.push(newRoom);  // 생성된 채팅방을 목록에 추가
            renderChatRooms();  // 채팅방 목록 업데이트

            // 생성된 채팅방으로 바로 이동
            openChatRoom(newRoom.id);  // 방 ID를 이용해 생성된 방으로 이동

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
    roomList.innerHTML = '';  // 기존 목록 비우기
    chatRooms.forEach(room => {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.textContent = room.roomName;
        li.addEventListener('click', () => {
            console.log(`채팅방 클릭됨: ${room.id}`);  // 로그 추가
            openChatRoom(room.id);  // 클릭하면 채팅방 열기
        });
        roomList.appendChild(li);
    });
}

// 채팅방 열기
function openChatRoom(roomId) {
    currentRoomId = roomId;
    const room = chatRooms.find(r => r.id === roomId);
    chatModalLabel.textContent = room.roomName;  // 모달 제목을 채팅방 이름으로 설정

    // 서버에서 채팅방 메시지 불러오기
    axios.get(`/api/chat/rooms/${roomId}/messages`)
        .then(response => {
            const messages = response.data;  // 서버에서 받은 메시지 목록
            renderMessages(messages);  // 메시지 렌더링
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
        const li = document.createElement('li');
        li.classList.add('message-item');
        li.textContent = `${message.sender}: ${message.content}`;  // 메시지 내용 출력
        messageList.appendChild(li);
    });
}

// 메시지 전송
sendMessageButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (!message || !currentRoomId) return;

    // 서버에 메시지 전송
    axios.post(`/api/chat/rooms/${currentRoomId}/messages`, { content: message })
        .then(response => {
            const room = chatRooms.find(r => r.id === currentRoomId);
            room.messages.push(response.data);  // 서버에서 받은 메시지 추가
            renderMessages(room.messages);  // 메시지 렌더링
            messageInput.value = '';  // 입력창 비우기
        })
        .catch(error => {
            console.error('메시지 전송 실패:', error);
        });
});
