'use client'

import React, { useState } from 'react'
import { Check, Copy, Terminal, Code, BookOpen } from 'lucide-react'
import type { TemplateConfig } from '@/lib/store/session.store'

interface CodeInstallerProps {
  config: TemplateConfig
  lang: string
}

type TabType = 'header' | 'footer' | 'form'

export default function CodeInstaller({ config, lang }: CodeInstallerProps) {
  const [activeTab, setActiveTab] = useState<TabType>('header')
  const [copied, setCopied] = useState(false)

  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Generate customized Header component code
  const getHeaderCode = () => {
    const isSidebar = config.headerMenuMode === 'sidebar'
    const logoAlign = config.headerLogoPosition
    const menuAlign = config.headerMenuPosition

    return `'use client'

import React, { useState } from 'react'
import { Sparkles, Share2, Phone, Menu, X } from 'lucide-react'

export function MainHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="w-full bg-background border-b border-border px-6 py-4 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo Section */}
        <div className="flex items-center ${logoAlign === 'center' ? 'mx-auto' : ''}">
          <a href="/" className="font-extrabold text-lg tracking-tight text-foreground flex items-center gap-2">
            <span className="w-3 h-3 bg-primary rounded-full" />
            <span>NEZAM</span>
          </a>
        </div>

        {/* Navigation Menu Links */}${
          !isSidebar
            ? `
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium ${
          menuAlign === 'center' ? 'mx-auto' : menuAlign === 'left' ? 'mr-auto' : 'ml-auto'
        }">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Home</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Services</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Portfolio</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a>
        </nav>`
            : ' /* Navigation deferred to Sidebar panel */'
        }

        {/* Extras & Actions Container */}
        <div className="flex items-center gap-4">
          ${
            config.headerShowPhone
              ? `<a href="tel:+201001234567" className="hidden lg:flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <Phone size={14} className="text-primary" />
            <span>+20 100 123 4567</span>
          </a>`
              : ''
          }
          ${
            config.headerShowSocials
              ? `
          <div className="hidden sm:flex items-center gap-3 text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors"><Share2 size={14} /></a>
          </div>`
              : ''
          }
          ${
            config.headerShowCta
              ? `
          <button className="bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            Get Started
          </button>`
              : ''
          }

          {/* Collapsible Mobile/Sidebar Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg hover:bg-muted text-foreground transition-colors ${!isSidebar ? 'md:hidden' : ''}"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Sidebar/Mobile Panel Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-background border-b border-border shadow-lg p-6 md:hidden">
          <nav className="flex flex-col gap-4 text-sm font-semibold">
            <a href="#" className="text-muted-foreground hover:text-foreground">Home</a>
            <a href="#" className="text-muted-foreground hover:text-foreground">Services</a>
            <a href="#" className="text-muted-foreground hover:text-foreground">Portfolio</a>
            <a href="#" className="text-muted-foreground hover:text-foreground">About Us</a>
          </nav>
        </div>
      )}
    </header>
  )
}`
  }

  // Generate customized Footer component code
  const getFooterCode = () => {
    const isBig = config.footerStyle === 'big'
    const cols = config.footerColumns || 3

    return `'use client'

import React from 'react'
import { Share2, Phone } from 'lucide-react'

export function MainFooter() {
  return (
    <footer className="w-full bg-background border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto ${isBig ? 'space-y-10' : ''}">
        ${
          isBig
            ? `
        {/* Massive Dynamic Multi-column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${cols} gap-8">
          <div className="space-y-3">
            <span className="font-extrabold text-base tracking-tight text-foreground">NEZAM</span>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Premium MENA design system contract powering fast high-end product building.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Products</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Core App</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Design Server</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Company</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>`
            : ''
        }

        <div className="border-t border-border/50 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} NEZAM. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            ${
              config.footerShowPhone
                ? `<a href="tel:+201001234567" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5">
              <Phone size={14} className="text-primary" />
              <span>+20 100 123 4567</span>
            </a>`
                : ''
            }
            ${
              config.footerShowSocials
                ? `
            <div className="flex items-center gap-3 text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors"><Share2 size={14} /></a>
            </div>`
                : ''
            }
          </div>
        </div>
      </div>
    </footer>
  )
}`
  }

  // Generate Form code block
  const getFormCode = () => {
    const isMinimal = config.formStyle === 'minimal'

    return `'use client'

import React from 'react'

export function ContactForm() {
  return (
    <div className="max-w-md w-full mx-auto border border-border bg-card text-card-foreground rounded-2xl p-8 space-y-6">
      <div className="space-y-1.5 text-center">
        <h3 className="text-lg font-bold tracking-tight">Ready to Build?</h3>
        <p className="text-xs text-muted-foreground">Fill in your information and our Cairo team will reach out.</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
          <input
            type="text"
            className="w-full text-sm bg-muted text-foreground px-3.5 py-2.5 outline-none transition-colors border ${
              isMinimal
                ? 'border-0 border-b border-border focus:border-primary rounded-none'
                : 'border-border focus:border-primary rounded-xl'
            }"
            placeholder="Ahmed Ali"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
          <input
            type="email"
            className="w-full text-sm bg-muted text-foreground px-3.5 py-2.5 outline-none transition-colors border ${
              isMinimal
                ? 'border-0 border-b border-border focus:border-primary rounded-none'
                : 'border-border focus:border-primary rounded-xl'
            }"
            placeholder="ahmed@nezam.app"
          />
        </div>

        <button className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:opacity-90 transition-opacity text-xs uppercase tracking-wider">
          Submit Inquiry
        </button>
      </form>
    </div>
  )
}`
  }

  const codeBlocks = {
    header: getHeaderCode(),
    footer: getFooterCode(),
    form: getFormCode()
  }

  return (
    <div className="flex flex-col bg-ds-surface rounded-2xl border border-ds-border overflow-hidden h-full">
      {/* Tab Navigation header */}
      <div className="flex items-center justify-between border-b border-ds-border bg-ds-surface-subtle px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <Code size={14} className="text-ds-primary" />
          <span className="text-xs font-bold text-ds-text-primary uppercase tracking-wider">
            {t('Production Code Snippets', 'أكواد برودكشن')}
          </span>
        </div>

        <div className="flex gap-1 bg-ds-background border border-ds-border rounded-lg p-0.5">
          {(['header', 'footer', 'form'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                activeTab === tab
                  ? 'bg-ds-surface text-ds-primary border border-ds-border font-semibold shadow-sm'
                  : 'text-ds-text-muted hover:text-ds-text-primary'
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Code Container area */}
      <div className="flex-1 p-4 flex flex-col justify-between overflow-hidden bg-ds-background-subtle">
        <div className="flex-1 flex flex-col min-h-0 relative">
          
          {/* Simulated Code Panel */}
          <div className="flex-1 bg-[#090D16] text-[#A5C0E4] font-mono text-[11px] leading-relaxed p-4 rounded-xl border border-ds-border overflow-auto select-all max-h-[380px] scrollbar-thin">
            <pre>{codeBlocks[activeTab]}</pre>
          </div>

          {/* Action floating bar */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={() => handleCopy(codeBlocks[activeTab])}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-ds-primary hover:opacity-90 text-white rounded-lg text-[10px] font-bold shadow-md transition-all"
            >
              {copied ? <Check size={11} strokeWidth={3} /> : <Copy size={11} />}
              <span>{copied ? t('Copied!', 'تم النسخ!') : t('Copy Component', 'نسخ الكود')}</span>
            </button>
          </div>
        </div>

        {/* Step-by-step developer deployment instructions */}
        <div className="mt-4 border border-ds-border bg-ds-surface rounded-xl p-3.5 flex gap-3 items-start">
          <div className="rounded-lg p-2 bg-ds-primary/10 text-ds-primary mt-0.5">
            <Terminal size={14} />
          </div>
          <div className="flex-1 text-[11px] leading-relaxed">
            <h4 className="font-bold text-ds-text-primary mb-0.5 flex items-center gap-1">
              <BookOpen size={11} />
              <span>{t('Nezam Integration Steps', 'خطوات التشغيل في نظام')}</span>
            </h4>
            <p className="text-ds-text-muted">
              {t(
                'Create a new component file inside your App Router directory (e.g. components/Header.tsx). Paste this generated contract code directly. All tokens, colors, and layout variables are pre-configured to match your design system automatically.',
                'اعمل ملف كومبوننت جديد في مشروعك (مثال: components/Header.tsx) والصق الكود ده فيه مباشرة. جميع الرموز والألوان متناسقة مع تصميماتك ومعرفة بمتغيرات Tailwind الموحدة.'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
