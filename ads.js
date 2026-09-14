/* =====================================================================
   広告の設定ファイル
   ---------------------------------------------------------------------
   ここを書き換えるだけで、サイトの全ページに広告が表示されます。
   HTMLファイルは一切さわる必要はありません。

   広告を出す準備ができるまでは、下の設定を空のままにしておいてください。
   空の間は広告枠そのものが非表示になり、レイアウトは何も変わりません。
   ===================================================================== */

/* ---------------------------------------------------------------------
   【設定1】Google AdSense を使う場合
   ---------------------------------------------------------------------
   AdSense の管理画面に表示される「サイト運営者 ID」を貼り付けます。
   例:  const AD_CLIENT = "ca-pub-1234567890123456";
--------------------------------------------------------------------- */
const AD_CLIENT = "";

/* ---------------------------------------------------------------------
   【設定2】広告枠ごとの中身
   ---------------------------------------------------------------------
   各ページに3か所の枠があります。

     top    … 記事タイトルのすぐ下
     mid    … 記事の中ほど
     bottom … 記事の最後、ページ送りの手前

   入れ方は2通りあります。好きなほうを使ってください。

   ■ AdSense の場合 … 広告ユニットの「スロットID」(10桁の数字)を書く
       top: "1234567890",

   ■ ASP のバナー(A8.net など)の場合 … 配布された HTML をそのまま貼る
       top: '<a href="..."><img src="..." alt=""></a>',

   使わない枠は "" のままにしておけば、その枠は表示されません。
--------------------------------------------------------------------- */
const AD_SLOTS = {
  top:    "",
  mid:    "",
  bottom: ""
};

/* =====================================================================
   ここから下は書き換え不要です
   ===================================================================== */
(function () {
  "use strict";

  var slots = document.querySelectorAll(".ad-slot");
  if (!slots.length) return;

  var used = 0;
  var needAdsense = false;

  slots.forEach(function (slot) {
    var name = slot.getAttribute("data-ad");
    var value = (AD_SLOTS[name] || "").trim();
    if (!value) {
      slot.remove();
      return;
    }

    var body = slot.querySelector(".ad-body");

    if (value.charAt(0) === "<") {
      // 生のHTML(ASPバナーなど)をそのまま入れる
      body.innerHTML = value;
    } else if (AD_CLIENT) {
      // AdSense のレスポンシブ広告ユニット
      var ins = document.createElement("ins");
      ins.className = "adsbygoogle";
      ins.style.display = "block";
      ins.setAttribute("data-ad-client", AD_CLIENT);
      ins.setAttribute("data-ad-slot", value);
      ins.setAttribute("data-ad-format", "auto");
      ins.setAttribute("data-full-width-responsive", "true");
      body.appendChild(ins);
      needAdsense = true;
    } else {
      // スロットIDは入っているがクライアントIDが未設定 → 何もしない
      slot.remove();
      return;
    }
    used++;
  });

  if (!used) return;
  document.documentElement.classList.add("ad-ready");

  if (needAdsense) {
    var s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" +
            encodeURIComponent(AD_CLIENT);
    document.head.appendChild(s);
    s.addEventListener("load", function () {
      document.querySelectorAll("ins.adsbygoogle").forEach(function () {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      });
    });
  }
})();
