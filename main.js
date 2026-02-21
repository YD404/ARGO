// —— 最小構成：all.json を1回だけ読み込んで描画 ——
// ルート直下に data/all.json がある前提。場所が違う場合はパスを合わせてください。
const ALL_JSON = "./data/all.json";

// index.html 内の要素（既存の見た目をそのまま使います）
const $ = (s) => document.querySelector(s);
const movieContainer = $("#movie-container");
const newsContainer = $("#news-container");
const overlay = $("#overlay");
const overlayImg = $("#overlay-img");
const overlayTitle = $("#overlay-title");
const overlayCaption = $("#overlay-caption");

// util
const norm = (v) => (v ?? "").toString().trim().toLowerCase();
const fmtDateOnly = (iso) => {
  if (!iso) return "";
  try { return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(new Date(iso)); }
  catch { return ""; }
};
const placeholder = () =>
  "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'>"
    + "<rect width='100%' height='100%' fill='#11151d'/>"
    + "<g fill='#4b5563' font-family='sans-serif' font-size='18'>"
    + "<text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle'>No Image</text>"
    + "</g></svg>"
  );

// カード（.card / .card-title を既存CSSで表示）
function addCardTo(container, item) {
  const { title, caption, Image, linkURL, linkTX, date } = item;

  const card = document.createElement("div");
  card.className = "card";

  const img = document.createElement("img");
  img.src = Image?.url || placeholder();
  img.alt = title ?? "";

  const ttl = document.createElement("div");
  ttl.className = "card-title";
  ttl.textContent = title ?? "(無題)";

  card.appendChild(img);
  card.appendChild(ttl);

  card.addEventListener("click", () => {
    openOverlay({
      title: title ?? "",
      caption: caption ?? "",
      img: Image?.url || "",
      linkURL: linkURL ?? "",
      linkTX: linkTX ?? "",
      date: date ?? ""
    });
  });

  container.appendChild(card);
}

// オーバーレイ（リンクボタン直下に投稿日を表示）
function openOverlay({ title, caption, img, linkURL, linkTX, date }) {
  overlayImg.src = img || "";
  overlayTitle.textContent = title || "";
  overlayCaption.textContent = caption || "";

  const content = overlay.querySelector(".overlay-content");
  // 以前の挿入要素を掃除
  const oldBtn = content.querySelector(".a-button");
  const oldDate = content.querySelector(".posted-date");
  if (oldBtn) oldBtn.remove();
  if (oldDate) oldDate.remove();

  if (linkURL && linkTX) {
    const wrap = document.createElement("div");
    wrap.className = "a-button";
    const a = document.createElement("a");
    a.className = "button";
    a.textContent = linkTX;
    a.href = linkURL;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    wrap.appendChild(a);
    content.appendChild(wrap);
  }
  if (date) {
    const posted = document.createElement("div");
    posted.className = "posted-date";
    posted.textContent = `投稿日：${fmtDateOnly(date)}`;
    posted.style.marginTop = "8px";
    posted.style.fontSize = "12px";
    posted.style.color = "#8a8fa3";
    content.appendChild(posted);
  }

  overlay.style.display = "flex";
}
function closeOverlay() {
  overlay.style.display = "none";
  overlayImg.src = "";
  overlayTitle.textContent = "";
  overlayCaption.textContent = "";
}
window.closeOverlay = closeOverlay;

// 指定カテゴリの最新3件を描画
function renderTop3(container, items, selectValue) {
  if (!container) return;
  const top3 = (items ?? [])
    .filter((it) => norm(it.select) === norm(selectValue))
    .sort((a, b) => new Date(b.date ?? 0) - new Date(a.date ?? 0))
    .slice(0, 3);

  container.innerHTML = ""; // 念のためリセット（トップは3件のみ）
  top3.forEach((it) => addCardTo(container, it));
}

// 起動
document.addEventListener("DOMContentLoaded", async () => {
  showLoader(movieContainer);
  showLoader(newsContainer);
  try {
    const res = await fetch(ALL_JSON + `?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const all = data.contents ?? [];

    hideLoader(movieContainer);
    hideLoader(newsContainer);
    renderTop3(newsContainer, all, "news");
    renderTop3(movieContainer, all, "movie");
  } catch (e) {
    console.error("[index]", e);
    hideLoader(movieContainer);
    hideLoader(newsContainer);
    // 失敗時は簡易メッセージ
    if (newsContainer) newsContainer.textContent = "データ取得に失敗しました。";
    if (movieContainer) movieContainer.textContent = "データ取得に失敗しました。";
  }
});
