// 問題11・12（三項比）の写真を、問題カードの「外側」に明瞭に表示する。
// app-photo-background.js のカード内背景を上書きし、写真を #app の背景として使う。

const cardBeforePhotoOutside = card;

card = function(x){
  const result = cardBeforePhotoOutside(x);
  const p = problems[pIndex];
  const section = app.querySelector('.card');

  if(p && p.type === 'triple' && section && window.TRIPLE_BG_PHOTOS){
    const item = window.TRIPLE_BG_PHOTOS[p.backgroundPhotoIndex ?? 0];

    // 写真は問題カード内ではなく、その外側に表示する。
    section.style.backgroundImage = 'none';
    section.style.backgroundColor = 'rgba(255,255,255,.97)';
    section.style.borderColor = 'rgba(255,255,255,.95)';
    section.style.boxShadow = '0 10px 32px rgba(0,0,0,.18)';

    app.style.backgroundImage = `url("${item.data}")`;
    app.style.backgroundSize = 'cover';
    app.style.backgroundPosition = item.position || 'center center';
    app.style.backgroundRepeat = 'no-repeat';
    app.style.borderRadius = '26px';
    app.style.padding = '150px 18px 22px';
    app.style.marginTop = '14px';
    app.style.boxShadow = '0 8px 30px rgba(0,0,0,.14)';
    app.style.overflow = 'hidden';
  } else {
    // 三項比以外は通常表示に戻す。
    app.style.backgroundImage = '';
    app.style.backgroundSize = '';
    app.style.backgroundPosition = '';
    app.style.backgroundRepeat = '';
    app.style.borderRadius = '';
    app.style.padding = '';
    app.style.marginTop = '';
    app.style.boxShadow = '';
    app.style.overflow = '';
  }

  return result;
};
