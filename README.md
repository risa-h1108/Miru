# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

## Supabase の設定

コードの履歴(Git)には残らない、ダッシュボードの設定です。
別の環境で作り直す場合は、同じ設定にしてください。

| 項目                             | 設定                                |
| -------------------------------- | ----------------------------------- |
| Email / Password でのログイン    | 有効                                |
| 匿名サインイン(ゲストログイン用) | ON                                  |
| Confirm email(メール確認)        | OFF(開発効率を優先。公開前に見直す) |
| 最小パスワード長                 | 8文字                               |
| パスワード要件                   | 文字と数字                          |

パスワード関連の2つは、Authentication の Email プロバイダーの設定にあります。

## セキュリティ(RLS)

Supabase の Row Level Security(行レベルセキュリティ)で、
ユーザーごとにデータを分離しています。

### 方針

- ブラウザから直接 Supabase を呼ぶ構成のため、フロントのコードだけでは
  他人のデータを守れません。そのため DB 側で、「自分の行だけ」読み書き
  できるように制限しています。
- ゲストログイン(匿名サインイン)も、通常ユーザーと同じ `authenticated`
  として扱い、同じルールで分離しています。
- ログインしていない(`anon`)アクセスは、全テーブルで許可していません。

### テーブルごとの扱い

| テーブル                        | 読む                                | 書く                          |
| ------------------------------- | ----------------------------------- | ----------------------------- |
| decisions                       | 自分の行だけ                        | 自分の行だけ(insert / update) |
| decision_reasons                | 親の decisions が自分の行のものだけ | 同左(insert)                  |
| action_masters / reason_masters | ログイン済みなら全員                | なし(読み取り専用)            |

### 設計の判断

- `decisions.user_id` は `default auth.uid()` にして、アプリ側が入れ忘れても、
  DB がログイン中のユーザーの ID を自動(`default`)で入れます。
  `not null` も付けているので、`user_id` が空の行は保存できません。
- `user_id` に他人の ID を送って保存しようとしても、insert のポリシー
  (`with check`)で拒否され、偽装を防ぎます。
- `decision_reasons` には `user_id` を持たせず、親の `decisions` の持ち主で
  判定します。持ち主の情報が1か所だけなので、親と子で食い違いが起きません。

### 注意点

- RLS で拒否された select は、エラーではなく「空っぽ」で返ります。
- 管理画面の Table Editor は RLS を無視するので、全ユーザーの行が見えます。
  動作確認は、アプリの画面で実施します。

設定の SQL は [`supabase/rls.sql`](supabase/rls.sql) に記録しています。
