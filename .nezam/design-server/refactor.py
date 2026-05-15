import re
import os

files = [
    "app/sitemap/page.tsx",
    "app/layout-designer/page.tsx",
    "components/wireframe/WireframeBlockLibrary.tsx",
    "components/wireframe/WireframeEditor.tsx",
    "components/wireframe/WireframeInspector.tsx",
    "components/wireframe/BlockLibraryPanel.tsx",
    "components/menus/MenusWorkspace.tsx",
    "components/layout/TabHeader.tsx",
    "components/tokens/ColorTokenRow.tsx"
]

color_map = {
    r"bg-\[#(0A0C14|090A0F|0D0F18)\]": "bg-ds-surface",
    r"bg-\[#(1E2130|2A2E3F)\]": "bg-ds-surface-hover",
    r"border-\[#(1E2130|2A2E3F)\]": "border-ds-border",
    r"text-\[#(3A3E4F|6B7280|9CA3AF|8a8f98|4B5563)\]": "text-ds-text-muted",
    r"text-\[#e5e7eb\]": "text-ds-text-primary",
    r"text-white": "text-ds-text-primary",
    r"bg-\[#FF5701\]": "bg-ds-primary",
    r"text-\[#FF5701\]": "text-ds-primary",
    r"border-\[#FF5701\]": "border-ds-primary",
    r"hover:bg-\[#1E2130\]": "hover:bg-ds-surface-hover",
    r"hover:bg-\[#2A2E3F\]": "hover:bg-ds-surface-hover",
    r"hover:border-\[#2A2E3F\]": "hover:border-ds-border-hover",
    r"hover:border-\[#FF5701\]": "hover:border-ds-primary",
    r"hover:text-\[#FF5701\]": "hover:text-ds-primary",
}

class_map = {
    r"\bml-": "ms-",
    r"\bmr-": "me-",
    r"\bpl-": "ps-",
    r"\bpr-": "pe-",
    r"\bleft-": "start-",
    r"\bright-": "end-",
    r"\bborder-l-": "border-s-",
    r"\bborder-r-": "border-e-",
    r"\bborder-l\b": "border-s",
    r"\bborder-r\b": "border-e",
    r"\brounded-l-": "rounded-s-",
    r"\brounded-r-": "rounded-e-",
    r"\brounded-l\b": "rounded-s",
    r"\brounded-r\b": "rounded-e",
    r"\btext-left\b": "text-start",
    r"\btext-right\b": "text-end",
}

for file_path in files:
    full_path = os.path.join("/Users/Dorgham/Documents/Work/Devleopment/NEZAM/.nezam/design-server", file_path)
    if not os.path.exists(full_path):
        print(f"Skipping {file_path}")
        continue
    with open(full_path, "r") as f:
        content = f.read()

    # Apply color map
    for pattern, replacement in color_map.items():
        content = re.sub(pattern, replacement, content)

    # Apply class map
    for pattern, replacement in class_map.items():
        content = re.sub(pattern, replacement, content)

    with open(full_path, "w") as f:
        f.write(content)
    
    print(f"Refactored {file_path}")
