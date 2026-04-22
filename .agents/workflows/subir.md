---
description: Subir alterações para o GitHub (git add, commit e push)
---

// turbo-all

1. Identificar todos os arquivos modificados com `git status --short`

2. Adicionar todos os arquivos ao stage:
```
cd "c:\Projetos\QUEROMAISSITE" ; git add -A
```

3. Fazer o commit com mensagem automática baseada na data/hora e nos arquivos alterados:
```
cd "c:\Projetos\QUEROMAISSITE" ; git commit -m "chore: atualizacao $(Get-Date -Format 'dd/MM/yyyy HH:mm')"
```

4. Fazer o push para o GitHub:
```
cd "c:\Projetos\QUEROMAISSITE" ; git push origin main
```

5. Confirmar o último commit para o usuário:
```
cd "c:\Projetos\QUEROMAISSITE" ; git log --oneline -3
```
