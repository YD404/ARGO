const movieCards = [
  { img: '/media/noimage.svg', title: '【製作中】特撮「ブラッドマン」', caption: '特撮「ブラッドマン」' },
  { img: '/media/noimage.svg', title: '【製作中】CGアニメ「トレイン」', caption: 'CGアニメ「トレイン」' },
  { img: '/media/noimage.svg', title: '【製作中】映画「傷と蝶」', caption: '映画「傷と蝶」' },
  { img: '/media/noimage.svg', title: 'MV「魔法」', caption: 'MV\n「魔法」' }
];


const newsCards = [
  { img: '/media/noimage.svg', title: 'ページ公開', caption: 'ARGOのホームページを公開しました。\n2024年9月30日' },
  { img: '/media/noimage.svg', title: 'クラウドファンディング', caption: '特撮「ブラッドマン」のためのクラウドファンディングを実施いたします。' },
  { img: '/media/noimage.svg', title: 'ニュース3', caption: 'News 3 Description' },
  { img: '/media/noimage.svg', title: 'ニュース4', caption: 'News 4 Description' }
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
    imgElement.alt = card.title;  // 画像のalt属性にタイトルを使用

    const titleElement = document.createElement('div');
    titleElement.className = 'card-title';
    titleElement.innerText = card.title;  // タイトルを表示

    // カードクリックイベントでオーバーレイを表示
    cardElement.onclick = function() {
      showOverlay(card.img, card.title, card.caption);
    };

    cardElement.appendChild(imgElement);
    cardElement.appendChild(titleElement);
    container.appendChild(cardElement);
  });
}

// オーバーレイを表示する関数
function showOverlay(imgSrc, titleText, captionText) {
  const overlay = document.getElementById('overlay');
  const overlayImg = document.getElementById('overlay-img');
  const overlayTitle = document.getElementById('overlay-title');
  const overlayCaption = document.getElementById('overlay-caption');

  overlayImg.src = imgSrc;
  overlayTitle.innerText = titleText;
  overlayCaption.innerText = captionText;
  overlay.style.display = 'flex';
}

// オーバーレイを閉じる関数
function closeOverlay() {
  const overlay = document.getElementById('overlay');
  overlay.style.display = 'none';
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
