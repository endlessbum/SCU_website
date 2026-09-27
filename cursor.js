// Курсор-шестерёнка: следует за мышью вместо системного курсора.
// Над интерактивным элементом делает оборот 360° по часовой,
// при уходе — обратный (против часовой): класс spin ставит
// rotate(360deg), снятие возвращает к 0 — CSS-переход крутит назад.
(function () {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var GEAR_SIZE = 28;
    var INTERACTIVE = 'a, button, [role="button"], label, summary, select, input, textarea';

    var gear = document.createElement('div');
    gear.className = 'cursor-gear';
    gear.setAttribute('aria-hidden', 'true');
    gear.innerHTML = '<img src="static/compositor/cursor.png" alt="" draggable="false">';
    document.body.appendChild(gear);

    var shown = false;
    document.addEventListener('mousemove', function (e) {
        if (!shown) {
            shown = true;
            gear.style.opacity = '1';
            // системный курсор скрываем только когда шестерёнка на экране
            document.documentElement.classList.add('custom-cursor');
        }
        gear.style.transform = 'translate(' + (e.clientX - GEAR_SIZE / 2) + 'px,' +
            (e.clientY - GEAR_SIZE / 2) + 'px)';
    });

    // мышь ушла за пределы окна
    document.documentElement.addEventListener('mouseleave', function () {
        gear.style.opacity = '0';
        shown = false;
        document.documentElement.classList.remove('custom-cursor');
    });

    document.addEventListener('mouseover', function (e) {
        if (e.target.closest(INTERACTIVE)) gear.classList.add('spin');
    });
    document.addEventListener('mouseout', function (e) {
        if (e.target.closest(INTERACTIVE)) gear.classList.remove('spin');
    });
})();
