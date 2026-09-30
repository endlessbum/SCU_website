// Кнопка «наверх»: появляется, когда прокручена половина страницы.
// Вынесено в отдельный файл: CSP на хостинге (script-src 'self')
// запрещает инлайн-скрипты.
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
