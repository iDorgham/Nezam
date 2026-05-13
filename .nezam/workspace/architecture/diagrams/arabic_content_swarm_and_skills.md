# Arabic Content Swarm and Skills

## Swarm Teams (Top-5 + Delegated)

```mermaid
flowchart TD
    PM01[PM01_SwarmLeader]
    ARCH01[ARCH01_ProjectArchitect]
    DESIGN01[DESIGN01_UIUXLead]
    FE01[FE01_FrontendLead]
    BE01[BE01_BackendLead]

    PM01 --> ARCH01
    PM01 --> DESIGN01
    PM01 --> FE01
    PM01 --> BE01

    PM01 --> DelegatedLeads[Delegated_Leads]
    DelegatedLeads --> ContentWorkflowMgr[content_workflow_manager]
    DelegatedLeads --> LocalizationLead[localization_lead]
    DelegatedLeads --> SeoLead[seo]
    DelegatedLeads --> AeoLead[aeo]
```

## Arabic Content Pod (Agents + Subagents)

```mermaid
flowchart TD
    LocalizationLead[localization_lead]
    ArabicMaster[arabic_content_master_agent]
    MasriSpec[masri_content_specialist]
    ArabicSeoAeo[arabic_seo_aeo_specialist]

    Khaleeji[khaleeji_specialist]
    Levantine[levantine_specialist]
    Maghrebi[maghrebi_specialist]
    MsaFormal[msa_formal_specialist]

    LocalizationLead --> ArabicMaster
    LocalizationLead --> I18n[i18n_engineer]
    LocalizationLead --> Rtl[rtl_specialist]

    ArabicMaster --> MasriSpec
    ArabicMaster --> ArabicSeoAeo
    ArabicMaster --> Khaleeji
    ArabicMaster --> Levantine
    ArabicMaster --> Maghrebi
    ArabicMaster --> MsaFormal

    MasriSpec --> MasriHero[masri_hero_copy]
    MasriSpec --> MasriLongform[masri_longform]
    MasriSpec --> MasriVideo[masri_video_script]
    MasriSpec --> MasriLegal[masri_legal_ux]
    MasriSpec --> MasriHumour[masri_humour_reviewer]
```

## Skill Architecture (Parent + Egyptian Module)

```mermaid
flowchart TD
    ArabicSkill[arabic_content_master_skill]
    EgyptianSkill[egyptian_arabic_content_master_skill]

    ArabicSkill --> DialectRouter[dialect_router_yaml]
    ArabicSkill --> SharedRamadan[ramadan_religious_calendar]
    ArabicSkill --> SharedA11y[arabic_typography_a11y]
    ArabicSkill --> SharedChannels[channel_playbooks_extended]
    ArabicSkill --> ArabicGolden[golden_pairs_arabic_jsonl]

    ArabicSkill --> EgyptianSkill

    EgyptianSkill --> ToneMatrix[tone_matrix]
    EgyptianSkill --> HumourGuide[humour_guidelines]
    EgyptianSkill --> ChannelFormats[channel_formats]
    EgyptianSkill --> BriefSchema[brief_schema_yaml]
    EgyptianSkill --> PackRouter[pack_router_map_yaml]
    EgyptianSkill --> RubricMasri[rubric_masri]
    EgyptianSkill --> GoldenMasri[golden_pairs_jsonl]
    EgyptianSkill --> Verticals[verticals_fintech_hospitality_realestate_health_ecommerce_education_food_beverage_saas]
```

## Agent-to-Skill Binding Map

```mermaid
flowchart LR
    ArabicMasterAgent[arabic_content_master_agent]
    MasriAgent[masri_content_specialist]
    ArabicSeoAeoAgent[arabic_seo_aeo_specialist]

    ArabicParentSkill[arabic_content_master_skill]
    EgyptianSkill[egyptian_arabic_content_master_skill]
    AeoSkill[coi_aeo_answer_engines]
    GeoSkill[coi_geo_optimization]
    TopicalSkill[coi_topical_authority]
    ContentModelSkill[coi_content_modeling]

    ArabicMasterAgent --> ArabicParentSkill
    ArabicMasterAgent --> EgyptianSkill
    ArabicMasterAgent --> AeoSkill
    ArabicMasterAgent --> GeoSkill
    ArabicMasterAgent --> TopicalSkill
    ArabicMasterAgent --> ContentModelSkill

    MasriAgent --> EgyptianSkill
    MasriAgent --> ArabicParentSkill

    ArabicSeoAeoAgent --> ArabicParentSkill
    ArabicSeoAeoAgent --> AeoSkill
    ArabicSeoAeoAgent --> GeoSkill
    ArabicSeoAeoAgent --> TopicalSkill
```
