"""Import approved Bower masters, preserving historical project media."""
from pathlib import Path
from PIL import Image, ImageChops
import json, hashlib, shutil, argparse

root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('--marketing-root', type=Path, default=Path(r'C:\Users\danie\Documents\Codex\Projects\Bower Marketing'))
args = parser.parse_args()
brand = args.marketing_root/'02-brand-identity'
products = args.marketing_root/'04-product-images/bower-product-images-v01'
manifest = json.loads((products/'bower-product-image-manifest-v02.json').read_text(encoding='utf-8-sig'))
active = [entry for entry in manifest['entries'] if entry.get('status') == 'active']
studies = root/'public/assets/studies'
studies.mkdir(exist_ok=True)
for entry in active:
    src = products/entry['filename']
    assert hashlib.sha256(src.read_bytes()).hexdigest() == entry['sha256'], f'Source changed: {src.name}'
    im = Image.open(src).convert('RGB')
    im.thumbnail((1600,1600))
    im.save(studies/f"{entry['slug']}.webp", quality=84, method=6)
out = root/'public/assets/brand'
out.mkdir(exist_ok=True)
records = []
for src in (brand/'bower-brand-identity-v01/06-logo-assets').glob('*.png'):
    im = Image.open(src).convert('RGBA')
    # Trim only the unprinted canvas, never change the artwork.
    bg = Image.new('RGBA', im.size, im.getpixel((0,0)))
    box = ImageChops.difference(im, bg).convert('RGB').getbbox()
    if im.getextrema()[3][0] == 0:
        box = im.getchannel('A').getbbox()
    if box: im = im.crop(box)
    im.thumbnail((1200, 600))
    dest = out/src.name.replace('-v01','')
    im.save(dest)
    records.append(dict(file=dest.name, source=src.name, sha256=hashlib.sha256(src.read_bytes()).hexdigest(), operation='Trim empty canvas; proportional resize'))
(out/'provenance.json').write_text(json.dumps(records,indent=2),encoding='utf-8')
font = brand/'01-brand-system-source/bower-brand-identity-v01-source/fonts/Inter[opsz,wght].ttf'
shutil.copyfile(font, root/'public/fonts/Inter-variable.ttf')
# Refresh legacy Bower URLs so quiet pages and existing shared links keep working.
mapping = {
 '01-wisteria-walk':'wisteria-walk','02-garden-pavilion':'garden-pavilion','05-stained-glass-interior':'stained-glass-interior',
 'living-bower-interior':'living-interior','bower-in-summer-borders':'summer-borders','curator-in-landscape':'curator-talk',
 'timber-joinery-detail':'rib-to-arch-joint','garden-concert-aerial':'concert-aerial','garden-dinner':'wedding-dinner',
 'flowering-bower-morning-mist':'flowering-morning-mist','landscape-room-at-dawn':'landscape-room-dawn',
 'valley-bower-at-dawn':'valley-dawn','stained-glass-cliff-interior':'stained-glass-cliff',
 'installation':'growth-01-installation','establishing':'growth-02-establishing','mature':'growth-03-mature',
 'winter-canopy':'winter-canopy','garden-performance':'garden-performance',
}
for folder in ['gallery','home','process','product','commissions']:
    for dest in (root/'public/assets'/folder).rglob('*.webp'):
        if dest.stem in mapping:
            shutil.copyfile(root/'public/assets/studies'/f'{mapping[dest.stem]}.webp',dest)
print(f'Imported {len(records)} approved logo derivatives, Inter, and current Bower image replacements.')
