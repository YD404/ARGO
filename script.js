// オーバーレイを表示する関数
function showOverlay(imgSrc, titleText, captionText) {
  const overlay = document.getElementById('overlay');
  const overlayImg = document.getElementById('overlay-img');
  const overlayTitle = document.getElementById('overlay-title');
  const overlayCaption = document.getElementById('overlay-caption');

  overlayImg.src = imgSrc;
  overlayTitle.innerText = titleText;
  overlayCaption.innerHTML = captionText;  // innerHTMLを使用してHTMLタグを反映
  overlay.style.display = 'flex';
}

// オーバーレイを閉じる関数
function closeOverlay() {
  const overlay = document.getElementById('overlay');
  overlay.style.display = 'none';
}

// オーバーレイの背景クリックで閉じるイベントリスナーを追加
document.addEventListener('DOMContentLoaded', function() {
  const overlay = document.getElementById('overlay');
  const overlayContent = document.querySelector('.overlay-content');
  
  overlay.addEventListener('click', function(event) {
    // クリックがオーバーレイ自体（暗い背景部分）にあった場合のみ閉じる
    if (event.target === overlay) {
      closeOverlay();
    }
  });
});

const movieCards = [
  { img: 'media/movie/movie_004.avif', title: '「Re:BLUE MOMENT」', caption: '東東東監督作品「Re:BLUE MOMENT」<br>YouTubeにて公開中です。<div class="a-button"><a href="https://youtu.be/qJjVPuMcO2g?si=Z2jUE16IYs1cwFX7" class="button" target="_blank">本編映像</a></div><br><br>2025年03月10日' },
  { img: 'media/movie/movie_003.avif', title: '短編映画「ロック・シザース・ペーパーズ」', caption: '仲井飛祐監督作品「ロック・シザース・ペーパーズ」<br>YouTubeにて公開中です。<div class="a-button"><a href="https://youtu.be/7GR_ErCZBLs" class="button" target="_blank">本編映像</a></div><br><br>2024年12月1日' },
  { img: 'media/movie/karuizawa.avif', title: '「軽井沢殺人事件」冒頭背景映像・背景画像', caption: '舞台「軽井沢殺人事件」にて、冒頭に上映する映像及び背景に投影する画像を作成いたしました。<br>また、舞台当日の投影業務も行いました。<br><br>2024年11月18日' },
  { img: 'media/movie/movie_002.avif', title: '【制作中】CGアニメ『トレイン』', caption: 'CGアニメ『トレイン』鋭意制作中' },
  { img: 'media/movie/movie_001.avif', title: 'ろくようび『魔法』MV', caption: 'インディーズバンド「ろくようび」ファーストアルバム収録曲『魔法』のミュージックビデオを制作致しました。<div class="a-button"><a href="https://youtu.be/Tq8UwIODUuk?si=k0xTBpTCe6cqoPG8" class="button" target="_blank">本編映像</a></div><br><br>2022年2月28日' },
];

const newsCards = [
  { img: 'media/news/movie_005.avif', title:'ARGOメンバー協力作品「超覚人」『TOHOシネマズ学生映画祭』にノミネート', caption: '短編映画作品「超覚人」が、『第18回TOHOシネマズ学生映画祭』にノミネートされました。ARGOメンバー数名が助監督やメイキングなどで協力しております。<br>2025年03月27日、TOHOシネマズ日比谷にて上映されます。<div class="a-button"><a href="https://tyokakujin.wixsite.com/untitled" class="button" target="_blank">詳しく</a></div><br><br>2025年03月08日' },
  { img: 'media/movie/movie_003.avif', title:'仲井飛祐監督作「ロック・シザース・ペーパーズ」『エクストラ部門』を受賞', caption: '仲井飛祐監督作「ロック・シザース・ペーパーズ」が、スマホフィルムフェス2024にて『エクストラ部門』を受賞しました！<div class="a-button"><a href="https://x.com/sumahofilmfes/status/1872422264106594493" class="button" target="_blank">詳しく</a></div><br><br>2024年12月28日' },
  { img: 'media/noimage.svg', title: '舞台『軽井沢殺人事件』の映像を担当', caption: 'Ｙプロジェクト・舞台製作集団SHIZUKAが企画・製作している『軽井沢殺人事件』にて、映像を担当致します。<div class="a-button"><a href="https://x.com/stage_shizuka" class="button" target="_blank">詳細情報</a></div><br><br>2024年9月21日' },
  { img: 'media/news/news_001.avif', title: 'ARGOホームページ公開', caption: '創作団体ARGOのホームページを公開しました。<br><br>2024年9月21日' },
];

document.addEventListener('DOMContentLoaded', function() {

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


  // ページに応じたカードの表示
  const path = window.location.pathname;
  if (path === '/' || path.includes('index.html')) {
    // ルートパスまたはindex.htmlの場合は最新3件のみ表示
    addCards('movie-container', movieCards, 3);
    addCards('news-container', newsCards, 3);
  } else if (path.includes('all-movies.html')) {
    // all-movies.htmlではすべての映画カードを表示
    addCards('movie-container', movieCards);
  } else if (path.includes('news.html')) {
    // news.htmlではすべてのニュースカードを表示
    addCards('news-container', newsCards);
  }

});


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
      if (window.innerWidth > 840) {
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

      // 画面サイズ変更時のメニュー状態の更新
      window.addEventListener('resize', () => {
        if (window.innerWidth > 840) {
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
  loadMenu(); // メニューの読み込みを実施
});




document.addEventListener('DOMContentLoaded', () => {
  const historyItems = document.querySelectorAll('.textblock,.card-member-large,.card-member-small');

  historyItems.forEach((item, index) => {
    item.style.opacity = 0;
    item.style.transform = 'translateY(20px)'; // 少し下にずらしておく

    const delay = index * 100; // アニメーション開始を少しずつ遅らせる
      setTimeout(() => {
          item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          item.style.opacity = 1;
          item.style.transform = 'translateY(0)';
      }, delay);
  });
});
