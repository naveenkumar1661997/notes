---
layout: default
title: Git
---

<div class="hero">
  <h1>🔀 Git</h1>
  <p class="sub">Branching strategies, rebase vs merge, cherry-pick, stash, hooks, and everyday command reference.</p>
  <div class="tags">
    <span class="tag">Git Flow</span><span class="tag">Branching</span><span class="tag">Rebase</span>
    <span class="tag">Merge</span><span class="tag">Cherry-pick</span><span class="tag">Hooks</span>
  </div>
</div>

<div class="toc">
  <div class="toc-h">Contents</div>
  <ol>
    <li><a href="#concepts">Core Concepts</a></li>
    <li><a href="#git-flow">Git Flow (Branching Strategy)</a></li>
    <li><a href="#github-flow">GitHub Flow</a></li>
    <li><a href="#merge-vs-rebase">Merge vs Rebase</a></li>
    <li><a href="#cherry-pick">Cherry-pick, Stash, Reset</a></li>
    <li><a href="#commands">Essential Commands</a></li>
    <li><a href="#hooks">Git Hooks</a></li>
  </ol>
</div>

---

## Core Concepts {#concepts}

<div class="diagram">
<div class="mermaid">
flowchart LR
    WD["📁 Working Directory\n(untracked changes)"]
    WD -->|git add| SA["📋 Staging Area\n(index)"]
    SA -->|git commit| LR["🗂️ Local Repo\n(.git folder)"]
    LR -->|git push| RR["☁️ Remote Repo\n(GitHub/GitLab)"]
    RR -->|git pull| WD
    RR -->|git fetch| LR
    LR -->|git checkout| WD
</div>
</div>

<div class="tw">
<table>
  <thead><tr><th>Area</th><th>Description</th><th>Key Command</th></tr></thead>
  <tbody>
    <tr><td><strong>Working Directory</strong></td><td>Files you see and edit. Untracked or modified.</td><td><code>git status</code></td></tr>
    <tr><td><strong>Staging Area (Index)</strong></td><td>Snapshot of what will go into the next commit</td><td><code>git add &lt;file&gt;</code></td></tr>
    <tr><td><strong>Local Repository</strong></td><td>All commits stored in <code>.git/</code> folder</td><td><code>git commit -m "msg"</code></td></tr>
    <tr><td><strong>Remote</strong></td><td>Shared repo on GitHub/GitLab/Bitbucket</td><td><code>git push / git pull</code></td></tr>
  </tbody>
</table>
</div>

---

## Git Flow — Branching Strategy {#git-flow}

<div class="diagram">
<div class="mermaid">
gitGraph
   commit id: "Initial commit"
   branch develop
   checkout develop
   commit id: "Setup project"

   branch feature/login
   checkout feature/login
   commit id: "Add login form"
   commit id: "Add JWT auth"
   checkout develop
   merge feature/login id: "Merge login"

   branch feature/payment
   checkout feature/payment
   commit id: "Add Stripe integration"
   checkout develop
   merge feature/payment id: "Merge payment"

   branch release/1.0
   checkout release/1.0
   commit id: "Bump version 1.0"
   commit id: "Fix release bug"
   checkout main
   merge release/1.0 tag: "v1.0"
   checkout develop
   merge release/1.0 id: "Back-merge to dev"

   branch hotfix/critical-bug
   checkout hotfix/critical-bug
   commit id: "Fix prod bug"
   checkout main
   merge hotfix/critical-bug tag: "v1.0.1"
   checkout develop
   merge hotfix/critical-bug id: "Merge hotfix to dev"
</div>
</div>

<div class="tw">
<table>
  <thead><tr><th>Branch</th><th>Purpose</th><th>Rule</th></tr></thead>
  <tbody>
    <tr><td><strong>main</strong></td><td>Production-ready code</td><td>Never commit directly. Only merge from release or hotfix</td></tr>
    <tr><td><strong>develop</strong></td><td>Integration branch — latest delivered dev changes</td><td>Feature branches merge here. Must always be buildable</td></tr>
    <tr><td><strong>feature/*</strong></td><td>New feature development</td><td>Branch from develop, merge back to develop via PR</td></tr>
    <tr><td><strong>release/*</strong></td><td>Prep for a production release</td><td>Branch from develop, merge to main AND develop</td></tr>
    <tr><td><strong>hotfix/*</strong></td><td>Emergency production fix</td><td>Branch from main, merge back to main AND develop</td></tr>
  </tbody>
</table>
</div>

---

## GitHub Flow — Simplified {#github-flow}

<div class="diagram">
<div class="mermaid">
flowchart LR
    MAIN["main\n(always deployable)"]
    MAIN -->|branch| FEAT["feature/my-feature"]
    FEAT -->|commits| FEAT
    FEAT -->|Pull Request| PR["PR Review\n+ CI checks"]
    PR -->|approved & merged| MAIN
    MAIN -->|auto deploy| PROD["🚀 Production"]
</div>
</div>

<div class="box info"><b>ℹ️ When to use which?</b>
<strong>Git Flow</strong> — scheduled releases, versioned software, multiple environments. Complex but structured.<br/>
<strong>GitHub Flow</strong> — continuous deployment, web apps, SaaS. Simple: one main branch + feature branches + PRs.
</div>

---

## Merge vs Rebase {#merge-vs-rebase}

<div class="diagram">
<div class="mermaid">
flowchart TD
    subgraph MERGE["git merge — preserves history"]
        M_MAIN["main: A→B→C"] --> M_MERGE["Merge commit M"]
        M_FEAT["feature: A→B→D→E"] --> M_MERGE
        M_MERGE --> M_FINAL["main: A→B→C→M (D+E inside)"]
    end

    subgraph REBASE["git rebase — linear history"]
        R_MAIN["main: A→B→C"]
        R_FEAT["feature: A→B→D'→E'"] --> R_FINAL["feature rebased on C: A→B→C→D'→E'"]
        R_MAIN --> R_FINAL
    end
</div>
</div>

<div class="tw">
<table>
  <thead><tr><th>Aspect</th><th>Merge</th><th>Rebase</th></tr></thead>
  <tbody>
    <tr><td><strong>History</strong></td><td>Non-linear, preserves all commits</td><td>Linear, clean history</td></tr>
    <tr><td><strong>Merge commit</strong></td><td>Creates extra "Merge branch X" commit</td><td>No extra merge commit</td></tr>
    <tr><td><strong>Safety</strong></td><td>✅ Safe on any branch</td><td>❌ Dangerous on shared branches (rewrites history)</td></tr>
    <tr><td><strong>Conflicts</strong></td><td>Resolved once</td><td>Resolved per commit (if multiple commits)</td></tr>
    <tr><td><strong>When to use</strong></td><td>Public/shared branches (develop, main)</td><td>Local feature branches before merging to keep log clean</td></tr>
  </tbody>
</table>
</div>

<pre data-lang="bash"><code># Rebase feature branch onto latest main
git checkout feature/login
git fetch origin
git rebase origin/main         # replay feature commits on top of main

# Interactive rebase — squash/edit last 3 commits
git rebase -i HEAD~3
# In editor: pick / squash / reword / drop

# Golden rule: NEVER rebase a branch others are working on</code></pre>

---

## Cherry-pick, Stash, Reset {#cherry-pick}

<pre data-lang="bash"><code># ─── Cherry-pick: apply a specific commit to current branch ───
git log --oneline other-branch    # find the commit hash
git cherry-pick abc123            # apply that commit here
git cherry-pick abc123..def456    # apply a range of commits

# ─── Stash: temporarily save uncommitted work ──────────────────
git stash                          # stash working dir changes
git stash push -m "WIP: login form"
git stash list                     # see all stashes
git stash pop                      # apply most recent + remove
git stash apply stash@{2}          # apply specific stash, keep it

# ─── Reset: undo commits ───────────────────────────────────────
# --soft: keep changes in staging area
git reset --soft HEAD~1

# --mixed (default): keep changes in working dir (unstaged)
git reset HEAD~1

# --hard: discard all changes — DESTRUCTIVE
git reset --hard HEAD~1

# ─── Revert: safe undo (creates new commit) ────────────────────
git revert abc123                  # creates a new "revert" commit
# Use revert on public/shared branches, reset on local only</code></pre>

---

## Essential Commands {#commands}

<pre data-lang="bash"><code># ─── Setup ─────────────────────────────────────────────────────
git config --global user.name "Naveen Kumar"
git config --global user.email "naveen@email.com"
git config --global core.editor "code --wait"

# ─── Daily workflow ─────────────────────────────────────────────
git status                            # what changed?
git diff                              # diff working dir vs staging
git diff --staged                     # diff staging vs last commit
git log --oneline --graph --all       # visual branch history
git add -p                            # interactive staging (patch mode)
git commit --amend                    # edit last commit message

# ─── Branch ─────────────────────────────────────────────────────
git checkout -b feature/new           # create + switch
git branch -d feature/old             # delete local branch
git push origin --delete feature/old  # delete remote branch
git branch -a                         # list all branches

# ─── Remote ─────────────────────────────────────────────────────
git remote -v                         # list remotes
git fetch --prune                     # fetch + clean deleted remote branches
git pull --rebase origin main         # pull with rebase (cleaner)

# ─── Tagging ─────────────────────────────────────────────────────
git tag v1.0.0                        # lightweight tag
git tag -a v1.0.0 -m "Release 1.0"   # annotated tag
git push origin v1.0.0
git push origin --tags

# ─── Useful aliases ─────────────────────────────────────────────
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.st "status -s"
git config --global alias.last "log -1 HEAD"</code></pre>

---

## Git Hooks {#hooks}

<div class="box info"><b>ℹ️ What are Git Hooks?</b>
Scripts that run automatically at specific Git lifecycle events. Stored in <code>.git/hooks/</code>. Use <strong>Husky</strong> to share hooks via <code>package.json</code> in a team.
</div>

<div class="tw">
<table>
  <thead><tr><th>Hook</th><th>When it runs</th><th>Common Use</th></tr></thead>
  <tbody>
    <tr><td><strong>pre-commit</strong></td><td>Before commit is created</td><td>Run linters, formatters (ESLint, Black, Checkstyle)</td></tr>
    <tr><td><strong>commit-msg</strong></td><td>After commit message entered</td><td>Enforce Conventional Commits format</td></tr>
    <tr><td><strong>pre-push</strong></td><td>Before push to remote</td><td>Run unit tests, prevent push to protected branches</td></tr>
    <tr><td><strong>post-merge</strong></td><td>After a successful merge</td><td>Auto-install new dependencies (<code>npm install</code>)</td></tr>
    <tr><td><strong>pre-receive</strong> (server)</td><td>On remote when push arrives</td><td>Enforce branch protection, code style on server</td></tr>
  </tbody>
</table>
</div>

<pre data-lang="bash"><code># .git/hooks/commit-msg  — enforce Conventional Commits
#!/bin/sh
MSG=$(cat "$1")
PATTERN="^(feat|fix|docs|chore|refactor|test|ci|perf|style)(\(.+\))?: .{1,80}"
if ! echo "$MSG" | grep -qE "$PATTERN"; then
    echo "❌ Invalid commit message."
    echo "   Format: type(scope): description"
    echo "   Example: feat(auth): add JWT token refresh"
    exit 1
fi</code></pre>
