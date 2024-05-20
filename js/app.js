$(document).ready(function() {
  const titleInput = $('#title');
  const textInput = $('#text');
  const saveButton = $('#save');
  const clearButton = $('#clear');
  const list = $('#list');
  const filterInput = $('#filter');
  const localStorageKey = 'memos';

  let storedMemos = JSON.parse(localStorage.getItem(localStorageKey)) || [];
  storedMemos.forEach(memo => addMemoToList(memo.title, memo.text, memo.translatedText));

  saveButton.on('click', () => {
    const title = titleInput.val();
    const text = textInput.val();

    if (title && text) {
      translateText(text)
        .then(translatedText => {
          const memo = { title, text, translatedText };
          storedMemos.push(memo);
          localStorage.setItem(localStorageKey, JSON.stringify(storedMemos));
          addMemoToList(title, text, translatedText);
          titleInput.val('');
          textInput.val('');
        })
        .catch(error => console.error('Error translating text:', error));
    }
  });

  clearButton.on('click', () => {
    localStorage.removeItem(localStorageKey);
    storedMemos = [];
    list.empty();
  });

  filterInput.on('input', () => {
    const filter = filterInput.val().toLowerCase();
    list.empty();
    storedMemos.filter(memo => memo.title.toLowerCase().includes(filter)).forEach(memo => addMemoToList(memo.title, memo.text, memo.translatedText));
  });

  function addMemoToList(title, text, translatedText) {
    const li = $('<li></li>').addClass('m-5 p-2 border-solid border-2 border-slate-500 rounded-xl hover:bg-pink-50');
    li.html(`
      <h3 class='font-bold m-4'>${title}</h3>
      <p class='text-gray-500 m-4'>日本語: ${text}</p>
      <p class='text-gray-700 m-4'>中国語: ${translatedText}</p>
      <button class='delete-btn m-4 p-2 hover:bg-red-400 rounded-xl'>
        <i class="fas fa-trash"></i>
      </button>
    `);
    list.prepend(li);

    li.find('.delete-btn').on('click', () => {
      li.remove();
      const index = storedMemos.findIndex(memo => memo.title === title && memo.text === text && memo.translatedText === translatedText);
      if (index !== -1) {
        storedMemos.splice(index, 1);
        localStorage.setItem(localStorageKey, JSON.stringify(storedMemos));
      }
    });
  }

  function translateText(text) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ja|zh-CN`;

    return fetch(url)
      .then(response => response.json())
      .then(data => data.responseData.translatedText)
      .catch(error => {
        console.error('Error translating text:', error);
        return '翻訳エラー';
      });
  }
});
