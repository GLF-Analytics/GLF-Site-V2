"""
S36 (9/30/26): raster copies of the GLF mark (public/images/glf-favicon.svg)
for search results, older browsers, iOS and the Organization logo in JSON-LD.
Run from the repo root after the mark changes:  python3 scripts/favicons.py

Writes public/favicon.ico (16, 32, 48), public/favicon-48.png,
public/apple-touch-icon.png (180, square corners: iOS rounds them itself)
and public/images/glf-logo.png (512). Needs Pillow and a bold sans font.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

FONTS = [
    "/mnt/c/Windows/Fonts/arialbd.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]
PUBLIC = Path(__file__).resolve().parent.parent / "public"
S = 512  # the 64-unit viewBox drawn at 8x


def mark(rounded: bool) -> Image.Image:
    k = S / 64
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    # <rect width="64" height="64" rx="12" fill="#09090b" />
    d.rounded_rectangle([0, 0, S - 1, S - 1], radius=12 * k if rounded else 0, fill="#09090b")
    # <rect x="2" y="2" width="60" height="60" rx="10" stroke="#27272a" />
    d.rounded_rectangle([2 * k, 2 * k, 62 * k, 62 * k], radius=10 * k, outline="#27272a", width=round(k))
    # <text x="32" y="35" font-size="28" font-weight="700" letter-spacing="1" anchor middle>GLF</text>
    font = ImageFont.truetype(next(f for f in FONTS if Path(f).exists()), round(28 * k))
    letters, gap = "GLF", 1 * k
    widths = [d.textlength(c, font=font) for c in letters]
    x = 32 * k - (sum(widths) + gap * (len(letters) - 1)) / 2
    for c, w in zip(letters, widths):
        d.text((x, 35 * k), c, font=font, fill="#ffffff", anchor="lm")
        x += w + gap
    return img


if __name__ == "__main__":
    rounded, square = mark(True), mark(False)
    rounded.resize((48, 48), Image.LANCZOS).save(PUBLIC / "favicon-48.png", optimize=True)
    rounded.save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    square.resize((180, 180), Image.LANCZOS).convert("RGB").save(PUBLIC / "apple-touch-icon.png", optimize=True)
    rounded.save(PUBLIC / "images" / "glf-logo.png", optimize=True)
    for f in ["favicon.ico", "favicon-48.png", "apple-touch-icon.png", "images/glf-logo.png"]:
        print(f, (PUBLIC / f).stat().st_size, "bytes")
