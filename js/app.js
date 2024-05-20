// 使い方説明のtoggleメソッド
$(document).ready(function () {
  // 最初は非表示にする
  $('#toggleDiv').hide();
  $('#toggleButton').click(function () {
    $('#toggleDiv').slideToggle();
  });
});

// ページ読み込み時の関数
$(document).ready(function () {
  // 各要素を取得し変数に格納
  const titleInput = $('#title');
  const textInput = $('#text');
  const saveButton = $('#save');
  const clearButton = $('#clear');
  const list = $('#list');
  const filterInput = $('#filter');
  const localStorageKey = 'memos';

  // ローカルストレージからキーに関連づけられた値（＝保存されたメモ）を取得、なければ（null）空の配列を返す
  let storedMemos = JSON.parse(localStorage.getItem(localStorageKey)) || [];
  // ページ読み込み時に保存されたメモをリストに追加
  // foreach 配列の各要素に対してaddMemo関数実行
  storedMemos.forEach(memo => addMemoToList(memo.title, memo.text, memo.translatedText));
  // コンソールログで確認
  console.log(storedMemos)

  // saveクリック時の関数
  saveButton.on('click', () => {
    // タイトルと本文を取得
    const title = titleInput.val();
    const text = textInput.val();

    // タイトルと本文が入力されている場合
    if (title && text) {
      // テキストを翻訳し、翻訳結果を取得するPromiseを呼び出す
      translateText(text)
        // 翻訳が成功した場合の処理
        .then(translatedText => {
          // メモオブジェクトを作成し、保存されたメモに追加
          const memo = { title, text, translatedText };
          storedMemos.push(memo);
          // ローカルストレージにメモを保存
          localStorage.setItem(localStorageKey, JSON.stringify(storedMemos));
          // メモをリストに追加
          addMemoToList(title, text, translatedText);
          // 入力欄をクリア
          titleInput.val('');
          textInput.val('');
        })
        // 翻訳が失敗した場合の処理
        // エラーをコンソールに表示
        .catch(error => console.error('Error translating text:', error));
    }
  });

  // エンターキーで登録するための処理
$('#title, #text').on('keypress', function(event) {
  if (event.which === 13) { // エンターキーが押されたかどうかを確認
    event.preventDefault(); // デフォルトのエンターキーの動作を無効にする
    saveButton.click(); // 登録ボタンをクリックする
  }
});

  // clearクリック時の関数
  clearButton.on('click', () => {
    // ローカルストレージからキーに関連づけられたデータを削除
    localStorage.removeItem(localStorageKey);
    // 空の配列でリセット
    storedMemos = [];
    // listの中身を空にする
    list.empty();
  });

  // フィルタリング機能の関数
  filterInput.on('input', () => {
    // フィルター入力欄の値を取得→小文字に変換して大文字との区別をなくす
    const filter = filterInput.val().toLowerCase();
    // メモのリストを空にする
    list.empty();
    // storedMemos配列からフィルターに一致するメモを抽出
    // filter変数に含まれる文字列が各メモのタイトルに含まれているかをチェック
    storedMemos.filter(memo => memo.title.toLowerCase().includes(filter)).forEach(memo => addMemoToList(memo.title, memo.text, memo.translatedText));
  });
  // フィルタリングされたメモの配列にaddMemoToList関数を使ってリスト表示する

  // メモをリストに追加する関数
  function addMemoToList(title, text, translatedText) {
    // 新しいli要素作成し、cssを追加
    const li = $('<li></li>').addClass('m-5 p-2 border-solid border-2 border-slate-500 rounded-xl hover:bg-pink-50');
    // テンプレートリテラル 関数の引数を表示
    li.html(`
      <h3 class='font-bold m-4'>${title}</h3>
      <p class='text-gray-500 m-4'>日本語: ${text}</p>
      <p class='text-gray-700 m-4'>中国語: ${translatedText}</p>
      <button class='delete-btn m-4 p-2 hover:bg-red-400 rounded-xl'>
        <i class="fas fa-trash"></i>
      </button>
    `);
    list.prepend(li);

    // deleteクリック時の処理
    // liからdelete-btnを持つ要素を探して以下実行
    li.find('.delete-btn').on('click', () => {
      li.remove();
      // 削除する配列がどこにあるかを見つけ、findIndexメソッドで条件に一致する要素を取得
      // 配列内で最初に見つかった位置のインデックス（配列内の順番）を返す。見つからない場合は-1
      const index = storedMemos.findIndex(memo => memo.title === title && memo.text === text && memo.translatedText === translatedText);
      // 削除対象のメモが見つかった場合（-1でない）のみ、削除
      if (index !== -1) {
        // storedMemos配列から削除対処のメモを削除
        // spliceメソッド 指定された位置から指定された数の要素を削除
        // 第一引数に削除開始位置のインデックス、第二引数に削除する要素の数を指定
        storedMemos.splice(index, 1);
        // 削除後のメモをローカルストレージに保存
        localStorage.setItem(localStorageKey, JSON.stringify(storedMemos));
      }
    });
  }

  // 指定されたテキストを翻訳する関数
  function translateText(text) {
    // MyMemory APIを使用
    // encodeURIComponent関数でテキストをURIエンコードして特殊文字を含む場合でも正しく動作する
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ja|zh-CN`;

    // fetch関数→作成したURLにリクエストを送信し、結果としてPromiseを返す
    return fetch(url)
      // 成功した場合
      // fetchメソッドが返したPromiseを解決し、JSON形式に変換
      .then(response => response.json())
      // 変換されたJSONデータから翻訳されたテキストを取り出す
      .then(data => data.responseData.translatedText)
      // 失敗した場合
      .catch(error => {
        // コンソールにエラーメッセージ表示
        console.error('Error translating text:', error);
        return '翻訳エラー';
      });
  }
});
