// Общие скрипты страниц: кнопка «наверх» и оверлейный скроллбар.
// Вынесено в отдельный файл: CSP на хостинге (script-src 'self')
// запрещает инлайн-скрипты.

// Кнопка «наверх»: появляется, когда прокручена половина страницы.
(function () {
    var btn = document.getElementById('toTop');
    if (!btn) return;

    function update() {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        btn.classList.toggle('visible', max > 0 && window.scrollY >= max / 2);
    }

    btn.addEventListener('click', function () {
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
})();

// Оверлейный скроллбар для десктопа с мышью: нативная полоса скрыта в CSS,
// при прокрутке рисуется бегунок .scroll-thumb (#2B2B2B, без стрелок и
// фона), который гаснет в покое — как оверлейные полосы на тач-устройствах.
(function () {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    var HIDE_MS = 900;   // сколько бегунок держится после последнего скролла
    var MIN_THUMB = 40;  // минимальная высота бегунка
    var EDGE = 4;        // отступ бегунка от краёв контейнера

    var containers = [];

    function addContainer(el, isPage) {
        if (!el) return;
        var c = { el: el, isPage: isPage, thumb: document.createElement('div'), timer: 0 };
        c.thumb.className = 'scroll-thumb';
        document.body.appendChild(c.thumb);

        c.hide = function () {
            clearTimeout(c.timer);
            c.thumb.classList.remove('visible');
        };

        c.update = function () {
            var rect, pos, scrollable;
            if (c.isPage) {
                rect = { top: 0, height: window.innerHeight, right: window.innerWidth };
                pos = window.scrollY;
                scrollable = el.scrollHeight - window.innerHeight;
            } else {
                // закрытая панель невидима — бегунок не нужен
                if (!el.classList.contains('open')) { c.hide(); return; }
                rect = el.getBoundingClientRect();
                pos = el.scrollTop;
                scrollable = el.scrollHeight - el.clientHeight;
            }
            if (scrollable <= 0 || rect.height <= 0) { c.hide(); return; }
            var trackH = rect.height - EDGE * 2;
            var thumbH = Math.max(MIN_THUMB, Math.round(trackH * rect.height / el.scrollHeight));
            c.thumb.style.top = Math.round(rect.top + EDGE + (pos / scrollable) * (trackH - thumbH)) + 'px';
            c.thumb.style.height = Math.round(thumbH) + 'px';
            c.thumb.style.left = Math.round(rect.right - EDGE - 8) + 'px';
            c.thumb.classList.add('visible');
            clearTimeout(c.timer);
            c.timer = setTimeout(c.hide, HIDE_MS);
        };

        (c.isPage ? window : el).addEventListener('scroll', c.update, { passive: true });
        containers.push(c);
    }

    addContainer(document.documentElement, true);
    addContainer(document.getElementById('versionsPanel'), false);
    addContainer(document.getElementById('changelogPanel'), false);

    window.addEventListener('resize', function () {
        containers.forEach(function (c) { c.update(); });
    });

    // панели открываются кликом: после анимации обновить их бегунки
    // (scroll-события при открытии может не быть, если scrollTop уже 0)
    document.addEventListener('click', function () {
        setTimeout(function () {
            containers.forEach(function (c) { if (!c.isPage) c.update(); });
        }, 450);
    });
})();
