'use client'

import { useState } from 'react'
import { useSessionStore } from '@/lib/store/session.store'
import { Plus, Trash2, Link as LinkIcon, MoveVertical } from 'lucide-react'

interface MenuItem {
  id: string
  title: string
  pageId?: string
  url?: string
}

interface Menu {
  id: string
  name: string
  items: MenuItem[]
}

export default function MenusWorkspace() {
  const { sitemap, lang } = useSessionStore()
  const t = (en: string, ar: string) => (lang === 'ar' ? ar : en)
  
  const [menus, setMenus] = useState<Menu[]>([
    { id: 'main', name: t('Main Menu', 'القائمة الرئيسية'), items: [] },
    { id: 'footer', name: t('Footer Menu', 'قائمة التذييل'), items: [] },
    { id: 'side', name: t('Side Menu', 'القائمة الجانبية'), items: [] },
  ])
  const [selectedMenuId, setSelectedMenuId] = useState('main')

  const selectedMenu = menus.find((m) => m.id === selectedMenuId)

  const addItem = (menuId: string) => {
    setMenus(
      menus.map((m) =>
        m.id === menuId
          ? {
              ...m,
              items: [
                ...m.items,
                { id: Math.random().toString(36).substring(2, 9), title: 'New Item' },
              ],
            }
          : m
      )
    )
  }

  const removeItem = (menuId: string, itemId: string) => {
    setMenus(
      menus.map((m) =>
        m.id === menuId
          ? { ...m, items: m.items.filter((i) => i.id !== itemId) }
          : m
      )
    )
  }

  const updateItem = (menuId: string, itemId: string, updates: Partial<MenuItem>) => {
    setMenus(
      menus.map((m) =>
        m.id === menuId
          ? {
              ...m,
              items: m.items.map((i) => (i.id === itemId ? { ...i, ...updates } : i)),
            }
          : m
      )
    )
  }

  return (
    <div className="p-6 space-y-6 text-ds-text-primary">
      <div className="flex justify-between items-center bg-ds-surface backdrop-blur-md border border-ds-border p-5 rounded-2xl shadow-2xl">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-ds-text-primary to-[#8a8f98] bg-clip-text text-transparent">{t('Menus Builder', 'باني القوائم')}</h1>
          <p className="text-xs text-[#8a8f98] mt-1">{t('Manage your application navigation menus', 'إدارة قوائم التنقل في تطبيقك')}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Menus List */}
        <div className="col-span-1 space-y-2">
          {menus.map((menu) => (
            <button
              key={menu.id}
              onClick={() => setSelectedMenuId(menu.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                selectedMenuId === menu.id
                  ? 'bg-[#7c3aed]/20 text-[#7c3aed] border border-[#7c3aed]/30'
                  : 'bg-white/[0.02] text-[#8a8f98] hover:text-ds-text-primary hover:bg-white/[0.05] border border-ds-border'
              }`}
            >
              {menu.name}
              <span className="float-right text-xs bg-white/[0.05] px-1.5 py-0.5 rounded-full">
                {menu.items.length}
              </span>
            </button>
          ))}
        </div>

        {/* Menu Items Editor */}
        <div className="col-span-3 bg-ds-surface backdrop-blur-md border border-ds-border p-6 rounded-2xl shadow-2xl">
          {selectedMenu ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{selectedMenu.name} {t('Items', 'عناصر')}</h2>
                <button
                  onClick={() => addItem(selectedMenu.id)}
                  className="px-3 py-1.5 bg-[#7c3aed] text-white rounded-lg text-xs font-medium hover:bg-[#6d28d9] transition-colors flex items-center gap-1"
                >
                  <Plus size={14} /> {t('Add Item', 'إضافة عنصر')}
                </button>
              </div>

              {selectedMenu.items.length === 0 ? (
                <div className="text-sm text-[#8a8f98] text-center py-12 bg-white/[0.01] border border-ds-border rounded-xl">
                  {t('No items in this menu. Click "Add Item" to start.', 'لا توجد عناصر في هذه القائمة. انقر فوق "إضافة عنصر" للبدء.')}
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedMenu.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-white/[0.02] border border-ds-border p-3 rounded-xl hover:border-white/[0.1] transition-colors"
                    >
                      <div className="text-[#8a8f98] cursor-move">
                        <MoveVertical size={16} />
                      </div>
                      
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateItem(selectedMenu.id, item.id, { title: e.target.value })}
                          className="bg-white/[0.03] border border-ds-border rounded-lg px-3 py-1.5 text-xs text-ds-text-primary focus:outline-none focus:border-[#7c3aed]/50 transition-colors"
                          placeholder={t('Item Title', 'عنوان العنصر')}
                        />
                        
                        <select
                          value={item.pageId || ''}
                          onChange={(e) => updateItem(selectedMenu.id, item.id, { pageId: e.target.value })}
                          className="bg-white/[0.03] border border-ds-border rounded-lg px-3 py-1.5 text-xs text-ds-text-primary focus:outline-none focus:border-[#7c3aed]/50 transition-colors"
                        >
                          <option value="">{t('Select Page...', 'اختر صفحة...')}</option>
                          {sitemap.map((page) => (
                            <option key={page.id} value={page.id}>
                              {page.title} ({page.route})
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => removeItem(selectedMenu.id, item.id)}
                        className="p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                        title={t('Remove Item', 'إزالة العنصر')}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-sm text-[#8a8f98] text-center py-12">
              {t('Select a menu to edit its items.', 'اختر قائمة لتحرير عناصرها.')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
