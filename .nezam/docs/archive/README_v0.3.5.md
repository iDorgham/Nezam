# NEZAM v0.3.2–v0.3.5 (Archived)

**Archived:** 2026-06-06  
**Status:** Superseded by v0.3.6  
**Reason:** v0.3.6 is 96% faster, full automation, single-command deployments  
**Keep Until:** 2026-07-06 (30-day grace period)  

---

## Version Progression

### v0.3.2–v0.3.5 (This Archive)
- Sequential phases: P0 → P1 → P2 → ... → P6
- Manual `pnpm ai:sync` (15 min per edit cycle)
- Manual branch naming, commit formatting
- Manual tag/release/deploy (430+ steps)
- 5.2GB repo, 30s IDE startup

### v0.3.6 (Active)
- Parallel phases: P0, then P1/P2/P3 simultaneous
- Auto-sync via CI gates (drift detection automation)
- Auto-branch/commit via Husky hooks
- Full release automation (1 git push)
- 1.4GB repo, <5s IDE startup
- **96% faster feature cycle (45 min → 2 min)**
- **96% fewer manual steps (430+ → 15)**

---

## If You Have Pending v0.3.x Work

Contact Dorgham to migrate to v0.3.6 timeline.

**See:** ../../MASTER_PLAN_v0.3.6.md (canonical active plan)
