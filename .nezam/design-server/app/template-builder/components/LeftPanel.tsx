'use client'
import React, { useState, useMemo, useEffect } from 'react'
import {
  Layers, Image, Square, Type, Layout, MousePointer, FormInput,
  Star, BarChart2, Map, Video, AlignLeft, Grid, ChevronRight,
  Search, Plus, FileText, Columns, Code2, SlidersHorizontal,
  Shapes, Link2, Minus, Table2, ToggleLeft, Calendar,
  List, Package, Globe, Monitor, Smartphone, Tablet,
  Shield, Cpu, Zap, Activity, Terminal, ArrowUpRight, Check, Play,
  User, Bell, Phone, Share2, ChevronDown, X, Trash2, Edit3,
  Settings, Info, Lock, Key, CreditCard, Sparkles,
  HardDrive, Network, GitBranch, RefreshCw, Eye, EyeOff,
  Volume2, HelpCircle as HelpIcon, ArrowRightLeft, CheckSquare,
  Flame, Compass, Sparkle, ShoppingBag, ShoppingCart, DollarSign,
  Wallet, Award, BadgeCheck, Briefcase, Camera, Clock, Cloud, Copy,
  Download, ExternalLink, Filter, Folder, Gift, Heart, Home, Mail,
  MessageSquare, Send, ThumbsUp, TrendingUp, CheckCircle, AlertCircle,
  PlayCircle, PlusCircle, MinusCircle, Users, Bookmark, ArrowRight, ArrowLeft
} from 'lucide-react'
import type { FontValue, ColorPalette, ButtonStyle, InputVariant } from './config'

// ── Local design system state (not persisted to templateConfig) ───────────────
export interface DesignSystemState {
  font: FontValue
  colorPalette: ColorPalette
  buttonStyle: ButtonStyle
  buttonWeight: string
  inputVariant: InputVariant
  inputSize: string
}

// ── Element definitions ───────────────────────────────────────────────────────
interface ElementDef {
  id: string
  label: string
  labelAr: string
  icon: React.ReactNode
  category: string
  description: string
  tag?: string // 'new' | 'pro' | undefined
}

const ELEMENTS: ElementDef[] = [
  // Layout
  { id: 'section',      label: 'Section',       labelAr: 'قسم',          icon: <Layout size={14} />,       category: 'Layout',   description: 'Full-width page section' },
  { id: 'columns',      label: '2 Columns',     labelAr: 'عمودين',       icon: <Columns size={14} />,      category: 'Layout',   description: 'Two-column layout grid' },
  { id: 'grid',         label: 'Grid',          labelAr: 'شبكة',         icon: <Grid size={14} />,         category: 'Layout',   description: 'Flexible item grid' },
  { id: 'container',    label: 'Container',     labelAr: 'حاوية',        icon: <Square size={14} />,       category: 'Layout',   description: 'Max-width centered wrapper' },
  { id: 'divider',      label: 'Divider',       labelAr: 'فاصل',         icon: <Minus size={14} />,        category: 'Layout',   description: 'Horizontal rule or spacer' },
  { id: 'step-card',    label: 'Step Card',     labelAr: 'بطاقة خطوة',    icon: <Layers size={14} />,       category: 'Layout',   description: 'Onboarding step summary box', tag: 'new' },
  { id: 'glass-card',   label: 'Glass Card',    labelAr: 'بطاقة زجاجية',  icon: <Square size={14} />,       category: 'Layout',   description: 'Sahel-inspired glassmorphism pane', tag: 'pro' },
  // Text
  { id: 'heading',      label: 'Heading',       labelAr: 'عنوان',        icon: <Type size={14} />,         category: 'Text',     description: 'H1–H6 headline' },
  { id: 'paragraph',    label: 'Paragraph',     labelAr: 'فقرة',         icon: <AlignLeft size={14} />,    category: 'Text',     description: 'Body text block' },
  { id: 'list',         label: 'List',          labelAr: 'قائمة',        icon: <List size={14} />,         category: 'Text',     description: 'Ordered or unordered list' },
  { id: 'code',         label: 'Code Block',    labelAr: 'كود',          icon: <Code2 size={14} />,        category: 'Text',     description: 'Syntax-highlighted code', tag: 'new' },
  { id: 'marquee-text', label: 'Marquee Ticker',labelAr: 'نص متحرك',     icon: <Type size={14} />,         category: 'Text',     description: 'Horizontal scrolling text banner', tag: 'new' },
  { id: 'gradient-heading', label: 'Gradient Title', labelAr: 'عنوان متدرج', icon: <Sparkles size={14} />,     category: 'Text',     description: 'Premium color-gradient title', tag: 'pro' },
  // Media
  { id: 'image',        label: 'Image',         labelAr: 'صورة',         icon: <Image size={14} />,        category: 'Media',    description: 'Photo or illustration' },
  { id: 'video',        label: 'Video',         labelAr: 'فيديو',        icon: <Video size={14} />,        category: 'Media',    description: 'Embedded or uploaded video' },
  { id: 'icon',         label: 'Icon',          labelAr: 'أيقونة',       icon: <Star size={14} />,         category: 'Media',    description: 'Lucide icon or SVG' },
  { id: 'map',          label: 'Map',           labelAr: 'خريطة',        icon: <Map size={14} />,          category: 'Media',    description: 'Google Maps embed', tag: 'new' },
  { id: 'audio-player', label: 'Audio Player',  labelAr: 'مشغل صوتي',   icon: <Volume2 size={14} />,      category: 'Media',    description: 'Premium sound embed widget', tag: 'pro' },
  { id: 'trust-badges', label: 'Trust Badges',  labelAr: 'شارات الثقة',   icon: <Shield size={14} />,       category: 'Media',    description: 'Fintech & compliance badges', tag: 'pro' },
  { id: 'instapay-qr',  label: 'Instapay QR',   labelAr: 'رمز إنستاباي',  icon: <Zap size={14} />,          category: 'Media',    description: 'Egypt Instapay transfer QR code', tag: 'pro' },
  { id: 'avatar-group', label: 'Avatar Group',  labelAr: 'مجموعة رمزية',  icon: <User size={14} />,         category: 'Media',    description: 'Egyptian tech stack team avatars', tag: 'new' },
  // Interactive
  { id: 'button',       label: 'Button',        labelAr: 'زر',           icon: <MousePointer size={14} />, category: 'Interactive', description: 'CTA or action button' },
  { id: 'link',         label: 'Link',          labelAr: 'رابط',         icon: <Link2 size={14} />,        category: 'Interactive', description: 'Text hyperlink' },
  { id: 'toggle',       label: 'Toggle',        labelAr: 'مفتاح',        icon: <ToggleLeft size={14} />,   category: 'Interactive', description: 'On/off toggle switch' },
  { id: 'stepper',      label: 'Progress Stepper', labelAr: 'مؤشر خطوات', icon: <SlidersHorizontal size={14} />, category: 'Interactive', description: 'Multistep progress tracking', tag: 'new' },
  { id: 'instapay-handle', label: 'Instapay Handle', labelAr: 'معرف إنستاباي', icon: <ArrowRightLeft size={14} />, category: 'Interactive', description: 'Direct checkout handle button', tag: 'pro' },
  { id: 'countdown-timer', label: 'Countdown Clock', labelAr: 'مؤقت تنازلي',  icon: <Calendar size={14} />,    category: 'Interactive', description: 'Urgent flash-sale deadline timer', tag: 'new' },
  { id: 'pricing-toggle', label: 'Pricing Switch', labelAr: 'مبدل الأسعار',  icon: <ToggleLeft size={14} />,   category: 'Interactive', description: 'Sahel billing period switcher', tag: 'pro' },
  // Forms
  { id: 'input',        label: 'Text Input',    labelAr: 'حقل نص',       icon: <FormInput size={14} />,    category: 'Forms',    description: 'Single-line text field' },
  { id: 'textarea',     label: 'Textarea',      labelAr: 'منطقة نص',     icon: <FileText size={14} />,     category: 'Forms',    description: 'Multi-line text area' },
  { id: 'select',       label: 'Select',        labelAr: 'قائمة منسدلة', icon: <SlidersHorizontal size={14} />, category: 'Forms', description: 'Dropdown selector' },
  { id: 'calendar',     label: 'Date Picker',   labelAr: 'منتقي تاريخ',  icon: <Calendar size={14} />,    category: 'Forms',    description: 'Date selection input', tag: 'new' },
  { id: 'checkbox',     label: 'Checkbox Group',labelAr: 'خانة اختيار',   icon: <CheckSquare size={14} />, category: 'Forms',    description: 'Multiple selection checkboxes', tag: 'new' },
  { id: 'paymob-card',  label: 'Paymob Checkout', labelAr: 'دفع بي موب',  icon: <CreditCard size={14} />,   category: 'Forms',    description: 'Paymob credit/debit input field', tag: 'pro' },
  // Data
  { id: 'table',        label: 'Table',         labelAr: 'جدول',         icon: <Table2 size={14} />,       category: 'Data',     description: 'Structured data table' },
  { id: 'chart',        label: 'Chart',         labelAr: 'رسم بياني',    icon: <BarChart2 size={14} />,    category: 'Data',     description: 'Bar, line, or pie chart', tag: 'new' },
  { id: 'stats',        label: 'Stats Card',    labelAr: 'بطاقة إحصاء',  icon: <Package size={14} />,      category: 'Data',     description: 'KPI metric card' },
  { id: 'live-status',  label: 'Live Latency',  labelAr: 'حالة الاستجابة', icon: <Activity size={14} />,     category: 'Data',     description: 'Cairo Node hub live sync ping', tag: 'pro' },
  // Shapes
  { id: 'rectangle',    label: 'Rectangle',     labelAr: 'مستطيل',        icon: <Square size={14} />,       category: 'Shapes',   description: 'Box or background shape' },
  { id: 'shape',        label: 'Decorative',    labelAr: 'زخرفي',        icon: <Shapes size={14} />,       category: 'Shapes',   description: 'SVG decorative element' },
  { id: 'wave-divider', label: 'Wave Divider',  labelAr: 'فاصل مموج',     icon: <Minus size={14} />,        category: 'Shapes',   description: 'Sahel beach wave separator line', tag: 'new' },
]

const ELEMENT_CATEGORIES = ['All', 'Layout', 'Text', 'Media', 'Interactive', 'Forms', 'Data', 'Shapes']

// ── Template blocks ───────────────────────────────────────────────────────────
interface BlockDef {
  id: string
  label: string
  icon: React.ReactNode
  category: string
  preview: string // gradient color stop
}

const BLOCKS: BlockDef[] = [
  { id: 'hero-centered',    label: 'Hero — Centered',      icon: <Monitor size={13} />,    category: 'Hero',       preview: 'from-ds-primary/20' },
  { id: 'hero-split',       label: 'Hero — Split',         icon: <Columns size={13} />,    category: 'Hero',       preview: 'from-violet-500/20' },
  { id: 'hero-video',       label: 'Hero — Video BG',      icon: <Video size={13} />,      category: 'Hero',       preview: 'from-rose-500/20' },
  { id: 'instapay-hero',    label: 'Instapay QR — Hero',   icon: <Zap size={13} />,        category: 'Hero',       preview: 'from-emerald-500/20' },
  { id: 'cairo-cyber-hero', label: 'Cairo Cyber Hero Grid', icon: <Monitor size={13} />,   category: 'Hero',       preview: 'from-orange-600/30' },
  { id: 'egyptian-glassmorphism-hero', label: 'Egyptian Glassmorphism Hero', icon: <Square size={13} />, category: 'Hero', preview: 'from-teal-400/20' },
  { id: 'swarm-telemetry-hero', label: 'Swarm Telemetry Stage', icon: <Cpu size={13} />,     category: 'Hero',       preview: 'from-purple-500/35' },
  { id: 'instapay-direct-split', label: 'Instapay Direct Split', icon: <ArrowRightLeft size={13} />, category: 'Hero', preview: 'from-emerald-600/30' },
  { id: 'alexandria-agency-showcase', label: 'Alexandria Agency Hero', icon: <Image size={13} />, category: 'Hero', preview: 'from-sky-400/25' },
  { id: 'features-grid',    label: 'Features — Grid',      icon: <Grid size={13} />,       category: 'Features',   preview: 'from-cyan-500/20' },
  { id: 'features-list',    label: 'Features — List',      icon: <List size={13} />,       category: 'Features',   preview: 'from-teal-500/20' },
  { id: 'cairo-latency',    label: 'Cairo Hub Latency',    icon: <Activity size={13} />,   category: 'Features',   preview: 'from-orange-500/20' },
  { id: 'egypt-logistics',  label: 'Egypt Logistics Grid', icon: <Map size={13} />,        category: 'Features',   preview: 'from-blue-500/20' },
  { id: 'fintech-trust-strip', label: 'Fintech Trust Strip', icon: <Shield size={13} />,    category: 'Features',   preview: 'from-indigo-500/20' },
  { id: 'pyramids-creative-timeline', label: 'Pyramids Growth Steps', icon: <Layers size={13} />, category: 'Features', preview: 'from-amber-600/25' },
  { id: 'pricing-cards',    label: 'Pricing — Cards',      icon: <Package size={13} />,    category: 'Pricing',    preview: 'from-amber-500/20' },
  { id: 'pricing-table',    label: 'Pricing — Table',      icon: <Table2 size={13} />,     category: 'Pricing',    preview: 'from-orange-500/20' },
  { id: 'sahel-checkout',   label: 'Sahel Pro — Checkout', icon: <CreditCard size={13} />, category: 'Pricing',    preview: 'from-fuchsia-500/20' },
  { id: 'sahel-comparison-matrix', label: 'Sahel Comparison Matrix', icon: <Table2 size={13} />, category: 'Pricing', preview: 'from-rose-500/30' },
  { id: 'paymob-subscription-tiers', label: 'Paymob Billing Tiers', icon: <Package size={13} />, category: 'Pricing', preview: 'from-violet-600/30' },
  { id: 'testimonials',     label: 'Testimonials',         icon: <Star size={13} />,       category: 'Social',     preview: 'from-emerald-500/20' },
  { id: 'stats-row',        label: 'Stats Row',            icon: <BarChart2 size={13} />,  category: 'Social',     preview: 'from-lime-500/20' },
  { id: 'nile-delta-kpi-grid', label: 'Nile Delta KPI Matrix', icon: <Activity size={13} />, category: 'Social',     preview: 'from-blue-600/30' },
  { id: 'cta-centered',     label: 'CTA — Centered',       icon: <MousePointer size={13}/>,category: 'CTA',        preview: 'from-fuchsia-500/20' },
  { id: 'cta-banner',       label: 'CTA — Banner',         icon: <Globe size={13} />,      category: 'CTA',        preview: 'from-indigo-500/20' },
  { id: 'contact-form',     label: 'Contact Form',         icon: <FormInput size={13} />,  category: 'Forms',      preview: 'from-slate-500/20' },
  { id: 'sidi-beachfront',  label: 'Sahel Beach Booking',  icon: <Calendar size={13} />,   category: 'Forms',      preview: 'from-sky-500/20' },
  { id: 'fawry-express-checkout', label: 'Fawry Express Pay', icon: <CreditCard size={13} />, category: 'Forms',      preview: 'from-yellow-500/20' },
  { id: 'faq-accordion',    label: 'FAQ — Accordion',      icon: <AlignLeft size={13} />,  category: 'Content',    preview: 'from-rose-400/20' },
  { id: 'gallery-masonry',  label: 'Gallery — Masonry',    icon: <Image size={13} />,      category: 'Media',      preview: 'from-sky-500/20' },
  { id: 'blog-grid',        label: 'Blog — Card Grid',     icon: <Layout size={13} />,     category: 'Content',    preview: 'from-cyan-400/20' },
  { id: 'map-contact',      label: 'Map + Contact',        icon: <Map size={13} />,        category: 'Forms',      preview: 'from-emerald-400/20' },
]

const BLOCK_CATEGORIES = ['All', 'Hero', 'Features', 'Pricing', 'Social', 'CTA', 'Forms', 'Content', 'Media']

// ── Layer tree (mock) ─────────────────────────────────────────────────────────
interface LayerItem {
  id: string; label: string; icon: React.ReactNode; depth?: number; hidden?: boolean
}
const LAYER_TREE: LayerItem[] = [
  { id: 'topbar',   label: 'Top Bar',        icon: <Globe size={11} /> },
  { id: 'header',   label: 'Header',         icon: <Layout size={11} /> },
  { id: 'hero',     label: 'Hero Section',   icon: <Monitor size={11} /> },
  { id: 'features', label: 'Features',       icon: <Grid size={11} /> },
  { id: 'h1',       label: 'Headline',       icon: <Type size={11} />,         depth: 1 },
  { id: 'p1',       label: 'Body Text',      icon: <AlignLeft size={11} />,    depth: 1 },
  { id: 'cta1',     label: 'CTA Button',     icon: <MousePointer size={11} />, depth: 1 },
  { id: 'img1',     label: 'Hero Image',     icon: <Image size={11} />,        depth: 1 },
  { id: 'pricing',  label: 'Pricing',        icon: <Package size={11} /> },
  { id: 'footer',   label: 'Footer',         icon: <Layout size={11} /> },
]

// ── Asset library (placeholder data) ─────────────────────────────────────────
const UNSPLASH_IMGS = [
  { id: 'u1', src: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&q=60', label: 'Tech desk' },
  { id: 'u2', src: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=60', label: 'Office' },
  { id: 'u3', src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=60', label: 'Analytics' },
  { id: 'u4', src: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=60', label: 'Team' },
  { id: 'u5', src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=60', label: 'Laptop' },
  { id: 'u6', src: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=60', label: 'Meeting' },
  { id: 'u7', src: 'https://images.unsplash.com/photo-1558403194-611308249627?w=400&q=60', label: 'Design' },
  { id: 'u8', src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=60', label: 'Dashboard' },
  { id: 'u9', src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=60', label: 'Portrait' },
]

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  lang: string
  t: (en: string, ar: string) => string
  iconPack?: 'lucide' | 'material'
  setIconPack?: (v: 'lucide' | 'material') => void
}

type Tab = 'elements' | 'blocks' | 'layers' | 'assets'

const TABS: { id: Tab; icon: React.ReactNode; label: string; labelAr: string }[] = [
  { id: 'elements', icon: <Square size={14} />,  label: 'Elements', labelAr: 'عناصر' },
  { id: 'blocks',   icon: <Layout size={14} />,  label: 'Blocks',   labelAr: 'كتل'   },
  { id: 'layers',   icon: <Layers size={14} />,  label: 'Layers',   labelAr: 'طبقات' },
  { id: 'assets',   icon: <Image  size={14} />,  label: 'Assets',   labelAr: 'أصول'  },
]

// ── Drag helper ───────────────────────────────────────────────────────────────
function handleDragStart(e: React.DragEvent, id: string, type: 'element' | 'block') {
  e.dataTransfer.setData('application/nezam-element', JSON.stringify({ id, type }))
  e.dataTransfer.effectAllowed = 'copy'
}

const LUCIDE_ICONS_LIST = [
  { name: 'Square', icon: <Square size={14} /> },
  { name: 'Shapes', icon: <Shapes size={14} /> },
  { name: 'Star', icon: <Star size={14} /> },
  { name: 'Globe', icon: <Globe size={14} /> },
  { name: 'BarChart2', icon: <BarChart2 size={14} /> },
  { name: 'Monitor', icon: <Monitor size={14} /> },
  { name: 'MousePointer', icon: <MousePointer size={14} /> },
  { name: 'Package', icon: <Package size={14} /> },
  { name: 'Layout', icon: <Layout size={14} /> },
  { name: 'Grid', icon: <Grid size={14} /> },
  { name: 'Search', icon: <Search size={14} /> },
  { name: 'FileText', icon: <FileText size={14} /> },
  { name: 'Columns', icon: <Columns size={14} /> },
  { name: 'Code2', icon: <Code2 size={14} /> },
  { name: 'SlidersHorizontal', icon: <SlidersHorizontal size={14} /> },
  { name: 'Link2', icon: <Link2 size={14} /> },
  { name: 'Minus', icon: <Minus size={14} /> },
  { name: 'Table2', icon: <Table2 size={14} /> },
  { name: 'ToggleLeft', icon: <ToggleLeft size={14} /> },
  { name: 'Calendar', icon: <Calendar size={14} /> },
  { name: 'Shield', icon: <Shield size={14} /> },
  { name: 'Cpu', icon: <Cpu size={14} /> },
  { name: 'Zap', icon: <Zap size={14} /> },
  { name: 'Activity', icon: <Activity size={14} /> },
  { name: 'Terminal', icon: <Terminal size={14} /> },
  { name: 'ArrowUpRight', icon: <ArrowUpRight size={14} /> },
  { name: 'Check', icon: <Check size={14} /> },
  { name: 'Play', icon: <Play size={14} /> },
  { name: 'User', icon: <User size={14} /> },
  { name: 'Bell', icon: <Bell size={14} /> },
  { name: 'Phone', icon: <Phone size={14} /> },
  { name: 'Share2', icon: <Share2 size={14} /> },
  { name: 'ChevronDown', icon: <ChevronDown size={14} /> },
  { name: 'X', icon: <X size={14} /> },
  { name: 'Trash2', icon: <Trash2 size={14} /> },
  { name: 'Edit3', icon: <Edit3 size={14} /> },
  { name: 'Settings', icon: <Settings size={14} /> },
  { name: 'Info', icon: <Info size={14} /> },
  { name: 'Lock', icon: <Lock size={14} /> },
  { name: 'Key', icon: <Key size={14} /> },
  { name: 'CreditCard', icon: <CreditCard size={14} /> },
  { name: 'Sparkles', icon: <Sparkles size={14} /> },
  { name: 'HardDrive', icon: <HardDrive size={14} /> },
  { name: 'Network', icon: <Network size={14} /> },
  { name: 'GitBranch', icon: <GitBranch size={14} /> },
  { name: 'RefreshCw', icon: <RefreshCw size={14} /> },
  { name: 'Eye', icon: <Eye size={14} /> },
  { name: 'EyeOff', icon: <EyeOff size={14} /> },
  { name: 'Volume2', icon: <Volume2 size={14} /> },
  { name: 'HelpIcon', icon: <HelpIcon size={14} /> },
  { name: 'ArrowRightLeft', icon: <ArrowRightLeft size={14} /> },
  { name: 'CheckSquare', icon: <CheckSquare size={14} /> },
  { name: 'Flame', icon: <Flame size={14} /> },
  { name: 'Compass', icon: <Compass size={14} /> },
  { name: 'Sparkle', icon: <Sparkle size={14} /> },
  { name: 'ShoppingBag', icon: <ShoppingBag size={14} /> },
  { name: 'ShoppingCart', icon: <ShoppingCart size={14} /> },
  { name: 'DollarSign', icon: <DollarSign size={14} /> },
  { name: 'Wallet', icon: <Wallet size={14} /> },
  { name: 'Award', icon: <Award size={14} /> },
  { name: 'BadgeCheck', icon: <BadgeCheck size={14} /> },
  { name: 'Briefcase', icon: <Briefcase size={14} /> },
  { name: 'Camera', icon: <Camera size={14} /> },
  { name: 'Clock', icon: <Clock size={14} /> },
  { name: 'Cloud', icon: <Cloud size={14} /> },
  { name: 'Copy', icon: <Copy size={14} /> },
  { name: 'Download', icon: <Download size={14} /> },
  { name: 'ExternalLink', icon: <ExternalLink size={14} /> },
  { name: 'Filter', icon: <Filter size={14} /> },
  { name: 'Folder', icon: <Folder size={14} /> },
  { name: 'Gift', icon: <Gift size={14} /> },
  { name: 'Heart', icon: <Heart size={14} /> },
  { name: 'Home', icon: <Home size={14} /> },
  { name: 'Mail', icon: <Mail size={14} /> },
  { name: 'MessageSquare', icon: <MessageSquare size={14} /> },
  { name: 'Send', icon: <Send size={14} /> },
  { name: 'ThumbsUp', icon: <ThumbsUp size={14} /> },
  { name: 'TrendingUp', icon: <TrendingUp size={14} /> },
  { name: 'CheckCircle', icon: <CheckCircle size={14} /> },
  { name: 'AlertCircle', icon: <AlertCircle size={14} /> },
  { name: 'PlayCircle', icon: <PlayCircle size={14} /> },
  { name: 'PlusCircle', icon: <PlusCircle size={14} /> },
  { name: 'MinusCircle', icon: <MinusCircle size={14} /> },
  { name: 'Users', icon: <Users size={14} /> },
  { name: 'Bookmark', icon: <Bookmark size={14} /> },
  { name: 'ArrowRight', icon: <ArrowRight size={14} /> },
  { name: 'ArrowLeft', icon: <ArrowLeft size={14} /> }
]

const MATERIAL_ICONS_LIST = [
  { name: 'home', display: 'Home' },
  { name: 'search', display: 'Search' },
  { name: 'settings', display: 'Settings' },
  { name: 'favorite', display: 'Favorite' },
  { name: 'star', display: 'Star' },
  { name: 'person', display: 'Person' },
  { name: 'shopping_cart', display: 'Cart' },
  { name: 'mail', display: 'Mail' },
  { name: 'phone', display: 'Phone' },
  { name: 'lock', display: 'Lock' },
  { name: 'check_circle', display: 'Check' },
  { name: 'cancel', display: 'Cancel' },
  { name: 'error', display: 'Error' },
  { name: 'info', display: 'Info' },
  { name: 'help', display: 'Help' },
  { name: 'menu', display: 'Menu' },
  { name: 'close', display: 'Close' },
  { name: 'arrow_forward', display: 'Forward' },
  { name: 'arrow_back', display: 'Back' },
  { name: 'add', display: 'Add' },
  { name: 'remove', display: 'Remove' },
  { name: 'delete', display: 'Delete' },
  { name: 'edit', display: 'Edit' },
  { name: 'share', display: 'Share' },
  { name: 'visibility', display: 'View' },
  { name: 'thumb_up', display: 'Like' },
  { name: 'dashboard', display: 'Dashboard' },
  { name: 'database', display: 'Database' },
  { name: 'cloud', display: 'Cloud' },
  { name: 'wifi', display: 'Wifi' },
  { name: 'bolt', display: 'Bolt' },
  { name: 'schedule', display: 'Calendar' },
  { name: 'shield', display: 'Shield' },
  { name: 'memory', display: 'Memory' },
  { name: 'play_arrow', display: 'Play' },
  { name: 'volume_up', display: 'Volume' },
  { name: 'lock_open', display: 'Unlock' },
  { name: 'key', display: 'Key' },
  { name: 'credit_card', display: 'Card' },
  { name: 'auto_awesome', display: 'Sparkles' },
  { name: 'dns', display: 'Server' },
  { name: 'terminal', display: 'Console' },
  { name: 'sync', display: 'Sync' },
  { name: 'visibility_off', display: 'Hide' },
  { name: 'notifications', display: 'Alerts' },
  { name: 'alternate_email', display: 'Email' },
  { name: 'verified_user', display: 'Verified' },
  { name: 'trending_up', display: 'Trend' },
  { name: 'code', display: 'Code' },
  { name: 'insights', display: 'Insights' },
  { name: 'shopping_bag', display: 'Bag' },
  { name: 'payments', display: 'Payments' },
  { name: 'account_balance_wallet', display: 'Wallet' },
  { name: 'badge', display: 'Badge' },
  { name: 'work', display: 'Work' },
  { name: 'photo_camera', display: 'Camera' },
  { name: 'content_copy', display: 'Copy' },
  { name: 'download', display: 'Download' },
  { name: 'open_in_new', display: 'Link' },
  { name: 'filter_alt', display: 'Filter' },
  { name: 'folder', display: 'Folder' },
  { name: 'featured_play_list', display: 'Playlist' },
  { name: 'card_giftcard', display: 'Gift' },
  { name: 'favorite_border', display: 'Like Border' },
  { name: 'mail_outline', display: 'Mail Outline' },
  { name: 'chat', display: 'Chat' },
  { name: 'send', display: 'Send' },
  { name: 'recommend', display: 'Recommend' },
  { name: 'arrow_upward', display: 'Up' },
  { name: 'arrow_downward', display: 'Down' },
  { name: 'swap_horiz', display: 'Swap' },
  { name: 'check_box', display: 'Check Box' },
  { name: 'radio_button_checked', display: 'Radio' },
  { name: 'flame', display: 'Flame' },
  { name: 'explore', display: 'Explore' },
  { name: 'auto_graph', display: 'Graph' },
  { name: 'vpn_key', display: 'Key vpn' },
  { name: 'qr_code_2', display: 'QR Code' },
  { name: 'contactless', display: 'Contactless' },
  { name: 'account_circle', display: 'Account' },
  { name: 'group', display: 'Group' },
  { name: 'hub', display: 'Hub' },
  { name: 'rocket_launch', display: 'Rocket' },
  { name: 'language', display: 'Language' }
]

export default function LeftPanel({ lang, t, iconPack = 'lucide', setIconPack }: Props) {
  const [tab,          setTab]          = useState<Tab>('elements')
  const [elemCat,      setElemCat]      = useState('All')
  const [blockCat,     setBlockCat]     = useState('All')
  const [searchElem,   setSearchElem]   = useState('')
  const [searchBlock,  setSearchBlock]  = useState('')
  const [assetSearch,  setAssetSearch]  = useState('')
  const [iconSearch,   setIconSearch]   = useState('')
  const [copiedIcon,   setCopiedIcon]   = useState<string | null>(null)
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set())
  const [device,       setDevice]       = useState<'desktop'|'tablet'|'mobile'>('desktop')

  useEffect(() => {
    if (iconPack === 'material') {
      const id = 'google-material-symbols'
      if (!document.getElementById(id)) {
        const link = document.createElement('link')
        link.id = id
        link.rel = 'stylesheet'
        link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
        document.head.appendChild(link)
      }
    }
  }, [iconPack])

  const filteredIcons = useMemo(() => {
    const q = iconSearch.trim().toLowerCase()
    if (!q) {
      return iconPack === 'material' ? MATERIAL_ICONS_LIST : LUCIDE_ICONS_LIST
    }
    if (iconPack === 'material') {
      return MATERIAL_ICONS_LIST.filter(item => item.name.includes(q) || item.display.toLowerCase().includes(q))
    } else {
      return LUCIDE_ICONS_LIST.filter(item => item.name.toLowerCase().includes(q))
    }
  }, [iconPack, iconSearch])

  const handleIconClick = (iconName: string) => {
    const code = iconPack === 'material'
      ? `<span className="material-symbols-outlined">${iconName}</span>`
      : `<${iconName} size={16} />`
    navigator.clipboard.writeText(code)
    setCopiedIcon(iconName)
    setTimeout(() => setCopiedIcon(null), 1000)
  }

  const filteredElements = useMemo(() => {
    let list = elemCat === 'All' ? ELEMENTS : ELEMENTS.filter(e => e.category === elemCat)
    if (searchElem.trim()) {
      const q = searchElem.toLowerCase()
      list = list.filter(e => e.label.toLowerCase().includes(q) || e.description.toLowerCase().includes(q))
    }
    return list
  }, [elemCat, searchElem])

  const filteredBlocks = useMemo(() => {
    let list = blockCat === 'All' ? BLOCKS : BLOCKS.filter(b => b.category === blockCat)
    if (searchBlock.trim()) {
      const q = searchBlock.toLowerCase()
      list = list.filter(b => b.label.toLowerCase().includes(q))
    }
    return list
  }, [blockCat, searchBlock])

  const filteredAssets = useMemo(() => {
    if (!assetSearch.trim()) return UNSPLASH_IMGS
    const q = assetSearch.toLowerCase()
    return UNSPLASH_IMGS.filter(a => a.label.toLowerCase().includes(q))
  }, [assetSearch])

  const toggleLayer = (id: string) => {
    setHiddenLayers(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div className="flex flex-col h-full bg-ds-surface border-r border-ds-border">

      {/* ── Header ── */}
      <div className="px-4 py-3 border-b border-ds-border bg-ds-background shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[11px] font-semibold text-ds-text-primary">
            {t('Element Library', 'مكتبة العناصر')}
          </h2>
          {/* Device switcher */}
          <div className="flex items-center gap-0.5 bg-ds-surface border border-ds-border rounded-lg p-0.5">
            {([
              { id: 'desktop' as const, icon: <Monitor size={11} /> },
              { id: 'tablet'  as const, icon: <Tablet  size={11} /> },
              { id: 'mobile'  as const, icon: <Smartphone size={11} /> },
            ]).map(d => (
              <button key={d.id} onClick={() => setDevice(d.id)}
                className={`p-1.5 rounded-md transition-all ${device === d.id ? 'bg-ds-primary text-white' : 'text-ds-text-muted hover:text-ds-text-primary'}`}>
                {d.icon}
              </button>
            ))}
          </div>
        </div>
        {/* Tab pills */}
        <div className="flex gap-1">
          {TABS.map(({ id, icon, label, labelAr }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-[10px] font-semibold rounded-lg transition-all ${
                tab === id
                  ? 'bg-ds-primary text-white shadow-sm'
                  : 'text-ds-text-muted hover:text-ds-text-primary hover:bg-ds-surface-hover'
              }`}>
              {icon}
              <span>{lang === 'ar' ? labelAr : label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Elements Tab ── */}
      {tab === 'elements' && (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Search */}
          <div className="px-3 pt-3 pb-2 shrink-0">
            <div className="relative">
              <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ds-text-muted pointer-events-none" />
              <input
                value={searchElem} onChange={e => setSearchElem(e.target.value)}
                placeholder={t('Search elements…', 'ابحث في العناصر…')}
                className="w-full bg-ds-background border border-ds-border rounded-lg pl-7 pr-3 py-1.5 text-[11px] text-ds-text-primary placeholder:text-ds-text-muted focus:outline-none focus:border-ds-primary transition-colors"
              />
            </div>
          </div>
          {/* Category filter */}
          {!searchElem && (
            <div className="px-3 pb-2 shrink-0 overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                {ELEMENT_CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setElemCat(cat)}
                    className={`px-2.5 py-1 text-[9px] font-semibold rounded-full transition-all whitespace-nowrap ${
                      elemCat === cat ? 'bg-ds-primary text-white' : 'bg-ds-surface border border-ds-border text-ds-text-muted hover:text-ds-text-primary'
                    }`}>{cat}</button>
                ))}
              </div>
            </div>
          )}
          {/* Element grid */}
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            {filteredElements.length === 0 ? (
              <p className="text-[10px] text-ds-text-muted text-center py-6">{t('No elements found', 'لا توجد عناصر')}</p>
            ) : (
              <div className="grid grid-cols-2 gap-1.5">
                {filteredElements.map(el => (
                  <div
                    key={el.id}
                    draggable
                    onDragStart={e => handleDragStart(e, el.id, 'element')}
                    className="group relative flex flex-col items-center gap-1.5 p-3 rounded-xl border border-ds-border bg-ds-surface hover:border-ds-primary hover:bg-ds-primary/5 transition-all duration-150 cursor-grab active:cursor-grabbing select-none"
                  >
                    <span className="text-ds-text-muted group-hover:text-ds-primary transition-colors">{el.icon}</span>
                    <span className="text-[10px] font-semibold text-ds-text-primary text-center leading-tight">
                      {lang === 'ar' ? el.labelAr : el.label}
                    </span>
                    {el.tag && (
                      <span className={`absolute top-1.5 right-1.5 text-[7px] font-bold px-1 py-0.5 rounded uppercase ${
                        el.tag === 'new' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-ds-primary/15 text-ds-primary'
                      }`}>{el.tag}</span>
                    )}
                    {/* Drag hint */}
                    <span className="absolute inset-0 rounded-xl ring-2 ring-ds-primary/0 group-hover:ring-ds-primary/20 transition-all pointer-events-none" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Blocks Tab ── */}
      {tab === 'blocks' && (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Search */}
          <div className="px-3 pt-3 pb-2 shrink-0">
            <div className="relative">
              <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ds-text-muted pointer-events-none" />
              <input
                value={searchBlock} onChange={e => setSearchBlock(e.target.value)}
                placeholder={t('Search blocks…', 'ابحث في الكتل…')}
                className="w-full bg-ds-background border border-ds-border rounded-lg pl-7 pr-3 py-1.5 text-[11px] text-ds-text-primary placeholder:text-ds-text-muted focus:outline-none focus:border-ds-primary transition-colors"
              />
            </div>
          </div>
          {/* Category filter */}
          {!searchBlock && (
            <div className="px-3 pb-2 shrink-0 overflow-x-auto">
              <div className="flex gap-1 min-w-max">
                {BLOCK_CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setBlockCat(cat)}
                    className={`px-2.5 py-1 text-[9px] font-semibold rounded-full transition-all whitespace-nowrap ${
                      blockCat === cat ? 'bg-ds-primary text-white' : 'bg-ds-surface border border-ds-border text-ds-text-muted hover:text-ds-text-primary'
                    }`}>{cat}</button>
                ))}
              </div>
            </div>
          )}
          {/* Block list */}
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5">
            {filteredBlocks.length === 0 ? (
              <p className="text-[10px] text-ds-text-muted text-center py-6">{t('No blocks found', 'لا توجد كتل')}</p>
            ) : filteredBlocks.map(block => (
              <div
                key={block.id}
                draggable
                onDragStart={e => handleDragStart(e, block.id, 'block')}
                className="group flex items-center gap-3 p-3 rounded-xl border border-ds-border bg-ds-surface hover:border-ds-primary hover:bg-ds-primary/5 transition-all duration-150 cursor-grab active:cursor-grabbing select-none"
              >
                {/* Mini preview thumbnail */}
                <div className={`shrink-0 w-12 h-9 rounded-lg bg-gradient-to-br ${block.preview} to-transparent border border-ds-border/60 flex items-center justify-center text-ds-text-muted group-hover:text-ds-primary transition-colors`}>
                  {block.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-semibold text-ds-text-primary truncate group-hover:text-ds-primary transition-colors">{block.label}</div>
                  <div className="text-[9px] text-ds-text-muted mt-0.5">{block.category}</div>
                </div>
                <Plus size={12} className="shrink-0 text-ds-text-muted group-hover:text-ds-primary opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Layers Tab ── */}
      {tab === 'layers' && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-ds-border/60 shrink-0">
            <span className="text-[10px] font-semibold text-ds-text-muted uppercase tracking-wider">{t('Page Layers', 'طبقات الصفحة')}</span>
            <button className="text-[9px] text-ds-primary font-semibold hover:opacity-80">{t('Collapse all', 'طي الكل')}</button>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {LAYER_TREE.map(layer => {
              const hidden = hiddenLayers.has(layer.id)
              const depth = layer.depth ?? 0
              return (
                <div
                  key={layer.id}
                  className={`group flex items-center gap-2 px-3 py-1.5 hover:bg-ds-surface-hover transition-colors cursor-default`}
                  style={{ paddingLeft: `${12 + depth * 16}px` }}
                >
                  {depth > 0 && <ChevronRight size={9} className="text-ds-border shrink-0" />}
                  <span className={`shrink-0 transition-colors ${hidden ? 'text-ds-text-muted/40' : 'text-ds-text-muted group-hover:text-ds-primary'}`}>
                    {layer.icon}
                  </span>
                  <span className={`flex-1 text-[11px] font-medium truncate transition-colors ${hidden ? 'text-ds-text-muted/40 line-through' : 'text-ds-text-primary'}`}>
                    {layer.label}
                  </span>
                  {/* Hidden toggle */}
                  <button
                    onClick={() => toggleLayer(layer.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-ds-surface text-ds-text-muted hover:text-ds-primary"
                    title={hidden ? 'Show' : 'Hide'}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {hidden
                        ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                        : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                      }
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Assets Tab ── */}
      {tab === 'assets' && (
        <div className="flex flex-col flex-1 min-h-0">
          {/* Search */}
          <div className="px-3 pt-3 pb-2 shrink-0">
            <div className="relative">
              <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ds-text-muted pointer-events-none" />
              <input
                value={assetSearch} onChange={e => setAssetSearch(e.target.value)}
                placeholder={t('Search assets…', 'ابحث في الأصول…')}
                className="w-full bg-ds-background border border-ds-border rounded-lg pl-7 pr-3 py-1.5 text-[11px] text-ds-text-primary placeholder:text-ds-text-muted focus:outline-none focus:border-ds-primary transition-colors"
              />
            </div>
          </div>
          {/* Upload strip */}
          <div className="px-3 pb-2 shrink-0">
            <button className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-dashed border-ds-border hover:border-ds-primary hover:bg-ds-primary/5 text-ds-text-muted hover:text-ds-primary text-[10px] font-semibold transition-all">
              <Plus size={12} />
              {t('Upload image', 'رفع صورة')}
            </button>
          </div>
          {/* Image grid */}
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-ds-text-muted mb-2">{t('Stock Photos', 'صور مخزنة')}</div>
            <div className="grid grid-cols-3 gap-1.5">
              {filteredAssets.map(asset => (
                <div
                  key={asset.id}
                  draggable
                  onDragStart={e => { e.dataTransfer.setData('application/nezam-asset', asset.src); e.dataTransfer.effectAllowed = 'copy' }}
                  className="group relative aspect-square rounded-lg overflow-hidden cursor-grab active:cursor-grabbing border border-ds-border hover:border-ds-primary transition-all"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset.src} alt={asset.label} className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end p-1">
                    <span className="text-[8px] text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity leading-tight">{asset.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic Icons Pack selector and search */}
            <div className="mt-4 mb-2 flex items-center justify-between border-t border-ds-border/60 pt-3">
              <div className="text-[9px] font-semibold uppercase tracking-wider text-ds-text-muted">{t('Shapes & Icons', 'أشكال وأيقونات')}</div>
              <div className="flex items-center gap-1 bg-ds-background border border-ds-border rounded p-0.5">
                <button
                  onClick={() => setIconPack?.('lucide')}
                  className={`text-[8px] font-bold px-1.5 py-0.5 rounded transition-all ${
                    iconPack === 'lucide' ? 'bg-ds-primary text-white' : 'text-ds-text-muted hover:text-ds-text-primary'
                  }`}
                >
                  LUCIDE
                </button>
                <button
                  onClick={() => setIconPack?.('material')}
                  className={`text-[8px] font-bold px-1.5 py-0.5 rounded transition-all ${
                    iconPack === 'material' ? 'bg-ds-primary text-white' : 'text-ds-text-muted hover:text-ds-text-primary'
                  }`}
                >
                  MATERIAL
                </button>
              </div>
            </div>

            <div className="mb-2 relative">
              <Search size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-ds-text-muted pointer-events-none" />
              <input
                value={iconSearch}
                onChange={e => setIconSearch(e.target.value)}
                placeholder={iconPack === 'material' ? t('Search Google Symbols…', 'ابحث في رموز جوجل…') : t('Search Lucide icons…', 'ابحث في أيقونات لوسيد…')}
                className="w-full bg-ds-background border border-ds-border rounded-lg pl-6 pr-2.5 py-1 text-[10px] text-ds-text-primary placeholder:text-ds-text-muted focus:outline-none focus:border-ds-primary transition-colors"
              />
            </div>

            <div className="grid grid-cols-5 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredIcons.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleIconClick(item.name)}
                  title={item.name}
                  draggable
                  onDragStart={e => {
                    e.dataTransfer.setData('application/nezam-element', JSON.stringify({ id: item.name, type: 'icon', pack: iconPack }))
                    e.dataTransfer.effectAllowed = 'copy'
                  }}
                  className={`relative flex items-center justify-center aspect-square rounded-lg border bg-ds-surface hover:border-ds-primary hover:bg-ds-primary/5 text-ds-text-muted hover:text-ds-primary transition-all duration-150 cursor-grab active:cursor-grabbing select-none ${
                    copiedIcon === item.name ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-ds-border'
                  }`}
                >
                  {iconPack === 'material' ? (
                    <span className="material-symbols-outlined text-[16px]">{item.name}</span>
                  ) : (
                    (item as any).icon
                  )}
                  {copiedIcon === item.name && (
                    <span className="absolute inset-0 rounded-lg bg-emerald-500/20 animate-pulse pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
