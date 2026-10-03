# -*- coding: utf-8 -*-
"""Сборка ассетов сайта: скрины карусели, hero-коллаж шапки и курсор."""
import os
import shutil
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
STRAIGHT = os.path.join(ROOT, 'Скрины', 'Срины приложения с углами 90 градусов')
SCU = os.path.join(ROOT, 'static', 'scuapp')

straight_files = {f: os.path.join(STRAIGHT, f)
                  for f in os.listdir(STRAIGHT) if f.lower().endswith('.png')}

# --- 1. Скрины для карусели (прямые углы), имена прежние ---
# рядом с png сохраняется webp: разметка подключает его через <picture>,
# png остаётся fallback'ом
for src_name, dst_name in [
    ('Установка компонентов.png', 'screen-install.png'),
    ('Удаление мусорного ПО.png', 'screen-cleanup.png'),
    ('Питание, память, CPU.png', 'screen-power.png'),
]:
    dst = os.path.join(SCU, dst_name)
    shutil.copyfile(straight_files[src_name], dst)
    Image.open(dst).convert('RGB').save(os.path.splitext(dst)[0] + '.webp',
                                        'WEBP', quality=90, method=6)

# --- 2. Hero шапки: webp-версия готовой композиции коллажа ---
# источник — static/compositor/og-image.png (ручной ассет, он же og:image);
# прежняя сборка коллажа из скринов удалена вместе с og-image-кропом
Image.open(os.path.join(ROOT, 'static', 'compositor', 'og-image.png')) \
    .convert('RGB') \
    .save(os.path.join(ROOT, 'static', 'compositor', 'hero.webp'),
          'WEBP', quality=90, method=6)

# --- 3. Курсор-шестерёнка: плоский #1C60F6, альфа логотипа, без контура ---
icon = Image.open(os.path.join(ROOT, 'static', 'compositor', 'app-icon.png')).convert('RGBA')
gear = Image.new('RGBA', icon.size, (0x1C, 0x60, 0xF6, 0))
gear.putalpha(icon.split()[3])
gear.resize((28, 28), Image.LANCZOS).save(
    os.path.join(ROOT, 'static', 'compositor', 'cursor.png'))
print('done')
