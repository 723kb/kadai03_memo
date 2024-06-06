// 使い方説明のtoggleメソッド
$(document).ready(() => {
  // 最初は非表示にする
  $('#toggleDiv').hide();
  $('#toggleButton').click(() => {
    $('#toggleDiv').slideToggle();
  });

  // フィルタリング機能説明のtoggleメソッド
  $("#filterArea").hide();
  $("#search").on("click", () => {
    $("#filterArea").slideToggle();
  });

  // 各要素を取得し変数に格納
  const titleInput = $('#title');
  const textInput = $('#text');
  const saveButton = $('#save');
  const clearButton = $('#clear');
  const list = $('#list');
  const filterInput = $('#filter');
  const localStorageKey = 'memos';

  // メモをリストに追加する関数
  const addMemoToList = (title, text, translatedText) => {
    // 新しいli要素作成→cssを追加→リストに追加
    const li = $('<li></li>').addClass('m-5 p-2 border-solid border-2 border-slate-500 rounded-xl hover:bg-pink-50');
    li.html(`
      <h3 class='font-bold m-4'>タイトル: ${title}</h3>
      <p class='text-gray-500 m-4'>日本語: <span class='jp-text'>${text}</span></p>
      <p class='text-gray-700 m-4'>中国語: <span class='cn-text'>${translatedText}</span></p>
      <button class='edit-btn m-4 p-2 hover:bg-green-400 rounded-xl'>
        <i class="fas fa-edit"></i>
      </button>
      <button class='delete-btn m-4 p-2 hover:bg-red-400 rounded-xl'>
        <i class="fa-regular fa-trash-can"></i>
      </button>
      <button class="speak-memo m-4 p-2 hover:bg-blue-400 rounded-xl">
        <i class="fa fa-volume-up"></i>
      </button>
    `);
    list.prepend(li);

    // deleteクリックイベント
    // liからdelete-btnを持つ要素を探して以下実行
    li.find('.delete-btn').on('click', () => {
      li.remove();
      // 削除する配列がどこにあるかを見つけ、findIndexメソッドで条件に一致する要素を取得
      // 配列内で最初に見つかった位置のインデックス(配列内の順番)を返す。見つからない場合は-1
      const index = storedMemos.findIndex(memo => memo.title === title && memo.text === text && memo.translatedText === translatedText);
      // 削除対象のメモが見つかった場合(-1でない)のみ、削除
      if (index !== -1) {
        // storedMemos配列から削除対象のメモを削除
        // spliceメソッド 第一引数:削除開始位置のインデックス 第二引数:削除する要素の数
        storedMemos.splice(index, 1);
        // 削除後のメモをローカルストレージに保存
        localStorage.setItem(localStorageKey, JSON.stringify(storedMemos));
      }
    });

    // editクリックイベント
    li.find('.edit-btn').on('click', async () => {
      // liから各クラス名を持つ要素を取得し変数に格納
      const jpTextElement = li.find('.jp-text');
      const cnTextElement = li.find('.cn-text');
      // 現在の日本語本文の内容を取得し変数に格納
      const originalText = jpTextElement.text();
      // 新しい日本語本文を入力するプロンプト表示→入力された内容を変数へ格納 初期値:originalTextを表示
      const newText = prompt('編集する日本語テキスト:', originalText);
      // ユーザーがキャンセルせず(nullでない)、かつ新本文が旧本文と異なる場合に以下実行
      if (newText !== null && newText !== originalText) {
        try {
          // 新しい日本語テキストを翻訳
          const translatedText = await translateText(newText);
          // 日本語テキストと中国語テキストを更新
          jpTextElement.text(newText);
          cnTextElement.text(translatedText);
          // 配列内からtitleとoriginalTextの両方合うものを探す
          const index = storedMemos.findIndex(memo => memo.title === title && memo.text === originalText);
          // 見つかった(インデックスが-1でない)場合に以下実行
          if (index !== -1) {
            // 日本語テキスト更新
            storedMemos[index].text = newText;
            // 翻訳テキスト更新
            storedMemos[index].translatedText = translatedText;
            // 更新された配列をローカルストレージに再度保存
            localStorage.setItem(localStorageKey, JSON.stringify(storedMemos));
          }
        } catch (error) {
          // エラーハンドリング
          console.error('Error translating text:', error);
        }
      }
    });

    // スピーカーボタンのクリックイベント
    li.find('.speak-memo').on('click', function () {
      console.log('スピーカーボタンがクリックされました。'); // デバッグ用メッセージ
      // .cn-text要素を取得し、その内容をログに表示
      const cnTextElement = $(this).closest('li').find('.cn-text'); // ここを修正
      console.log("cn-text element:", cnTextElement); // 追加
      const textToSpeak = cnTextElement.text();
      console.log("Text to speak:", textToSpeak); // 追加: スピーカーボタンがクリックされたときのテキストをログに出力
      speakText(textToSpeak);
    });
  };

  // ローカルストレージから保存されたメモを取得、なければ（null）空の配列を返す
  let storedMemos = JSON.parse(localStorage.getItem(localStorageKey)) || [];
  // foreach:配列の各要素に対してaddMemo関数実行 = ページ読み込み時に保存されたメモをリストに追加
  storedMemos.forEach(memo => addMemoToList(memo.title, memo.text, memo.translatedText));

  // コンソールログで確認
  console.log(storedMemos, "配列の中身");
  console.log(localStorageKey, "鍵の名前");

  // saveクリックイベント
  saveButton.on('click', () => {
    saveMemo();
  });

  // EnterKeyで保存
  $(document).on('keypress', (e) => {
    if (e.which == 13) {
      saveMemo();
    }
  });

  // メモを保存する関数
  const saveMemo = async () => {
    // タイトルと本文を取得
    const title = titleInput.val();
    const text = textInput.val();

    // タイトルと本文が入力されている場合のみ処理を行う
    if (title && text) {
      try {
        // テキストを翻訳(await 完了するまでに次の処理に行かない)
        const translatedText = await translateText(text);
        // メモオブジェクトを作成し、保存されたメモ配列に追加
        const memo = { title, text, translatedText };
        storedMemos.push(memo);
        // ローカルストレージにメモを保存
        localStorage.setItem(localStorageKey, JSON.stringify(storedMemos));
        // メモをリストに追加
        addMemoToList(title, text, translatedText);
        // 入力欄をクリア
        titleInput.val('');
        textInput.val('');
      } catch (error) {
        // エラーハンドリング 失敗した時にコンソールでエラーメッセージ表示
        console.error('Error translating text:', error);
      }
    }
  }

  // clearクリックイベント
  clearButton.on('click', () => {
    // ローカルストレージからキーに関連づけられたデータを削除
    localStorage.removeItem(localStorageKey);
    // 確認メッセージを表示し、OKが押された場合のみ削除を実行
    if (confirm("本当に削除しますか？")) {
      // 空の配列でリセット
      storedMemos = [];
      // listの中身を空にする
      list.empty();
    }
  });

  // フィルタ入力欄で入力があった時の処理
$('#searchButton').on('click', () => {
    // フィルター入力欄の値を取得→小文字に変換して大文字との区別をなくす
    const filter = filterInput.val().toLowerCase();
    list.empty();
    // storedMemos配列からフィルターに一致するメモを抽出
    // filter変数に含まれる文字列が各メモのタイトルに含まれているかをチェック
    const filteredMemos = storedMemos.filter(memo => memo.title.toLowerCase().includes(filter));
    if (filteredMemos.length === 0) { // 配列の長さが0なら条件に一致するものはない
      $('#noMemosMessage').show();
    } else {
      $('#noMemosMessage').hide();
      filteredMemos.forEach(memo => addMemoToList(memo.title, memo.text, memo.translatedText));
    }

// フィルター入力欄を空にする処理
$('#filterClear').on('click', () => {
  $('#filter').val(''); // フィルター入力欄を空にする
  // メモを再読み込みする
  list.empty(); // リストを空にする
  storedMemos.forEach(memo => addMemoToList(memo.title, memo.text, memo.translatedText));
});
  });

  // MyMemory APIを使って指定されたテキストを翻訳する関数
  const translateText = async (text) => {
    console.log("Translating text:", text); // テキストが正しく渡されていることを確認
    // encodeURIComponent関数でテキストをURIエンコードすると特殊文字を含む場合でも正しく動作する
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ja|zh-CN`;
    try {
      // APIリクエストを送信し、レスポンスを取得 (fetch 指定されたURLにリクエスト送信)
      const response = await fetch(url);
      const data = await response.json();
      console.log("API response inside translateText function:", data);
      // エラーがあれば例外をスロー
      if (data && data.responseData && data.responseData.translatedText) {
        console.log("Translated text:", data.responseData.translatedText);
        return data.responseData.translatedText;
      } else {
        throw new Error('Translation error: Translated text not found in response data');
      }
    } catch (error) {
      // エラーハンドリング
      console.error('Error translating text:', error);
      throw error;
    }
  }
  // メモを音読する関数
  const speakText = (text) => {
    console.log('音読関数が呼び出されました。');
    // ブラウザがWeb Speech APIのspeechSynthesisに対応しているかを確認
    if ('speechSynthesis' in window) {
      // 音声合成用のUtteranceオブジェクトを作成
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN'; // 中国語に設定
      // テキストを音声で読み上げる
      console.log("音読開始:", text); // コンソールログを追加
      speechSynthesis.speak(utterance);
    } else {
      // ブラウザが音声合成に対応していない場合の処理
      alert('このブラウザは音声合成に対応していません。');
    }
  };
});



// Promiseと明示しなくてもfetchは暗黙的にPromiseを返す!
// そのため,then(), awaitで非同期的に結果を処理できる

// async, awaitで書く方が可読性が上がり、エラーハンドリングも一貫するため推奨されている →あまりよくわからない...
// async には.thenもawaitも使えるが、awaitはasyncの中でしか使えない