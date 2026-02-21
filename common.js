// === ローダー表示/非表示 ===
function showLoader(container) {
  if (!container) return;
  const loader = document.createElement("div");
  loader.className = "loader-container";
  loader.innerHTML = `<svg viewBox="0 0 100 100">
    <circle class="dot" cx="30" cy="50" r="5" />
    <circle class="dot" cx="50" cy="50" r="5" />
    <circle class="dot" cx="70" cy="50" r="5" />
  </svg>`;
  container.appendChild(loader);
}

function hideLoader(container) {
  if (!container) return;
  const loader = container.querySelector(".loader-container");
  if (loader) loader.remove();
}

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
document.addEventListener('DOMContentLoaded', function () {
  const overlay = document.getElementById('overlay');
  const overlayContent = document.querySelector('.overlay-content');

  overlay.addEventListener('click', function (event) {
    // クリックがオーバーレイ自体（暗い背景部分）にあった場合のみ閉じる
    if (event.target === overlay) {
      closeOverlay();
    }
  });
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
      const nav = document.querySelector('nav');

      // 初期表示時にサイズに応じてメニューの状態を設定
      if (window.innerWidth > 840) {
        menu.classList.add('expanded');
        menuToggle.style.display = 'none';
        closeMenu.style.display = 'none';
        nav.classList.remove('menu-open');
      } else {
        menu.classList.remove('expanded');
        menuToggle.style.display = 'block';
        closeMenu.style.display = 'none';
        nav.classList.remove('menu-open');
      }

      menuToggle.addEventListener('click', () => {
        menu.classList.add('expanded');
        nav.classList.add('menu-open');
        menuToggle.style.display = 'none';
        closeMenu.style.display = 'block';
        document.body.style.overflow = 'hidden'; // スクロール無効
      });

      closeMenu.addEventListener('click', () => {
        menu.classList.remove('expanded');
        nav.classList.remove('menu-open');
        menuToggle.style.display = 'block';
        closeMenu.style.display = 'none';
        document.body.style.overflow = ''; // スクロール復帰
      });

      // メニューリンクをクリックしたらメニューを閉じる
      menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          if (window.innerWidth <= 840) {
            menu.classList.remove('expanded');
            nav.classList.remove('menu-open');
            menuToggle.style.display = 'block';
            closeMenu.style.display = 'none';
            document.body.style.overflow = '';
          }
        });
      });

      // 画面サイズ変更時のメニュー状態の更新
      window.addEventListener('resize', () => {
        if (window.innerWidth > 840) {
          menu.classList.add('expanded');
          nav.classList.remove('menu-open');
          menuToggle.style.display = 'none';
          closeMenu.style.display = 'none';
          document.body.style.overflow = '';
        } else {
          menu.classList.remove('expanded');
          nav.classList.remove('menu-open');
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
