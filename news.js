// === all.json ローダー（場所に依存せず動かす） ===
const CANDIDATES = ["./data/all.json", "../data/all.json", "/data/all.json"];
async function loadAllJson() {
  let lastErr;
  for (const p of CANDIDATES) {
    try {
      const res = await fetch(p + `?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      console.log("[all.json] loaded:", p);
      return await res.json();
    } catch (e) {
      console.warn("[all.json] failed:", p, e.message);
      lastErr = e;
    }
  }
  throw lastErr ?? new Error("all.json not found");
}

// === ページ設定 ===
const TARGET_SELECT = "news"; // ← ここだけ変えれば他カテゴリにも流用可

// 参照要素
const $ = (s) => document.querySelector(s);
const container = $("#news-container");
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

// カード生成
function addCard(item) {
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

  // クリックでオーバーレイ
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

// オーバーレイ
function openOverlay({ title, caption, img, linkURL, linkTX, date }) {
  overlayImg.src = img || "";
  overlayTitle.textContent = title || "";
  overlayCaption.textContent = caption || "";

  const content = overlay.querySelector(".overlay-content");

  // 以前の挿入要素を掃除
  const oldBtn = content.querySelector(".a-button");
  if (oldBtn) oldBtn.remove();
  const oldDate = content.querySelector(".posted-date");
  if (oldDate) oldDate.remove();

  // ボタン
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

  // 投稿日（ボタン直下）
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

// 閉じる（×ボタンから呼ばれる想定）
function closeOverlay() {
  overlay.style.display = "none";
  overlayImg.src = "";
  overlayTitle.textContent = "";
  overlayCaption.textContent = "";
}
window.closeOverlay = closeOverlay;

// メイン
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await loadAllJson();
    let items = data.contents ?? [];
    items = items.filter((it) => norm(it.select) === norm(TARGET_SELECT));
    items.sort((a, b) => new Date(b.date ?? 0) - new Date(a.date ?? 0));

    if (items.length === 0) {
      const msg = document.createElement("p");
      msg.textContent = `select が「${TARGET_SELECT}」の記事がありません。`;
      container.appendChild(msg);
      return;
    }
    items.forEach(addCard);
  } catch (err) {
    console.error(err);
    const msg = document.createElement("p");
    msg.textContent = `取得エラー: ${err.message}`;
    container.appendChild(msg);
  }
});
