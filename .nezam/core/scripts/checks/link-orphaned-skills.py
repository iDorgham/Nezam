import json
import os
import re

# Resolve root path
repo_root = os.getcwd()

skills_registry_path = os.path.join(repo_root, '.cursor/state/skills-registry.json')
agents_dir = os.path.join(repo_root, '.cursor/agents')

if not os.path.exists(skills_registry_path):
    print(f"Error: {skills_registry_path} not found.")
    exit(1)

with open(skills_registry_path, 'r', encoding='utf-8') as f:
    registry = json.load(f)

orphaned_skills = []
for skill in registry.get('skills', []):
    if skill.get('orphaned'):
        orphaned_skills.append(skill)

print(f"Found {len(orphaned_skills)} orphaned skills to map.")

# Let's map categories to leader agent markdown file basenames
MAPPING = {
    'backend': ['backend-lead.md', 'lead-backend-architect.md'],
    'frontend': ['frontend-lead.md', 'lead-frontend-architect.md'],
    'design': ['lead-uiux-designer.md', 'visual-design-manager.md'],
    'infrastructure': ['infrastructure-manager.md', 'lead-devops-performance.md'],
    'quality': ['qa-test-lead.md'],
    'system': ['swarm-leader.md', 'deputy-swarm-leader.md', 'subagent-controller.md'],
    'content': ['content-strategist.md', 'content-workflow-manager.md'],
    'research': ['seo-specialist.md', 'aeo-specialist.md'],
    'analytics': ['lead-analytics-architect.md'],
    'cms-saas': ['lead-cms-saas-architect.md'],
    'external': ['subagent-controller.md'],
    'mobile-testing': ['qa-test-lead.md'],
    'pm': ['swarm-leader.md'],
    's8': ['swarm-leader.md']
}

# Group orphaned skills by category
skills_by_category = {}
for skill in orphaned_skills:
    path_parts = skill['path'].replace('\\', '/').split('/')
    try:
        skills_idx = path_parts.index('skills')
        category = path_parts[skills_idx + 1]
    except ValueError:
        category = 'system'
    
    if category not in skills_by_category:
        skills_by_category[category] = []
    skills_by_category[category].append(skill)

# For each category, append to the target agents
for category, skills in skills_by_category.items():
    targets = MAPPING.get(category, ['swarm-leader.md'])
    for target in targets:
        agent_path = os.path.join(agents_dir, target)
        if not os.path.exists(agent_path):
            print(f"Warning: Target agent file {agent_path} does not exist. Skipping.")
            continue
        
        with open(agent_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Format the skill references to append
        skills_list = []
        for s in skills:
            skills_list.append(f"- `@{s['id']}`")
        
        skills_text = "\n".join(skills_list)
        
        if "## Related Skills" in content:
            # Append inside the existing section
            pattern = r"(## Related Skills\s*)"
            replacement = r"\1" + skills_text + "\n"
            content = re.sub(pattern, replacement, content, 1)
        elif "## Primary skills / lenses" in content:
            # Append inside Primary skills / lenses section
            pattern = r"(## Primary skills / lenses\s*)"
            replacement = r"\1" + skills_text + "\n"
            content = re.sub(pattern, replacement, content, 1)
        elif "# @skill nezam-Dependencies" in content:
            # Append under dependencies
            pattern = r"(# @skill nezam-Dependencies\s*)"
            replacement = r"\1" + skills_text + "\n"
            content = re.sub(pattern, replacement, content, 1)
        else:
            # Append at the end of the file
            content += f"\n\n## Related Skills\n{skills_text}\n"
            
        with open(agent_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"Successfully mapped {len(skills)} skills to {target}")

print("Orphan mapping process complete!")
