"""Export all indexed R13 display meshes with their original Rhino surface normals.
Usage: python scripts/render-tech-timbers.py SOURCE.3dm
Then open /work/tech-timber-render/index.html and capture each 1200 x 500 view.
CAD is read only; this creates a display-only copy for website illustrations.
"""
import sys
import json
from pathlib import Path
import numpy as np
import trimesh
import rhino3dm as rhino

root = Path(__file__).resolve().parents[1]
destination = root / 'work/tech-timber-render'
destination.mkdir(parents=True, exist_ok=True)
model = rhino.File3dm.Read(sys.argv[1])
names = json.loads((root/'src/pages/tech/parts.generated.json').read_text())
(destination/'meshes').mkdir(parents=True, exist_ok=True)
for obj in model.Objects:
    name = obj.Attributes.Name
    if name not in names: continue
    vertices, normals, faces = [], [], []
    for surface in obj.Geometry.Faces:
        mesh = surface.GetMesh(rhino.MeshType.Render)
        if mesh is None: raise ValueError('Missing cached mesh: '+name)
        offset = len(vertices)
        vertices.extend((p.X*.001,p.Z*.001,-p.Y*.001) for p in mesh.Vertices)
        normals.extend((n.X,n.Z,-n.Y) for n in mesh.Normals)
        for a,b,c,d in mesh.Faces:
            faces.append((a+offset,b+offset,c+offset))
            if c != d: faces.append((a+offset,c+offset,d+offset))
    points = np.array(vertices)
    center = points.mean(axis=0)
    horizontal = (points-center)[:,[0,2]]
    _, axes = np.linalg.eigh(np.cov(horizontal.T))
    along = np.array([axes[0,-1],0,axes[1,-1]])
    if along[0] < 0: along *= -1
    up = np.array([0,1,0])
    view = np.cross(along,up)*.9 + up*.38 + along*.2
    view /= np.linalg.norm(view)
    right = np.cross(up,view); right /= np.linalg.norm(right)
    basis = np.stack([right,np.cross(view,right),view],axis=1)
    projected = (points-center) @ basis
    projected -= (projected.min(axis=0)+projected.max(axis=0))/2
    part = trimesh.Trimesh(vertices=projected,faces=np.array(faces),vertex_normals=np.array(normals)@basis,process=False)
    scene = trimesh.Scene()
    scene.add_geometry(part,geom_name=name,node_name=name)
    (destination/'meshes'/f'{name}.glb').write_bytes(scene.export(file_type='glb',include_normals=True))
    print(name,len(faces),'original cached faces',flush=True)
(destination/'parts.json').write_text(json.dumps(names))
