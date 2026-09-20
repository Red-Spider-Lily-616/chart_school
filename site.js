/* =====================================================================
   FX学習ノート 共通スクリプト
   ・テーマ切替
   ・練習問題（.q）の採点
   ・チェックリスト（#chkbox）の進捗
   いずれも該当要素が無いページでは何もしない（エラーを出さない）。
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- テーマ切替 ---------- */
  var btn = document.getElementById('themeBtn');
  if (btn) {
    btn.addEventListener('click', function () {
      var r = document.documentElement, c = r.getAttribute('data-theme');
      if (!c) { c = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; }
      r.setAttribute('data-theme', c === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- 練習問題 ---------- */
  var qs = document.querySelectorAll('[data-q]');
  if (qs.length) {
    var correct = 0, answered = 0, total = qs.length;
    var sTxt = document.getElementById('scoreTxt');
    var sNum = document.getElementById('scoreNum');
    qs.forEach(function (q) {
      var ans = parseInt(q.getAttribute('data-answer'), 10);
      var opts = q.querySelectorAll('.opt'), fb = q.querySelector('.fb');
      opts.forEach(function (opt) {
        opt.addEventListener('click', function () {
          if (q.dataset.done) return;
          q.dataset.done = '1';
          var picked = parseInt(opt.getAttribute('data-i'), 10);
          answered++; if (picked === ans) correct++;
          opts.forEach(function (o) {
            var i = parseInt(o.getAttribute('data-i'), 10);
            o.disabled = true;
            if (i === ans) {
              o.classList.add('correct');
              o.insertAdjacentHTML('afterbegin', '<span class="mark">正解</span>');
            } else if (i === picked) {
              o.classList.add('wrong');
              o.insertAdjacentHTML('afterbegin', '<span class="mark">不正解</span>');
            }
          });
          if (fb) fb.classList.add('show');
          if (sNum) sNum.textContent = correct;
          if (sTxt) {
            if (answered < total) { sTxt.textContent = '解答中… 残り ' + (total - answered) + ' 問'; }
            else if (correct === total) { sTxt.textContent = '全問正解。内容が身についています。'; }
            else if (correct >= Math.ceil(total * 0.6)) { sTxt.textContent = 'あと少し。まちがえた問題の章に戻りましょう。'; }
            else { sTxt.textContent = '最初の章から読み直すのが近道です。'; }
          }
        });
      });
    });
  }

  /* ---------- チェックリスト ----------
     2つの書き方に対応する。
       旧: #chkbox + #bar + #progTxt （1ページに1つ）
       新: .chkgroup の中に .progressbar i / .progresstxt / .chk （1ページに複数可）
  --------------------------------------------------- */
  function wire(boxes, bar, pTxt) {
    if (!boxes.length) return;
    var update = function () {
      var done = 0;
      boxes.forEach(function (b) { if (b.checked) done++; });
      if (bar) bar.style.width = (done / boxes.length * 100) + '%';
      if (pTxt) {
        pTxt.textContent = done + ' / ' + boxes.length + ' 項目 完了' +
          (done === boxes.length ? ' — おつかれさまでした!' : '');
      }
    };
    boxes.forEach(function (b) { b.addEventListener('change', update); });
    update();
  }

  var legacy = document.querySelectorAll('#chkbox input[type="checkbox"]');
  if (legacy.length) {
    wire(legacy, document.getElementById('bar'), document.getElementById('progTxt'));
  }

  document.querySelectorAll('.chkgroup').forEach(function (g) {
    wire(g.querySelectorAll('.chk input[type="checkbox"]'),
         g.querySelector('.progressbar i'),
         g.querySelector('.progresstxt'));
  });
})();
