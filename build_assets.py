# -*- coding: utf-8 -*-
"""Сборка ассетов сайта: скрины карусели, hero-коллаж шапки и курсор.

Скрипт не молчит: каждый шаг либо выполняется, либо попадает в отчёт как
пропущенный с указанием причины. Если не собрано ничего — выход с кодом 1,
чтобы деплой не уехал со старыми картинками.
"""
import os
import shutil
import sys
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
STRAIGHT = os.path.join(ROOT, 'static', 'scuapp', 'Заменить')
SCU = os.path.join(ROOT, 'static', 'scuapp')
HERO_SRC = os.path.join(ROOT, 'static', 'compositor', 'Итог')

# Качество подобрано по факту: исходные экспорты композера (lossless webp)
# весили 1.3 МБ на скрин, q85 даёт 50–120 КБ без видимой разницы на UI-скринах.
SCREEN_Q = 85
HERO_Q = 90

built, skipped = [], []


def note_built(msg):
    built.append(msg)
    print('  ok      ' + msg)


def note_skipped(msg):
    skipped.append(msg)
    print('  ПРОПУСК ' + msg)


# --- 1. Скрины для карусели ---
# Источник — папка «Заменить» с новыми экспортами. Если её нет, webp
# пересобираются из уже лежащих рядом png (они и есть исходники карусели),
# чтобы пережать старые тяжёлые webp без новых скринов.
straight_files = ({f: os.path.join(STRAIGHT, f)
                   for f in os.listdir(STRAIGHT) if f.lower().endswith('.png')}
                  if os.path.isdir(STRAIGHT) else {})

for src_name, dst_name in [
    ('1. screen-benchmark.png', 'screen-benchmark.png'),
    ('2. screen-search.png', 'screen-search.png'),
    ('3. screen-telemetry.png', 'screen-telemetry.png'),
    ('4. screen-power.png', 'screen-power.png'),
]:
    dst = os.path.join(SCU, dst_name)
    if src_name in straight_files:
        shutil.copyfile(straight_files[src_name], dst)
        src_for_webp, origin = dst, 'Заменить/' + src_name
    elif os.path.isfile(dst):
        src_for_webp, origin = dst, 'существующий ' + dst_name
    else:
        note_skipped('%s: нет ни «Заменить/%s», ни %s' % (dst_name, src_name, dst_name))
        continue

    out = os.path.splitext(dst)[0] + '.webp'
    Image.open(src_for_webp).convert('RGB').save(out, 'WEBP', quality=SCREEN_Q, method=6)
    note_built('%s -> %s (%d КБ, из %s)' % (
        dst_name, os.path.basename(out), os.path.getsize(out) // 1024, origin))

# --- 2. Hero шапки: webp-версии готовых композиций (десктоп + мобильная) ---
# Источники — ручные ассеты в static/compositor/Итог (на деплой не попадают,
# см. .vercelignore). Альфа сохраняется: фон страницы просвечивает сквозь
# прозрачные края композиции. Атрибуты width/height в index.html должны
# совпадать с фактическим размером этих источников (2936x1443 / 1170x913).
for src_name, out_name in [
    ('hero-desktop.png', 'hero.webp'),
    ('hero-mobile.png', 'hero-mobile.webp'),
]:
    src = os.path.join(HERO_SRC, src_name)
    out = os.path.join(ROOT, 'static', 'compositor', out_name)
    if not os.path.isfile(src):
        note_skipped('%s: нет источника %s' % (out_name, src))
        continue

    im = Image.open(src)
    im.save(out, 'WEBP', quality=HERO_Q, method=6)
    note_built('%s -> %s (%dx%d, %d КБ)' % (
        src_name, out_name, im.size[0], im.size[1], os.path.getsize(out) // 1024))

# --- 3. Курсор-шестерёнка: плоский #1C60F6, альфа логотипа, без контура ---
icon_path = os.path.join(ROOT, 'static', 'compositor', 'app-icon.png')
if os.path.isfile(icon_path):
    icon = Image.open(icon_path).convert('RGBA')
    gear = Image.new('RGBA', icon.size, (0x1C, 0x60, 0xF6, 0))
    gear.putalpha(icon.split()[3])
    gear.resize((28, 28), Image.LANCZOS).save(
        os.path.join(ROOT, 'static', 'compositor', 'cursor.png'))
    note_built('cursor.png (28x28)')
else:
    note_skipped('cursor.png: нет static/compositor/app-icon.png')

# --- Отчёт ---
print('\nсобрано: %d, пропущено: %d' % (len(built), len(skipped)))
if not built:
    print('ОШИБКА: ни один ассет не собран — проверьте пути к источникам', file=sys.stderr)
    sys.exit(1)
if skipped:
    print('ВНИМАНИЕ: часть ассетов не пересобрана (см. ПРОПУСК выше)', file=sys.stderr)
