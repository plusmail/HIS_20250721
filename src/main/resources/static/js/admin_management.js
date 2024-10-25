const idCheckStatus = document.getElementById('idCheckStatus');
const idCheckMsg = document.getElementById('idCheckMsg');
const userFormData = document.getElementById('UserFormData')
const txtPopId = document.getElementById('txtPopId')
const txtPopName = document.getElementById('txtPopName');
const txtPopPwd = document.getElementById('txtPopPwd');
const txtPopMail = document.getElementById('txtPopMail');
const txtPopHandPhone = document.getElementById('txtPopHandPhone');
const txtPopTel = document.getElementById('txtPopTel');
const cmbPopUserAuth = document.getElementById('cmbPopUserAuth');
const zipCode = document.getElementById("zipCode");
const streetAdr = document.getElementById("streetAdr");
const detailAdr = document.getElementById("detailAdr");
const note = document.getElementById("note");
const userTableRest = document.getElementById("userTableRest");
const userTableDelete = document.getElementById("userTableDelete");
const userTableUpdate = document.getElementById("userTableUpdate");
const userTableAdd = document.getElementById("userTableAdd");
const duplicateBtn = document.getElementById("duplicateBtn");
const btnSearch = document.getElementById("btnSearch");
const btnSearchReset = document.getElementById("btnSearchReset");
const userSearchForm = document.getElementById("userSearchForm");

window.onload = function () {
    loadPage(1);
};

function loadPage(pageNumber) {
    axios.get(`/admin_management/paginglist?page=${pageNumber}`) // 적절한 API 엔드포인트 사용
        .then(response => {
            userListRender(response)
        })
        .catch(error => {
            console.error('Error fetching members:', error);
        });
}

function formatPhoneNumber(phoneNumber) {
    // 전화번호가 11자리일 경우, 3-4-4 형식으로 변환
    if (phoneNumber.length === 11) {
        return phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    // 전화번호가 10자리일 경우, 3-3-4 형식으로 변환
    if (phoneNumber.length === 10) {
        return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    // 기본적으로 원래의 전화번호를 반환
    return phoneNumber;
}


// 페이지네이션을 동적으로 생성하는 함수
function renderPagination(responseDTO) {
    const paginationList = document.getElementById('pagination-list');
    paginationList.innerHTML = '';  // 기존 페이지네이션 초기화

    // "이전" 버튼 추가
    if (responseDTO.prev) {
        const prevItem = document.createElement('li');
        prevItem.classList.add('page-item');
        prevItem.innerHTML = `<a class="page-link" data-num="${members[0].start - 1}" onclick="loadPage(${responseDTO.start - 1})">이전</a>`;
        paginationList.appendChild(prevItem);
    }

    // 중간 페이지 번호들 추가
    for (let i = responseDTO.start; i <= responseDTO.end; i++) {
        const pageItem = document.createElement('li');
        pageItem.classList.add('page-item');
        if (responseDTO.page === i) {
            pageItem.classList.add('active');
        }
        pageItem.innerHTML = `<a class="page-link" data-num="${i}" onclick="loadPage(${i})">${i}</a>`;
        paginationList.appendChild(pageItem);
    }

    // "다음" 버튼 추가
    if (responseDTO.next) {
        const nextItem = document.createElement('li');
        nextItem.classList.add('page-item');
        nextItem.innerHTML = `<a class="page-link" data-num="${responseDTO.end + 1}" onclick="loadPage(${responseDTO.end + 1})">다음</a>`;
        paginationList.appendChild(nextItem);
    }
}


// 저장 버튼 클릭 이벤트
userTableAdd.addEventListener('click', function (event) {
    event.preventDefault(); // 기본 동작 방지

    // 저장할 사용자 데이터 객체 생성
// 저장할 사용자 데이터 객체 생성
    const userDataAdd = {
        // 사용자 입력값 가져오기
        mid: txtPopId.value,
        name: txtPopName.value,
        password: txtPopPwd.value,
        roles: getSelectedRoles(),
        tel: txtPopTel.value,
        phone: txtPopHandPhone.value,
        email: txtPopMail.value,
        address: streetAdr.value,
        detailAddress: detailAdr.value,
        zipCode: zipCode.value,
        note: note.value
    };

    console.log(userDataAdd)
    // 필수 입력값 체크
    if (!userDataAdd.mid || !userDataAdd.password || !userDataAdd.name || !userDataAdd.email) {
        alert('필수 입력값을 확인하세요.');
        return;
    }
    // 서버에 사용자 데이터 전송
    fetch('/admin_management/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDataAdd),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.success) {
                alert('사용자가 성공적으로 저장되었습니다.');
                window.location.reload();
            } else {
                alert('저장에 실패했습니다. 다시 시도해주세요.');
                console.error('Error:', data.error);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('저장 중 오류가 발생했습니다.');
        });
});

// 다중 선택된 값들을 배열로 가져오는 함수
function getSelectedRoles() {
    const selectedOptions = document.getElementById('cmbPopUserAuth').selectedOptions;
    const roles = [];

    for (let option of selectedOptions) {
        roles.push({roleSet: option.value});  // 선택된 각 값을 배열에 추가
    }

    return roles;
}

userTableUpdate.addEventListener("click", e => {
    e.preventDefault()

    const txtPipIdDisabled = txtPopId.getAttribute("disabled")
    const txtDupBtnDisabled = duplicateBtn.getAttribute("disabled")
    if (!txtPipIdDisabled || !txtDupBtnDisabled) return;
    const userDataUpdate = {
        // 사용자 입력값 가져오기
        mid: txtPopId.value,
        name: txtPopName.value,
        roles: getSelectedRoles(),
        tel: txtPopTel.value,
        phone: txtPopHandPhone.value,
        email: txtPopMail.value,
        address: streetAdr.value,
        detailAddress: detailAdr.value,
        zipCode: zipCode.value,
        note: note.value
    };

    if (txtPopPwd.value) {
        userDataUpdate.password = txtPopPwd.value
    }
    console.log("userDataUpdate:", userDataUpdate)
    // 필수 입력값 체크
    if (!userDataUpdate.mid || !userDataUpdate.name || !userDataUpdate.email) {
        alert('필수 입력값을 확인하세요.');
        return;
    }
    // 서버에 사용자 데이터 전송
    fetch('/admin_management/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDataUpdate),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.success) {
                alert('사용자가 성공적으로 수정되었습니다.');
                window.location.reload();
            } else {
                alert('수정에 실패했습니다. 다시 시도해주세요.');
                console.error('Error:', data.error);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('수정 중 오류가 발생했습니다.');
        });
})

userTableDelete.addEventListener("click", e => {
    e.preventDefault()

    const userDataDelete = {
        // 사용자 입력값 가져오기
        mid: txtPopId.value,
        name: txtPopName.value,
        roles: getSelectedRoles(),
        tel: txtPopTel.value,
        phone: txtPopHandPhone.value,
        email: txtPopMail.value,
    };
    console.log("userDataDelete:", userDataDelete)
    // 필수 입력값 체크
    if (!userDataDelete.mid) {
        alert('필수 입력값을 확인하세요.');
        return;
    }
    // 서버에 사용자 데이터 전송
    fetch('/admin_management/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDataDelete),
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.success) {
                alert('사용자가 성공적으로 삭제되었습니다.');
                window.location.reload();
            } else {
                alert('삭제에 실패했습니다. 다시 시도해주세요.');
                console.error('Error:', data.error);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('삭제 중 오류가 발생했습니다.');
        });
})

btnSearch.addEventListener("click", function () {
    // 입력된 검색 조건을 가져옴
    const userId = document.getElementById("txtSearchId").value;
    const userName = document.getElementById("txtSearchName").value;
    const email = document.getElementById("txtSearchEmail").value;
    const userRole = document.getElementById("cmbSearchAuth").selected;

    let searchType = '';
    let keyword = '';

    if (userId) {
        searchType += 'm'
        keyword = userId
    }
    if (userName) {
        searchType += 'n'
        keyword = userName
    }
    if (email) {
        searchType += 'e'
        keyword = email
    }
    if (userRole) {
        searchType += 'r'
        keyword = userRole.selected
    }


    console.log(searchType)

    // 검색 조건을 객체로 만들기
    const searchParams = {

        page: 1,
        size: 10,
        type: searchType,
        keyword: keyword
    };

    console.log(searchParams)


    axios.get(`/admin_management/paginglist?page=1`, {
        params: searchParams,
    }) // 적절한 API 엔드포인트를 사용
        .then(response => {
            userListRender(response)
        })
        .catch(error => {
            console.error('Error fetching members:', error);
        });

});

function userListRender(response){
    let members = response.data; // 서버에서 가져온 데이터
    const memberList = document.querySelector('#membersList'); // ul 요소 선택

    // 기존 ul 요소의 모든 li 요소 삭제
    memberList.innerHTML = '';

    // members가 배열이 아닐 경우 배열로 변환
    if (!Array.isArray(members)) {
        members = [members];
    }

    const listItemHeader = document.createElement('li');

    listItemHeader.classList.add("list-group-item"); // Bootstrap 스타일 적용 (선택 사항)
    listItemHeader.classList.add("d-flex"); // Bootstrap 스타일 적용 (선택 사항)
    listItemHeader.classList.add("justify-content-between"); // Bootstrap 스타일 적용 (선택 사항)
    listItemHeader.classList.add("align-items-center"); // Bootstrap 스타일 적용 (선택 사항)
    listItemHeader.classList.add('list-group-item', 'bg-primary', 'text-white', 'font-weight-bold'); // Bootstrap 클래스 추가
    listItemHeader.innerHTML = `
                    <span class="post-number">ID</span>
                    <span class="post-number">이름</span>
                    <span class="post-number">연락처</span>
                    <span class="post-title">E-mail</span>
                    <span class="post-author">권한</span>
                    `

    memberList.insertBefore(listItemHeader, memberList.firstChild)


    members[0].dtoList.forEach(user => {
        const listItem = document.createElement('li');
        listItem.classList.add("list-group-item"); // Bootstrap 스타일 적용 (선택 사항)
        listItem.classList.add("d-flex"); // Bootstrap 스타일 적용 (선택 사항)
        listItem.classList.add("justify-content-between"); // Bootstrap 스타일 적용 (선택 사항)
        listItem.classList.add("align-items-center"); // Bootstrap 스타일 적용 (선택 사항)
        const roles = user.roles.map(role => role).join(', ');
        listItem.setAttribute("data-mid", user.mid);
        listItem.addEventListener('click', function () {
            const memberId = this.getAttribute('data-mid'); // 클릭한 항목의 data-mid 값 가져옴
            console.log("Selected member ID:", memberId);

            // 회원 정보 조회 API 호출 (예시 API)
            axios.get(`/admin_management/editform/${memberId}`)
                .then(response => {
                    userFormData.reset();
                    const memberInfo = response.data;

                    // 회원 정보 처리 로직 (예: 모달 창에 정보 표시 등)
                    console.log(memberInfo);
                    txtPopId.value = memberInfo.mid;
                    txtPopId.setAttribute("disabled", 'true');
                    duplicateBtn.setAttribute("disabled", 'true');
                    txtPopName.value = memberInfo.name;
                    txtPopPwd.value = '';
                    txtPopMail.value = memberInfo.email;
                    zipCode.value = memberInfo.zipCode;
                    streetAdr.value = memberInfo.address;
                    detailAdr.value = memberInfo.detailAddress;
                    note.value = memberInfo.note;
                    if (memberInfo.tel !== null) {
                        txtPopTel.value = formatPhoneNumber(memberInfo.tel);
                    }
                    if (memberInfo.phone !== null) {
                        txtPopHandPhone.value = formatPhoneNumber(memberInfo.phone);
                    }

                    // 역할 배열과 <select> 옵션 간의 매핑 테이블
                    const roleMap = {
                        "EMP": "0",    // 일반사용자
                        "ADMIN": "1",  // 관리자
                        "DOCTOR": "2", // 의사
                        "NURSE": "3"   // 간호사
                    };

                    // 모든 <option>의 선택을 초기화
                    const options = cmbPopUserAuth.options;
                    for (let i = 0; i < options.length; i++) {
                        options[i].selected = false; // 모든 옵션 선택 해제
                    }

                    // memberInfo.roleSet 배열을 순회하여 해당하는 옵션을 선택
                    memberInfo.roleSet.forEach(role => {
                        const optionValue = roleMap[role.roleSet];
                        if (optionValue !== undefined) {
                            for (let i = 0; i < options.length; i++) {
                                if (options[i].value === optionValue) {
                                    options[i].selected = true; // 해당 옵션을 선택 상태로 설정
                                }
                            }
                        }
                    });
                })
                .catch(error => {
                    console.error('Error fetching member info:', error);
                });
        });

        // li 요소의 내용 생성
        listItem.innerHTML = `
                    <span class="post-number">${user.mid}</span>
                    <span class="post-number">${user.name} </span>
                    <span class="post-number">${user.phone} </span>
                    <span class="post-title">${user.email} </span>
                    <span class="post-author">${roles}</span>
                `;


        memberList.appendChild(listItem); // ul 요소에 li 요소 추가
        renderPagination(members[0]);
    });
}


function sample4_execDaumPostcode() {

    new daum.Postcode({
        oncomplete: function (data) {
            // 우편번호
            console.log(data.zonecode)
            zipCode.value = data.zonecode;
            // 도로명 및 지번주소
            streetAdr.value = data.roadAddress;
        }
    }).open();
}

function addrCheck() {
    if (zipCode.value == '' && streetAdr.value == '') {
        alert("우편번호를 클릭하여 주소를 검색해주세요.");
        zipCode.focus();
    }
}


function checkDuplicateId() {
    const memberId = txtPopId.value;

    // 입력된 아이디가 없으면 메시지 숨김
    if (!memberId) {
        idCheckMsg.textContent = '';
        return;
    }

    // 서버로 중복 체크 요청
    axios.get(`/admin_management/checkId`, {
        params: {mid: memberId}
    })
        .then(response => {
            if (response.data) {
                // 중복 아이디가 존재할 경우
                idCheckMsg.textContent = '이미 존재하는 아이디입니다.';
                idCheckMsg.style.color = 'red';
                idCheckStatus.checked = false;

            } else {
                // 중복되지 않는 아이디일 경우
                idCheckMsg.textContent = '사용 가능한 아이디입니다.';
                idCheckMsg.style.color = 'green';
                idCheckStatus.checked = true;
            }
        })
        .catch(error => {
            console.error('Error checking ID:', error);
            idCheckMsg.textContent = '중복 체크 중 오류가 발생했습니다.';
            idCheckMsg.style.color = 'red';
            idCheckStatus.checked = false;
        });
}

userTableRest.addEventListener("click", (e) => {
    txtPopId.removeAttribute('disabled')
    duplicateBtn.removeAttribute('disabled')
    userFormData.reset();
    idCheckMsg.innerText = ''
    idCheckStatus.checked = false;

})

txtPopId.addEventListener("focusin", (e) => {
    idCheckMsg.innerText = ''
    idCheckStatus.checked = false;
})

btnSearchReset.addEventListener("click", e => {

    userSearchForm.reset()

})

function highlightPost(selectedPost) {
    // 모든 게시물 항목에서 'active' 클래스를 제거
    const posts = document.querySelectorAll("#postList .list-group-item");
    posts.forEach(post => post.classList.remove("active"));

    // 클릭된 항목에 'active' 클래스 추가
    selectedPost.classList.add("active");
}
