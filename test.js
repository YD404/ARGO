// ./data/test.json を読み、select==="test" のカードを表示
const API_URL = "./data/test.json";

const elStatus = document.getElementById("status");
const elCards  = document.getElementById("cards");
const tpl      = document.getElementById("card-tpl");

const norm = v => (v ?? "").toString().trim().toLowerCase();
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
  const { title, date, caption, Image, linkURL, linkTX } = item;
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
  elCards.appendChild(node);
}

async function main(){
  try{
    const res = await fetch(API_URL, { cache: "no-store" });
    if(!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();

    const all = data.contents ?? [];
    const items = all
      .filter(it => norm(it.select) === "test")
      .sort((a,b)=> new Date(b.date ?? 0) - new Date(a.date ?? 0));

    if(items.length === 0){
      elStatus.textContent = "select が「test」のデータはありません。";
      return;
    }
    elCards.hidden = false;
    elStatus.remove();
    items.forEach(appendCard);
  }catch(err){
    console.error(err);
    elStatus.textContent = `取得エラー: ${err.message}`;
  }
}

document.addEventListener("DOMContentLoaded", main);
