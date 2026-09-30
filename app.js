        // Панель «Версии»: список сборок и вложенная панель с описанием изменений.
        // Новая версия = новая запись в массиве VERSIONS (первая в списке — верхняя в панели).
        var VERSIONS = [
            {
                num: "3.1.1",
                date: "30.09.2026",
                sections: [
                    {
                        title: "Меню и навигация",
                        items: [
                            "Раздел «Главная» выведен из группы «Обзор» и стоит над заголовком группы; пустые заголовки групп в сайдбаре скрываются.",
                            "В «Редактирование меню» безгрупповая секция подписывается «Без группы»; пустое имя группы больше не попадает в выпадающие списки.",
                            "Окно «Редактирование меню»: карточки компактнее; настройки (название / группа / видимость) применяются только по кнопке «Применить» (неактивна без изменений); заголовок окна в цвет фона обеих тем (Mica + DWMWA_CAPTION_COLOR)."
                        ]
                    },
                    {
                        title: "Новая вкладка «AI»",
                        items: [
                            "Карточка «Подключение по API» с выбором провайдера: DeepSeek API / OpenRouter / Cloudflare Workers AI; ключ хранится в <code>%AppData%\\SCU\\deepseek\\settings.json</code>, валидация ключа на лету (зелёный/красный пунктир с анимацией).",
                            "Окно чата: пузыри сообщений (пользователь справа/акцент, ассистент слева), Enter/Shift+Enter, история чатов, автопрокрутка, сохранение в <code>chats.json</code>, кнопка «Стоп».",
                            "Системная подсказка и конвертер разметки (<code>\\frac</code> → (a)/(b), <code>\\sqrt</code> → √ и т.д.); отладка ошибок: 402 → бесплатные провайдеры, 403 → приоритет r1-дистилляту."
                        ]
                    },
                    {
                        title: "Новые разделы «Диагностика» и «Драйверы»",
                        items: [
                            "«Диагностика» (группа «Очистка»): DiagnosticEngine с 12 пробами (система, диски, службы, Windows Update, сеть, автозагрузка, безопасность, журнал, DISM/CheckHealth, драйверы, SMART, аудио) и защитой от ложных срабатываний.",
                            "Три исправления с полным циклом: сброс DNS, запуск службы, DISM RestoreHealth + SFC; остальные действия ведут в существующие разделы. Карточка «Состояние системы» на Dashboard.",
                            "«Драйверы»: инвентарь ключевого оборудования через WMI, поиск и установка обновлений через Windows Update API (COM) с точкой восстановления типа 10 перед установкой, проблемные устройства → Диспетчер устройств, экспорт пакетов <code>pnputil /export-driver</code>."
                        ]
                    },
                    {
                        title: "Безопасность",
                        items: [
                            "PathSafety: реализованы <code>IsProtectedSharedDirectory</code>, <code>IsProtectedDataFolderName</code>, <code>IsAppProcessPath</code> — широкие корни защищены от удаления; reparse points резолвятся (junction наружу — rejected), добавлены тесты.",
                            "UserScriptStore: SHA-256 скрипта при импорте и сверка при каждом запуске — подмена файла означает fail-closed; перед запуском — подтверждение.",
                            "SystemTool использует абсолютные пути System32 (<code>netsh/powercfg/bcdedit/dism/powershell/cmd</code>); FileCleanupService пропускает reparse points; UIService восстанавливает таскбар только в Taskband/Streams\\Desktop (allowlist).",
                            "Новые регресс-тесты: инвалидация кэша по версии движка, вложенные архивы, модифицированный payload, атомарная замена, частичная загрузка, graceful timeout деинсталляции, безопасность дерева процессов и др.",
                            "Приватный ключ подписи базы сканера в истории git задокументирован в <code>docs/security-notes.md</code>."
                        ]
                    },
                    {
                        title: "Приватность и службы",
                        items: [
                            "Приватность: кнопка «Все сразу» → «Включить все» — семантика перевёрнута (включает все категории, возвращая твики); активна, пока хотя бы один тумблер выключен; каждый тумблер ресинхронизируется с фактическим состоянием.",
                            "Службы: кнопка «Отключить все» справа от «Откатить» — создаёт резерв один раз и отключает службы по очереди с подтверждением и записью в историю; отсутствующая служба считается «пропущенной» (идемпотентно).",
                            "«Поиск и целостность»: состояние дисков читается автоматически по атрибуту корня; кнопка переименована в «Применить» и активна только при расхождении галочек с фактом; снятие галочки включает индексацию обратно (attrib +I/−I рекурсивно).",
                            "DestructiveChange (сейчас → станет → последствия → откат) и <code>IConfirmDialogService.ConfirmChange</code>: переведены 8 опасных флоу, включая отключение всех служб, массовое включение приватности, полное удаление приложения, файл подкачки и снятие BCD-ограничений."
                        ]
                    },
                    {
                        title: "Сканер и база",
                        items: [
                            "Конвейер базы (MalwareBazaar): лимит пакета 10/4 МБ → 64 МБ; команда <code>fetch</code> в DatabaseBuilder (дампы MalwareBazaar + GitHub-агрегаторы, нормализация, дедупликация); ежедневная пересборка с подписью и публикацией <code>--latest</code> через workflow. E2E: 156 103 уникальных хеша.",
                            "ScannerCore переведён на WinVerifyTrust; winget — только из WindowsApps с проверкой подписи; автообновление базы сериализовано через семафор; URL-override ограничен allowlist'ом хостов.",
                            "Проверка индексации, карантин и запуск установщиков усилены: QuarantineService + SecureDirectory (DACL Administrators+SYSTEM, отказ при junction-перенаправлении), VerifiedLaunch — анти-TOCTOU запуск (reparse-запрет + повторная проверка подписи + read-lock).",
                            "WebView2 самого SCU больше не убивается при удалении Edge; PathSafety переведён на fail-closed."
                        ]
                    },
                    {
                        title: "Надёжность и краши",
                        items: [
                            "Аудит ~45 находок: RegistryHelper fail-closed (rollback не удаляет живые значения, Restore() откатывает частично восстановленное); все async void-границы защищены; утечка подписки UserScriptsChanged устранена.",
                            "Таймауты + <code>-NonInteractive</code> для всех раннеров (RunnerGuard); карантин не падает на UnauthorizedAccessException; ленивая инициализация на await; гонка бенчмарка со Startup устранена; убраны UI-фризы; починено колесо мыши в Сканере/Диагностике.",
                            "Бенчмарк: сбои чтения UAC попадают в ошибки области; ceip проверяет фактическое состояние задач; «Подтверждено» — только при положительной динамике; исправлено, что PotentialText никогда не заполнялся, а результат пользовательского скрипта был скрыт всегда.",
                            "SystemNotificationInterceptor: необработанные исключения → красная карточка, UnobservedTaskException → жёлтая; уведомление «SCU уже запущен» — в стиле приложения вместо системного MessageBox."
                        ]
                    },
                    {
                        title: "Встроенный браузер",
                        items: [
                            "NavigateAsync обязан прогонять URL через BrowserNavigationPolicy — устранён возможный обход политики через JSON закладок.",
                            "Расширения отключены (<code>AreBrowserExtensionsEnabled = false</code>), включена защита от отслеживания уровня Strict на профиле.",
                            "Индикатор «Не защищено» в адресной строке; при неудачной записи .tmp-файл удаляется."
                        ]
                    },
                    {
                        title: "Интерфейс и доступность",
                        items: [
                            "HelpText: <code>AutomationProperties.HelpText</code> из ToolTip в 7 базовых стилей (каскадом на все производные); icon-only кнопки браузера именуются из ToolTip.",
                            "WCAG-аудит: исправлены 7 кистей (Success, Warn, Danger, StateMissing, Tertiary и др.) в light/dark — повторный аудит все PASS.",
                            "LogPane: RichTextBox с цветами по уровню (ERROR красный, WARN янтарный, INFO обычный), умная автопрокрутка и вытеснение старых строк; SearchField — кастомный адорнер курсора (исправлено налипание на первый символ).",
                            "InfoTexts: новый формат JoinAttributed (имя кнопки + описание) — 7 объединённых информеров в разделах Network, Power, Services, Tasks.",
                            "Классификация приложений переписана: зелёный — игры/лаунчеры и стороннее, жёлтый — только по положительным признакам (Microsoft, железо, драйверы, рантаймы), серый (кнопка неактивна) — системные компоненты (Edge, WebView2, VC++, .NET).",
                            "Единый формат дат: хелперы <code>L.Date / L.DateTime</code>, ~15 мест приведены к дд.мм.гггг (раньше — смесь ISO / культуры / g).",
                            "Кнопки выбора цвета стали компактными квадратами 36×36 с центрированием палитры; Success-кисти, NotificationHost, стилизованные табы, MonoFontFamily, кольцо прогресса с расчётом периметра в коде."
                        ]
                    },
                    {
                        title: "Архитектура и сборка",
                        items: [
                            "ViewModels отвязаны от Windows API: <code>IShellOpenService / IFilePickerService</code> в Common, реализации в presentation-слое; PowerService 1034 → 4 partial; MainViewModel 1311 → 768 + Menu + Updates.",
                            "53 файла перенесены из SCU.Services в SCU.AppCore и SCU.Infrastructure; 81 using заменён глобальными; Common — чистый shared kernel; устранены namespace-коллизии.",
                            "Устранены все 25 предупреждений компилятора: сборка 0 ошибок / 0 предупреждений; UserScriptStore хранит SHA-256 скрипта при импорте и сверяет при каждом запуске (подмена = fail-closed).",
                            "Тесты: 473 → 527 → <strong>555 passed, 0 failed</strong>; сюиты разделены <code>[Trait(\"Suite\", Integration/Security)]</code>, CI — матрица unit/integration.",
                            "Build-джоб: SBOM (CycloneDX) + SHA256; release.yml по тегу <code>v*</code>: clean build → тесты → publish → подпись + signtool verify → Inno Setup → SHA256-манифест → SBOM."
                        ]
                    },
                    {
                        title: "Локализация",
                        items: [
                            "Полная ru/en во всех новых и изменённых разделах — включая AI, диагностику, драйверы, деструктивные диалоги и локализованные заголовки окон и критических сообщений."
                        ]
                    }
                ]
            },
            {
                num: "2.2.0",
                date: "28.09.2026",
                sections: [
                    {
                        title: "Встроенный браузер",
                        items: [
                            "Новая вкладка «Браузер»: встроенный защищённый браузер на WebView2 в отдельном окне, с вкладками, загрузками, историей, закладками и настройками.",
                            "Безопасность: блокировка опасных схем (<code>file://</code>, <code>javascript:</code>, <code>powershell:</code> и др.), подтверждение внешних протоколов, запрет разрешений по умолчанию, безопасные имена загружаемых файлов, запуск скачанного — только вручную.",
                            "Опциональная проверка скачанных файлов встроенным сканером."
                        ]
                    },
                    {
                        title: "Кастомизация",
                        items: [
                            "«Редактирование меню» в настройках: включение/скрытие вкладок, переименование, перенос между группами, пользовательские вкладки, удаление встроенных утилит.",
                            "«Добавить свой скрипт» (<code>.ps1</code>/<code>.bat</code>): проверка работоспособности, мастер размещения карточки, встроенный редактор, список установленных.",
                            "Выбор акцентного цвета и отдельный цвет иконки приложения через квадратик с палитрой; по умолчанию — синий."
                        ]
                    },
                    {
                        title: "Уведомления и обновления",
                        items: [
                            "Центр уведомлений в стиле приложения (загрузки, угрозы, статус сканера).",
                            "Проверка обновлений по GitHub Releases: автоматически при запуске и вручную из карточки «Обновления SCU»."
                        ]
                    },
                    {
                        title: "Прочее",
                        items: [
                            "Горячие клавиши: глобальная <code>Ctrl+Alt+S</code>, навигация <code>Ctrl+1…9</code>.",
                            "Сканер: процент выполнения и оценка времени до конца сканирования.",
                            "Очистка: отображение объёмов, доступных к очистке, прямо в карточках.",
                            "Приложения: маркер важности для системы (зелёный/жёлтый/серый) с подсказками.",
                            "Исправлено множество багов: гонки инициализации, утечки, порядок открытия вкладок, подсветка поиска, allowlist сканера при правке скриптов и другие."
                        ]
                    }
                ]
            },
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

            // Пока открыта панель (список версий или описание), основная страница
            // не прокручивается — скролл работает только внутри самой панели.
            // Класс вешается на html: у html задан overflow-x, из-за него
            // overflow на body не блокирует прокрутку страницы.
            function syncScrollLock() {
                var locked = versions.classList.contains('open') || changelog.classList.contains('open');
                document.documentElement.classList.toggle('panel-lock', locked);
                // компенсация ширины исчезнувшего скроллбара, чтобы контент не прыгал
                if (locked) {
                    var sb = window.innerWidth - document.documentElement.clientWidth;
                    document.body.style.paddingRight = sb > 0 ? sb + 'px' : '';
                } else {
                    document.body.style.paddingRight = '';
                }
            }

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
                syncScrollLock();
                if (refocus !== false) toggle.focus({ preventScroll: true });
            }

            toggle.addEventListener('click', function () {
                if (versions.classList.contains('open')) {
                    closeAll();
                } else {
                    open(overlay);
                    open(versions);
                    toggle.setAttribute('aria-expanded', 'true');
                    syncScrollLock();
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
                    syncScrollLock();
                    var firstItem = versionsList.querySelector('.version-item');
                    if (firstItem) firstItem.focus({ preventScroll: true });
                } else if (versions.classList.contains('open')) {
                    closeAll();
                }
            });

            // Свайпы на тач-экранах: открыть список версий — слева направо
            // (от левого края), закрыть — справа налево. В окне чтения версии
            // свайп справа налево закрывает её и возвращает к списку.
            (function () {
                var SWIPE_MIN = 70;   // минимальная длина горизонтального жеста
                var EDGE = 80;        // свайп-открытие начинается не дальше этого от левого края
                var startX = 0, startY = 0, tracking = false;

                document.addEventListener('touchstart', function (e) {
                    tracking = e.touches.length === 1;
                    if (!tracking) return;
                    startX = e.touches[0].clientX;
                    startY = e.touches[0].clientY;
                }, { passive: true });

                document.addEventListener('touchend', function (e) {
                    if (!tracking) return;
                    tracking = false;
                    var t = e.changedTouches[0];
                    var dx = t.clientX - startX;
                    var dy = t.clientY - startY;
                    // горизонтальный жест должен явно преобладать над вертикальным
                    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy) * 1.5) return;

                    var changelogOpen = changelog.classList.contains('open');
                    var versionsOpen = versions.classList.contains('open');

                    if (dx > 0 && !versionsOpen && !changelogOpen && startX <= EDGE) {
                        open(overlay);
                        open(versions);
                        toggle.setAttribute('aria-expanded', 'true');
                        syncScrollLock();
                        focusTitle(versions);
                    } else if (dx < 0 && changelogOpen) {
                        close(changelog);
                        var firstItem = versionsList.querySelector('.version-item');
                        if (firstItem) firstItem.focus({ preventScroll: true });
                    } else if (dx < 0 && versionsOpen) {
                        closeAll();
                    }
                }, { passive: true });
            })();
        })();

        // Счётчики посещений и загрузок: дедупликация по SHA256 на сервере (/api/track).
        (function () {
            var elVisits = document.getElementById('statVisits');
            var elDownloads = document.getElementById('statDownloads');

            function render(data) {
                if (!data || typeof data.visits !== 'number') return;
                var visitsValue = elVisits.querySelector('.stat-value');
                var downloadsValue = elDownloads.querySelector('.stat-value');
                if (!visitsValue || !downloadsValue) return;
                visitsValue.textContent = data.visits.toLocaleString('ru-RU');
                downloadsValue.textContent = data.downloads.toLocaleString('ru-RU');
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
            var COLORS = ['#34c759', '#af52de', '#32ade6', '#1C5FF6'];
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
