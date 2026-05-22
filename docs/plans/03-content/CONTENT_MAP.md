# Content Map — Nezam Design Server · Ultimate UI Suite

> **Phase:** 03-Content | **Source:** PRD v2.0.0 · IA_CONTENT.md
> Defines all UI copy, microcopy, empty states, toasts, labels, and tone guidelines.

---

## 1. Voice & Tone

| Attribute | Definition |
|---|---|
| **Voice** | Technical but warm — tools-first, not marketing-first |
| **Tone** | Confident, precise, low-noise |
| **Register** | Developer-grade: assume familiarity with CSS, tokens, RTL |
| **Emotion** | Calm command — never cheerful, never apologetic |
| **Length** | Shortest possible that preserves clarity — no filler words |

**What we never write:**
- ❌ "Oops!" — not an error tone
- ❌ "Great job!" — no patronizing feedback
- ❌ "Please..." — polite but never deferential
- ❌ Long explanatory tooltips — embed a link, not a paragraph

---

## 2. Global Navigation Copy

### Top Navigation Bar

| Element | English | Arabic |
|---|---|---|
| App name (logo alt) | Nezam Design Server | خادم تصميم نِظام |
| Mode: Token Studio | Token Studio | استوديو الرموز |
| Mode: Sitemap Graph | Sitemap Graph | خريطة المشروع |
| Lang toggle (en active) | EN | EN |
| Lang toggle (ar active) | AR | AR |
| Theme toggle (light) | Light | فاتح |
| Theme toggle (dark) | Dark | داكن |
| Sync pill (synced) | CSS Synchronized | CSS متزامن |
| Sync pill (syncing) | Syncing... | جاري التزامن... |
| Sync pill (failed) | Sync Failed | فشل التزامن |
| Sync pill (offline) | Offline | غير متصل |

### Tab Bar Labels

| Tab type | English | Arabic |
|---|---|---|
| Dashboard | Dashboard | لوحة التحكم |
| Sitemap | Sitemap | خريطة المشروع |
| Wireframe | Wireframe — [page name] | إطار صلبي — [اسم الصفحة] |
| Settings | Settings | الإعدادات |
| Export | Export | تصدير |

---

## 3. Token Studio — Labels & Microcopy

### Left Dock — Design Profiles Section

| Element | English | Arabic |
|---|---|---|
| Section label | Design Profiles | ملفات التصميم |
| System profile badge | System | نظام |
| Custom profile badge | Custom | مخصص |
| Apply CTA | Apply | تطبيق |
| Edit CTA | Edit | تعديل |
| "Save Preset" button | Save Preset | حفظ الإعداد المسبق |
| Preset name input placeholder | Preset name... | اسم الإعداد المسبق... |
| Name validation error | Preset name required | اسم الإعداد المسبق مطلوب |
| Name collision warning | "Sahel Sunset" already exists — overwrite? | "Sahel Sunset" موجود بالفعل — تجاوزه؟ |
| Overwrite confirm | Overwrite | تجاوز |
| Cancel label | Cancel | إلغاء |

### Color Editor

| Element | English | Arabic |
|---|---|---|
| Section label | Color | اللون |
| Primary label | Primary | الأساسي |
| Accent label | Accent | التأكيد |
| Background label | Background | الخلفية |
| Surface label | Surface | السطح |
| Border label | Border | الحدود |
| Invalid color error | Invalid color — use hex or HSL | لون غير صالح — استخدم hex أو HSL |
| Contrast fail badge | Contrast fail — [ratio]:1 | فشل التباين — [ratio]:1 |
| Safe color suggestion | Suggested safe: [hex] | آمن مقترح: [hex] |

### Typography Scale

| Element | English | Arabic |
|---|---|---|
| Section label | Typography Scale | مقياس الطباعة |
| Font family label | Font Family | خط |
| Base size label | Base Size | الحجم الأساسي |
| Scale ratio label | Scale Ratio | نسبة المقياس |
| Line height label | Line Height | ارتفاع السطر |
| Arabic preview toggle | Arabic Preview | معاينة عربية |
| Arabic leading label | Arabic Leading (≥1.4×) | ارتفاع السطر العربي (≥١.٤×) |
| Offline frozen state | Cannot sync — offline | لا يمكن المزامنة — غير متصل |

### Border Radius Editor

| Element | English | Arabic |
|---|---|---|
| Section label | Shape — Border Radius | الشكل — نصف قطر الحواف |
| Slider label | Corner Radius | انحناء الزوايا |
| Token label (XS) | XS — 2px | XS — 2px |
| Token label (SM) | SM — 4px | SM — 4px |
| Token label (MD) | MD — 8px | MD — 8px |
| Token label (LG) | LG — 12px | LG — 12px |
| Token label (XL) | XL — 16px | XL — 16px |
| Token label (Full) | Full — 9999px | Full — 9999px |
| Invalid unit error | Invalid unit — use px or rem | وحدة غير صالحة — استخدم px أو rem |

---

## 4. Infinity Canvas Copy

### Empty States

| Location | English | Arabic |
|---|---|---|
| Canvas: no pages | Add your first page | أضف صفحتك الأولى |
| Canvas: no pages subtext | Drag a node from the left dock or use ⌘K to create | اسحب عقدة من الشريط الأيسر أو استخدم ⌘K للإنشاء |
| Left dock: no pages in list | No pages yet | لا توجد صفحات بعد |
| Left dock: no widgets | No widgets added | لم تُضَف عناصر بعد |

### Wire Inspector (Right Dock)

| Element | English | Arabic |
|---|---|---|
| Panel title | Wire Inspector | مفتش الوصلة |
| No selection state | Select a wire to inspect | اختر وصلة للفحص |
| Attachment drop zone | Drop image or paste directive | اسحب صورة أو الصق تعليمة |
| Vision Gate scanning | Scanning for embedded text... | جاري فحص النص المضمّن... |
| Vision Gate valid | Image clear — no text detected | الصورة نظيفة — لا نص مضمّن |
| Vision Gate rejected | Non-compliant: text detected in artwork | غير مطابق: نص مضمّن في الصورة |
| Generate button (idle) | Generate [Page B] | توليد [صفحة ب] |
| Generate button (loading) | Generating... | جاري التوليد... |
| Generate button (done) | Page B generated ✓ | ✓ تم توليد صفحة ب |
| Hardlock RTL gate fail | RTL gate: source node not RTL-compliant | بوابة RTL: العقدة الأصل غير مطابقة للـ RTL |
| Hardlock WCAG gate fail | WCAG gate: contrast below 4.5:1 | بوابة WCAG: التباين أقل من 4.5:1 |
| Context size warning | Context compressed to [N]k tokens | تم ضغط السياق إلى [N]ألف رمز |
| Token overflow error | Context too large — simplify attachments | السياق كبير جداً — بسّط المرفقات |

### Floating Canvas Toolbar

| Element | English | Arabic |
|---|---|---|
| Add node button | Add Node | إضافة عقدة |
| Zoom in button | Zoom In | تكبير |
| Zoom out button | Zoom Out | تصغير |
| Reset view | Reset View | إعادة تعيين العرض |
| Wiring mode (W) | Wiring Mode | وضع التوصيل |
| Wiring mode active | Wiring — click a node to start | التوصيل — انقر على عقدة للبدء |

### Wire Type Labels

| Wire type | English | Arabic |
|---|---|---|
| navigational | Navigational | تنقل |
| data | Data | بيانات |
| auth | Auth | مصادقة |
| conditional | Conditional | مشروط |

### Node Generation Status

| State | English | Arabic |
|---|---|---|
| idle | — | — |
| generating | Generating... | جاري التوليد... |
| done | Generated | تم التوليد |
| error | Generation failed — retry | فشل التوليد — أعد المحاولة |

---

## 5. Motion Studio Copy

| Element | English | Arabic |
|---|---|---|
| Panel title | Motion Studio | استوديو الحركة |
| Empty state | Add first keyframe at 0.0s | أضف أول إطار مفتاحي عند 0.0s |
| Add keyframe button | + Add Keyframe | + إطار مفتاحي |
| Easing label | Easing | التخفيف |
| Duration label | Duration | المدة |
| Delay label | Delay | التأخير |
| Loop label | Loop | تكرار |
| Stagger label | Stagger | تتالي |
| Reduced motion notice | prefers-reduced-motion active — all durations set to 0ms | prefers-reduced-motion نشط — جميع المدد 0ms |
| Scrub label | Scrub | تصفح |
| Play label | Play | تشغيل |
| Pause label | Pause | إيقاف مؤقت |

---

## 6. Property Inspector Copy

### Tab Labels

| Tab | English | Arabic |
|---|---|---|
| Layers | Layers | الطبقات |
| Settings | Settings | الإعدادات |
| CSS | CSS | CSS |
| A11y | A11y | إمكانية الوصول |

### Box Model Fields

| Field | English | Arabic |
|---|---|---|
| margin-inline-start | Margin Inline Start | هامش البداية المضمّنة |
| margin-inline-end | Margin Inline End | هامش نهاية المضمّنة |
| padding-block-start | Padding Block Start | حشو بداية الكتلة |
| padding-block-end | Padding Block End | حشو نهاية الكتلة |
| Block size | Block Size | حجم الكتلة |
| Inline size | Inline Size | الحجم المضمّن |

### Hardlock Error Messages

| Blocked input | Error message (EN) | Error message (AR) |
|---|---|---|
| margin-left | Use logical: margin-inline-start | استخدم المنطقي: margin-inline-start |
| margin-right | Use logical: margin-inline-end | استخدم المنطقي: margin-inline-end |
| padding-left | Use logical: padding-inline-start | استخدم المنطقي: padding-inline-start |
| padding-right | Use logical: padding-inline-end | استخدم المنطقي: padding-inline-end |
| Fixed px font-size | Use clamp() for fluid type | استخدم clamp() لنوع سائل |
| Contrast < 4.5:1 | Contrast fail — [X.X]:1 | فشل التباين — [X.X]:1 |

### A11y Tab Copy

| Element | English | Arabic |
|---|---|---|
| Contrast label | Contrast | التباين |
| AA pass badge | AA ✅ [ratio]:1 | AA ✅ [ratio]:1 |
| AA fail badge | Fail ❌ [ratio]:1 — fix required | فشل ❌ [ratio]:1 — مطلوب إصلاح |
| ARIA Role label | ARIA Role | دور ARIA |
| Tab Index label | Tab Index | ترتيب التبديل |
| No selection state | Select a component to inspect | اختر عنصراً للفحص |
| Multiple selection | (multiple selected) — showing shared properties | (متعدد) — عرض الخصائص المشتركة |

---

## 7. Asset Browser Copy

| Element | English | Arabic |
|---|---|---|
| Panel title | Asset Browser | متصفح الأصول |
| Drop zone label | Drop files here | اسحب الملفات هنا |
| Drop zone subtext | SVG · WOFF2 · PNG · JPG · JSON · YAML | SVG · WOFF2 · PNG · JPG · JSON · YAML |
| Uploading | Uploading [filename]... | جاري رفع [filename]... |
| Vision reject badge | Text layer detected — blocked | طبقة نص مكتشفة — محظور |
| Delete confirm | Remove asset permanently? | حذف الأصل نهائياً؟ |
| Delete confirm CTA | Remove | حذف |
| Unsupported MIME | File type not supported | نوع الملف غير مدعوم |

---

## 8. Settings Page Copy

| Element | English | Arabic |
|---|---|---|
| Page title | Settings | الإعدادات |
| Design Profile section | Design Profile | ملف التصميم |
| Active profile label | Active Profile | الملف النشط |
| Change profile CTA | Change Profile | تغيير الملف |
| Workspace section | Workspace | مساحة العمل |
| Port label | Port | المنفذ |
| Port placeholder | 4000 | ٤٠٠٠ |
| Reset to defaults | Reset to Defaults | إعادة للافتراضي |
| Reset confirm | Reset all settings to factory defaults? | إعادة جميع الإعدادات للافتراضية؟ |

---

## 9. Toast & System Notification Copy

### Success Toasts

| Trigger | English | Arabic |
|---|---|---|
| Preset saved | Preset "[name]" saved | تم حفظ الإعداد "[name]" |
| Synced to disk | Synced to `.nezam/design/[name]/` | تمت المزامنة إلى `.nezam/design/[name]/` |
| Node generated | [Page B] generated ✓ | ✓ تم توليد [صفحة ب] |
| Asset uploaded | [filename] uploaded and optimized | تم رفع [filename] وتحسينه |

### Error Toasts

| Trigger | English | Arabic |
|---|---|---|
| Disk write fail | Failed to write DESIGN.md: Permission Denied | فشل الكتابة في DESIGN.md: رُفض الإذن |
| Sync failed | Sync failed — check file permissions | فشل التزامن — تحقق من أذونات الملف |
| Vision Gate timeout | Vision Gate unavailable — retry | بوابة الرؤية غير متاحة — أعد المحاولة |
| Context overflow | Context too large — simplify attachments or directives | السياق كبير جداً — بسّط المرفقات أو التعليمات |
| Generation failed | Generation failed — check logs | فشل التوليد — تحقق من السجلات |
| Unsupported MIME | [filename]: file type not supported | [filename]: نوع الملف غير مدعوم |

### Warning / Info

| Trigger | English | Arabic |
|---|---|---|
| Offline mode | Offline — changes saved locally only | غير متصل — التغييرات محفوظة محلياً فقط |
| Hardlock RTL warn | Generate blocked: fix RTL gate first | التوليد محظور: أصلح بوابة RTL أولاً |
| Hardlock WCAG warn | Generate blocked: contrast below 4.5:1 | التوليد محظور: التباين أقل من 4.5:1 |
| prefers-reduced-motion | Reduced motion active — animation disabled | الحركة المخففة نشطة — الرسوم المتحركة معطلة |
| Wire already exists | Wire already exists — select it to add context | الوصلة موجودة بالفعل — اخترها لإضافة سياق |

---

## 10. Empty State Inventory (Complete)

| Location | Empty trigger | Headline | Subtext | CTA |
|---|---|---|---|---|
| Canvas | No nodes | Add your first page | Drag from the left dock or press ⌘K | + Add Node |
| Preset sidebar | No custom presets | No custom profiles yet | Save a preset to get started | Save Preset |
| Wire Inspector | No wire selected | Select a wire to inspect | Click any bezier wire to open the inspector | — |
| Wire attachment zone | No attachments | Drop image or paste directive | Attach a style reference or generation note | Drop files |
| Asset Browser | No assets | No assets yet | Drop SVG, WOFF2, PNG, JPG, JSON, or YAML | Drop files here |
| Motion Studio | No keyframes | Add first keyframe | Click the timeline ruler at any timestamp | + Keyframe |
| Property Inspector | No selection | Select a component | Click any canvas node to inspect its properties | — |
| Wireframe Editor | No blocks | Drag a block from the library | Choose from the block library in the left dock | — |

---

## 11. Keyboard Shortcut Discoverability Copy

| Shortcut | Description EN | Description AR |
|---|---|---|
| ⌘K | Command palette | لوحة الأوامر |
| W | Wiring mode (canvas) | وضع التوصيل |
| Escape | Cancel / deselect | إلغاء / رفع التحديد |
| ⌘Z | Undo | تراجع |
| ⌘⇧Z | Redo | إعادة |
| Space + drag | Pan canvas | تحريك اللوحة |
| Scroll | Zoom canvas | تكبير/تصغير اللوحة |
| 0 | Reset zoom | إعادة تعيين التكبير |
| Tab | Next tab in inspector | التبويب التالي في المفتش |

---

*Generated: 2026-05-18 | Source: PRD v2.0.0 · IA_CONTENT.md*
