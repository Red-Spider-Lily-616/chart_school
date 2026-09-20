/* =====================================================================
   広告設定ファイル（A8.net 対応）
   ---------------------------------------------------------------------
   このファイル1つを書き換えるだけで、サイト全ページの広告が変わります。
   HTMLファイルは一切さわりません。

   設定が空の間は広告枠そのものがDOMから消えるため、
   レイアウトは何も変わりません。安心して空のまま置いておけます。
   ===================================================================== */

/* ---------------------------------------------------------------------
   【設定】各広告枠に入れるHTML
   ---------------------------------------------------------------------
   A8.netの管理画面 →「プログラム検索」→ 提携中のプログラム →
   「広告リンク」でバナーを選び、表示されたHTMLをまるごとコピーして
   下の "" の中に貼り付けます。

   ■ 貼り付けるときの注意
     ・シングルクォート '...' で囲んでください（A8のコードは " を含むため）
     ・末尾の <img ...0.gif...> （1x1の計測用画像）も必ず含めること
     ・貼り付けたあと、行末の , を消さないこと

   ■ 枠の位置
     top    … 記事タイトルのすぐ下
     mid    … 記事の中ほど
     bottom … 記事の最後、ページ送りの手前

   使わない枠は "" のままにしておけば非表示になります。

   ■ 記入例
     top: '<a href="https://px.a8.net/svt/ejp?a8mat=XXXX" rel="nofollow">' +
          '<img border="0" width="300" height="250" alt="" ' +
          'src="https://www2X.a8.net/svt/bgt?aid=XXXX&wid=001&eno=01&mid=XXXX&mc=1"></a>' +
          '<img border="0" width="1" height="1" src="https://www1X.a8.net/0.gif?a8mat=XXXX" alt="">',
--------------------------------------------------------------------- */
const AD_SLOTS = {
  top:    "",
  mid:    "",
  bottom: ""
};

/* ---------------------------------------------------------------------
   【設定】広告の見出し文字
   景品表示法（ステマ規制）により、広告であることの明示が必要です。
   通常は "広告" のままで問題ありません。
--------------------------------------------------------------------- */
const AD_LABEL = "広告";

/* =====================================================================
   ここから下は書き換え不要です
   ===================================================================== */
(function () {
  "use strict";

  var slots = document.querySelectorAll(".ad-slot");
  if (!slots.length) return;

  var used = 0;

  slots.forEach(function (slot) {
    var name = slot.getAttribute("data-ad");
    var code = (AD_SLOTS[name] || "").trim();

    if (!code) {            // 未設定の枠は丸ごと削除（レイアウトに影響させない）
      slot.remove();
      return;
    }

    var label = slot.querySelector(".ad-label");
    if (label) label.textContent = AD_LABEL;

    var body = slot.querySelector(".ad-body");
    body.innerHTML = code;

    // アフィリエイトリンクには rel="sponsored nofollow" を必ず付ける
    // （Google のリンクスパム対策ガイドラインへの対応。A8 のコードに
    //   rel が無い場合や不足している場合の保険として自動補完する）
    body.querySelectorAll("a[href]").forEach(function (a) {
      var rel = (a.getAttribute("rel") || "").toLowerCase().split(/\s+/);
      if (rel.indexOf("sponsored") === -1) rel.push("sponsored");
      if (rel.indexOf("nofollow") === -1) rel.push("nofollow");
      a.setAttribute("rel", rel.filter(Boolean).join(" "));
      a.setAttribute("target", "_blank");
    });

    used++;
  });

  if (used) document.documentElement.classList.add("ad-ready");
})();
