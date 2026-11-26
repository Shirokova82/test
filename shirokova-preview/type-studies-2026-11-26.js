
/* Previews based on the exact approved V12 source; only #home-page is replaced. */
(async function () {
  const variant = new URLSearchParams(location.search).get('variant') === 'b' ? 'b' : 'a';
  const words = ['КАКИМ','БЫ','НИ','БЫЛ','ВАШ'];
  const atom = (value, i, className='') => '<span' + (className ? ' class="'+className+'"' : '') + ' style="--i:'+(i+1)+'">'+value+'</span>';
  const prefix = '<section class="home ty-home ty-'+variant+'" id="home-page" aria-label="Главная — массаж и маркетинг"><div class="ty-stage">'
    + '<div class="ty-header"><span>МАССАЖ И МАРКЕТИНГ</span><span>АННА ШИРОКОВА / АВТОРСКИЙ ПРОЕКТ</span></div>'
    + '<div class="ty-art"><h1 class="ty-sr">Каким бы ни был ваш массаж — он должен быть профессиональным</h1>';
  const ending = '</div><div class="ty-footer"><span>АННА ШИРОКОВА / МОСКВА</span>'
    + '<a href="#page-products" aria-label="Открыть раздел Продукты">К РАЗДЕЛАМ <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18m-7-7 7 7 7-7"/></svg></a>'
    + '</div></div></section>';
  const heroA = '<div class="a-phrase" aria-hidden="true">'
    + '<div class="ty-text a-line a-opening">' + words.map((x,i) => atom(x,i,'a-shift')).join('')+'</div>'
    + '<div class="ty-text a-line a-central">'+atom('МАС',2,'a-shift')+atom('САЖ',3,'a-shift')+'</div>'
    + '<div class="a-axis"></div><div class="ty-text a-line a-clause"><span>— ОН ДОЛЖЕН</span><span>БЫТЬ</span></div>'
    + '<div class="ty-text a-line a-result">ПРОФЕССИОНАЛЬНЫМ</div></div>';
  const heroB = '<div class="b-phrase" aria-hidden="true">'
    + '<div class="ty-text b-opening">'+words.map((x,i)=>atom(x,i)).join('')+'</div>'
    + '<div class="b-spectrum"><div class="b-band">'+[...'МАССАЖ'].map((ch,i)=>atom(ch,i)).join('')+'</div></div>'
    + '<div class="ty-text b-conclusion"><span class="b-clause">— ОН ДОЛЖЕН БЫТЬ</span>'
    + '<strong class="ty-text b-result">ПРОФЕССИОНАЛЬНЫМ</strong></div></div>';
  const home = prefix + (variant === 'a' ? heroA : heroB) + ending;
  const re = /<section class="home" id="home-page"[^>]*>[\s\S]*?<\/section>/;
  try {
    const response = await fetch('./index.html', {cache:'no-store'});
    if (!response.ok) throw new Error('Исходная V12 не загрузилась: '+response.status);
    let source = await response.text();
    if (!source.includes('интерактивный макет · Droid 1997 · v12')
        || !re.test(source)
        || !source.includes('id="page-products"')
        || !source.includes('id="page-articles"')
        || !source.includes('id="page-club-membership"')
        || !source.includes('id="page-about"'))
      throw new Error('Исходник сайта изменился или не совпадает с утверждённой V12.');
    source = source.replace(re,home);
    source = source.replace('</head>','<link rel="stylesheet" href="./type-studies-2026-11-26.css"></head>');
    source = source.replace('<title>shirokova.blog — интерактивный макет · Droid 1997 · v12</title>',
      '<title>Массаж и маркетинг — типографический первый экран '+(variant==='a'?'01':'02')+'</title>');
    // Fit long Cyrillic words by actual font size, never squeeze the glyphs or substitute fonts.
    const fitJS = '<script>(function(){function fit(el){if(!el)return;var cap=el.closest(".ty-art"),size=parseFloat(getComputedStyle(el).fontSize),minimum=window.innerWidth<900?26:48;if(!cap)return;var limit=cap.clientWidth;for(var i=0;i<100 && el.scrollWidth>limit && size>minimum;i++){size-=1;el.style.fontSize=size+"px";}}function go(){document.querySelectorAll(".a-opening,.a-central,.a-clause,.a-result,.b-opening,.b-band,.b-result").forEach(fit)}document.fonts.ready.then(go);window.addEventListener("resize",go);go()})();<\/script>';
    source = source.replace('</body>',fitJS+'</body>');
    // The removed mobile raster contains the old heading; it is not retained in the new home.
    if (source.toLowerCase().includes('куда дальше')) throw new Error('Устаревший первый экран ещё присутствует');
    document.open();
    document.write(source);
    document.close();
  } catch (error) {
    document.body.innerHTML = '<main style="max-width:700px;margin:15vh auto;padding:30px;font:17px/1.6 Arial,sans-serif;color:#07516A">'
      +'<h1>Не удалось открыть предпросмотр</h1><p>'+String(error.message).replace(/[<>&]/g,'')+'</p></main>';
  }
})();
