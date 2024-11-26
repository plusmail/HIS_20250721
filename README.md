<div align="center">
 <img src="https://github.com/user-attachments/assets/36b0d180-6c07-4a53-8ca8-f2c70d6dfb93" width="400"/>

<br/> [<img src="https://img.shields.io/badge/프로젝트 기간-2024.10.22~2024.11.14-green?style=flat&logo=&logoColor=white" />]()

</div>

<br>

## 프로젝트 소개

- 병원 및 의료 기관, 특히 치과 환자 관리와 세션을 돕기 위한 소프트웨어 시스템
- 환자 관리, 예약, 진료 접수, 진료 차트, 약품 재고 관리 등의 기능을 체계화하여 효율적으로 업무를 수행할 수 있도록 돕습니다.

<br>

## 팀원 구성

<div align="center">

| **이재준** | **백지영** | **김관호** | **정수빈** | **송경섭** | **최선아** |
| :------: |  :------: | :------: | :------: | :------: | :------: |
| <img src="https://avatars.githubusercontent.com/u/106502312?v=4" height=150 width=150> |<img src="https://avatars.githubusercontent.com/u/112460466?v=4" height=150 width=150> | <img src="https://avatars.githubusercontent.com/u/112460506?v=4" height=150 width=150>| <img src="https://avatars.githubusercontent.com/u/76766459?v=4" height=150 width=150> | <img src="https://avatars.githubusercontent.com/u/76766459?v=4" height=150 width=150>| <img src="https://avatars.githubusercontent.com/u/76766459?v=4" height=150 width=150> |
| [GitHub](https://github.com/ksol0048) | [GitHub](https://github.com/bjy-98) | [GitHub](https://github.com/ho0911) | [GitHub](https://github.com/Bintori) | [GitHub](https://github.com/song424) | [GitHub](https://github.com/tjsdkek) |
  
</div>

<br>

## ⚙ 개발환경
> skills 폴더에 있는 아이콘을 이용할 수 있습니다.

### 운영체제
<div>
<img src="https://github.com/user-attachments/assets/2efc2c61-9b0f-4cc4-9c25-b56d9b80f854?raw=true" width="90">
</div>

### IDE
<div>
<img src="https://github.com/user-attachments/assets/8620ffd6-a5c5-4553-8df4-4b5750219690?raw=true" width="90">
</div>

### font-end
<div>
<img src="https://github.com/user-attachments/assets/657602b8-3bbc-40d7-bf0e-c2a0ae9275fb?raw=true" width="90">
<img src="https://github.com/user-attachments/assets/e1814c3a-9972-44bd-9d9e-15f5003aff42?raw=true" width="90">
<img src="https://github.com/user-attachments/assets/15be680f-5259-4583-8cfd-50d4361f6812?raw=true" width="90">

</div>

### Back-end
<div>
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/Java.png?raw=true" width="80">
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/SpringBoot.png?raw=true" width="80">
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/SpringSecurity.png?raw=true" width="80">
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/SpringDataJPA.png?raw=true" width="80">
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/Mysql.png?raw=true" width="80">
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/Ajax.png?raw=true" width="80">
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/Thymeleaf.png?raw=true" width="80">
<!-- <img src="https://github.com/user-attachments/assets/28b66b4b-95cf-48c6-9019-46c7a83ef12d?raw=true" width="100"> -->
<!-- <img src="https://github.com/user-attachments/assets/f224cc4b-1e6e-4362-8a38-bd8d16d5e0f5?raw=true" width="100"> -->
</div>

### Tools
<div>
<img src="https://github.com/yewon-Noh/readme-template/blob/main/skills/Github.png?raw=true" width="80">
</div>

<br />

# 2. Key Features (주요 기능)
- **사용자관리**:
  - 사용자 등록 시 권한 부여 가능.

- **로그인**:
  - 사용자 인증 정보를 통해 로그인합니다.

- **환자 검색**:
  - 메뉴바에서 환자검색을 하면 Session에 정보 저장을 하여 모든 페이지에서 사용 가능.

- **진료차트 조회/검색 필터**:
  - 기본적으로 검색된 환자 기준으로 조회.
  - 날짜, 진료의, 구분, 치아 검색 필터 적용 가능.
  - 치아를 한눈에 볼 수 있도록 프레임을 두어 위치를 표시되어 있습니다. 
 
- **예약 캘린더**:
  - 선택된 날짜에 예약된 환자 정보들을 캘린더에 표시한다.
 
- **접수 현황**:
  - 접수된 환자을 진료중, 진료완료, 접수 취소가 될 때마다 진료 현황에 실시간으로 반영이 된다.

- **재고 미달 현황**:
  - 현재 재고량이 최소보관수량보다 적은 재료를 표시 기능 제공

- **메신저**:
  - 채팅방 실시간 메시지 기능이 제공된다.
  - 메시지가 수신이 되면 메시지 수신 알람 기능 제공된다.

<br/>

## 3. 프로젝트 구조

```
├── src
│   ├── main
│   │   ├── java
│   │   │   └── kroryi
│   │   │       └── his
│   │   │           ├── config
│   │   │           ├── controller
│   │   │           ├── domain
│   │   │           ├── dto
│   │   │           ├── exception
│   │   │           ├── mapper
│   │   │           ├── repository
│   │   │           │   └── search
│   │   │           ├── service
│   │   │           │   └── Impl
│   │   │           └── websocket
│   │   └── resources
│   │       ├── static
│   │       │   ├── css
│   │       │   ├── js
│   │       │   └── toothimage
│   │       └── templates
│   │           ├── board
│   │           ├── layout
│   │           └── user
│   └── test
│       └── java
│           └── kroryi
│               └── his
└── target
    ├── classes
    │   ├── kroryi
    │   │   └── his
    │   │       ├── config
    │   │       ├── controller
    │   │       ├── domain
    │   │       ├── dto
    │   │       ├── exception
    │   │       ├── mapper
    │   │       ├── repository
    │   │       │   └── search
    │   │       ├── service
    │   │       │   └── Impl
    │   │       └── websocket
    │   ├── static
    │   │   ├── css
    │   │   ├── js
    │   │   └── toothimage
    │   └── templates
    │       ├── board
    │       ├── layout
    │       └── user
    ├── generated-sources
    │   └── annotations
    │       └── kroryi
    │           └── his
    │               ├── domain
    │               └── mapper
    ├── generated-test-sources
    │   └── test-annotations
    └── test-classes
        └── kroryi
            └── his
```

<br>

## 4. 역할 분담(재확인 필요)

### 이재준

- **PAGE**
    - layout, 로그인, 환자관리, 진료차트(List목록, PLAN)
- **기능**
    - 환자 검색, 환자 등록/수정/삭제, 환자 메모장 등록/수정/삭제, 진료차트 조회(검색 필터),PLAN 등록/수정/삭제

<br>
    
### 백지영

- **PAGE**
    - 홈(재고현황), 진료차트(CC, PI), 재고관리
- **기능**
    - 재고 조회, CC/PI 등록/수정/삭제, 재료사,재료,입출고, 재고현황 조회/등록/수정/삭제 

<br>

### 김관호

- **PAGE**
    - 예약
- **기능**
    - 환자 예약 등록/수정/삭제 및 예약 현황, 캘린더 현황 조회

<br>

### 정수빈

- **PAGE**
    - 홈(공지사항), 사용자관리, 공지사항
- **기능**
    - 사용자 관리 조회/등록/수정/삭제 , 공지사항 조회/등록/수정/삭제
    
<br>

### 송경섭

- **PAGE**
    - 홈(접수 현황, 예약 현황), 접수
- **기능**
    - 환자 접수 접수, 진료중, 진료완료, 접수 취소 WebSocket을 활용한 실시간 반영
    
<br>

### 최선아

- **PAGE**
    - 재고관리, 메신저
- **기능**
    - 기본 채팅 기능, 알람 기능, 채팅방 관리, 개별 채팅방 삭제 기능
    
<br>

## 5. 개발 기간 및 작업 관리

### 개발 기간

- 전체 개발 기간 : 2024-10-22 ~ 2024-11-14

<br>

### 작업 관리

- GitHub를 사용하여 진행 상황을 공유했습니다.
- Figma를 활용하여 프로젝트의 방향성과 회의 내용을 기록했습니다.

<br>

## 6. 주요 기능(수정진행 필요)

- [접근제한 설정](https://github.com/likelion-project-README/README/wiki/README-6.%EC%8B%A0%EA%B2%BD-%EC%93%B4-%EB%B6%80%EB%B6%84_%EC%A0%91%EA%B7%BC%EC%A0%9C%ED%95%9C-%EC%84%A4%EC%A0%95)

- [Web Socket](https://github.com/ksol0048/HIS/wiki/6.-%EC%A3%BC%EC%9A%94%EA%B8%B0%EB%8A%A5%E2%80%90-WebSocket)

<br>

## 7. 페이지별 기능(영상추가 및 내용 수정 필요요)

### [로그인]
- 서비스 접속 초기화면으로 splash 화면이 잠시 나온 뒤 다음 페이지가 나타납니다.
    - 로그인이 되어 있지 않은 경우 : SNS 로그인 페이지
    - 로그인이 되어 있는 경우 : README 홈 화면
- SNS(카카오톡, 구글, 페이스북) 로그인 기능은 구현되어 있지 않습니다.



<br>

### [Layout && 홈]
- 이메일 주소와 비밀번호를 입력하면 입력창에서 바로 유효성 검사가 진행되고 통과하지 못한 경우 각 경고 문구가 입력창 하단에 표시됩니다.
- 이메일 주소의 형식이 유효하지 않거나 이미 가입된 이메일일 경우 또는 비밀번호가 6자 미만일 경우에는 각 입력창 하단에 경구 문구가 나타납니다.
- 작성이 완료된 후, 유효성 검사가 통과된 경우 다음 버튼이 활성화되며, 버튼을 클릭하면 프로필 설정 화면이 나타납니다.


https://github.com/user-attachments/assets/4b8d071a-2ed7-4870-9662-c9a3d4673af0



<br>

### [사용자관리]
- 회원가입 페이지의 유효성 검사를 통과해야 진입할 수 있습니다.
- 프로필 설정에 필요한 프로필 사진, 사용자 이름, 계정 ID, 소개를 입력받습니다.
- 사용자 이름과 계정 ID는 필수 입력사항입니다.
- 계정 ID에는 형식 및 중복 검사가 진행됩니다.
- 프로필 사진은 등록하지 않을 경우 기본 이미지가 등록됩니다.


<br>

### [환자관리]
- 이메일 주소와 비밀번호를 입력하면 입력창에서 바로 유효성 검사가 진행되고 통과하지 못한 경우 각 경고 문구가 입력창 하단에 표시됩니다.
- 이메일 주소의 형식이 유효하지 않거나 비밀번호가 6자 미만일 경우에는 각 입력창 하단에 경구 문구가 나타납니다.
- 작성이 완료된 후, 유효성 검사가 통과된 경우 로그인 버튼이 활성화됩니다.
- 로그인 버튼 클릭 시 이메일 주소 또는 비밀번호가 일치하지 않을 경우에는 경고 문구가 나타나며, 로그인에 성공하면 홈 피드 화면으로 이동합니다.



https://github.com/user-attachments/assets/b5907f15-f7e7-4210-921d-cd139414bf49



<br>

### [진료차트]
- 상단 의 kebab menu를 클릭 후 나타나는 모달창의 로그아웃 버튼을 클릭하면 확인창이 뜹니다.
- 로그아웃시 로컬 저장소의 토큰 값과 사용자 정보를 삭제하고 초기화면으로 이동합니다.



https://github.com/user-attachments/assets/f30f6525-4245-4112-9897-d49f98313fd9



<br>

### [예약]
- 상단 배너 : 각 페이지별로 다른 종류의 버튼을 가지고 있습니다.
    - 뒤로가기 : 브라우저 상에 기록된 이전 페이지로 돌아갑니다.
    - 검색 : 사용자 검색 페이지로 이동합니다.
    - 사용자 이름 : 채팅룸 페이지의 경우 상대방의 사용자 이름을 보여줍니다.
    - kebab menu : 각 페이지 또는 컴포넌트에 따른 하단 모달창을 생성합니다.
        - 상품, 댓글, 게시글 컴포넌트 - 삭제, 수정, 신고하기
        - 사용자 프로필 페이지 - 설정 및 사용자 정보, 로그아웃
- 하단 탭 메뉴 : 홈, 채팅, 게시물 작성, 프로필 아이콘을 클릭하면 각각 홈 피드, 채팅 목록, 게시글 작성 페이지, 내 프로필 페이지로 이동합니다.


<br>

### [접수]
- 자신이 팔로우 한 유저의 게시글이 최신순으로 보여집니다.
- 팔로우 한 유저가 없거나, 팔로워의 게시글이 없을 경우 검색 버튼이 표시됩니다.
- 게시글의 상단 유저 배너 클릭 시 게시글을 작성한 유저의 프로필 페이지로, 본문 클릭 시 게시글 상세 페이지로 이동합니다.


<br>

### [재고관리]
- 사용자 이름 혹은 계정 ID로 유저를 검색할 수 있습니다.
- 검색어와 일치하는 단어는 파란색 글씨로 표시됩니다.
- 클릭 시 해당 유저의 프로필 페이지로 진입합니다.



https://github.com/user-attachments/assets/b391aff8-ce27-4f0c-af75-60ea2a88dc36



<br>

### [공지사항]
- 사용자 이름 혹은 계정 ID로 유저를 검색할 수 있습니다.
- 검색어와 일치하는 단어는 파란색 글씨로 표시됩니다.
- 클릭 시 해당 유저의 프로필 페이지로 진입합니다.



https://github.com/user-attachments/assets/d70c5e3e-dbd8-4868-a9a6-1e06449b10e5



<br>


### [채팅]
- 채팅 목록에서 아직 읽지 않은 채팅에는 좌측 상단의 파란색 알림을 띄워줍니다.
- 채팅방에서 메시지를 입력하거나 파일을 업로드하면 전송 버튼이 활성화됩니다.
- 채팅방에서 우측 상단의 채팅방 나가기 모달 버튼을 통해 채팅 목록 페이지로 이동할 수 있습니다.
- 채팅 메시지 전송 및 수신 기능은 개발 예정입니다.


<br>

## 10. 프로젝트 후기(수정 필요)

### 🍊 고지연

깃헙을 통한 협업에 익숙해지는 것, 서로 감정 상하지 않고 무사히 마무리하는 것이 1차적인 목표였어서 항상 이 부분을 명심하면서 작업했습니다.
각자 페이지를 작업하고 합치는 과정에서 마주친 버그들이 몇 있었는데, 시간에 쫓기느라 해결하기에 급급해서 제대로 트러블슈팅 과정을 기록하지 못한 게 살짝 아쉬운 부분으로 남습니다. 그래도 2022년 한 해 동안 가장 치열하게 살았던 한 달인 것 같습니다. 조원들 모두에게 고생했다고 전하고 싶습니다🧡

<br>

### 👻 김민제

여러모로 많은 것들을 배울 수 있었던 한 달이었습니다. 혼자서는 할 수 없었던 일이라는 것을 너무 잘 알기에 팀원들에게 정말 감사하다는 말 전하고 싶습니다. 개인적으로 아쉬웠던 부분은 기한 내에 기능을 구현하는 데에만 집중하면서 트러블 슈팅이나 새로 배웠던 것들을 체계적으로 기록하지 못했다는 점입니다. 이렇게 느낀 바가 있으니 이후의 제가 잘 정리하면서 개발할 거라 믿습니다… 하하 다들 수고하셨습니다!!!!

<br>

### 😎 양희지

팀 프로젝트 시작에 앞서 초기 설정을 진행하며 체계적인 설계의 중요성을 느꼈습니다. 앞으로는 점점 더 체계적이고 효율적으로 프로젝트를 진행할 수 있도록 발전하고 싶습니다.
정규 수업 직후에 프로젝트를 진행하면서 배운 내용을 직접 구현하는 과정이 어색했지만 어떤 부분이 부족한지 알 수 있는 기회였습니다. 스스로 최대한 노력해보고 팀원들과 함께 해결해 나가면서 협업의 장점을 체감할 수 있었습니다. 하지만 빠르게 작업을 진행하면서 팀원들과 함께 해결한 이슈가 어떤 이슈이며 어떻게 해결했는지에 대해 자세히 작성하지 못한 것이 아쉽습니다.
’멋쟁이 사자처럼’이라는 같은 목표를 가진 집단에서 프로젝트에 함께할 수 있는 소중한 경험이었습니다. 함께 고생한 조원들 모두 고생하셨습니다! 앞으로도 화이팅해서 함께 목표를 이뤄가고 싶습니다.

<br>

### 🐬 지창언

컨벤션을 정하는 것부터 Readme 파일 작성까지 전 과정을 진행하려니 처음 생각보다 많은 에너지를 썼어요. 좋은 의미로 많이 썼다기보다, 제 능력을 십분 발휘하지 못해서 아쉬움이 남는 쪽입니다. 개발한다고 개발만 해서는 안 된다는 것을 몸소 느껴보는 기간이었던 것 같습니다. 이번 기회로 프로젝트를 진행하면서, 제가 잘하는 점과 부족한 점을 확실하게 알고 가는 건 정말 좋습니다. 기술적인 부분에 있어서는 리액트의 컴포넌트화가 주는 장점을 알았습니다. 조금 느린 개발이 되었을지라도 코드 가독성 부분에 있어서 좋았고, 오류가 발생해도 전체가 아닌 오류가 난 컴포넌트와 근접한 컴포넌트만 살펴보면 수정할 수 있는 부분이 너무 편했습니다. 모두 고생 참 많으셨고 리팩토링을 통해 더 나은 프로젝트 완성까지 화이팅입니다.
