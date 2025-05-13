import { createClient } from '@supabase/supabase-js'; // Supabase 클라이언트 생성 함수 가져오기

// 환경 변수에서 Supabase URL과 API Key를 가져옵니다.
// 실제 프로젝트에서는 .env.local 파일에 저장하세요
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yixiczpnxuwuwdxiforh.supabase.co'; // Supabase URL 설정
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpeGljenBueHV3dXdkeGlmb3JoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNjAwMzMsImV4cCI6MjA2MjYzNjAzM30.cJKnyWL59h8iuVnMY_v_7wmnki3DnktkG9Q5_e4oWPA'; // 익명 키 설정

// Supabase 클라이언트 인스턴스 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey); // 클라이언트 생성 및 내보내기 