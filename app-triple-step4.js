// 三項比 STEP 4だけを丁寧に説明する。
const renderTripleBeforeStep4Detail=renderTriple;

renderTriple=function(p){
  if(step!==3) return renderTripleBeforeStep4Detail(p);

  const a=fracText(p.aFrac);
  const b=fracText(p.bFrac);
  const lcmDen=tripleLcm(p.aFrac.d,p.bFrac.d);
  const intA=p.bFrac.n*(lcmDen/p.bFrac.d);
  const intB=p.aFrac.n*(lcmDen/p.aFrac.d);
  const correct=`一成：尋子 ＝ ${p.ab[0]}：${p.ab[1]}`;

  return card(`
    <div class="tag">三項比 STEP 4 / 8</div>
    <div class="story">${p.story}</div>
    <div class="stepTitle">一成と尋子だけを、ゆっくり考えよう</div>

    <div class="rule">
      <strong>① まず「同じチケット代」を式にする</strong><br>
      一成 × ${a} ＝ 尋子 × ${b}
    </div>

    <div class="prompt">
      一成と尋子の2人だけになったので、ここでは<br>
      <b>「内項の積＝外項の積の公式を利用して」</b>考えます。
    </div>

    <div class="rule">
      <strong>② 比にすると、割合は反対側にくる</strong><br>
      一成：尋子 ＝ ${b}：${a}
    </div>

    <div class="prompt">
      なぜなら、<b>一成 × ${a} ＝ 尋子 × ${b}</b> だからです。<br>
      一成の横にあった ${a} は尋子側へ、尋子の横にあった ${b} は一成側へ置きます。
    </div>

    <div class="rule">
      <strong>③ 分数の比を整数にする</strong><br>
      ${b}：${a}<br>
      ↓ 両方に ${lcmDen} をかける<br>
      ${intA}：${intB}
    </div>

    <div class="stepTitle">一成：尋子 はどれ？</div>
    <div class="choices">${choice([
      {t:correct,c:1},
      {t:`一成：尋子 ＝ ${p.ab[1]}：${p.ab[0]}`,c:0},
      {t:`一成：尋子 ＝ ${p.aFrac.n}：${p.bFrac.n}`,c:0}
    ])}</div>
    <div id="feedback" class="feedback"></div>
    <button id="next" class="next primary" onclick="nextStep()">STEP 5へ</button>
  `);
};
