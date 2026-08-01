# NewsDarpan — MASTER BLUEPRINT

**Owner:** Neelverse Studios Private Limited
**Domain:** https://newsdarpan.in
**Brand:** NewsDarpan — *The Digital Mirror of India*
**Document status:** Single source of truth. Supersedes `Reader App (Android + iOS)` and `cross-reference.md` where they conflict.
**Date:** 31 July 2026
**Basis:** Dainik Bhaskar competitive teardown (`research/01`) + live audit of newsdarpan.in + existing repo review

---

## 0. Executive Summary — 60 seconds

**Kya already ban chuka hai (real, verified):**
- Django CMS + bilingual public site live hai, ~40 articles/day publish ho rahe hain
- Staff API (`/api/staff/v1/`) working hai, role-based workflow ke saath
- Team app (Kotlin + Compose) real backend se connected hai
- Company registered, Play Developer account ready, UP stringers hired
- SEO foundation strong hai: hreflang, news-sitemap, llms.txt, AI-crawler policy

**Kya nahi hai (the actual blockers):**
1. **Reader mobile API exist hi nahi karti** — `/api/mobile/v1/*` sab 404. Ye #1 blocker hai
2. Reader app mock data pe chal raha hai — production me kaam hi nahi karega
3. Package ID mismatch se deep links tootenge
4. Grievance Officer nahi hai — IT Rules 2021 non-compliance
5. `app-ads.txt` missing — programmatic revenue block
6. Content strategy broad hai, deep nahi — Bhaskar ke against yahi haarne ki wajah banegi

**Central strategic call:**
> App tumhara bottleneck nahi hai. **Backend API + content depth** bottleneck hai.
> Reader app ko **native Kotlin** me dobara likho (team app ke saath stack match), Flutter shell discard karo.
> Aur content ko **UP-first hyperlocal** banao — global filler kaat do. Bhaskar ka moat hyperlocal depth hai; usi maidan me lado, uske hi tareeke se, better app quality ke saath.

**Realistic timeline to a genuinely good launch: 16 weeks.**

---

## 1. Verified Current State — Audit Findings

Sab kuch 31 July 2026 ko live verify kiya gaya (curl/HTTP checks). **Ye assumptions nahi, measured facts hain.**

### 1.1 Backend & APIs

| Endpoint | Status | Matlab |
|---|---|---|
| `/api/mobile/v1/bootstrap` | **404** | ❌ Reader API absent |
| `/api/mobile/v1/home` | **404** | ❌ Reader API absent |
| `/api/staff/v1/` | **401** | ✅ Exists, auth-protected, working |
| `/api/v1/auth/token/` | **405** on GET | ✅ JWT auth working (POST) |

**Conclusion:** Team app ke paas real backend hai. Reader app ke paas **kuch nahi**. Poora reader mobile API ek greenfield backend workstream hai.

### 1.2 Public Site

| Item | Finding |
|---|---|
| Hindi home `/` | ✅ HTTP 200, 76 KB HTML, 0.85s |
| English home `/en/` | ✅ HTTP 200, 60 KB |
| hreflang alternates | ✅ Correct (`hi-IN`, `en-IN`, `x-default`) |
| `sitemap.xml` | ⚠️ HTTP 200 but **576 KB single `<urlset>`** — sitemap index nahi hai. Scale pe tootega |
| `news-sitemap.xml` | ✅ 87 articles (~2 din = ~40/day) |
| `robots.txt` | ✅ Well-crafted. GPTBot/ClaudeBot/PerplexityBot/OAI-SearchBot ko deliberately allow kiya (GEO citation strategy) — ye sophisticated hai |
| `llms.txt` | ✅ Exists (1.4 KB) — AI answer-engine optimization |
| `app-ads.txt` | ❌ **404** — programmatic ad demand block hoga |

### 1.3 App Links & Package Identity — **critical conflict**

| Source | Package ID |
|---|---|
| `https://newsdarpan.in/.well-known/assetlinks.json` | `in.newsdarpan.reader` (SHA256 `7C:E7:F7:EC:5F:89:A7:8F:...`) |
| Flutter `android/app/build.gradle.kts` | `in.newsdarpan.newsdarpan_reader` |

❌ **Mismatch.** Verified App Links fail karenge — web URL app me nahi khulega.

✅ **Good news:** Play Store pe **koi app publish nahi hui** (teeno package IDs 404 dete hain). Matlab package ID **freely change** kar sakte ho. Koi legacy constraint nahi. Clean slate.

**Decision:** `in.newsdarpan.reader` use karo (assetlinks already isi ke liye configured hai).

### 1.4 Legal & Compliance Pages

| Page | Status |
|---|---|
| `/about/` | ✅ 200 |
| `/editorial-policy/` | ✅ 200 |
| `/ethics-policy/` | ✅ 200 |
| `/corrections/` | ✅ 200 |
| `/ownership/` | ✅ 200 — correctly names *"Neelverse Studios Private Limited, an Indian technology and media company"* |
| `/ai-disclosure/` | ✅ 200 — good, AI transparency |
| `/privacy/` | ✅ 200 |
| `/terms/` | ✅ 200 |
| `/contact/` | ✅ 200 |
| **`/grievance/`** | ❌ **404** |
| **`/compliance-report/`** | ❌ **404** |
| `/advertising-policy/` | ❌ 404 |

❌ **Grievance Officer ka naam/contact site pe kahin nahi mila** — na homepage pe, na `/contact/` pe.

⚠️ **Ye IT Rules 2021 ka mandatory requirement hai** (digital news publishers ko India-based Grievance Officer appoint karna, publicly display karna, 24h me acknowledge, 15 din me resolve, aur monthly compliance report publish karna hota hai). Detail: `research/06`.

### 1.5 Content — Sabse Important Finding

**Volume:** ~40 articles/day. Bhaskar 300+/day karta hai. Gap bada hai, par startup ke liye starting point theek hai.

**Authors:** 12 named authors with profile pages ✅ (E-E-A-T ke liye accha)

**Automated utility:** Rashifal roz 12 rashiyon ke liye auto-generate ho raha hai (`rashifal-mesh-2026-08-01`) ✅ — smart, daily habit content

**❌ Problem 1 — Content mix bahut broad hai:**
Sitemap me ye sab mila — Hong Kong port checkpoints, China PLA anniversary, Singapore, Malayalam cinema, Kerala monsoon, Karnataka mango platform, Tamil Nadu, Barack Obama's reading list, Bryan Johnson anti-ageing, HSBC Australia loan portfolio.

Iske saath genuine UP local bhi hai: Unnao, Aligarh, Bulandshahr, Mirzapur, Lucknow, Bhadohi, Varanasi.

> **Sach ye hai:** "Huanggang Port ka naya checkpoint" Hindi me padhne ke liye UP ka koi user tumhari app nahi kholega. Ye content **na traffic laata hai, na differentiation deta hai** — bas wire feed bhar raha hai. Tumhare paas UP stringers hain, wahi tumhari real asset hai.

**❌ Problem 2 — English edition actually English nahi hai (serious):**
Verified example from live sitemap:
```
/en/article/ptii-ne-ptnii-pr-ddaalaa-tejaab-asptaal-men-bhrtii-aliigddh-ke-
thaanaa-roraavr-ke-shaahjmaal-rhmaaniyaa-msjid-ke-saamne-vaalii-glii-nivaasii-
saabaad-ne-shukrvaar-tddke-kriib-saaddhe-chh-bje-apnii-ptnii-yaasmiin-ke-upr-
tejaab-uddel-diyaa-aur-mauke-se-phraar-ho-gyaa...
```
Ye Hindi headline ka **romanized transliteration** hai — English translation nahi. Aur ye `/en/` edition me serve ho raha hai.

**Risks:**
- Google News/Discover: auto-generated/thin content policy risk — poore domain ki trust girti hai
- Slug 300+ characters — SEO ke liye kharab
- English reader ko gibberish dikhta hai — brand credibility khatam
- Yeh scale pe hazaaron URLs bana sakta hai

**Ye launch se pehle fix hona chahiye.** Options section 5.4 me.

### 1.6 Existing Apps in Repo

| App | State |
|---|---|
| **Reader (Flutter)** | 33 Dart files, 13 screens, **preview/mock data pe chal raha hai** (`USE_PREVIEW_DATA`, 156-line `preview_data.dart`). Push notifications ka code **zero** (koi Firebase/FCM dependency nahi). **Zero tests**. Package ID galat. → User ne isse "bilkul zero" kaha, aur wo sahi hai |
| **Team (Kotlin + Compose)** | Real, substantial, working. Hilt + Retrofit + Room + WorkManager + DataStore. 7 roles, workflow transitions, offline draft sync, media upload, audit log, video generation. **Ye keep karna hai** |

---

## 2. The Six Blockers (priority order)

| # | Blocker | Impact | Owner |
|---|---|---|---|
| **B1** | Reader mobile API absent (`/api/mobile/v1/*` = 404) | 🔴 App ban hi nahi sakti | Backend |
| **B2** | English edition = transliterated Hindi | 🔴 Google News trust + brand risk | Editorial + Backend |
| **B3** | Grievance Officer / IT Rules compliance gap | 🔴 Legal exposure | Legal + Web |
| **B4** | Reader app is a mock shell, wrong stack, wrong package ID | 🟠 Rebuild needed | Mobile |
| **B5** | `app-ads.txt` 404 | 🟠 Ad revenue loss from day 1 | Web (30-min fix) |
| **B6** | Content is broad, not deep — no moat | 🟠 Long-term competitive failure | Editorial |

**B5 aaj hi fix ho sakta hai. B3 is hafte. B1 sabse lamba hai (6-8 weeks).**

---

## 3. Strategic Decisions

### D1 — Reader app: **Native Kotlin + Jetpack Compose** (Flutter discard)

**Faisla:** Flutter reader app delete karo, native Kotlin me naya likho.

**Kyun:**
1. **Team app already Kotlin + Compose hai.** Ek hi stack = ek hiring pool, shared design-system module, shared networking/auth/serialization patterns, ek CI setup. Do stacks maintain karna chhoti team ke liye waste hai.
2. **Performance targets native se hi milte hain.** Bhaskar ko beat karne ka core claim hai: APK < 22 MB, cold start < 1.5s on 3GB device, 60fps scroll. Flutter engine baseline size aur first-frame cost add karta hai — ye claim aur mushkil ho jaata hai.
3. **Khone ko kuch nahi hai.** Current Flutter app mock data pe chalne wala 33-file shell hai — na push, na tests, na published listing. Sunk cost minimal hai.
4. **Audience Android-dominant hai.** Hindi belt me iOS share chhota hai.

**Honest trade-off:** iOS ke liye alag Swift app banana padega (Flutter ek codebase deta tha).
**Mitigation:** iOS Phase 3 hai. Tab tak API mature hoga. Agar iOS parity jaldi chahiye to **Kotlin Multiplatform** consider karo — domain + data layer share, UI native dono taraf. Par v1 me ise mat lo, complexity badhegi.

### D2 — Package ID: `in.newsdarpan.reader`

assetlinks.json already isi ke liye configured hai. Play pe kuch published nahi hai, so free change. Signing key ka SHA256 assetlinks me already hai — verify karo ki tumhare paas wahi keystore hai, aur **Play App Signing ka fingerprint bhi assetlinks me add karna** (do fingerprints chahiye: upload key + Play signing key).

### D3 — Backend: existing Django NDSAAS pe hi build karo (rewrite nahi)

Django 5 + DRF + PostgreSQL + Redis + Celery already production me hai, staff API working hai, SEO strong hai. **Isse replace karne ka koi kaaran nahi.** Naya Django app add karo: `apps.mobile_api`. Mera `research/03` doc NestJS/Postgres greenfield maanta tha — **wo ab applicable nahi hai**; usse sirf schema/caching/ranking ideas ke liye reference karo.

### D4 — ePaper: **digital-first auto-generated edition** (print nahi hai)

Bhaskar ka ePaper archive unka strongest retention + subscription hook hai. Tumhare paas print nahi hai — to `research/05` §9 ka **Case B** lo: roz raat ko top 40-60 stories ko newspaper-style layout templates me render karke ek "e-edition" auto-generate karo (HTML/CSS + Paged.js → headless Chromium → PDF → tiles).

**Ye actually Bhaskar se behtar hai** kyunki:
- Article bboxes tumhe already pata hain (tumhi layout bana rahe ho) → perfect hotspots, perfect text, zero OCR
- Per-city editions automatically generate ho sakti hain, zero extra manpower
- Kisi bhi purani date ke liye retroactively generate kar sakte ho

Phase 3 item hai, par ise roadmap me rakho — ye subscription revenue ka sabse strong candidate hai.

### D5 — Content: **UP-first depth, global filler cut**

Bhaskar 2000+ cities cover karta hai. Tum unse volume pe nahi jeet sakte. Par **UP ke 5-8 districts me unse deep** ja sakte ho — tehsil aur village level tak, jahan Bhaskar bhi district pe ruk jaata hai.

- Global/aggregated content (Hong Kong, Singapore, China, Kerala, Karnataka) ko **drastically cut** karo ya ek chhoti "Duniya" section me daalo
- Stringer output ko **tehsil-level geo-tagging** ke saath structure karo
- Target: **UP ke chune hue districts me #1 bano**, phir expand. Ek district me 50,000 loyal DAU > 20 districts me 2,000 casual users

### D6 — English edition: curated, not auto-transliterated

Transliteration pipeline turant band karo. Teen options (section 5.4 me detail):
1. Curated EN subset — sirf wo stories jinka real English version likha gaya (recommended)
2. Proper machine translation + human review, with `hreflang` + AI-disclosure
3. EN edition temporarily hide karo jab tak proper pipeline na bane

### D7 — Notifications: FCM, data-only, hard-capped

Reader app me **abhi push ka koi code nahi hai**. Ye P0 hai — news app ka primary retention engine. `research/04` §5 ka poora implementation lo: data-only messages, 12 channels, 6/day cap, quiet hours, dedupe, **aur MIUI/ColorOS/FuntouchOS pe alag se test** (India me 30-40% delivery OEM battery managers se marti hai).

### D8 — Monetization: ad-light, GAM-ready

`app-ads.txt` aaj host karo. Ad density caps `research/07` §3 se — max 1 ad per 7 cards, **zero app-open interstitial**, first ad position 6 ke baad. "Sabse kam ad wali Hindi news app" ek marketable claim hai.

### D9 — Team app: keep, harden

Delete kuch nahi. Fix:
- JWT tokens DataStore → **EncryptedSharedPreferences** (README me khud ye gap likha hai)
- Tests badhao (abhi 2 test files hain)
- Play Integrity on sensitive calls

### D10 — Quality gates non-negotiable

`research/09` ka poora process. Specifically: staged rollout with auto-halt, crash-free ≥ 99.7% gate, CI size gate (+300 KB fail), Macrobenchmark cold-start gate, aur OEM notification test cycle.

---

## 4. Target Architecture

```
                    ┌─────────────────────────────────────────┐
                    │   CDN (Cloudflare) + WAF + caching      │
                    └───────────────┬─────────────────────────┘
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
┌───────▼────────┐        ┌─────────▼─────────┐       ┌─────────▼─────────┐
│ Reader App     │        │  Public Web Site  │       │  Team App         │
│ Kotlin+Compose │        │  (Django templates│       │  Kotlin+Compose   │
│ in.newsdarpan  │        │   HI + EN, SEO,   │       │  in.newsdarpan    │
│    .reader     │        │   PWA, RSS,       │       │    .team          │
│ [REBUILD]      │        │   web stories)    │       │  [KEEP + HARDEN]  │
└───────┬────────┘        └─────────┬─────────┘       └─────────┬─────────┘
        │                           │                           │
        │ /api/mobile/v1/           │                           │ /api/staff/v1/
        │ [BUILD — B1]              │                           │ [EXISTS ✅]
        └───────────────────────────┼───────────────────────────┘
                                    │
                 ┌──────────────────▼──────────────────┐
                 │      Django 5 + DRF  (NDSAAS)       │
                 │  apps.newsroom   (Story, Section,   │
                 │                   Tag, Region,      │
                 │                   MediaAsset, ...)  │
                 │  apps.workflow   (transitions,      │
                 │                   policy, capability│
                 │  apps.accounts   (staff RBAC)       │
                 │  apps.publishing (public views)     │
                 │  apps.seo        (SEORecord)        │
                 │  apps.mobile_api   ◄── NEW          │
                 │  apps.notifications ◄── NEW         │
                 │  apps.reader_identity ◄── NEW (P2)  │
                 └──────────────────┬──────────────────┘
                                    │
     ┌──────────┬───────────┬───────┴────┬────────────┬──────────────┐
┌────▼─────┐┌───▼────┐┌─────▼─────┐┌─────▼─────┐┌─────▼──────┐┌──────▼─────┐
│PostgreSQL││ Redis  ││  Celery   ││ Object    ││    FCM     ││ Image      │
│          ││(cache) ││(workers,  ││ storage   ││ (push)     ││ pipeline   │
│          ││        ││ beat)     ││ (media)   ││            ││(resize/AVIF│
└──────────┘└────────┘└───────────┘└───────────┘└────────────┘└────────────┘
```

**Golden rules (from `cross-reference.md`, still valid):**
- Reader API sirf `status=published` serve karti hai. Staff fields (`risk_tier`, `legal_hold`, `quality_breakdown`, editor notes, workflow events) **kabhi expose nahi**
- Staff app kabhi reader API ko nahi likhta — sab kuch workflow service se
- Canonical URL shape `/{lang}/article/{slug}` — sharing aur deep links dono ke liye
- Correction/demotion → content revision bump → reader caches + downloads reconcile

---

## 5. Workstreams

### 5.1 Workstream A — Reader Mobile API (**critical path, B1**)

Naya Django app: `apps.mobile_api`. Base: `https://newsdarpan.in/api/mobile/v1/`

**Endpoints (build in this order):**

```
# Tier 1 — app ka minimum viable set
GET  /bootstrap?lang=hi
     → min/supported app version, force_update flag, brand, nav sections,
       feature flags, ad config, breaking state, legal page revisions, server_time
     Ek hi call — app open pe 8 calls nahi

GET  /home?lang=hi&cursor=
     → server-driven modules[]: breaking | hero | story_list | story_grid
       | web_stories | rashifal | newsletter
     Editorial placement app update ke bina badal sake

GET  /stories?lang=&section=&region=&tag=&author=&story_type=
             &ordering=latest|popular&cursor=
GET  /stories/{id}
GET  /stories/{id}/related
GET  /resolve?url={canonicalUrl}     ← web URL → story (deep links ke liye)
GET  /sections?lang=
GET  /pages/{slug}                   ← legal pages

# Tier 2
GET  /search?q=&lang=&section=&region=&author=&from=&to=&cursor=
GET  /authors  /authors/{slug}  /authors/{slug}/stories
GET  /stories/{id}/live-updates?since=
GET  /regions?parent=&kind=
GET  /topics/trending?lang=

# Tier 3
POST /devices        PATCH /devices/{id}    DELETE /devices/{id}   ← FCM tokens
GET  /stories/{id}/comments        POST /stories/{id}/comments
POST /newsletter/subscriptions     POST /contact
```

**Technical requirements (non-negotiable):**
- **Cursor pagination** (offset se feed me duplicates aate hain)
- `ETag` + `If-None-Match` → 304 = zero bandwidth
- Brotli/gzip at edge; feed payload target **≤ 40 KB for 20 items**
- `select_related` / `prefetch_related` + **serializer query-count tests** (N+1 = news app ka #1 backend killer)
- Structured `body_blocks[]` (native renderer ke liye) + sanitized `body_html` compatibility field
- `content_revision` field har story pe → client cache/download reconciliation
- **410 Gone** for demoted/tombstoned stories → app stale download delete kare
- Rate limits: anon 60/min/IP, `X-Request-Id` on every response
- Standard error envelope with `code`, `message`, `request_id`
- OpenAPI schema → generated Kotlin client (drift rokta hai)

**Cache strategy:**
| Layer | TTL |
|---|---|
| CDN — feed JSON | 60s + stale-while-revalidate 300s |
| CDN — story JSON | 300s (breaking: 30s) |
| CDN — images | 1 year immutable (hashed URLs) |
| Redis — rendered feed pages | 60s, publish event pe invalidate |

Publish/correction pe **surrogate-key based purge** (poora cache flush nahi — sirf affected section/region/story tags).

**Effort estimate: 5-7 weeks** for Tier 1+2 with one senior Django engineer.

---

### 5.2 Workstream B — Reader App (native Kotlin rebuild)

**Module structure** (`research/04` §1 se, is project ke liye adapted):

```
newsdarpan-reader/
├── app/                        # nav host, DI wiring, Application
├── core/
│   ├── core-designsystem/      # ⭐ SHARE with team-app: theme, Devanagari
│   │                           #    typography, brand lockup, components
│   ├── core-network/           # Retrofit + OkHttp, ETag interceptor,
│   │                           #    X-App-Version/X-Platform headers
│   ├── core-database/          # Room: stories, feed, bookmarks, downloads,
│   │                           #    tombstones, outbox, notification inbox
│   ├── core-datastore/         # preferences (lang, font, theme, data saver)
│   ├── core-model/  core-common/
│   ├── core-analytics/         # vendor-agnostic event abstraction
│   ├── core-notifications/     # 12 channels, data-only FCM, caps, deeplink
│   ├── core-media/             # Coil config, Media3 for video
│   └── core-ads/               # GAM behind abstraction; features never
│                               #    touch ad SDK directly
├── feature/
│   ├── onboarding/  (language → sections/regions → notification opt-in)
│   ├── home/        (server-driven modules)
│   ├── article/     (native block renderer — NO WebView)
│   ├── sections/    search/  authors/  saved/  downloads/
│   ├── liveblog/    webstories/  notifications/  settings/  legal/
│   └── utility/     (rashifal + Phase 2 civic utility)
└── benchmark/                  # Macrobenchmark + Baseline Profile generation
```

**Hard budgets (CI-enforced):**

| Metric | Budget |
|---|---|
| AAB download size | **≤ 22 MB** |
| Cold start → first content (p90, 3GB device) | **≤ 1500 ms** |
| Feed scroll | 0 frames > 16ms at p95, zero frozen frames |
| Article open (cached) | ≤ 250 ms |
| Memory (feed idle) | ≤ 120 MB PSS |
| Data for 50 articles | ≤ 3 MB normal, ≤ 1 MB data-saver |
| Crash-free sessions | ≥ 99.8% |
| User-perceived ANR | ≤ 0.10% (Play penalty line 0.47%) |
| Partial wake locks | **zero** (Play battery vital) |

**Must-do list:**
- ✅ **Baseline Profiles** shipped in AAB (20-30% startup win)
- ✅ Ads SDK init **deferred past first frame**
- ✅ Offline-first: Room = single source of truth, UI never reads network directly
- ✅ Paging 3 + RemoteMediator
- ✅ Devanagari font **subsetted** (full Noto Sans Devanagari 300KB+ → ~80KB)
- ✅ Data-only FCM + client-side cap/quiet-hours/dedupe guardrails
- ✅ Deep links: `newsdarpan.in/{hi|en}/article/{slug}`, `/section/`, `/author/` + `assetlinks.json` with **both** fingerprints
- ✅ Bilingual discipline: **never mix scripts, never silent fallback** (project's non-negotiable rule)
- ✅ Correction/demotion handling: 410 → remove from cache + downloads, show unavailable state
- ✅ Account deletion (in-app + web URL) if reader accounts ship
- ✅ Accessibility: TalkBack, 200% font scale, 48dp targets, WCAG AA

**Explicitly NOT in v1:** reader accounts (P2), comments (P2), ePaper (P3), iOS (P3), subscriptions (P3).

**Effort: 8-10 weeks** with 2 Android engineers, starting after API Tier 1 is stable.

---

### 5.3 Workstream C — Team App Hardening

| Task | Priority |
|---|---|
| JWT storage → EncryptedSharedPreferences | P0 (security) |
| Play Integrity on login + publish calls | P1 |
| Test coverage: 2 files → target 80% on ViewModels/repos | P1 |
| Extract `core-designsystem` as shared module with reader app | P1 |
| Stringer-optimized flows: 2G-tolerant upload, offline queue UX, image compress-before-upload | **P0 — UP stringers already hired, ye unka daily tool hai** |
| Push: story assigned / approval feedback / queue aging | P1 |

> **Ye workstream underrated hai.** Tumhare UP stringers ka output hi tumhara moat hai. Agar unka app 2G pe photo upload nahi kar paata, to content pipeline hi ruk jaayega. Team app ko field conditions me test karo — Unnao/Bulandshahr me, Bangalore office me nahi.

---

### 5.4 Workstream D — Content & Editorial

**D-1. English edition fix (B2) — launch blocker**

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **A. Curated EN subset** — sirf wo stories jinka genuine English version likha gaya | Quality guaranteed, Google-safe, credible | Kam EN volume | ✅ **Recommended** |
| B. MT + human review, AI-disclosed | Volume + quality | Review capacity chahiye | Good Phase 2 |
| C. EN edition temporarily noindex/hide | Immediate risk removal | Traffic loss | Interim if A/B ready nahi |

**Turant:** transliteration pipeline **band karo**. Existing transliterated `/en/` URLs ko `noindex` + canonical to Hindi karo, ya remove karo. Slug generation fix karo — Devanagari headline ka slug **transliteration dump nahi**, chhota meaningful ASCII slug (max ~60 chars) hona chahiye.

**D-2. Hyperlocal restructure (B6)**

```
Ab:      National + Global + Multi-state broad coverage, ~40/day, shallow
Target:  UP-first depth

  Tier 1 (60% output): 5-8 chune hue UP districts — tehsil/village level
                        crime, civic, politics, mandi, schools, health,
                        local govt, sports, festivals
  Tier 2 (25%):        UP state + National (jo UP reader ko matter kare)
  Tier 3 (15%):        Utility (rashifal, rates, weather, jobs, results)
  Cut:                 Global filler jisse UP reader ka koi rishta nahi
```

**Geo-tagging:** Story model me `Region` already hai. Isse **tehsil/village level** tak use karo. Ye reader app ke "Aapka Sheher" feed ka backbone hai.

**D-3. Utility content expansion (`research/02` Wedge 2)**
Rashifal already automated hai ✅. Ab add karo — ye **daily habit** banate hain, news se zyada:
- Mandi bhav (UP APMC crop prices) — rural UP me killer feature
- Bijli cut schedule (UPPCL feeder-wise)
- Petrol/diesel/gold rates city-wise
- Weather + rain alerts
- Sarkari bharti / exam results / admit cards
- Panchang, vrat-tyohar

**D-4. Content velocity target**
| Milestone | Articles/day |
|---|---|
| Now | ~40 |
| Week 8 | 80 (UP-weighted) |
| Week 16 (launch) | 120-150 |
| Month 12 | 250+ |

---

### 5.5 Workstream E — Compliance & Revenue Quick Wins

**This week:**
```
□ app-ads.txt host karo at https://newsdarpan.in/app-ads.txt        [30 min, B5]
□ Play Console "developer website" = newsdarpan.in (app-ads.txt match ke liye)
□ /grievance/ page: Grievance Officer naam, designation, email,
  phone, postal address — publicly visible, app + web dono            [B3]
□ Grievance intake form + ticket system with 24h ack / 15-day resolve SLA timers
□ /compliance-report/ page structure (monthly IT Rules report)
□ /advertising-policy/ page
□ Footer + app Settings me saare legal pages link
□ assetlinks.json me Play App Signing fingerprint bhi add karo
□ sitemap.xml ko sitemap index me todo (576KB single file scale pe tootega)
```

**Play Console (app submit se pehle):**
```
□ News & magazine app declaration — poora bharo (content sources, editorial contact)
□ Data Safety form — har SDK ka accurate declaration
□ Content rating (IARC)
□ Account deletion URL (agar reader accounts ship karte ho)
□ Privacy policy URL
```

Detail: `research/06` aur `research/11`.

---

## 6. Differentiation — Bhaskar ke against kya bechna hai

Bhaskar ki verified weaknesses (`research/01` §6) ke against, tumhare 4 wedges:

| Wedge | Claim | Status |
|---|---|---|
| **1. Sabse halki, sabse tez** | APK < 22MB vs unke 60-100MB; cold start < 1.5s vs 4-6s; 1 ad per 7 cards vs heavy; **zero app-open interstitial**; 6 notification/day cap vs 20-30 | Native rebuild se achievable. **Screenshot-able, marketable claim** |
| **2. Kaam Ki Khabar** | Mandi bhav, bijli cut, rates, naukri, results — daily utility | Rashifal ✅ done. Baaki Phase 2 |
| **3. Sunlo Darpan** | Hindi TTS per article + 5-min daily audio bulletin + Android Auto | Phase 3. India me huge underserved |
| **4. Sach Ka Darpan** | Visible fact-check layer + WhatsApp forward checker | Phase 3. `/ai-disclosure/` already exists — trust posture strong hai |

**Plus tumhara existing unfair advantage:** `llms.txt` + AI-crawler-friendly `robots.txt` = **GEO (generative engine optimization)**. ChatGPT/Claude/Perplexity jab UP news cite karenge, tum surface hoge. Bhaskar ye nahi kar raha. **Isse double down karo** — ye ek real, early-mover distribution channel hai.

---

## 7. Roadmap — 16 Weeks to Launch

```
═══ PHASE 0: Unblock & Foundation (Week 1-3) ═══
Backend    OpenAPI contract for /api/mobile/v1/ (design + review)
           apps.mobile_api scaffold, serializers, cursor pagination helper
           BodyBlockConverter (Story.body → body_blocks[])
Web        ✅ app-ads.txt, /grievance/, /compliance-report/,
             /advertising-policy/, sitemap index, assetlinks 2nd fingerprint
Editorial  🔴 Transliteration pipeline OFF. Slug generator fix.
             EN strategy decided + old EN URLs handled
Mobile     Flutter app archived. Native repo scaffold, design system module
             extracted from team-app, CI + size/perf gates configured
Content    UP-first editorial plan. Tehsil-level Region taxonomy defined

═══ PHASE 1: API + App Core (Week 4-9) ═══
Backend    /bootstrap, /home, /stories, /stories/{id}, /related, /resolve,
             /sections, /pages  →  live on staging then production
           Query-count tests, ETag, CDN cache rules, surrogate-key purge
Mobile     Onboarding (lang → regions → notif), Home (server-driven modules),
             Article (native block renderer), Sections, Saved (offline),
             Settings, Legal
           Room offline-first, Paging 3, Baseline Profiles
Team app   EncryptedSharedPreferences, 2G stringer flows, tests
Content    Velocity 40 → 80/day, UP-weighted

═══ PHASE 2: Engagement (Week 10-13) ═══
Backend    /search, /authors, /live-updates, /devices, notification models
             (MobileInstallation, NotificationPreference, Campaign, Delivery)
           Celery push fanout, dead-token cleanup, 410 tombstones
Mobile     Search, Authors, Live blog, Downloads manager,
             🔔 FCM push (12 channels, caps, quiet hours, dedupe),
             notification inbox, deep links verified, GAM ad slots
Content    Utility expansion: mandi bhav, bijli cut, rates, jobs
QA         50 E2E flows, OEM matrix (MIUI/ColorOS/Vivo/realme),
             network conditions, Hindi localization, accessibility, load tests

═══ PHASE 3: Launch (Week 14-16) ═══
Week 14    Internal track (20 testers) → Closed beta (300)
Week 15    Open beta (5,000). Vitals gate: crash-free ≥99.7%, ANR ≤0.15%
           Play listing + ASO assets (research/08), pre-registration campaign
Week 16    Production staged rollout 5% → 20% → 50% → 100%
           Auto-halt if crash-free < 99.3%
           Content velocity 120-150/day, 2 weeks archive ready

═══ POST-LAUNCH (Month 5+) ═══
Reader accounts + cross-device sync · Comments · Web stories native player
Home widget · TTS/audio bulletins · Fact-check section
Auto-generated e-edition (ePaper) · Subscriptions · iOS (Swift)
Personalization v1 · Multi-language expansion
```

---

## 8. Quality Gates (launch-blocking)

```
BACKEND
□ Every reader endpoint has serializer query-count test (no N+1)
□ p95 API read < 800ms at origin for common feeds
□ Reader API permission test: no staff field ever leaks
   (status, risk_tier, legal_hold, quality_breakdown, editor notes)
□ Unpublished/demoted story returns 404/410, never content
□ Load test: breaking-news spike 0 → 15,000 RPS in 60s survives
□ CDN cache hit ratio ≥ 90% under load

READER APP
□ AAB ≤ 22 MB (verified in Play Console)
□ Cold start p90 ≤ 1500ms on 3GB device (Macrobenchmark)
□ Zero frames > 16ms at p95 on feed scroll
□ Crash-free ≥ 99.8% in open beta
□ ANR ≤ 0.10%
□ Zero partial wake locks
□ Baseline Profile shipped
□ Offline: airplane mode → cached feed + articles + downloads work
□ Deep links verified in production (adb + real WhatsApp share test)
□ Push delivered on MIUI/ColorOS/Vivo with app killed ⭐
□ HI/EN: no script mixing, no silent fallback, 200% font scale intact
□ TalkBack full pass, Accessibility Scanner clean
□ Correction/demotion: 410 → stale download removed, honest UI state

CONTENT & COMPLIANCE
□ Zero transliterated-as-English articles live
□ Grievance Officer publicly listed (app + web) ⭐
□ Monthly compliance report page live
□ app-ads.txt validated ⭐
□ Play news declaration + Data Safety accurate
□ 2 weeks archive published before launch (empty app = uninstall)
□ Every article: real byline, timestamp, source, alt-text
□ CMS guardrails: victim identity, communal framing, suicide helpline,
   health/financial disclaimers (research/06 §6)
```

---

## 9. Immediate Next 10 Actions

| # | Action | Owner | Effort |
|---|---|---|---|
| 1 | **Host `app-ads.txt`** + set Play Console developer website | Web | 30 min |
| 2 | **Transliteration pipeline OFF**; fix slug generator (≤60 char ASCII) | Backend | 1 day |
| 3 | **`/grievance/` page live** with Grievance Officer details + intake form | Legal + Web | 2 days |
| 4 | Decide EN edition strategy (A / B / C from §5.4) | Editor-in-Chief | Decision |
| 5 | **OpenAPI contract for `/api/mobile/v1/`** — design + sign-off | Backend + Mobile | 3 days |
| 6 | Archive Flutter app; scaffold native Kotlin repo with CI gates | Mobile | 3 days |
| 7 | Extract `core-designsystem` shared module from team-app | Mobile | 2 days |
| 8 | Add Play App Signing fingerprint to `assetlinks.json` | Web | 1 hour |
| 9 | UP-first editorial plan + tehsil-level Region taxonomy | Editor + Backend | 3 days |
| 10 | Team app: EncryptedSharedPreferences + 2G stringer upload testing | Mobile | 3 days |

---

## 10. Open Decisions — Tumhara Input Chahiye

| # | Question | Why it matters |
|---|---|---|
| 1 | **English edition:** Option A (curated subset), B (MT + review), ya C (temporarily hide)? | B2 blocker. Google News trust |
| 2 | **Kaunse UP districts** Tier-1 focus honge? (5-8 chuno) | Poori editorial + geo taxonomy isi pe depend karti hai |
| 3 | **Reader accounts v1 me chahiye ya P2?** | Agar v1 → account deletion, data export, sync sab build karna padega |
| 4 | **iOS kab?** Phase 3 native Swift, ya KMP se parallel? | Stack decision aaj lena better hai |
| 5 | **Ads v1 me on ya launch ke baad?** | Ad-free launch se better reviews milte hain, revenue late |
| 6 | **Keystore:** assetlinks ka SHA256 `7C:E7:F7...` — wo keystore tumhare paas safely backed up hai? | Kho gaya to package ID hamesha ke liye dead |
| 7 | **Backend engineer capacity?** Mobile API 5-7 weeks ka dedicated kaam hai | Ye critical path hai — yahan resource kam hua to sab late |
| 8 | **NDSAAS repo access** — mujhe milega? | Mobile API main directly implement kar sakta hoon |

---

## 11. Reference Documents

Detailed research `research/` folder me hai. **Note:** ye docs greenfield assumption pe likhe gaye thay — jahan is master blueprint se conflict ho, **master blueprint jeetega**. Unhe reference material ki tarah use karo.

| Doc | Use it for | Caveat |
|---|---|---|
| `01-dainik-bhaskar-research.md` | Competitor teardown, 12 weaknesses, white space | Fully valid ✅ |
| `02-feature-spec-news-darpan.md` | 250+ feature checklist, P0-P3 priorities | Hindi-only maanta hai; NewsDarpan bilingual hai |
| `03-tech-architecture.md` | Caching, feed ranking, Hindi search, security, observability | ⚠️ NestJS/Postgres greenfield stack — **Django reality pe apply nahi hota** |
| `04-mobile-app-engineering.md` | **Native Kotlin bible** — budgets, notifications, OEM issues, analytics | Fully valid ✅ Primary mobile reference |
| `05-epaper-system.md` | Auto-generated e-edition (§9 Case B) | Phase 3 |
| `06-legal-compliance-india.md` | IT Rules, DPDP, PRP Act, Play policy, content law guardrails | Fully valid ✅ |
| `07-monetization-revenue.md` | Ad density caps, direct sales, CBC/DIPR, subscriptions | Fully valid ✅ |
| `08-aso-growth-playbook.md` | Play ranking, ASO, retention loops, growth channels | Fully valid ✅ |
| `09-qa-testing-quality.md` | 50 E2E flows, device matrix, CI gates, bug SLAs | Fully valid ✅ |
| `10-team-cost-timeline.md` | Org structure, costs, risk register | Adjust — CMS/company/stringers already done |
| `11-launch-checklist.md` | Master pre-launch checklist | Fully valid ✅ |

---

## 12. Do Honest Statements

**1. "100% perfect app jisme koi dikkat na ho" — ye literally possible nahi hai.**
Koi software bug-free nahi hota. Jo achievable hai: crash-free ≥ 99.8%, zero data loss, zero security incidents, zero user-visible regressions, aur har bug 24-48 ghante me fix. Wo `research/09` ke process se aata hai — "achhi coding" se nahi, **gates, staged rollout aur kill switches** se.

**2. Bhaskar se behtar *app* 16 hafte me ban jaayega. Unse behtar *news organization* banne me 3-5 saal lagenge.**
Verified reality: tum ~40 articles/day pe ho, wo 300+ pe. Wo 2000+ cities me hain, tum UP me shuru kar rahe ho. **App quality tumhara entry ticket hai — moat content depth hai.** Isliye is blueprint me editorial workstream (5.4) aur team app hardening (5.3) ko mobile app se **equal ya zyada** weight diya gaya hai.

Sabse important single insight: **tumhara bottleneck app nahi, backend API aur content depth hai.** Us par focus karo.

---

*Prepared by Kiro · 31 July 2026 · Based on live audit of newsdarpan.in, repo review, and Dainik Bhaskar competitive analysis*
