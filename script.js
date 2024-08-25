// カードデータの定義
const movieCards = [
  { img: '/media/noimage.svg', caption: '【製作中】特撮「ブラッドマン」' },
  { img: '/media/noimage.svg', caption: '【製作中】CGアニメ「トレイン」' },
  { img: '/media/noimage.svg', caption: '【製作中】映画「傷と蝶」' },
  { img: '/media/noimage.svg', caption: 'MV「魔法」' }
];

const newsCards = [
  { img: '/media/noimage.svg', caption: 'ページを公開しました。' },
  { img: '/media/noimage.svg', caption: 'News 2 Description' },
  { img: '/media/noimage.svg', caption: 'News 3 Description' },
  { img: '/media/noimage.svg', caption: 'News 4 Description' }
];

// カードを生成してDOMに追加する関数
function addCards(containerId, cards, limit = null) {
  const container = document.getElementById(containerId);
  const cardList = limit ? cards.slice(0, limit) : cards;

  cardList.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.className = 'card';

    const imgElement = document.createElement('img');
    imgElement.src = card.img;
    imgElement.alt = card.caption;

    const captionElement = document.createElement('div');
    captionElement.className = 'card-caption';
    captionElement.innerText = card.caption;

    cardElement.appendChild(imgElement);
    cardElement.appendChild(captionElement);
    container.appendChild(cardElement);
  });
}

// ページに応じたカードの表示
if (window.location.pathname.includes('index.html')) {
  // index.htmlでは最新3つのみ表示
  addCards('movie-container', movieCards, 3);
  addCards('news-container', newsCards, 3);
} else if (window.location.pathname.includes('all-movies.html')) {
  // all-movies.htmlではすべての映画カードを表示
  addCards('movie-container', movieCards);
} else if (window.location.pathname.includes('news.html')) {
  // news.htmlではすべてのニュースカードを表示
  addCards('news-container', newsCards);
}


// メニューを読み込む関数
function loadMenu() {
  fetch('menu.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('menuContainer').innerHTML = data;

      // メニューボタンのクリックイベントリスナーを追加
      const menuToggle = document.getElementById('menuToggle');
      const closeMenu = document.getElementById('closeMenu');
      const menu = document.querySelector('nav .menu');

      // 初期表示時にサイズに応じてメニューの状態を設定
      if (window.innerWidth > 600) {
        menu.classList.add('expanded');
        menuToggle.style.display = 'none';
        closeMenu.style.display = 'none';
      } else {
        menu.classList.remove('expanded');
        menuToggle.style.display = 'block';
        closeMenu.style.display = 'none';
      }

      menuToggle.addEventListener('click', () => {
        menu.classList.toggle('expanded');
        menuToggle.style.display = 'none';
        closeMenu.style.display = 'block';
      });

      closeMenu.addEventListener('click', () => {
        menu.classList.toggle('expanded');
        menuToggle.style.display = 'block';
        closeMenu.style.display = 'none';
      });

      // 画面サイズが変更されたときにメニュー状態を更新
      window.addEventListener('resize', () => {
        if (window.innerWidth > 600) {
          menu.classList.add('expanded');
          menuToggle.style.display = 'none';
          closeMenu.style.display = 'none';
        } else {
          menu.classList.remove('expanded');
          menuToggle.style.display = 'block';
          closeMenu.style.display = 'none';
        }
      });
    })
    .catch(error => console.error('メニューの読み込みエラー:', error));
}
document.addEventListener('DOMContentLoaded', () => {
  loadMenu();      // メニューの読み込みを呼び出し
});
