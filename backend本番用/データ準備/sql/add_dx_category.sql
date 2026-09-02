-- 社内DX用カテゴリー機能の追加
-- 実行日: 2026-09-02
-- 対象DB: dx_test

-- ① dxlists に category カラムを追加
--    dxwg.category と同様に、カテゴリーマスタ(dx_category)の id を複数格納する integer 配列とする
ALTER TABLE public.dxlists
  ADD COLUMN category integer[];

-- ② dx_category テーブルを作成
--    dxwg_category と同様の構造（カテゴリーマスタ）
CREATE TABLE public.dx_category (
  id        SERIAL PRIMARY KEY,
  name      VARCHAR(100),
  sort_key  INTEGER
);

-- ③ dx_category マスタデータ投入
INSERT INTO public.dx_category (name, sort_key) VALUES
  ('事務', 1),
  ('技術', 2),
  ('営業', 3),
  ('BPO', 4);

-- ④ dxlists（division=true：社内DX）の既存データに、部署(department)を基準にカテゴリを設定
--    department=1(--)のみ判断材料がなく対象外（categoryは未設定のまま）
--    department=22(西日本支社)は個別のwork内容（システム運用保守）から「技術」と判断
--    department=23(福岡支社)は個別のwork内容（マネジメント資料のデータ化）から「事務」と判断

-- 事務(1): 総務部/人事部/経営管理部/財務部/東京本社マネジメント推進部/経営戦略部/福岡支社
UPDATE public.dxlists
  SET category = ARRAY[1]
  WHERE division = true
    AND department IN (2, 3, 4, 6, 31, 33, 23);

-- 技術(2): ITサービスプロモート部/システムサービス部/インフラビジネス推進部/ソリューション開発部/
--          東日本施設予約サービス推進部/施設予約サービス部/ソリューションサービス部/公共ソリューション部/
--          標準化・ガバメントクラウド推進部/西日本支社
UPDATE public.dxlists
  SET category = ARRAY[2]
  WHERE division = true
    AND department IN (11, 16, 21, 24, 25, 27, 28, 29, 37, 22);

-- 営業(3): ビジネス営業部
UPDATE public.dxlists
  SET category = ARRAY[3]
  WHERE division = true
    AND department IN (32);

-- BPO(4): BPO推進部
UPDATE public.dxlists
  SET category = ARRAY[4]
  WHERE division = true
    AND department IN (30);
