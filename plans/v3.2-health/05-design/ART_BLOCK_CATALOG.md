# Artistic wireframe block catalog (25)

Additive `Art_*` blocks for NEZAM Design Hub wireframes. Registry: `.nezam/templates/wireframe-server/block_registry.json` → category `artistic`.

## Visual rules

- **Chrome:** `app-*` tokens only; richness inside preview frame / section body.
- **Compact palette:** ~52–64px min height; **canvas:** ~88–120px.
- **Icons:** lucide-react (`h-3 w-3` compact, `h-4 w-4` canvas).
- **Primitives:** Button, Badge, Avatar, Input, Label, Skeleton, Tabs, Separator, Card; MiniCard fallback where Card not used.
- **Motion:** `Art_Logos_Marquee` only; static when `prefers-reduced-motion: reduce`.
- **RTL:** use `gap-*`, `ps-*` / `pe-*`, avoid hardcoded `ml-*` only.

## Block index

| type | Layout | Key primitives |
|------|--------|----------------|
| Art_Hero_Cinematic | 2-col hero + media | Badge, Button, Skeleton media |
| Art_Hero_Bento | headline + 2×2 bento | Card cells, icons |
| Art_Hero_StatsFloat | copy + metric pills | Badge, stat chips |
| Art_BentoGrid_4 | asymmetric 4-cell | Card, icons |
| Art_BentoGrid_6 | dense 6-cell | Card grid |
| Art_Feature_Zigzag | alternating rows | Icon + text rows |
| Art_Feature_IconMatrix | 3×2 grid | Card, icons |
| Art_Pricing_Spotlight | 3 tiers, center ring | Card, Badge, Button |
| Art_Testimonial_Spotlight | large quote | Card, Avatar row |
| Art_Testimonial_Masonry | 3 varied cards | Card heights |
| Art_Logos_Marquee | logo strip | Skeleton pills, marquee |
| Art_Stats_BigNumber | oversized metrics | large type, labels |
| Art_Team_Portraits | avatar grid | Avatar, Badge roles |
| Art_CaseStudy_Row | 3 tagged cards | Card, Badge, Button |
| Art_Gallery_Masonry | 2×3 media grid | Skeleton tiles |
| Art_Media_SplitCinematic | copy + tall media | 2-col |
| Art_Comparison_Matrix | check grid | table-like Card |
| Art_CTA_Band | full-width band | Button, copy |
| Art_Newsletter_Card | centered capture | Card, Input, Button |
| Art_FAQ_Split | FAQ + visual | 2-col, chevrons |
| Art_Blog_Featured | featured + list | Card hero + rows |
| Art_Integrations_Wall | logo wall | grid + Badge |
| Art_Process_Timeline | vertical steps | icons + connectors |
| Art_Product_Highlight | product + specs | 2-col, bullets |
| Art_AppPreview_Frame | browser chrome mock | frame + dashboard skeleton |

## Seed heuristics

- **Home / marketing:** may include `Art_Hero_Cinematic` or `Art_BentoGrid_4` alongside standard nav/footer.
- **Pricing:** optional `Art_Pricing_Spotlight`.
- **Team:** optional `Art_Team_Portraits`.
