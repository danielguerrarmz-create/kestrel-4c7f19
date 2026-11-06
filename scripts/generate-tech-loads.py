"""Project the historical c3 LC4 data into a static grid and animated arrow groups.

Usage: python scripts/generate-tech-loads.py PATH/TO/c3
Read-only source. Same projection, force scaling and one-in-70 display sample
as the portfolio's render-bower-load-diagram.py. No structural analysis.
"""
import csv
import json
import math
import sys
from pathlib import Path

source = Path(sys.argv[1])
root = Path(__file__).resolve().parents[1]
assets = root / 'public/assets/tech'

def rows(name):
    with (source / name).open(encoding='utf-8-sig', newline='') as stream:
        return list(csv.DictReader(stream))

nodes = {r['node_id']: tuple(float(r[k]) for k in ('x_m', 'y_m', 'z_m')) for r in rows('nodes.csv')}
az, el = math.radians(-35), math.radians(28)

def project(p):
    x, y, z = p
    return x*math.cos(az)-y*math.sin(az), z*math.cos(el)+(x*math.sin(az)+y*math.cos(az))*math.sin(el)

segments = [(project(nodes[r['node_i']]), project(nodes[r['node_j']])) for r in rows('elements.csv') if r['node_i'] in nodes and r['node_j'] in nodes]
loads = [(nodes[r['node_id']], float(r['fz_kN'])) for r in rows('load_application.csv') if r['case_id'] == 'LC4' and float(r['fz_kN']) != 0]
maximum = max(abs(force) for _, force in loads)
arrows = []
for point, force in loads[::70]:
    length = .22 + .9*abs(force)/maximum
    arrows.append((project((point[0], point[1], point[2]+length)), project(point)))
supports = [project(tuple(float(r[k]) for k in ('x_m', 'y_m', 'z_m'))) for r in rows('supports.csv')]
points = [p for pair in segments+arrows for p in pair] + supports
lo = [min(p[i] for p in points) for i in range(2)]
hi = [max(p[i] for p in points) for i in range(2)]
width, height = 1426, 1132
scale = min((width-48)/(hi[0]-lo[0]), (height-48)/(hi[1]-lo[1]))

def screen(p):
    return round(width/2+(p[0]-(lo[0]+hi[0])/2)*scale, 1), round(height/2-(p[1]-(lo[1]+hi[1])/2)*scale, 1)

def line(pair):
    a, b = [screen(p) for p in pair]
    return f'M{a[0]},{a[1]}L{b[0]},{b[1]}'

grid = ''.join(line(pair) for pair in segments)
footings = ''.join(f'<rect x="{screen(p)[0]-5}" y="{screen(p)[1]-5}" width="10" height="10" fill="#20291f"/>' for p in supports)
base = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}"><title>Historical c3 gridshell, September 2026</title><path d="{grid}" fill="none" stroke="#70776c" stroke-width=".85" opacity=".7"/>{footings}</svg>'
(assets / 'gridshell-c3-base.svg').write_text(base, encoding='utf-8')
groups = [{'delay': round(1500*(i/11)**.72), 'path': '', 'tips': []} for i in range(12)]
tip_y = [screen(pair[1])[1] for pair in arrows]
for pair, y in zip(arrows, tip_y):
    band = min(11, int((y-min(tip_y))/(max(tip_y)-min(tip_y))*12))
    groups[band]['path'] += line(pair)
    groups[band]['tips'].append(screen(pair[1]))
data = {'width': width, 'height': height, 'case': 'LC4', 'sourceDate': '2026-09-03', 'loadedNodes': len(loads), 'displayArrows': len(arrows), 'groups': groups}
(root / 'src/pages/tech/loads.generated.json').write_text(json.dumps(data, separators=(',', ':'))+'\n', encoding='utf-8')
print(f'{len(segments)} grid segments; {len(loads)} historical loaded nodes; {len(arrows)} display arrows in {len(groups)} groups')
