
        function editUser(rowIndex) {
            // 수정 기능을 구현하는 코드
        }

        function deleteUser(button) {
            const row = button.parentNode.parentNode;
            row.parentNode.removeChild(row);
        }

        function searchUser() {
            const input = document.getElementById('search').value.toLowerCase();
            const table = document.getElementById('userTable');
            const rows = table.getElementsByTagName('tr');

            for (let i = 1; i < rows.length; i++) {
                const cells = rows[i].getElementsByTagName('td');
                let match = false;

                for (let j = 0; j < cells.length - 1; j++) {
                    if (cells[j].textContent.toLowerCase().indexOf(input) > -1) {
                        match = true;
                        break;
                    }
                }
                rows[i].style.display = match ? "" : "none";
            }
        }

        document.addEventListener("DOMContentLoaded", function() {
            // '조회' 버튼 클릭 이벤트 처리
            document.getElementById("btnSearch").addEventListener("click", function() {
                let id = document.getElementById("txtId").value;
                let name = document.getElementById("txtName").value;
                let auth = document.getElementById("cmbAuth").value;
                let date = document.getElementById("transactionStartDate").value;

                // 여기서 조회 기능 처리
                console.log("조회 버튼 클릭:", id, name, auth, date);
                // 필요한 추가 기능 (예: API 호출 등)
            });

            // '초기화' 버튼 클릭 이벤트 처리
            document.getElementById("btnReset").addEventListener("click", function() {
                document.getElementById("txtId").value = '';
                document.getElementById("txtName").value = '';
                document.getElementById("cmbAuth").value = '';
                document.getElementById("transactionStartDate").value = '';

                console.log("초기화 버튼 클릭");
            });

            // '수정' 버튼 클릭 이벤트 처리
            document.getElementById("btnEdit").addEventListener("click", function() {
                console.log("수정 버튼 클릭");
                // 수정 기능 추가
            });

            // '삭제' 버튼 클릭 이벤트 처리
            document.getElementById("btnDelete").addEventListener("click", function() {
                console.log("삭제 버튼 클릭");
                // 삭제 기능 추가
            });

            // '저장' 버튼 클릭 이벤트 처리
            document.getElementById("btnSave").addEventListener("click", function() {
                let id = document.getElementById("txtPopId").value;
                let name = document.getElementById("txtPopName").value;
                let tel = document.getElementById("txtPopTel").value;
                let email = document.getElementById("txtPopMail").value;

                // 여기서 저장 기능 처리
                console.log("저장 버튼 클릭:", id, name, tel, email);
                // 필요한 추가 기능 (예: API 호출 등)
            });
        });

        function addUser() {
            const userDto = {
                id: document.getElementById('txtPopId').value,
                name: document.getElementById('txtPopName').value,
                email: document.getElementById('txtPopMail').value,
                role: document.getElementById('cmbPopUserAuth').value
            };

            fetch('/api/users/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userDto),
            })
                .then(response => response.text())
                .then(data => {
                    alert(data);
                    // 필요 시 테이블 업데이트 등의 추가 작업
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }

            // 저장 버튼 클릭 이벤트
            document.getElementById('userTable').addEventListener('click', function (event) {
                event.preventDefault(); // 기본 동작 방지





                // 저장할 사용자 데이터 객체 생성
                const userData = {
                    // 사용자 입력값 가져오기
                    id: document.getElementById('txtPopId').value,
                    password: document.getElementById('txtPopPwd').value,
                    role : document.getElementById('cmbPopUserAuth').value,
                    username : document.getElementById('txtPopName').value,
                    // phone : document.getElementById('txtPopTel').value,
                    email : document.getElementById('txtPopMail').value,
                    // address: document.getElementById('txtPop').value,
                    // note : document.getElementById('note').value
                };
                // 필수 입력값 체크
                if (!userData.id || !userData.password || !userData.username || !userData.email) {
                    alert('필수 입력값을 확인하세요.');
                    return;
                }
                // 서버에 사용자 데이터 전송
                fetch('/user/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        if (data.success) {
                            alert('사용자가 성공적으로 저장되었습니다.');
                            // 필요 시 페이지 새로고침 또는 리스트 업데이트 로직 추가
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







