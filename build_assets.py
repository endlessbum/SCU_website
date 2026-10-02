# -*- coding: utf-8 -*-
"""Сборка ассетов сайта: скрины карусели, hero-коллаж и og:image."""
import os
import shutil
from PIL import Image, ImageFilter, ImageOps

ROOT = os.path.dirname(os.path.abspath(__file__))
ROUND = os.path.join(ROOT, 'Скрины', 'Срины приложения с сглаженными углами')
STRAIGHT = os.path.join(ROOT, 'Скрины', 'Срины приложения с углами 90 градусов')
SCU = os.path.join(ROOT, 'static', 'scuapp')


def fix_name(n):
    """В папке со скруглёнными скринами имена файлов сохранились в mojibake (utf-8 как cp866)."""
    try:
        return n.encode('cp866').decode('utf-8')
    except Exception:
        return n


round_files = {fix_name(f): os.path.join(ROUND, f)
               for f in os.listdir(ROUND) if f.lower().endswith('.png')}
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

# --- 2. Hero-коллаж из скруглённых скринов ---
CANVAS_W, CANVAS_H = 2936, 1443
canvas = Image.new('RGBA', (CANVAS_W, CANVAS_H), (255, 255, 255, 255))


def paste_with_shadow(img, pos):
    shadow = Image.new('RGBA', img.size, (0, 0, 0, 80))
    shadow.putalpha(img.split()[3].point(lambda a: 80 if a else 0))
    shadow = shadow.filter(ImageFilter.GaussianBlur(26))
    canvas.alpha_composite(shadow, (pos[0], pos[1] + 16))
    canvas.alpha_composite(img, pos)


def scaled(name, width):
    im = Image.open(round_files[name]).convert('RGBA')
    h = round(im.height * width / im.width)
    return im.resize((width, h), Image.LANCZOS)


# порядок от заднего к переднему
paste_with_shadow(scaled('Главная.png', 1700), (618, 90))
paste_with_shadow(scaled('Установка компонентов.png', 1100), (-140, 680))
paste_with_shadow(scaled('Настройки.png', 1100), (CANVAS_W - 1100 + 140, 680))
paste_with_shadow(scaled('Бэнчмарк.png', 1200), (868, 950))

rgb = canvas.convert('RGB')
# сайт подключает hero.webp напрямую; png-версия не собирается
rgb.save(os.path.join(ROOT, 'static', 'compositor', 'hero.webp'),
         'WEBP', quality=90, method=6)

# --- 3. og:image 1200x630 — cover-кроп из hero ---
ImageOps.fit(rgb, (1200, 630), Image.LANCZOS).save(
    os.path.join(ROOT, 'static', 'compositor', 'og-image.png'), optimize=True)

# --- 4. Курсор-шестерёнка: плоский #1C60F6, альфа логотипа, без контура ---
icon = Image.open(os.path.join(ROOT, 'static', 'compositor', 'app-icon.png')).convert('RGBA')
gear = Image.new('RGBA', icon.size, (0x1C, 0x60, 0xF6, 0))
gear.putalpha(icon.split()[3])
gear.resize((28, 28), Image.LANCZOS).save(
    os.path.join(ROOT, 'static', 'compositor', 'cursor.png'))
print('done')
