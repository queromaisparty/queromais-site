import os

replacements = [
    ('Ã§', 'c'),
    ('Ã£', 'a'),
    ('Ã³', 'o'),
    ('Ã©', 'e'),
    ('Ãª', 'e'),
    ('Ã¡', 'a'),
    ('Ã­', 'i'),
    ('Ãµ', 'o'),
    ('Ãº', 'u'),
    ('Ã ', 'a'),
]

# Correct mappings using proper UTF-8
correct_replacements = [
    ('\u00c3\u00a7', '\u00e7'),  # ç
    ('\u00c3\u00a3', '\u00e3'),  # ã
    ('\u00c3\u00b3', '\u00f3'),  # ó
    ('\u00c3\u00a9', '\u00e9'),  # é
    ('\u00c3\u00aa', '\u00ea'),  # ê
    ('\u00c3\u00a1', '\u00e1'),  # á
    ('\u00c3\u00ad', '\u00ed'),  # í
    ('\u00c3\u00b5', '\u00f5'),  # õ
    ('\u00c3\u00ba', '\u00fa'),  # ú
    ('\u00c3\u00a0', '\u00e0'),  # à
    ('\u00c3\u0089', '\u00c9'),  # É
    ('\u00c3\u201c', '\u00d3'),  # Ó
    ('\u00c3\u009a', '\u00da'),  # Ú
    ('\u00c2\u00a9', '\u00a9'),  # ©
    ('\u00c2\u00b0', '\u00b0'),  # °
    ('\u00c3\u00a2', '\u00e2'),  # â
    ('\u00c3\u00b4', '\u00f4'),  # ô
]

fixed = []
for root, dirs, files in os.walk('C:/Projetos/QUEROMAISSITE/app/src'):
    dirs[:] = [d for d in dirs if d != 'node_modules']
    for file in files:
        if file.endswith(('.tsx', '.ts', '.css')):
            path = os.path.join(root, file)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                original = content
                for garbled, correct in correct_replacements:
                    content = content.replace(garbled, correct)
                if content != original:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    fixed.append(path)
            except Exception as e:
                print('Error ' + path + ': ' + str(e))

print('Fixed ' + str(len(fixed)) + ' files:')
for f in fixed:
    print('  ' + f)
