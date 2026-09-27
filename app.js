        // Панель «Версии»: список сборок и вложенная панель с описанием изменений.
        // Новая версия = новая запись в массиве VERSIONS (первая в списке — верхняя в панели).
        var VERSIONS = [
            {
                num: "2.1.1",
                date: "26.09.2026",
                sections: [
                    {
                        title: "Безопасность сканера",
                        items: [
                            "Пересмотрен порядок анализа: lookup по подписанной базе IOC выполняется <strong>всегда до</strong> локального кэша — кэш больше не может скрыть известный malware.",
                            "Архивы (ZIP, включая вложенные) не кэшируются как «чистые»: содержимое сканируется при каждой встрече контейнера.",
                            "Кэш вердиктов версионируется по движку, версии базы и профилю сканирования (scripts/archives/persistence/processes/maxFileSize/эвристики) — смена любого параметра полностью сбрасывает кэш; повреждённые записи кэша игнорируются.",
                            "Persistence-цель-архив проходит полный archive-скан, вердикт содержимого учитывается в детекте автозапуска.",
                            "Добавлены тесты отмены и повреждённой базы: сканер корректно прерывается и не падает на мусорных данных."
                        ]
                    },
                    {
                        title: "База и обновления",
                        items: [
                            "Строгая валидация пакета базы: каждая строка <code>hashes.txt</code> проверяется (64 hex, вердикт, имя, UTF-8, без дублей); одна испорченная строка отклоняет всю базу.",
                            "Загрузка обновлений без автопереходов: redirect'ы обрабатываются вручную — только HTTPS, тот же хост, без понижения схемы, максимум 3 перехода.",
                            "Проверяется подпись базы чужим/подменённым ключом — пакет отклоняется."
                        ]
                    },
                    {
                        title: "Приложение",
                        items: [
                            "Проверки границ пути переведены с префиксного сравнения (<code>StartsWith</code>) на безопасный алгоритм — соседние каталоги (App vs App2/Alex vs Alex2) больше не проходят как «свои».",
                            "Принудительное удаление программ: сначала штатный тихий деинсталлятор, принудительное снятие процессов — только по таймауту; папка установки удаляется только при подтверждённом владении; папки данных по имени — только после отдельного подтверждения со списком.",
                            "Установка рантайм-компонентов: добавлены проверки ожидаемого имени файла, продукта и (опционально) SHA256-allowlist установщика, fail-closed.",
                            "История операций пишется через контролируемую фоновую очередь с дозаписью при выходе; логика старта переведена на Task-based."
                        ]
                    },
                    {
                        title: "UX и доступность",
                        items: [
                            "Всем переключателям без текста заданы имена для экранных дикторов (Accessibility).",
                            "Повышен контраст вторичного/третичного текста в светлой и тёмной темах до ≥4.5:1 — читаемость без потери визуальной иерархии.",
                            "Активатор выведен из production-сборки (UI, команда и копирование в output удалены)."
                        ]
                    },
                    {
                        title: "Инфраструктура",
                        items: [
                            "Приватный ключ подписи и пароль PFX удалены из исходников (пароль — только через переменную окружения).",
                            "Репозиторий очищен от сгенерированных артефактов; сборка воспроизводится с нуля, бинарники подписываются и автоматически проверяются; к релизу формируется манифест SHA256SUMS.",
                            "Тесты: <strong>347/347</strong>, включая 20+ security-регрессионных; отсутствие собранного ScannerCore в CI — ошибка, а не тихий пропуск."
                        ]
                    }
                ]
            }
        ];

        (function () {
            var toggle = document.getElementById('versionsToggle');
            var overlay = document.getElementById('versionsOverlay');
            var versions = document.getElementById('versionsPanel');
            var changelog = document.getElementById('changelogPanel');
            var versionsList = document.getElementById('versionsList');
            var changelogTitles = document.getElementById('changelogTitles');
            var changelogBody = document.getElementById('changelogBody');
            if (!toggle || !versions || !changelog || !versionsList) return;

            function open(el) { el.classList.add('open'); el.setAttribute('aria-hidden', 'false'); }
            function close(el) { el.classList.remove('open'); el.setAttribute('aria-hidden', 'true'); }

            // фокус при открытии получает заголовок панели (tabindex="-1"),
            // чтобы скринридер объявил её название
            function focusTitle(panel) {
                var title = panel.querySelector('.panel-title');
                if (title) title.focus({ preventScroll: true });
            }

            // Tab не выходит за пределы открытой панели: зацикливается по её
            // интерактивным элементам (верхняя панель — changelog, под ней — versions)
            function trapTab(e) {
                var panel = changelog.classList.contains('open') ? changelog
                    : versions.classList.contains('open') ? versions : null;
                if (!panel) return;
                var focusables = panel.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])');
                if (!focusables.length) return;
                var first = focusables[0];
                var last = focusables[focusables.length - 1];
                var active = document.activeElement;
                if (!panel.contains(active)) {
                    e.preventDefault();
                    (e.shiftKey ? last : first).focus({ preventScroll: true });
                } else if (e.shiftKey && active === first) {
                    e.preventDefault();
                    last.focus({ preventScroll: true });
                } else if (!e.shiftKey && active === last) {
                    e.preventDefault();
                    first.focus({ preventScroll: true });
                }
            }

            function openChangelog(v) {
                if (changelogTitles) {
                    changelogTitles.innerHTML = '<p class="panel-title" tabindex="-1">Версия ' + v.num + '</p>' +
                        '<p class="panel-sub">Релиз ' + v.date + '</p>';
                }
                changelogBody.innerHTML = v.sections.map(function (s) {
                    return '<h3>' + s.title + '</h3><ul>' +
                        s.items.map(function (item) { return '<li>' + item + '</li>'; }).join('') +
                        '</ul>';
                }).join('');
                open(changelog);
                changelog.scrollTop = 0;
                focusTitle(changelog);
            }

            VERSIONS.forEach(function (v) {
                var item = document.createElement('button');
                item.type = 'button';
                item.className = 'version-item';
                item.innerHTML = '<span class="version-num">Версия ' + v.num + '</span>' +
                    '<span class="version-date">Релиз ' + v.date + '</span>';
                item.addEventListener('click', function () { openChangelog(v); });
                versionsList.appendChild(item);
            });

            function closeAll(refocus) {
                close(changelog);
                close(versions);
                close(overlay);
                toggle.setAttribute('aria-expanded', 'false');
                if (refocus !== false) toggle.focus({ preventScroll: true });
            }

            toggle.addEventListener('click', function () {
                if (versions.classList.contains('open')) {
                    closeAll();
                } else {
                    open(overlay);
                    open(versions);
                    toggle.setAttribute('aria-expanded', 'true');
                    focusTitle(versions);
                }
            });

            overlay.addEventListener('click', function () { closeAll(); });
            document.getElementById('versionsClose').addEventListener('click', function () { closeAll(); });
            document.getElementById('changelogClose').addEventListener('click', function () { closeAll(); });
            document.getElementById('changelogBack').addEventListener('click', function () {
                close(changelog);
                var firstItem = versionsList.querySelector('.version-item');
                if (firstItem) firstItem.focus({ preventScroll: true });
            });

            document.addEventListener('keydown', function (e) {
                if (e.key === 'Tab') { trapTab(e); return; }
                if (e.key !== 'Escape') return;
                if (changelog.classList.contains('open')) {
                    close(changelog);
                    var firstItem = versionsList.querySelector('.version-item');
                    if (firstItem) firstItem.focus({ preventScroll: true });
                } else if (versions.classList.contains('open')) {
                    closeAll();
                }
            });
        })();

        // Счётчики посещений и загрузок: дедупликация по SHA256 на сервере (/api/track).
        (function () {
            var elVisits = document.getElementById('statVisits');
            var elDownloads = document.getElementById('statDownloads');

            function render(data) {
                if (!data || typeof data.visits !== 'number') return;
                elVisits.textContent = 'Посещений: ' + data.visits.toLocaleString('ru-RU');
                elDownloads.textContent = 'Скачали: ' + data.downloads.toLocaleString('ru-RU');
                elVisits.classList.add('visible');
                elDownloads.classList.add('visible');
            }

            fetch('api/track?type=visit', { headers: { 'Accept': 'application/json' } })
                .then(function (r) { return r.ok ? r.json() : null; })
                .then(render)
                .catch(function () {});

            // keepalive, чтобы запрос успел уйти до начала скачивания
            document.querySelectorAll('.btn-download').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    fetch('api/track?type=download', { method: 'POST', keepalive: true })
                        .then(function (r) { return r.ok ? r.json() : null; })
                        .then(render)
                        .catch(function () {});
                });
            });
        })();

        // «клик» ↔ switch morph: word turns into a toggle that cycles
        // green → purple → light blue → blue, then turns back into the word.
        (function () {
            var wrap = document.getElementById('clickMorph');
            if (!wrap) return;
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

            var sw = wrap.querySelector('.morph-switch');
            var GRAY = '#444444';
            var COLORS = ['#34c759', '#af52de', '#32ade6', '#0255fc'];
            var MORPH_MS = 500, HOLD_ON = 1300, HOLD_OFF = 420, WORD_PAUSE = 1800;

            function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

            async function cycle() {
                wrap.classList.add('as-switch');
                await wait(MORPH_MS + 750);

                for (var i = 0; i < COLORS.length; i++) {
                    sw.style.background = COLORS[i];
                    wrap.classList.add('on');
                    await wait(HOLD_ON);
                    wrap.classList.remove('on');
                    sw.style.background = GRAY;
                    if (i < COLORS.length - 1) await wait(HOLD_OFF);
                }

                await wait(MORPH_MS);
                wrap.classList.remove('as-switch');
                await wait(MORPH_MS + WORD_PAUSE);
            }

            // не крутим анимацию в фоновой вкладке и когда hero вне экрана
            var inView = false, viewWaiters = [];
            new IntersectionObserver(function (entries) {
                inView = entries[0].isIntersecting;
                if (inView) {
                    viewWaiters.forEach(function (r) { r(); });
                    viewWaiters = [];
                }
            }).observe(wrap);

            function waitVisible() {
                var promises = [];
                if (document.hidden) {
                    promises.push(new Promise(function (resolve) {
                        document.addEventListener('visibilitychange', function onVis() {
                            document.removeEventListener('visibilitychange', onVis);
                            resolve();
                        }, { once: true });
                    }));
                }
                if (!inView) promises.push(new Promise(function (r) { viewWaiters.push(r); }));
                return Promise.all(promises);
            }

            (async function loop() {
                for (;;) {
                    await waitVisible();
                    await cycle();
                }
            })();
        })();

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
