#!/usr/bin/env python3
"""Create an allowlisted flat Hostinger artifact; never deploys or contacts hosting."""
import pathlib, shutil, zipfile
root=pathlib.Path(__file__).resolve().parents[1]
dist=root/'dist'
stage=dist/'nombres-hostinger'
if stage.exists():shutil.rmtree(stage)
stage.mkdir(parents=True)
for name in ['index.php','router.php','sitemap.php','robots.php','.htaccess','content','lib','partials','templates','assets']:
    source=root/name
    if source.is_dir():shutil.copytree(source,stage/name)
    else:shutil.copy2(source,stage/name)
with zipfile.ZipFile(dist/'nombres-hostinger.zip','w',zipfile.ZIP_DEFLATED) as archive:
    for p in sorted(stage.rglob('*')):
        if p.is_file():archive.write(p,p.relative_to(stage))
print(f'Created {dist / "nombres-hostinger.zip"} ({(dist/"nombres-hostinger.zip").stat().st_size} bytes)')
