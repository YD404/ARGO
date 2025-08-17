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
