import os
import re

agents_dir = "/Users/Dorgham/Documents/Work/Devleopment/NEZAM/.cursor/agents"

frontmatter_to_add = """version: 1.0.0
certified: false
updated: 2026-05-12
changelog: []"""

for filename in os.listdir(agents_dir):
    if filename.endswith(".md"):
        filepath = os.path.join(agents_dir, filename)
        with open(filepath, 'r') as f:
            content = f.read()
        
        if "version:" in content:
            continue
            
        # Match frontmatter block
        match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
        if match:
            existing_frontmatter = match.group(1)
            new_content = content.replace(existing_frontmatter, existing_frontmatter + "\n" + frontmatter_to_add)
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Updated {filename}")
        else:
            # If no frontmatter, create one
            new_content = "---\n" + frontmatter_to_add + "\n---\n\n" + content
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Created frontmatter for {filename}")
