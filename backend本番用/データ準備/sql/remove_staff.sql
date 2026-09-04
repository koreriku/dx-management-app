-- 社内DXの担当者項目（staff）の削除
-- 実行日: 2026-09-04
-- 対象DB: dx_test

-- dxlists（社内DX）から、担当者を保存していたカラムを削除
ALTER TABLE public.dxlists
  DROP COLUMN staff;
