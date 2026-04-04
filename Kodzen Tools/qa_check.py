from pathlib import Path
import sys

base = Path(__file__).resolve().parent
apps = list(base.rglob('app.json'))
errors = []
for app in apps:
    r = app.parent
    for rel in ['demo/index.html','full/index.html','full/app.js','full/styles.css','setup/setup.ps1','setup/setup.bat','docs/tanitim.txt']:
        if not (r / rel).exists():
            errors.append(str(r / rel))
print('apps', len(apps))
print('missing', len(errors))
if errors:
    for e in errors[:40]:
        print('MISS', e)
    sys.exit(1)
