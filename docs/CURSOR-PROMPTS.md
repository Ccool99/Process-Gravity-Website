# Cursor AI Prompts for Git Workflow

Copy and paste these prompts into Cursor exactly as written - **NO EDITING NEEDED!**

---

## ⚙️ One-Time Setup (Do This First!)

**Paste this into Cursor ONCE when you first start:**

```
Please help me set up my personal Git branch and safety protections for this project:

1. Run: git config user.name
2. Take that username and create a branch name format: username-fixes
3. Save it in Git config: git config user.branchname "username-fixes"
4. Verify it's saved: git config user.branchname
5. Install pre-push hook to prevent accidental pushes to main:
   - Create .git/hooks/pre-push with this content:
     #!/bin/bash
     current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')
     if [ "$current_branch" = "main" ]; then
         echo ""
         echo "🚫 ERROR: Direct push to 'main' branch is blocked!"
         echo ""
         echo "   Please use the proper workflow:"
         echo "   1. Get your branch name: git config user.branchname"
         echo "   2. Switch to your feature branch: git checkout [your-branch]"
         echo "   3. Commit your changes there"
         echo "   4. Push your branch: git push origin [your-branch]"
         echo "   5. Create a Pull Request on GitHub"
         echo ""
         exit 1
     fi
     echo "✅ Pushing to branch: $current_branch"
     exit 0
   - Make it executable: chmod +x .git/hooks/pre-push
6. Check if my branch exists locally: git branch --list
7. Check if my branch exists on GitHub: git branch -r --list
8. If the branch doesn't exist anywhere:
   - Make sure I'm on main: git checkout main
   - Pull latest: git pull origin main
   - Create my branch: git checkout -b [my-branch-name-from-config]
   - Push it to GitHub: git push -u origin [my-branch-name-from-config]
9. If the branch exists on GitHub but not locally:
   - Fetch it: git fetch origin
   - Check it out: git checkout [my-branch-name-from-config]
10. If the branch exists locally:
    - Just switch to it: git checkout [my-branch-name-from-config]
11. Tell me what my branch name is and confirm I'm ready to work
12. Confirm that the pre-push hook is installed and working

Please show me each command and explain what's happening.
```

After this setup, you're fully protected and ready to use all other prompts!

---

## 🌅 Starting Your Work Day

**Paste this into Cursor (no editing needed!):**

```
I need to start my work day with Git. Please help me:

1. Get my branch name from: git config user.branchname
2. Check which branch I'm currently on
3. Make sure all my current changes are committed (if any)
4. Switch to the main branch and get the latest updates
5. Switch back to my personal branch (create it if it doesn't exist yet)
6. Merge the latest changes from main into my branch
7. Tell me if there are any conflicts that need resolving

Please show me the list of commands and I will run them myself. Will come back to you with any issues.
```

---

## 💾 Saving Your Work (Multiple Times Per Day)

**Paste this into Cursor (no editing needed!):**

```
I want to save my current work to Git. Please help me:

1. Get my branch name from: git config user.branchname
2. Show me what files I've changed
3. Add all my changes to Git
4. Commit them with a descriptive message based on what changed
5. Push to my branch (get name from config)

Don't push to main - only to my personal branch.

Please show me the list of commands and I will run them myself and come back to you with any issues.
```

---

## 📤 End of Day - Create and Submit PR

**Paste this into Cursor (no editing needed!):**

```
I'm ready to submit my work for review. Please help me:

1. Get my branch name from: git config user.branchname
2. Make sure all my changes are committed and pushed to my branch
3. Create a Pull Request on GitHub from my branch to main
4. Write a PR description summarizing the changes I made
5. Submit the PR

Target branch: main

Please show me the list of commands and I will run them myself. Do create PR instructions along with description. Will come back to you with any issues.
```

---

## 🆘 Emergency: I Made Changes on Wrong Branch

**Paste this into Cursor (no editing needed!):**

```
HELP! I think I made changes on the wrong branch (probably main).

Please help me:
1. Get my correct branch name from: git config user.branchname
2. Check which branch I'm on
3. Check if I have uncommitted changes
4. If I'm on main with changes, move those changes to my correct branch
5. Make sure main stays clean

Please explain each step carefully.
```

---

## 🔀 Resolving Conflicts

**Paste this into Cursor (no editing needed!):**

```
I have merge conflicts. Please help me:

1. Get my branch name from: git config user.branchname
2. Show me which files have conflicts
3. For each conflicted file, explain what the conflict is in simple terms
4. Help me decide what to keep (ask me questions if needed)
5. Mark the conflicts as resolved
6. Complete the merge

Please go slowly and explain each step.
```

---

## ✅ Verify Everything is Clean

**Paste this into Cursor (no editing needed!):**

```
Please check my Git status and tell me:

1. Get my configured branch name from: git config user.branchname
2. What branch am I currently on?
3. Do I have any uncommitted changes?
4. Is my branch up to date with the remote?
5. Are there any issues I should know about?

Please explain everything in simple terms.
```

---

## 📋 Quick Reference

| When | What to Do |
|------|------------|
| **First time ever** | Use "One-Time Setup" prompt |
| **Start of day** | Use "Starting Your Work Day" prompt |
| **After any coding session** | Use "Saving Your Work" prompt |
| **End of day** | Use "End of Day - Create PR" prompt |
| **Something feels wrong** | Use "Verify Everything is Clean" prompt |
| **Worked on wrong branch** | Use "Emergency" prompt |
| **Cursor says "conflicts"** | Use "Resolving Conflicts" prompt |

---

## Important Notes

- **You can save/commit multiple times per day** - don't wait until end of day
- **Your branch name is stored in Git config** - you never need to remember it
- **Don't worry about breaking things** - your branch is safe
- **If confused, paste the "Verify" prompt** to see current status
- **PRs can take time to review** - you can keep working on your branch while waiting

---

## What About the Next Day If My PR Isn't Merged?

**You have two options:**

### Option A: Keep Working (Recommended for Small Changes)
```
I have a PR under review but want to keep working. Please help me:

1. Get my branch name from: git config user.branchname
2. Make sure I'm on my branch
3. Let me continue working
4. When I save, commit with a message that this is additional work
5. Push to the same branch (this updates my existing PR automatically)

Tell me when I'm ready to continue working.
```

### Option B: Start Fresh (Recommended for New Feature)
```
I want to start a completely different feature while my PR is under review. Please help me:

1. Get my usual branch name from: git config user.branchname
2. Ask me what I'm working on to create a new branch name
3. Switch to main branch and pull latest changes
4. Create and switch to the new branch
5. Tell me I can now work on this new feature

I'll work here while my other PR is under review.
```

---

## Why This Works

✅ **No manual editing** - branch name comes from Git config  
✅ **Consistent** - everyone uses same prompts  
✅ **Portable** - works on any machine after one-time setup  
✅ **Safe** - Cursor always knows your correct branch name  
✅ **Protected** - pre-push hook prevents accidental pushes to main  
✅ **Smart** - automatically creates branch if it doesn't exist

---

## Getting Help

**If Cursor doesn't understand or something goes wrong:**
1. Copy the error message
2. Contact Sri with: "Cursor said: [paste error]"
3. Or paste this to Cursor: "Something went wrong. Here's the error: [paste error]. Please help me understand what happened and how to fix it."

---

## For Advanced Users: Understanding What's Happening

When you run the one-time setup, here's what happens behind the scenes:

1. **Git config stores your branch name** - like a bookmark
2. **Pre-push hook is installed** - prevents accidental main pushes (local safety net)
3. **All prompts read from this config** - consistent everywhere
4. **Branch is created if needed** - either locally or fetched from GitHub
5. **You're tracked on the right branch** - ready to work

Every prompt starts by reading `git config user.branchname` to know which branch is yours.

**The pre-push hook** acts as a local safety net that catches mistakes before they reach GitHub. Combined with GitHub's branch protection, you have two layers of protection.



---

## Web Application Product & Market Evaluation and launch readiness Prompt


Please review the entire web application, including the codebase, features, user flows, and overall architecture. Develop a clear understanding of the product’s purpose, target users, and core value proposition. Analyze how the application compares to existing products or alternatives in the current market. Identify the areas where this product is stronger or more differentiated, as well as any functional or experiential gaps. Recommend additional features, improvements, or refinements that would increase competitiveness and user adoption. Evaluate the application’s readiness for launch in terms of usability, performance, security, and scalability. Outline the key steps and priorities required before a full production launch. Present your findings in a structured, actionable format suitable for roadmap and decision-making.












## Prompt for - Condomate OS: Evidence-Based Feature Audit, Competitive Gap Analysis & Strategic Development Roadmap ##


You are Cursor’s Principal Product Engineer + Competitive Analyst. Your mission is to (1) inventory every feature that currently exists in the Condomate OS codebase (evidence-based), (2) compare against real competitors, (3) identify missing features and gaps, (4) prioritize what to build next using a clear scoring model, and (5) output a high-level step-by-step development plan for the next releases.

NON-NEGOTIABLES
- Evidence-based only: every “feature exists” claim must point to concrete artifacts (routes/pages/components, API endpoints, DB tables, RLS policies, seed/sample data flags).
- Separate “Built” vs “Partial” vs “Mock/Sample data” vs “Not present.”
- Multi-tenant + role-based (admin/board/treasurer/owner/resident/vendor) must be considered for every feature.

PHASE 1 — CODEBASE FEATURE INVENTORY (CURRENT STATE)
1) Crawl the repo and produce a Feature Catalog with columns:
   - Feature Area (Onboarding, Residents, Units, Work Orders, Vendors, Docs, Announcements, Finance, Payments, Reporting, Messaging, Notifications, Audits, Settings, AI, etc.)
   - Status: Built / Partial / Mock / Missing
   - UI Evidence: route(s) + page/component file path(s)
   - Backend Evidence: API calls / Supabase functions / queries used
   - Data Evidence: table(s)/view(s), triggers, indexes; sample-data usage (YES/NO)
   - RLS/Permissions Evidence: policies involved and role access notes
   - Notes: known limitations (e.g., not in routes, uses sample data, no exports, etc.)

2) Identify “orphan features”:
   - Pages/components that exist but are not routed
   - DB tables that exist with no UI
   - UI that uses mock/sample data instead of DB
   - Features blocked by RLS/circular bootstrap issues

3) Output a concise “System Map”:
   - Role model
   - Tenant model (property/unit membership)
   - Main workflows (happy paths) and where they break

PHASE 2 — COMPETITOR BENCHMARK (MARKET REALITY)
4) Build a competitor set (use web research and official product pages):
   - Buildium
   - AppFolio Property Manager
   - Vantaca (HOA focused)
   - TownSq (community/HOA)
   - PayHOA
   - (Optional) HOA Start / CINC / TOPS [include if time permits]

5) For each competitor, extract and normalize a feature checklist (only from credible sources like official sites, docs, pricing pages, or reputable reviews). Create a Competitor Feature Matrix:
   - Feature (standardized name)
   - Competitors offering it (Y/N)
   - Notes (depth: basic vs advanced)
   - “Table stakes” flag (common across most competitors)

PHASE 3 — GAP ANALYSIS (WHAT’S MISSING)
6) Compare Condomate OS catalog vs Competitor Feature Matrix and generate:
   - Missing Table-Stakes Features (must-have to sell)
   - Differentiators to pursue (AI, automation, workflow speed)
   - Nice-to-have features (later)
7) For each missing feature, provide:
   - Why it matters (business/user impact)
   - Which roles benefit (admin/board/treasurer/resident/vendor)
   - Dependencies (data model, payments provider, email, exports, etc.)
   - Implementation rough size (S/M/L)

PHASE 4 — PRIORITIZATION (RUTHLESS AND JUSTIFIED)
8) Prioritize using a scoring model (1–5) and show the scores:
   - Revenue/Conversion impact
   - User pain severity + frequency
   - Competitive necessity (table-stakes)
   - Engineering effort (inverse score)
   - Risk/compliance/security impact
   - Dependency readiness (can we build now?)
9) Produce a ranked backlog:
   - Top 10 Now (next 4–8 weeks)
   - Next 10 Soon (next 2–3 months)
   - Later (post-MVP)

PHASE 5 — HIGH-LEVEL DEVELOPMENT PLAN (NEXT RELEASES)
10) Produce a step-by-step plan in releases (high-level but actionable):
   - Release 1: unblock onboarding + tenant bootstrapping + routing gaps
   - Release 2: finance/payment truth + replace sample data + exports
   - Release 3: notifications (email first) + prefs + audit trails
   - Release 4: reporting generation + scheduling + downloadable PDFs/CSVs
   - Release 5: messaging module (if needed) + resident engagement enhancements
(Adjust the release breakdown based on what you find in the codebase.)

11) For each release, include:
   - Objectives
   - Scope bullets (features)
   - Key engineering milestones (DB, API, UI, RLS, tests)
   - Definition of Done (acceptance criteria)
   - Risks + mitigations

OUTPUT FORMAT (STRICT)
A) “Current Features in Condomate OS” catalog table (evidence-based)
B) Competitor feature matrix (with sources listed)
C) Gap list (missing features) with size/dependencies
D) Prioritized roadmap (ranked with scoring)
E) Next development plan (release-by-release)

START NOW
- First, inventory the repo and build the evidence-based feature catalog.
- Second, benchmark competitors using credible sources.
- Third, generate gaps, prioritize, and propose the release plan.

**Canonical output:** The full deliverable (A–E) is maintained in **`docs/FEATURE_CATALOG_AND_COMPETITIVE_ROADMAP.md`**. Update that document when re-running this analysis.
---






















