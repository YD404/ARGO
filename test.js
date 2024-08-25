// 共通のカード表示関数
function displayCards(cardsToDisplay, cardType) {
    const container = document.getElementById(`${cardType}Container`);
    container.innerHTML = ''; // 既存の内容をクリア
  
    cardsToDisplay.forEach(card => {
      const cardElement = document.createElement('div');
      cardElement.classList.add(`${cardType}-card`);
  
      const cardImage = document.createElement('img');
      cardImage.src = card.imageUrl;
      cardImage.alt = card.title || 'No title'; // タイトルがない場合のデフォルト
  
      const cardInfo = document.createElement('div');
      cardInfo.classList.add(`${cardType}-info`);
  
      const cardTitle = document.createElement('h2');
      cardTitle.textContent = card.title || ''; // タイトルがない場合は空白
  
      const cardDescription = document.createElement('p');
      cardDescription.textContent = card.description;
  
      cardInfo.appendChild(cardTitle);
      cardInfo.appendChild(cardDescription);
      cardElement.appendChild(cardImage);
      cardElement.appendChild(cardInfo);
      container.appendChild(cardElement);
    });
  }

  // 映画データ
const movies = [
    { description: '【制作中】特撮「ブラッドマン」', imageUrl: 'media/noimage.svg' },
    { description: '【制作中】短編CGアニメ「トレイン」', imageUrl: 'media/noimage.svg' },
    { description: '【制作中】映画「傷と蝶」', imageUrl: 'media/noimage.svg' },
    { description: 'ろくようび「魔法」MV', imageUrl: 'media/noimage.svg' }
    // さらに映画作品を追加可能
  ];
  
  // ニュースデータ
  const news = [
    { title: '新作発表', description: '新しい映画の発表がありました。', imageUrl: 'media/news1.jpg' },
    { title: 'イベントのお知らせ', description: '特別イベントが開催されます。', imageUrl: 'media/news2.jpg' }
    // さらにニュース記事を追加可能
  ];
  
  // 映画とニュースを表示
  document.addEventListener('DOMContentLoaded', () => {
    displayCards(movies, 'movie');
    displayCards(news, 'news');
  });
  