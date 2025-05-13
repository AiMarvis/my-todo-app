# Supabase를 활용한 사용자 관리 시스템

## 구현 내용

### 1. 사용자 인증 (Auth)

- Supabase Auth를 사용하여 사용자 등록 및 로그인 구현
- 이메일/비밀번호 기반 인증 시스템
- 로그인 상태 유지 및 세션 관리

### 2. 사용자 프로필 (Profiles)

- 사용자 정보 저장을 위한 profiles 테이블 생성
- 사용자 등록 시 자동으로 프로필 레코드 생성 (트리거 사용)
- 프로필 정보 조회 및 업데이트 기능

### 3. 보안 설정 (RLS)

- Row Level Security를 통한 데이터 접근 제어
- 사용자는 자신의 프로필만 조회 및 수정 가능
- 할 일 데이터는 해당 사용자만 접근 가능

## 주요 코드 파일

- `src/hooks/useSupabaseUser.js`: 사용자 정보를 관리하는 커스텀 훅
- `src/components/UserProfile.js`: 사용자 프로필 표시 및 수정 컴포넌트
- `src/app/profile/page.js`: 사용자 프로필 페이지
- `src/migrations/create_profiles_table.sql`: 프로필 테이블 생성 SQL

## Supabase 설정 방법

### 1. 테이블 생성

Supabase 대시보드 또는 SQL 에디터에서 `create_profiles_table.sql` 파일의 내용을 실행하여 프로필 테이블과 관련 트리거를 생성합니다.

### 2. RLS(Row Level Security) 설정

모든 테이블에 RLS를 활성화하고, 다음 정책들을 적용합니다:

- profiles 테이블: 사용자는 자신의 프로필만 읽고 수정 가능
- todos 테이블: 사용자는 자신의 할 일만 읽고, 추가, 수정, 삭제 가능

### 3. 클라이언트 사용법

```javascript
// 사용자 정보 가져오기 및 관리
const { user, userDetails, loading, error, updateUserProfile } = useSupabaseUser({
  fetchUserDetails: true
});

// 프로필 업데이트
const updated = await updateUserProfile({
  name: '홍길동',
  bio: '안녕하세요. 반갑습니다.'
});
```

## useEffect와 getUser 사용

useSupabaseUser 훅은 내부적으로 useEffect와 getUser 함수를 사용하여 다음과 같은 작업을 수행합니다:

1. 컴포넌트 마운트 시 사용자 정보 로드
2. 인증 상태 변경 이벤트 구독
3. 프로필 정보 가져오기 및 업데이트

getUser 함수는 Supabase auth API를 호출하여 현재 로그인한 사용자의 정보를 가져오고, 필요에 따라 사용자 프로필 정보도 함께 조회합니다.

## 주의사항

- 프로필 테이블에 새 필드를 추가할 때는 handle_new_user 트리거 함수도 함께 업데이트해야 합니다.
- 프로덕션 환경에서는 보안 검토를 통해 RLS 정책을 재확인하세요.
- Supabase 클라이언트 키는 환경 변수로 관리하세요. 