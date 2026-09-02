-- コメント・データ・添付ファイルの削除権限機能の追加
-- 実行日: 2026-09-02
-- 対象DB: dx_test

-- dxwg（DXWG）に、課題を登録したユーザーの社員番号を保存するカラムを追加
ALTER TABLE public.dxwg
  ADD COLUMN employee_no VARCHAR(100);

-- dxlists（社内DX・社外DX）に、課題を登録したユーザーの社員番号を保存するカラムを追加
ALTER TABLE public.dxlists
  ADD COLUMN employee_no VARCHAR(100);
