-- Supabase 대시보드에서 실행할 SQL
CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 정책 설정 (Row Level Security)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 사용자가 자신의 Todo만 접근할 수 있도록 정책 생성
CREATE POLICY "사용자는 자신의 할 일만 볼 수 있음" ON todos
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "사용자는 자신의 할 일만 추가할 수 있음" ON todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "사용자는 자신의 할 일만 수정할 수 있음" ON todos
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "사용자는 자신의 할 일만 삭제할 수 있음" ON todos
  FOR DELETE USING (auth.uid() = user_id); 