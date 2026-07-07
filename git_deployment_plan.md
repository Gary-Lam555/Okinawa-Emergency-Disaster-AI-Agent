# Git Version Control & Deployment Commands

This document provides the exact sequence of Git commands required to initialize, commit, and push the **Okinawa Emergency Portal (OkiSafe AI)** project to a remote Git hosting provider (like GitHub, GitLab, or Gitea) to trigger automated CDNs deployments.

---

## 🛠️ Step 1: Initialize Git and Create Local Commit
Run these commands inside your local project folder (`c:\Project\CapstoneProject`):

```bash
# 1. Initialize local Git repository
git init

# 2. Stage all project files (HTML, CSS, JS modules, assets)
git add .

# 3. Create initial commit
git commit -m "feat: initial commit of Okinawa Disaster AI Agent portal"

# 4. Rename the default branch to main
git branch -M main
```

---

## 🌐 Step 2: Link to GitHub / Remote Repository
1. Log in to [GitHub](https://github.com/) and click **New Repository**.
2. Name it `okisafe-ai` (leave it public and do NOT check "Add a README" or ".gitignore" as we already have codebase files).
3. Copy your remote repository URL (e.g., `https://github.com/YOUR-USERNAME/okisafe-ai.git`).
4. Execute the following in your command prompt:

```bash
# 1. Link the local repository to your remote GitHub repository
git remote add origin https://github.com/YOUR-USERNAME/okisafe-ai.git

# 2. Push your code to the main branch
git push -u origin main
```

---

## ⚡ Step 3: Trigger Auto-Deployment (GitHub Pages)
Once your code is pushed to GitHub:
1. Go to your repository page on GitHub.
2. Select the **Settings** tab.
3. Click **Pages** under the "Code and automation" sidebar.
4. Set **Source** to `Deploy from a branch`.
5. Set **Branch** to `main` and Folder to `/ (root)`.
6. Click **Save**.
7. Wait 1-2 minutes. Click on the generated link (e.g. `https://YOUR-USERNAME.github.io/okisafe-ai/`) to access your live portal.

---

## 🔄 Step 4: Making Future Updates
Whenever you modify files (e.g. adding new shelters or refining the AI Agent prompts), deploy the changes using this routine:

```bash
# 1. Stage the modifications
git add .

# 2. Commit the changes
git commit -m "chore: updated shelter status and AI prompt scripts"

# 3. Push to GitHub (Pages will automatically rebuild and update your site)
git push
```
