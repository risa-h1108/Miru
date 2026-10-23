-- Miru: RLS(行レベルセキュリティ)の設定記録
-- ※実行済みの内容の記録。作成済みの DB に再実行すると「already exists」で止まるものがある

-- =====================================================================
-- 0. テスト記録を消す(1回限り・既存 DB のみ)
--    user_id を NOT NULL で足す前に、名札のない行(idがない行)を消す必要があったため
--    ※データを消す操作(元に戻せない)なので、間違って実行しないようコメントアウトしてある
-- =====================================================================
-- delete from decision_reasons;    -- 子(理由)を先に消す。親を先に消すと、参照されているので失敗することがある
-- delete from decisions;           -- 親(記録)を消す。where が無いので全行が対象


-- =====================================================================
-- 1. decisions に「持ち主の名札(user_id カラム)」を追加
-- =====================================================================
alter table decisions
  add column user_id uuid          -- 型は auth.users の id と同じ uuid
    not null                       -- 名札なしの行は禁止
    default auth.uid()             -- 入れ忘れたら、ログイン中の本人の ID を DB が自動で入れる
    references auth.users(id)      -- auth.users に存在する ID だけ許可(外部キー)
    on delete cascade;             -- ユーザーが消えたら、その人の記録も一緒に消す


-- =====================================================================
-- 2. RLS を有効にする(有効でないと、ポリシーは働かない)
--    ※Supabase のテーブルは、すでに有効になっていた(暫定ポリシーが効いていたため)。再現用に記録
-- =====================================================================
alter table decisions        enable row level security;   -- decisions で RLS を有効化。ポリシーが無い操作は、全行が拒否される
alter table decision_reasons enable row level security;   -- decision_reasons も同じ
alter table action_masters   enable row level security;   -- action_masters(行動の選択肢)も同じ
alter table reason_masters   enable row level security;   -- reason_masters(理由の選択肢)も同じ


-- =====================================================================
-- 3. テーブルを「使う」権限(GRANT)。ログイン済み(ゲスト含む)に渡す
--    GRANT は「建物に入れるか」、RLS は「どの郵便受けを開けるか」。両方そろって初めて動く
--    delete は、アプリで使っていないので付けない(権限は最小限にする)
-- =====================================================================
grant select, insert, update on public.decisions        to authenticated;  -- 記録: 読む・保存・更新(振り返りで update を使う)
grant select, insert         on public.decision_reasons to authenticated;  -- 理由: 読む・保存(あとから更新はしない)
grant select                 on public.action_masters   to authenticated;  -- 行動の選択肢: 読むだけ
grant select                 on public.reason_masters   to authenticated;  -- 理由の選択肢: 読むだけ


-- =====================================================================
-- 4. マスタ: ログイン済みなら全行を読める(全員共通のデータなので、条件なし)
-- =====================================================================
create policy "authenticated can read action_masters"   -- ポリシーの名前(あとで見て分かる名前にする)
  on public.action_masters                              -- どのテーブルに
  for select                                            -- どの操作を(読む)
  to authenticated                                      -- 誰に(ログイン済み。ゲストを含む)
  using (true);                                         -- どの行を?：常に true なので、全行

create policy "authenticated can read reason_masters"
  on public.reason_masters
  for select
  to authenticated
  using (true);


-- =====================================================================
-- 5. decisions: 自分の行だけ読む・保存する・更新する
-- =====================================================================
create policy "users can select own decisions"
  on public.decisions
  for select
  to authenticated
  using (user_id = auth.uid());       -- すでにある行のうち、名札がログイン中の本人の ID と一致する行だけ見える

create policy "users can insert own decisions"
  on public.decisions
  for insert
  to authenticated
  with check (user_id = auth.uid());  -- これから書く行の名札が、本人の ID のときだけ保存できる(insert は using ではなく with check)

create policy "users can update own decisions"
  on public.decisions
  for update
  to authenticated
  using (user_id = auth.uid())        -- 更新の「対象」にできるのは、自分の行だけ
  with check (user_id = auth.uid());  -- 更新した「あと」の行も、自分の行のまま(他人の ID に書き換える抜け道をふさぐ)


-- =====================================================================
-- 6. decision_reasons: 親の decisions の持ち主を見て判定(user_id は持たない)
-- =====================================================================
create policy "users can select own decision_reasons"
  on public.decision_reasons
  for select
  to authenticated
  using (
    exists (                                          -- 条件に合う行が 1 つでもあれば OK
      select 1                                        -- 中身は何でもよい。「行があるか」だけ見る
      from public.decisions d                         -- 親の記録を探す(d は decisions の短い呼び名)
      where d.id = decision_reasons.decision_id       -- この理由がぶら下がっている親
        and d.user_id = auth.uid()                    -- その親の持ち主が、ログイン中の本人
    )
  );

create policy "users can insert own decision_reasons"
  on public.decision_reasons
  for insert
  to authenticated
  with check (
    exists (                                          -- 書き込む理由の親が、自分の記録のときだけ OK
      select 1
      from public.decisions d
      where d.id = decision_reasons.decision_id       -- 書き込む理由がぶら下がる親
        and d.user_id = auth.uid()                    -- その親の持ち主が本人(他人の記録に、理由を差し込めない)
    )
  );


-- =====================================================================
-- 7. 暫定の全許可ポリシー(anon 向け)を削除
--    残すと、ログインしていない人が全データを読み書きできてしまう
--    if exists: すでに消えている DB で実行しても、エラーで止まらないように追記
-- =====================================================================
drop policy if exists "Allow all for anon (temporary)" on public.decisions;
drop policy if exists "Allow all for anon (temporary)" on public.decision_reasons;
drop policy if exists "Allow all for anon (temporary)" on public.action_masters;
drop policy if exists "Allow all for anon (temporary)" on public.reason_masters;