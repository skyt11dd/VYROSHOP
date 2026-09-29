---
description: Auto-deploy rules for VYROSHOP
---

# Deployment Rules

1. Always deploy code changes to `https://github.com/skyt11dd/VYROSHOP`.
2. When the user asks to "deploy" (задеплой) or complete a task that requires it, automatically run `git add .`, `git commit -m "..."`, and `git push -u origin main`.
3. Do not ask for permission to push to this repository. Just execute the git commands.
