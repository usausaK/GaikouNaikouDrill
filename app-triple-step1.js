// 三項比 STEP 1：公式の使い方と「二人ずつ」をそれぞれ選択させる。
const renderTripleBeforeStep1Select = renderTriple;
let tripleStep1State = {formula:false,pick:false,counted:false};

renderTriple=function(p){
  if(step!==0) return renderTripleBeforeStep1Select(p);

  tripleStep1State={formula:false,pick:false,counted:false};
  return card(`
    <div class="tag">三項比 STEP 1 / 8</div>
    <div class="story">${p.story}</div>
    <div class="stepTitle">三項比のルール</div>

    <div class="prompt"><b>この問題は三項比（さんこうひ）の問題です。三項比（さんこうひ）の問題では、そのまま内項の積＝外項の積の公式を</b></div>
    <div class="choices" id="tripleFormulaChoices">
      <button onclick="selectTripleRule('formula',false,this)">使う</button>
      <button onclick="selectTripleRule('formula',true,this)">使ってはいけない</button>
    </div>

    <div class="prompt" style="margin-top:22px"><b>何人ずつピックアップして解く？</b></div>
    <div class="choices" id="triplePickChoices">
      <button onclick="selectTripleRule('pick',true,this)">二人ずつ</button>
      <button onclick="selectTripleRule('pick',false,this)">三人まとめて</button>
    </div>

    <div id="feedback" class="feedback"></div>
    <button id="next" class="next primary" onclick="nextStep()">STEP 2へ</button>
  `);
};

function selectTripleRule(group,correct,btn){
  if(locked)return;
  const f=document.getElementById('feedback');
  if(!correct){
    btn.disabled=true;
    f.className='feedback ng';
    f.innerHTML=group==='formula'
      ? '三項比に、そのまま「内項の積＝外項の積」は使いません。'
      : '三人まとめてではなく、<strong>二人ずつ</strong>ピックアップします。';
    return;
  }

  tripleStep1State[group]=true;
  const box=document.getElementById(group==='formula'?'tripleFormulaChoices':'triplePickChoices');
  if(box) box.querySelectorAll('button').forEach(b=>b.disabled=true);
  btn.disabled=false;

  if(tripleStep1State.formula && tripleStep1State.pick){
    if(!tripleStep1State.counted){
      tripleStep1State.counted=true;
      score++;
    }
    locked=true;
    f.className='feedback ok';
    f.innerHTML='正解！<br><strong>そのまま公式は使わない。二人ずつピックアップして解く。</strong>';
    showNext();
    updateHeader();
  }else{
    f.className='feedback ok';
    f.innerHTML=group==='formula'
      ? '正解！ 次に、何人ずつピックアップするか選ぼう。'
      : '正解！ もう1つのルールも選ぼう。';
  }
}
