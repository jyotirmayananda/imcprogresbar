import os
import re

replacements = {
    "text-white": "text-slate-900",
    "text-gray-400": "text-slate-500",
    "text-gray-300": "text-slate-600",
    "bg-ag-black": "bg-slate-50",
    "bg-[#0D0B14]": "bg-white",
    "bg-[#0A0A0F]": "bg-slate-50",
    "bg-white/5": "bg-white",
    "bg-white/10": "bg-slate-200",
    "bg-white/20": "bg-slate-300",
    "border-white/10": "border-slate-200",
    "border-white/5": "border-slate-200",
    "border-white/20": "border-slate-300",
    "[color-scheme:dark]": "[color-scheme:light]",
    "hover:bg-white/10": "hover:bg-slate-200",
    "text-gray-500": "text-slate-400"
}

for root, _, files in os.walk(r"e:\jyoti\baba\antigravity\src"):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            original = content
            for k, v in replacements.items():
                content = content.replace(k, v)
            if content != original:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
print("Replaced all tailwind classes for light theme")
