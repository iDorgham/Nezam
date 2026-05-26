'use client'

/**
 * Centralized icon registry — maps string keys (stored in data/types)
 * to lucide-react components. Use `IconRenderer` wherever an icon name
 * string needs to be rendered as a real SVG icon.
 */

import {
  Home,
  FileText,
  Info,
  DollarSign,
  Mail,
  Key,
  Sparkles,
  Lock,
  Unlock,
  LayoutDashboard,
  FileEdit,
  Image,
  Users,
  User,
  Settings,
  BarChart2,
  FolderOpen,
  Folder,
  CheckSquare,
  Inbox,
  Calendar,
  Bell,
  Briefcase,
  CreditCard,
  Building2,
  Plug,
  Bookmark,
  BookOpen,
  Tag,
  Wrench,
  ClipboardList,
  LayoutGrid,
  ShoppingBag,
  ShoppingCart,
  Heart,
  Package,
  Zap,
  Shield,
  Compass,
  HelpCircle,
  UserPlus,
  CheckCircle,
  Database,
  FilePlus,
  // Hub sections
  Network,
  Palette,
  Eye,
  EyeOff,
  Puzzle,
  Monitor,
  Tablet,
  Smartphone,
  // UI actions
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Pencil,
  ArrowUpRight,
  MoreHorizontal,
  Moon,
  Sun,
  PanelRight,
  Download,
  X,
  CornerDownRight,
  Search,
  Copy,
  ExternalLink,
  AlertCircle,
  XCircle,
  Star,
  Globe,
  Link,
  Hash,
  // Token categories
  Droplets,
  Type,
  ArrowLeftRight,
  Circle,
  Layers,
  Square,
  MousePointer,
  AlignLeft,
  Ruler,
  SlidersHorizontal,
  Shapes,
  Grid,
  Box,
  // Extra
  FileCode,
  Columns,
  Sliders,
  ToggleLeft,
  MessageSquare,
  Navigation,
  PanelLeft,
  ListFilter,
  type LucideIcon,
} from 'lucide-react'

import React from 'react'

// ─── Icon map ─────────────────────────────────────────────────────────────────

export const ICON_MAP: Record<string, LucideIcon> = {
  // Page / navigation icons
  Home,
  FileText,
  Info,
  DollarSign,
  Mail,
  Key,
  Sparkles,
  Lock,
  Unlock,
  LayoutDashboard,
  FileEdit,
  Image,
  Users,
  User,
  Settings,
  BarChart2,
  FolderOpen,
  Folder,
  CheckSquare,
  Inbox,
  Calendar,
  Bell,
  Briefcase,
  CreditCard,
  Building2,
  Plug,
  Bookmark,
  BookOpen,
  Tag,
  Wrench,
  ClipboardList,
  LayoutGrid,
  ShoppingBag,
  ShoppingCart,
  Heart,
  Package,
  Zap,
  Shield,
  Compass,
  HelpCircle,
  UserPlus,
  CheckCircle,
  Database,
  FilePlus,
  Star,
  Globe,
  Link,
  Hash,
  FileCode,

  // Hub sections
  Network,
  Palette,
  Eye,
  EyeOff,
  Puzzle,
  Monitor,
  Tablet,
  Smartphone,

  // UI actions
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Pencil,
  ArrowUpRight,
  MoreHorizontal,
  Moon,
  Sun,
  PanelRight,
  Download,
  X,
  CornerDownRight,
  Search,
  Copy,
  ExternalLink,
  AlertCircle,
  XCircle,

  // Token categories
  Droplets,
  Type,
  ArrowLeftRight,
  Circle,
  Layers,
  Square,
  MousePointer,
  AlignLeft,
  Ruler,
  SlidersHorizontal,
  Shapes,
  Grid,
  Box,
  Columns,
  Sliders,

  // Misc
  ToggleLeft,
  MessageSquare,
  Navigation,
  PanelLeft,
  ListFilter,
}

// ─── PAGE_ICONS picker list (icon names for the arch page icon picker) ───────

export const PAGE_ICON_NAMES: string[] = [
  'FileText', 'FolderOpen', 'Home', 'Settings', 'User', 'CreditCard',
  'BarChart2', 'FileEdit', 'Key', 'Mail', 'BookOpen', 'Lock',
  'Calendar', 'DollarSign', 'Zap', 'CheckSquare', 'Folder', 'Bell',
  'Image', 'Users', 'Inbox', 'Tag', 'Plug', 'LayoutDashboard',
  'ClipboardList', 'Wrench', 'Shield', 'Compass', 'Heart', 'ShoppingBag',
]

// ─── IconRenderer component ───────────────────────────────────────────────────

interface IconRendererProps {
  name: string
  size?: number
  className?: string
  strokeWidth?: number
  style?: React.CSSProperties
}

export function IconRenderer({ name, size = 16, className, strokeWidth = 1.5, style }: IconRendererProps) {
  const IconComponent = ICON_MAP[name]
  if (!IconComponent) {
    // Fallback: render a generic file icon if name not found
    return React.createElement(FileText, { size, className, strokeWidth, style })
  }
  return React.createElement(IconComponent, { size, className, strokeWidth, style })
}
