// === all.json ローダー（ページの場所に依存せず動かす） ===
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

// === ページごとの設定 ===
// testページは全件出したいので null（= 絞り込みなし）
const TARGET_SELECT = null; // "news" / "movie" / "test" にすれば絞り込み

// === 以降は既存の描画コードそのまま（必要最小限の関数だけ同梱） ===
const elStatus = document.getElementById("status");
const elCards  = document.getElementById("cards");
const tpl      = document.getElementById("card-tpl");

const fmtDateOnly = iso => {
  if (!iso) return "";
  try { return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(new Date(iso)); }
  catch { return ""; }
};
const placeholderSvg = () =>
  "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'>"
    + "<rect width='100%' height='100%' fill='#11151d'/>"
    + "<g fill='#4b5563' font-family='sans-serif' font-size='18'>"
    + "<text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle'>No Image</text>"
    + "</g></svg>"
  );

function appendCard(item){
  const { title, date, caption, Image, linkURL, linkTX, select } = item;
  const node = tpl.content.cloneNode(true);

  const img = node.querySelector(".card__img");
  const h2  = node.querySelector(".card__title");
  const tm  = node.querySelector(".card__date");
  const p   = node.querySelector(".card__caption");
  const act = node.querySelector(".card__actions");

  img.src = (Image && Image.url) ? Image.url : placeholderSvg();
  img.alt = title ?? "";
  h2.textContent = title ?? "(無題)";

  if (date){ tm.datetime = date; tm.textContent = fmtDateOnly(date); } else { tm.remove(); }
  if (caption){ p.textContent = caption; } else { p.remove(); }

  if (linkTX && linkURL){
    const a = document.createElement("a");
    a.className = "btn";
    a.textContent = linkTX;
    a.href = linkURL;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    act.appendChild(a);
  }

  // デバッグ用に select 値を表示
  const info = document.createElement("div");
  info.style.fontSize = "12px";
  info.style.color = "#8a8fa3";
  info.style.marginTop = "6px";
  info.textContent = `select: ${select ?? "(未設定)"}`;
  act.appendChild(info);

  elCards.appendChild(node);
}

document.addEventListener("DOMContentLoaded", async () => {
  try{
    const data = await loadAllJson();
    let items = data.contents ?? [];

    // 必要なら select で絞る（news/movie/testなど）
    if (typeof TARGET_SELECT === "string") {
      const norm = v => (v ?? "").toString().trim().toLowerCase();
      items = items.filter(it => norm(it.select) === norm(TARGET_SELECT));
    }

    items.sort((a,b)=> new Date(b.date ?? 0) - new Date(a.date ?? 0));

    if(items.length === 0){
      elStatus.textContent = "データが1件もありません。";
      return;
    }
    elCards.hidden = false;
    elStatus.remove();
    items.forEach(appendCard);
  }catch(err){
    console.error(err);
    elStatus.textContent = `取得エラー: ${err.message}`;
  }
});
