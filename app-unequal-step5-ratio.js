// 問題9・10（異なる量の増減）のSTEP 5でも、変化後の元の比を残して表示する。
// 例：（⑤ − 400）：（③ − 600）＝ 3：2

const renderUnequal8BeforeStep5Ratio = renderUnequal8;

renderUnequal8 = function(p){
  if(step===4){
    const kp=maru(p.p), hq=maru(p.q);
    const K=`${kp} − ${p.kDed}`;
    const H=`${hq} − ${p.hDed}`;
    const c=`(${H}) × ${p.r} ＝ (${K}) × ${p.s}`;

    return card(`
      <div class="tag">発展問題 STEP 5 / 8</div>${phrase()}
      <div class="story">${p.story}</div>
      <div class="eqbox">(${K}) ： (${H}) ＝ ${p.r} ： ${p.s}</div>
      <div class="stepTitle">内項の積＝外項の積の式にしよう</div>
      <div class="prompt">上の元の比を見ながら、内項と外項を確認しよう。</div>
      <div class="choices">${choice([
        {t:c,c:1},
        {t:`(${K}) × ${p.r} ＝ (${H}) × ${p.s}`,c:0},
        {t:`(${K}) × (${H}) ＝ ${p.r} × ${p.s}`,c:0}
      ])}</div>
      <div id="feedback" class="feedback"></div>
      <button id="next" class="next primary" onclick="nextStep()">次へ</button>
    `);
  }

  return renderUnequal8BeforeStep5Ratio(p);
};
