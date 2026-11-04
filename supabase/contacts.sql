-- supabaseでのお問い合わせテーブル作成SQL

create table contacts (
  -- 入れなければDBが自動で作る。
  -- uuid:重複しない長いID。
  -- primary key: 1件を特定するための列。
  -- default ...: 値を渡さなかったときに自動で入る値。
  id uuid primary key default gen_random_uuid(),

  -- 受付日時。入れなければDBが今の時刻を自動で入れる
  -- timestamptz: タイムゾーン付きの日時。
  created_at timestamptz not null default now(),

  -- フォームの4項目。
  -- not null:値なし(null)では保存できない。
  --          ※空文字("")は通るため、空欄のチェックは画面側(required)でも行う
  name text not null,
  email text not null,
  category text not null,   -- "bug" など value を保存する
  contents text not null
);

-- RLSとGRANTのSQL

-- 1.RLSを有効にする(行の関門を作る)
-- enable row level security:これを実行すると、ポリシーがない操作はすべて拒否される
alter table contacts enable row level security;

-- 2.GRANT:入口の権限。insertだけ渡して許可する(selectなどはポリシーがないので拒否される)
-- anon:ログインしていない人、authenticated:ログイン中の人(ゲストも含む)
grant insert on contacts to anon, authenticated;

-- 3.ポリシー:行の関門。insertを通す
create policy "Anyone can insert contacts"
  on contacts
  for insert
  to anon, authenticated
  -- with check (true):「insertする行は、条件なしで通す」という意味
  with check (true);


--1文字以上の入力が必要、半角スペースだけの入力はDB側で受け付けない
  alter table contacts
  add constraint contacts_not_blank check (
    -- length(...) > 0:1文字以上あるか確認
    -- trim:前後の半角スペースを取る(半角スペースだけの入力を止める)
    length(trim(name)) > 0
    and length(trim(email)) > 0
    and length(trim(category)) > 0
    and length(trim(contents)) > 0
  );