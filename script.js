const movieCards = [
  { img: 'media/movie/movie_002.avif', title: '【制作中】CGアニメ『トレイン』', caption: 'CGアニメ『トレイン』鋭意制作中' },
  { img: 'media/movie/movie_001.avif', title: 'ろくようび『魔法』MV', caption: 'インディーズバンド「ろくようび」ファーストアルバム収録曲『魔法』のミュージックビデオを制作致しました。<a href="https://youtu.be/Tq8UwIODUuk?si=k0xTBpTCe6cqoPG8" target="_blank">本編映像</a><br><br>2022年2月28日' },
];

const newsCards = [
  { img: 'media/noimage.svg', title: '舞台『軽井沢殺人事件』の映像を担当', caption: 'Ｙプロジェクト・舞台製作集団SHIZUKAが企画・製作している『軽井沢殺人事件』にて、映像を担当致します。<br>『軽井沢殺人事件』の詳しい情報は<a href="https://x.com/stage_shizuka" target="_blank">ここから</a><br><br>2024年9月21日' },
  { img: 'media/news/news_001.avif', title: 'ARGOホームページ公開', caption: '創作団体ARGOのホームページを公開しました。<br><br>2024年9月21日' },
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
  overlayCaption.innerHTML = captionText;  // innerHTMLを使用してHTMLタグが反映されるようにする
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
      if (window.innerWidth > 800) {
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
        if (window.innerWidth > 800) {
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
