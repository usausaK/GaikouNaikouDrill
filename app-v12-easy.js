// 三項比2問を暗算で解ける難度に固定する。
// 同じチケット代なので、所持金は「使った割合」の逆比になる。

function disneyLandTriple(){
  // 1/2, 1/3, 1/4 → 2 : 3 : 4
  return makeTriple(
    'ディズニーランド',
    '50％',{n:1,d:2},
    '1/3',{n:1,d:3},
    '1/4',{n:1,d:4}
  );
}

function disneySeaTriple(){
  // 1/5, 1/4, 1/2 → 5 : 4 : 2
  return makeTriple(
    'ディズニーシー',
    '20％',{n:1,d:5},
    '1/4',{n:1,d:4},
    '1/2',{n:1,d:2}
  );
}
