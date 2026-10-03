# -*- coding: utf-8 -*-
"""Сборка ассетов сайта: скрины карусели, hero-коллаж шапки и курсор."""
import os
import shutil
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
STRAIGHT = os.path.join(ROOT, 'Скрины', 'Срины приложения с углами 90 градусов')
SCU = os.path.join(ROOT, 'static', 'scuapp')

straight_files = ({f: os.path.join(STRAIGHT, f)
                   for f in os.listdir(STRAIGHT) if f.lower().endswith('.png')}
                  if os.path.isdir(STRAIGHT) else {})

# --- 1. Скрины для карусели (прямые углы), имена прежние ---
# рядом с png сохраняется webp: разметка подключает его через <picture>,
# png остаётся fallback'ом. Папка с исходниками опциональна: без неё
# существующие скрины карусели не пересобираются
for src_name, dst_name in [
    ('Установка компонентов.png', 'screen-install.png'),
    ('Удаление мусорного ПО.png', 'screen-cleanup.png'),
    ('Питание, память, CPU.png', 'screen-power.png'),
]:
    if src_name not in straight_files:
        continue
    dst = os.path.join(SCU, dst_name)
    shutil.copyfile(straight_files[src_name], dst)
    Image.open(dst).convert('RGB').save(os.path.splitext(dst)[0] + '.webp',
                                        'WEBP', quality=90, method=6)

# --- 2. Hero шапки: webp-версии готовых композиций (десктоп + мобильная) ---
# источники — ручные ассеты в static/compositor/Итог (на деплой не попадают,
# см. .vercelignore). Альфа сохраняется: фон страницы просвечивает сквозь
# прозрачные края композиции
HERO_SRC = os.path.join(ROOT, 'static', 'compositor', 'Итог')
for src_name, out_name in [
    ('hero-desktop.png', 'hero.webp'),
    ('hero-mobile.png', 'hero-mobile.webp'),
]:
    Image.open(os.path.join(HERO_SRC, src_name)).save(
        os.path.join(ROOT, 'static', 'compositor', out_name),
        'WEBP', quality=90, method=6)

# --- 3. Курсор-шестерёнка: плоский #1C60F6, альфа логотипа, без контура ---
icon = Image.open(os.path.join(ROOT, 'static', 'compositor', 'app-icon.png')).convert('RGBA')
gear = Image.new('RGBA', icon.size, (0x1C, 0x60, 0xF6, 0))
gear.putalpha(icon.split()[3])
gear.resize((28, 28), Image.LANCZOS).save(
    os.path.join(ROOT, 'static', 'compositor', 'cursor.png'))
print('done')
