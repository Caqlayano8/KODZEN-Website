#!/usr/bin/env python3
import os
import glob

repo_path = r"C:\Users\kurto\Documents\GitHub\KODZEN-Website"
os.chdir(repo_path)

# Script tags to inject
scripts = '''  <script src="js/navbar-fix.js"></script>
  <script src="js/newsletter.js"></script>
'''

# Get all HTML files in root (not in subdirs)
html_files = [f for f in glob.glob("*.html") if not f.startswith("_")]

print(f"Found {len(html_files)} HTML files\n")

injected = 0
skipped = 0
failed = 0

for filename in sorted(html_files):
    try:
        # Read with UTF-8
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if already has scripts
        if 'navbar-fix.js' in content:
            print(f"⊘ {filename} (already has scripts)")
            skipped += 1
            continue
        
        # Find insertion point
        if '</body>' in content:
            insert_before = '</body>'
        elif '</html>' in content:
            insert_before = '</html>'
        else:
            print(f"✗ {filename} (no closing tag found)")
            failed += 1
            continue
        
        # Insert scripts
        new_content = content.replace(insert_before, scripts + insert_before)
        
        # Write back
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"✓ {filename}")
        injected += 1
    
    except Exception as e:
        print(f"✗ {filename} ({str(e)})")
        failed += 1

print(f"\n=== SUMMARY ===")
print(f"Injected: {injected}")
print(f"Skipped:  {skipped}")
print(f"Failed:   {failed}")
