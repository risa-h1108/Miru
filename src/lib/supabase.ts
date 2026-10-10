//Supabaseと通信するための窓口

import { createClient } from "@supabase/supabase-js";

//Supabaseプロジェクトの住所(URL)　.envに書いた値をVite経由で読み込む
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

//Supabaseにアクセスするための鍵(Publishable(公開可能)キー＝anon(匿名)キー)
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

//URLと鍵をcreateClientに渡してSupabaseとやり取りするための
// 「窓口/クライアント(createClientの戻り値、完成品)」を作成する
//これ以降はこのsupabase変数を経由して、
// 他ファイルでデータの取得(select)や保存(insert)を使えるようsupabaseの名称でexportする
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
