const navLinks = document.querySelectorAll('.nav-link');

// 페이지 로드 시 localStorage에서 active 상태를 복원
const activeLinkId = localStorage.getItem('activeLinkId');
if (activeLinkId) {
    document.getElementById(activeLinkId).classList.add('active');
}

// 각 nav-link에 클릭 이벤트를 추가
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        // 모든 nav-link에서 active 클래스를 제거합니다.
        navLinks.forEach(link => link.classList.remove('active'));

        // 클릭된 요소에 active 클래스를 추가합니다.
        this.classList.add('active');

        // 클릭된 링크의 ID를 localStorage에 저장합니다.
        localStorage.setItem('activeLinkId', this.id);
    });
});

const registerModal = new bootstrap.Modal(document.querySelector(".registerModal"))
const registerBtn = document.querySelector(".registerBtn")
const replyText = document.querySelector(".replyText")
const replyer = document.querySelector(".replyer")
const closeRegisterBtn = document.querySelector(".closeRegisterBtn")

document.querySelector(".addReplyBtn").addEventListener("click", (e) => {
    registerModal.show()
}, false)

closeRegisterBtn.addEventListener("click", (e) => {
    registerModal.hide()
}, false)