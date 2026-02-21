// === members.json ローダー ===
const CANDIDATES = ["./data/members.json", "../data/members.json", "/data/members.json"];

async function loadMembersJson() {
    let lastErr;
    for (const p of CANDIDATES) {
        try {
            const res = await fetch(p + `?t=${Date.now()}`, { cache: "no-store" });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            console.log("[members.json] loaded:", p);
            return await res.json();
        } catch (e) {
            console.warn("[members.json] failed:", p, e.message);
            lastErr = e;
        }
    }
    throw lastErr ?? new Error("members.json not found");
}

// === 参照要素 ===
const $ = (s) => document.querySelector(s);
const leaderContainer = $("#leader-container");
const memberContainer = $("#member-container");

// === プラットフォームアイコンマップ ===
const platformIcons = {
    "Twitter": '<i class="fa-brands fa-twitter"></i>',
    "Instagram": '<i class="fa-brands fa-instagram"></i>',
    "YouTube": '<i class="fa-brands fa-youtube"></i>',
    "ニコニコ": '<i class="fa-solid fa-tv"></i>',
    "メール": '<i class="fa-solid fa-envelope"></i>',
    "その他": '<i class="fa-solid fa-link"></i>'
};

// === ヘルパー関数：配列を文字列に ===
const arrToStr = (val) => Array.isArray(val) ? val.join(", ") : (val || "");
const firstOf = (val) => Array.isArray(val) ? val[0] : val;

// === プレースホルダー画像 ===
const placeholder = () =>
    "data:image/svg+xml;charset=utf-8," + encodeURIComponent(
        "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'>"
        + "<rect width='100%' height='100%' fill='#e0e0e0'/>"
        + "<g fill='#999' font-family='sans-serif' font-size='18'>"
        + "<text x='50%' y='50%' text-anchor='middle' dominant-baseline='middle'>No Image</text>"
        + "</g></svg>"
    );

// === サイズマッピング ===
const sizeMap = {
    "大きめ": "large",
    "中くらい": "medium",
    "小さめ": "small"
};

// === カード生成 ===
function createMemberCard(member, forceSize = null) {
    const { name, role, image, boi, order, works, socials } = member;

    // orderを適切なサイズクラスに変換
    const orderVal = firstOf(order) || "中くらい";
    const cardSize = boi ? 'large' : (forceSize || sizeMap[orderVal] || 'medium');
    const cardClass = `card-member-${cardSize}`;

    const card = document.createElement("div");
    card.className = cardClass;

    // 画像
    const img = document.createElement("img");
    img.src = image?.url || placeholder();
    img.alt = name || "";
    card.appendChild(img);

    // コンテンツエリア
    const content = document.createElement("div");
    content.className = "content-member";

    // 名前・役職
    const nameInfo = document.createElement("div");
    nameInfo.className = "content-name-info";

    const h2 = document.createElement("h2");
    h2.textContent = name || "(名前なし)";
    nameInfo.appendChild(h2);

    if (role) {
        const h3 = document.createElement("h3");
        h3.textContent = arrToStr(role);
        nameInfo.appendChild(h3);
    }

    // 紹介文（boiがある場合のみ）
    if (boi) {
        const p = document.createElement("p");
        p.textContent = boi;
        nameInfo.appendChild(p);
    }

    content.appendChild(nameInfo);

    // 作品歴
    if (works && works.length > 0) {
        const historyDiv = document.createElement("div");
        historyDiv.className = "content-history";

        const table = document.createElement("table");
        works.forEach(work => {
            const tr = document.createElement("tr");
            const th = document.createElement("th");
            th.textContent = firstOf(work.workTitle) || "";
            const td = document.createElement("td");
            // 複数役割は改行で表示
            const roles = Array.isArray(work.workRole) ? work.workRole : [work.workRole];
            td.innerHTML = roles.filter(r => r).join("<br>");
            tr.appendChild(th);
            tr.appendChild(td);
            table.appendChild(tr);
        });

        historyDiv.appendChild(table);
        content.appendChild(historyDiv);
    }

    // SNSリンク
    if (socials && socials.length > 0) {
        const socialDiv = document.createElement("div");
        socialDiv.className = "social-icons";

        socials.forEach(social => {
            const platformName = firstOf(social.platform) || "その他";
            const a = document.createElement("a");
            a.href = social.url || "#";
            a.target = "_blank";
            a.className = "icon";
            a.innerHTML = platformIcons[platformName] || platformIcons["その他"];
            socialDiv.appendChild(a);
        });

        content.appendChild(socialDiv);
    }

    card.appendChild(content);
    return card;
}

// === メイン ===
document.addEventListener("DOMContentLoaded", async () => {
    showLoader(leaderContainer);
    showLoader(memberContainer);
    try {
        const data = await loadMembersJson();
        const members = data.contents ?? [];

        hideLoader(leaderContainer);
        hideLoader(memberContainer);

        if (members.length === 0) {
            const msg = document.createElement("p");
            msg.textContent = "メンバー情報がありません。";
            memberContainer?.appendChild(msg);
            return;
        }

        // boiがあるメンバー（リーダー）とそれ以外を分離
        const leaders = members.filter(m => m.boi);
        const others = members.filter(m => !m.boi);

        // サイズ順にソート（大きめ→中くらい→小さめ）
        const sizeOrder = { "大きめ": 0, "中くらい": 1, "小さめ": 2 };
        others.sort((a, b) => {
            const orderA = sizeOrder[firstOf(a.order)] ?? 1;
            const orderB = sizeOrder[firstOf(b.order)] ?? 1;
            return orderA - orderB;
        });

        // リーダーを先頭に大きく表示
        leaders.forEach(member => {
            const card = createMemberCard(member, 'large');
            leaderContainer?.appendChild(card);
        });

        // サイズごとにグループ分け
        const largeMembers = others.filter(m => firstOf(m.order) === "大きめ");
        const mediumMembers = others.filter(m => firstOf(m.order) === "中くらい");
        const smallMembers = others.filter(m => firstOf(m.order) === "小さめ");

        // 大きめメンバー
        largeMembers.forEach(member => {
            const card = createMemberCard(member);
            memberContainer?.appendChild(card);
        });

        // 大きめと中くらいの間に区切り線
        if (largeMembers.length > 0 && mediumMembers.length > 0) {
            const hr = document.createElement("hr");
            hr.style.width = "100%";
            memberContainer?.appendChild(hr);
        }

        // 中くらいメンバー
        mediumMembers.forEach(member => {
            const card = createMemberCard(member);
            memberContainer?.appendChild(card);
        });

        // 中くらいと小さめの間に区切り線
        if (mediumMembers.length > 0 && smallMembers.length > 0) {
            const hr = document.createElement("hr");
            hr.style.width = "100%";
            memberContainer?.appendChild(hr);
        }

        // 小さめメンバー
        smallMembers.forEach(member => {
            const card = createMemberCard(member);
            memberContainer?.appendChild(card);
        });

    } catch (err) {
        console.error("[member]", err);
        hideLoader(leaderContainer);
        hideLoader(memberContainer);
        const msg = document.createElement("p");
        msg.textContent = `取得エラー: ${err.message}`;
        memberContainer?.appendChild(msg);
    }
});
