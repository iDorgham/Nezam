import re
import os
import glob

files = glob.glob('app/**/*.tsx', recursive=True) + glob.glob('components/**/*.tsx', recursive=True)

color_map = {
    r"bg-\[#(0A0C14|090A0F|0D0F18|0a0c14|090a0f|0d0f18)\]": "bg-ds-surface",
    r"bg-\[#(1E2130|2A2E3F|1e2130|2a2e3f)\]": "bg-ds-surface-hover",
    r"border-\[#(1E2130|2A2E3F|1e2130|2a2e3f)\]": "border-ds-border",
    r"text-\[#(3A3E4F|6B7280|9CA3AF|8a8f98|8A8F98|4B5563|3a3e4f|6b7280|9ca3af|4b5563)\]": "text-ds-text-muted",
    r"text-\[#(e5e7eb|E5E7EB|FFFFFF|ffffff|F7F8F8|f7f8f8)\]": "text-ds-text-primary",
    r"bg-\[#(FF5701|ff5701)\]": "bg-ds-primary",
    r"text-\[#(FF5701|ff5701)\]": "text-ds-primary",
    r"border-\[#(FF5701|ff5701)\]": "border-ds-primary",
    r"hover:bg-\[#(1E2130|2A2E3F|1e2130|2a2e3f)\]": "hover:bg-ds-surface-hover",
    r"hover:border-\[#(2A2E3F|1E2130|2a2e3f|1e2130)\]": "hover:border-ds-border-hover",
    r"hover:border-\[#(FF5701|ff5701)\]": "hover:border-ds-primary",
    r"hover:text-\[#(FF5701|ff5701)\]": "hover:text-ds-primary",
    r"hover:bg-\[#(e04e00|E04E00)\]": "hover:bg-ds-primary/90",
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
    if not os.path.isfile(file_path):
        continue
    with open(file_path, "r") as f:
        content = f.read()

    orig = content
    # Apply color map
    for pattern, replacement in color_map.items():
        content = re.sub(pattern, replacement, content)

    # Apply class map
    for pattern, replacement in class_map.items():
        # Avoid replacing things inside imports like import { ChevronLeft } from '...'
        # or left in other JS contexts by making sure it's in a className string? 
        # A simple hack for now: only replace if it's not preceded by a dot or inside a word
        pass

    # A more robust regex for classes inside className="...", but for simplicity we'll just run it globally
    # Wait, things like `marginLeft` shouldn't be touched by \bml- (it's not).
    # But `sm:ml-` will be hit by `\bml-`. `left-` will hit `left-0`.
    for pattern, replacement in class_map.items():
        content = re.sub(pattern, replacement, content)

    # Also fix some SVG fills/strokes
    content = re.sub(r"fill=['\"]#(0A0C14|090A0F|0D0F18)['\"]", "fill=\"var(--ds-surface)\"", content, flags=re.IGNORECASE)
    content = re.sub(r"stroke=['\"]#(1E2130|2A2E3F)['\"]", "stroke=\"var(--ds-border)\"", content, flags=re.IGNORECASE)
    content = re.sub(r"fill=['\"]#(4B5563|3A3E4F|8A8F98)['\"]", "fill=\"var(--ds-text-muted)\"", content, flags=re.IGNORECASE)
    content = re.sub(r"fill=['\"]#(FF5701)['\"]", "fill=\"var(--ds-primary)\"", content, flags=re.IGNORECASE)
    content = re.sub(r"stroke=['\"]#(FF5701)['\"]", "stroke=\"var(--ds-primary)\"", content, flags=re.IGNORECASE)

    if orig != content:
        with open(file_path, "w") as f:
            f.write(content)
        print(f"Refactored {file_path}")

