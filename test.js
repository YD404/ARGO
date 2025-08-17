// news.js の例
const API_URL = "./data/test.json"; // ← 相対パスにするのが安全

async function main() {
  const res = await fetch(API_URL, { cache: "no-store" });
  const data = await res.json();
  const items = (data.contents ?? []).sort((a,b)=> new Date(b.date??0) - new Date(a.date??0));
  items.forEach(addCard);
}
const apiUrl = `https://${SERVICE_DOMAIN}.microcms.io/api/v1/${ENDPOINT}?limit=${LIMIT}&orders=-date`;

const elStatus = document.getElementById("status");
const elCards = document.getElementById("cards");
const tpl = document.getElementById("card-tpl");

// URLクエリで select を切替可能（例: ?sel=news）。未指定なら "test"
const urlSel = new URLSearchParams(location.search).get("sel");
const TARGET_SELECT = (urlSel ?? "test").toLowerCase();

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short" }).format(d);
  } catch { return iso ?? ""; }
}
function placeholderSvg() {
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 225'>
      <rect width='100%' height='100%' fill='#11151d'/>
      <g fill='#4b5563' font-family='sans-serif' font-size='18'>
        <text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle'>No Image</text>
      </g>
    </svg>`
  );
  return `data:image/svg+xml;charset=utf-8,${svg}`;
}

function appendCard(item) {
  const { title, date, caption, Image, linkURL, linkTX } = item;

  const node = tpl.content.cloneNode(true);
  const img = node.querySelector(".card__img");
  const h2 = node.querySelector(".card__title");
  const time = node.querySelector(".card__date");
  const p = node.querySelector(".card__caption");
  const actions = node.querySelector(".card__actions");

  img.src = Image?.url || placeholderSvg();
  img.alt = title ?? "";

  h2.textContent = title ?? "(無題)";
  if (date) {
    time.datetime = date;
    time.textContent = formatDate(date);
  } else {
    time.remove();
  }

  if (caption) p.textContent = caption;
  else p.remove();

  if (linkTX && linkURL) {
    const a = document.createElement("a");
    a.className = "btn";
    a.textContent = linkTX;
    a.href = linkURL;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    actions.appendChild(a);
  }

  elCards.appendChild(node);
}

async function main() {
  try {
    const res = await fetch(apiUrl, {
      headers: { "X-MICROCMS-API-KEY": API_KEY },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

    const data = await res.json();
    const all = data.contents ?? [];

    // ここでクライアント側フィルタ（正規化して比較）
    const norm = v => (v ?? "").toString().trim().toLowerCase();
    const items = all.filter(it => norm(it.select) === TARGET_SELECT);

    if (items.length === 0) {
      // デバッグ情報を表示（全件の select 値一覧）
      const uniques = [...new Set(all.map(it => norm(it.select) || "(未設定)"))];
      elStatus.innerHTML = `select が「${TARGET_SELECT}」のデータはありません。<br>
        取得できた select 値: ${uniques.join(", ")}`;
      return;
    }

    elCards.hidden = false;
    elStatus.remove();
    items.forEach(appendCard);
  } catch (err) {
    console.error(err);
    elStatus.textContent = `取得エラー: ${err.message}`;
  }
}

document.addEventListener("DOMContentLoaded", main);