import React, { useState, useEffect, useMemo, useCallback, useDeferredValue } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { useToast } from '../context/ToastContext'
import { hackathonAPI, clearHackathonListCache } from '../config/api'
import { getFallbackImage } from '../utils/imageUtils'

const normalizeKey = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')

const getHackathonKey = (hackathon) => {
  if (!hackathon) return ''
  if (hackathon._id) return String(hackathon._id)
  if (hackathon.sourceKey) return `source:${normalizeKey(hackathon.sourceKey)}`
  if (hackathon.sourceUrl) return `url:${normalizeKey(hackathon.sourceUrl)}`
  if (hackathon.registrationLink) return `link:${normalizeKey(hackathon.registrationLink)}`
  return `${normalizeKey(hackathon.title)}|${String(hackathon.startDate || '').slice(0, 10)}`
}

function HackathonGrid({
  hackathons,
  bookmarkedSet,
  isDark,
  getStatusBadge,
  formatDate,
  toggleBookmark,
  onSelect,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
      {hackathons.map((hackathon, idx) => {
        const status = getStatusBadge(hackathon)
        const isBookmarked = bookmarkedSet.has(hackathon._id)
        const isCollege = Boolean(hackathon.isCollegeFeatured)

        return (
          <m.div
            key={hackathon._id || hackathon.sourceKey || hackathon.sourceUrl}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx * 0.03, 0.3), duration: 0.3 }}
            onClick={() => onSelect(hackathon)}
            className={`group rounded-3xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
              isDark
                ? 'bg-white/[0.025] border-white/10 hover:border-[#7c3aed]/70 hover:shadow-[0_20px_40px_rgba(0,0,0,0.45)]'
                : 'bg-white border-gray-200 hover:border-blue-500'
            }`}
          >
            <div className="h-40 sm:h-44 overflow-hidden bg-gradient-to-br from-[#7c3aed]/20 to-[#3b82f6]/20 relative">
              <img
                src={hackathon.image || getFallbackImage('Startups', hackathon.title, hackathon._id, 0)}
                alt={hackathon.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = getFallbackImage('Startups', hackathon.title, hackathon._id, 0)
                }}
              />
              {isCollege && (
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur border border-white/10 text-[9px] font-black text-[#a855f7] uppercase tracking-widest">
                  College
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${status.color}`}>
                    {status.text}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleBookmark(hackathon._id)
                  }}
                  className={`px-3 py-1 rounded-full transition-colors text-[11px] font-bold tracking-wide ${
                    isBookmarked
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : isDark
                      ? 'bg-white/10 text-white/70 hover:text-white'
                      : 'bg-gray-200 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {isBookmarked ? 'SAVED' : 'SAVE'}
                </button>
              </div>

              <h3 className={`text-[17px] sm:text-xl font-black tracking-tight mb-2 line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {hackathon.title}
              </h3>

              <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-white/55' : 'text-gray-600'}`}>
                {hackathon.description}
              </p>

              <div className="space-y-2 mb-4 text-xs">
                <div className={`flex items-center gap-2 ${isDark ? 'text-white/55' : 'text-gray-600'}`}>
                  <span className="font-bold">DATE</span>
                  <span>
                    {formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}
                  </span>
                </div>

                {hackathon.time && (
                  <div className={`flex items-center gap-2 ${isDark ? 'text-white/55' : 'text-gray-600'}`}>
                    <span className="font-bold">TIME</span>
                    <span>{hackathon.time}</span>
                  </div>
                )}

                <div className={`flex items-center gap-2 ${isDark ? 'text-white/55' : 'text-gray-600'}`}>
                  <span className="font-bold">LOCATION</span>
                  <span>{hackathon.location || '-'}</span>
                </div>

                <div className={`flex items-center gap-2 ${isDark ? 'text-white/55' : 'text-gray-600'}`}>
                  <span className="font-bold">MODE</span>
                  <span>{hackathon.mode}</span>
                </div>

                <div className={`flex items-center gap-2 ${isDark ? 'text-white/55' : 'text-gray-600'}`}>
                  <span className="font-bold">ORGANIZER</span>
                  <span>{hackathon.organizer || 'TBA'}</span>
                </div>

                {hackathon.prize && (
                  <div className={`flex items-center gap-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                    <span className="font-bold">PRIZE</span>
                    <span>{hackathon.prize}</span>
                  </div>
                )}
              </div>

              {hackathon.tags && hackathon.tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {hackathon.tags.slice(0, 3).map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className={`text-xs px-2 py-1 rounded ${
                        isDark
                          ? 'bg-[#7c3aed]/20 text-[#d8b4fe] border border-[#7c3aed]/40'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                  {hackathon.tags.length > 3 && (
                    <span className={`text-xs px-2 py-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      +{hackathon.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </m.div>
        )
      })}
    </div>
  )
}

export default function Hackathons() {
  const { addToast } = useToast()
  const isDark = true // dark mode always active

  const [hackathons, setHackathons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [bookmarks, setBookmarks] = useState([])

  const [searchQuery, setSearchQuery] = useState('')
  const deferredSearchQuery = useDeferredValue(searchQuery)
  const [modeFilter, setModeFilter] = useState('All')
  const [viewMode, setViewMode] = useState('browse')
  const [selectedHackathon, setSelectedHackathon] = useState(null)
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    setIsExpanded(false)
  }, [selectedHackathon])

  const loadHackathons = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)

      // Always load from cache first for instant display
      const cached = await hackathonAPI.getAll({})
      if (cached.success && cached.hackathons?.length) {
        setHackathons(cached.hackathons)
        setLoading(false)
      }

      // If force refresh requested, sync in background and update
      if (forceRefresh) {
        try {
          const fresh = await hackathonAPI.getAll({ refresh: true })
          if (fresh.success) {
            setHackathons(fresh.hackathons || [])
          }
        } catch {
          // Background sync failed silently — cached data is already shown
        }
      }

      if (!cached.success && !forceRefresh) {
        setError('Failed to load hackathons')
        addToast('Failed to load hackathons', 'error')
      }
    } catch (err) {
      const errorMessage = err?.message || 'Failed to load hackathons'
      setError(errorMessage)
      addToast(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  const loadBookmarks = useCallback(async () => {
    try {
      const response = await hackathonAPI.getUserBookmarks()
      if (response.success) {
        const bookmarkIds = response.hackathons?.map((h) => h._id) || []
        setBookmarks(bookmarkIds)
      }
    } catch {
      /* bookmarks optional when logged out */
    }
  }, [])

  useEffect(() => {
    loadHackathons(true)
    loadBookmarks()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, [])

  useEffect(() => {
    const onHackathonsChanged = () => {
      clearHackathonListCache()
      loadHackathons(true)
    }
    window.addEventListener('hackathons-changed', onHackathonsChanged)
    return () => window.removeEventListener('hackathons-changed', onHackathonsChanged)
  }, [loadHackathons])

  const bookmarkedSet = useMemo(() => new Set(bookmarks), [bookmarks])

  const dedupedHackathons = useMemo(() => {
    const seen = new Set()
    return hackathons.filter((hackathon) => {
      const key = getHackathonKey(hackathon)
      if (!key) return false
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [hackathons])

  const filteredHackathons = useMemo(() => {
    let filtered =
      viewMode === 'saved'
        ? dedupedHackathons.filter((h) => bookmarkedSet.has(h._id))
        : dedupedHackathons

    if (modeFilter !== 'All') {
      filtered = filtered.filter((h) => h.mode === modeFilter)
    }

    if (deferredSearchQuery.trim()) {
      const query = deferredSearchQuery.toLowerCase()
      filtered = filtered.filter(
        (h) =>
          String(h.title || '').toLowerCase().includes(query) ||
          String(h.description || '').toLowerCase().includes(query) ||
          String(h.organizer || '').toLowerCase().includes(query) ||
          String(h.location || '').toLowerCase().includes(query) ||
          String(h.city || '').toLowerCase().includes(query) ||
          String(h.state || '').toLowerCase().includes(query) ||
          h.tags?.some((tag) => String(tag || '').toLowerCase().includes(query))
      )
    }

    filtered = [...filtered].sort((a, b) => {
      const aCollege = a.isCollegeFeatured ? 0 : 1
      const bCollege = b.isCollegeFeatured ? 0 : 1
      if (aCollege !== bCollege) return aCollege - bCollege
      return new Date(a.startDate) - new Date(b.startDate)
    })
    return filtered
  }, [dedupedHackathons, deferredSearchQuery, modeFilter, bookmarkedSet, viewMode])

  const toggleBookmark = async (hackathonId) => {
    try {
      if (bookmarks.includes(hackathonId)) {
        const response = await hackathonAPI.removeBookmark(hackathonId)
        if (response.success) {
          setBookmarks((prev) => prev.filter((id) => id !== hackathonId))
          addToast('Bookmark removed', 'success')
        }
      } else {
        const response = await hackathonAPI.addBookmark(hackathonId)
        if (response.success) {
          setBookmarks((prev) => [...prev, hackathonId])
          addToast('Hackathon saved!', 'success')
        }
      }
    } catch (err) {
      addToast(err?.message || 'Failed to update bookmark', 'error')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusBadge = (hackathon) => {
    const now = new Date()
    const start = new Date(hackathon.startDate)
    const end = new Date(hackathon.endDate)

    if (now < start) return { text: 'Upcoming', color: 'bg-blue-500/20 text-blue-400' }
    if (now > end) return { text: 'Ended', color: 'bg-gray-500/20 text-gray-400' }
    return { text: 'Ongoing', color: 'bg-green-500/20 text-green-400' }
  }

  return (
    <m.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`min-h-screen ${isDark ? 'bg-[#09090b]' : 'bg-gray-50'}`}
    >
      <div className="flex flex-col lg:flex-row gap-8 max-w-[1100px] mx-auto min-h-[calc(100vh-140px)] relative z-10 pt-8 px-[4px] sm:px-6 pb-28 md:pb-12">
        <div className="hidden lg:flex w-full lg:w-[320px] shrink-0 flex-col gap-4 lg:sticky lg:top-28 lg:self-start lg:max-h-[calc(100vh-160px)] lg:overflow-auto">
          <div className="p-6 rounded-3xl border border-white/5 bg-white/[0.02]">
            <h2 className="text-[10px] font-black text-[#a855f7] uppercase tracking-[0.2em] mb-3">Events</h2>
            <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Hackathons</h3>
            <p className="text-sm text-white/45 leading-relaxed">Find upcoming events, save your favorites, and track participation.</p>
          </div>

          <div className="p-3 rounded-3xl border border-white/5" style={{ background: 'var(--bg-surface)' }}>
            <p className="px-3 pb-2 text-[10px] font-black text-white/30 uppercase tracking-widest">Mode Filter</p>
            <div className="flex flex-col gap-2">
              {['All', 'Online', 'Offline', 'Hybrid'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setModeFilter(mode)}
                  className={`px-4 py-3 rounded-2xl text-left font-bold text-sm transition-all relative overflow-hidden group ${
                    modeFilter === mode
                      ? 'text-white'
                      : 'text-white/45 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {modeFilter === mode && (
                    <m.div
                      layoutId="mode-pill"
                      className="absolute inset-0 bg-[#7c3aed] shadow-[0_4px_20px_rgba(124,58,237,0.4)]"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{mode}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-3xl border border-white/5" style={{ background: 'var(--bg-surface)' }}>
            <p className="px-3 pb-2 text-[10px] font-black text-white/30 uppercase tracking-widest">View</p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setViewMode('browse')}
                className={`px-4 py-3 rounded-2xl text-left font-bold text-sm transition-all relative overflow-hidden group ${
                  viewMode === 'browse'
                    ? 'text-white'
                    : 'text-white/45 hover:bg-white/5 hover:text-white'
                }`}
              >
                {viewMode === 'browse' && (
                  <m.div
                    layoutId="view-pill"
                    className="absolute inset-0 bg-[#7c3aed] shadow-[0_4px_20px_rgba(124,58,237,0.4)]"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">Browse</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('saved')}
                className={`px-4 py-3 rounded-2xl text-left font-bold text-sm transition-all relative overflow-hidden group ${
                  viewMode === 'saved'
                    ? 'text-white'
                    : 'text-white/45 hover:bg-white/5 hover:text-white'
                }`}
              >
                {viewMode === 'saved' && (
                  <m.div
                    layoutId="view-pill"
                    className="absolute inset-0 bg-[#7c3aed] shadow-[0_4px_20px_rgba(124,58,237,0.4)]"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">Saved ({bookmarks.length})</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full min-h-[500px]">
          <m.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 pb-6 md:mb-10 md:pb-8 border-b border-white/5">
              {/* Mobile Specific Header/Filters */}
              <div className="lg:hidden mb-4 flex flex-col gap-2 px-2">
                <h2 className="text-[10px] font-black text-[#a855f7] uppercase tracking-[0.2em]">Discovery</h2>
                <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">Hackathons</h3>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 max-w-xl">
                <div className="relative flex-1 group">
                  <input
                    type="text"
                    placeholder="Search hackathons..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-3.5 pl-12 pr-10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed] transition-all"
                  />
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#a855f7] transition-colors">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                    >
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>

                {/* Mobile Saved Toggle */}
                <button
                  onClick={() => setViewMode(viewMode === 'saved' ? 'browse' : 'saved')}
                  className={`lg:hidden shrink-0 w-[44px] h-[44px] sm:w-[50px] sm:h-[50px] flex items-center justify-center rounded-2xl border transition-all ${
                    viewMode === 'saved'
                      ? 'bg-[#7c3aed] border-[#7c3aed] text-white shadow-[0_0_20px_rgba(124,58,237,0.4)]'
                      : 'bg-white/[0.03] border-white/10 text-white/40'
                  }`}
                  title={viewMode === 'saved' ? 'Show All' : 'Show Saved'}
                >
                  <svg width="20" height="20" fill={viewMode === 'saved' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"/>
                  </svg>
                </button>
              </div>

              {/* Mobile Mode Dropdown */}
              <div className="lg:hidden mt-4 relative">
                <button
                  type="button"
                  onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
                  className="flex items-center justify-between w-full px-4 py-3 sm:px-5 sm:py-3.5 bg-white/[0.03] rounded-2xl border border-white/10 text-white transition-all text-sm font-bold"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 uppercase text-[10px] font-black tracking-widest mr-2">Mode</span>
                    <span className="text-[#a855f7] px-2 py-0.5 bg-[#a855f7]/10 rounded-lg">{modeFilter}</span>
                  </div>
                  <m.div
                    animate={{ rotate: isModeDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
                  </m.div>
                </button>

                <AnimatePresence>
                  {isModeDropdownOpen && (
                    <m.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#0d0d0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-2"
                    >
                      {['All', 'Online', 'Offline', 'Hybrid'].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => {
                            setModeFilter(mode);
                            setIsModeDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                            modeFilter === mode
                              ? 'bg-[#7c3aed] text-white'
                              : 'text-white/40 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </m.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden lg:block mt-6">
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Hackathon Discovery</h1>
                <p className="text-base text-white/50 leading-relaxed max-w-2xl">
                  Find and join upcoming hackathons worldwide
                </p>
              </div>
            </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div key={s} className="rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden animate-pulse">
                <div className="h-44 bg-white/10" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-white/10 rounded w-2/3" />
                  <div className="h-3 bg-white/5 rounded w-full" />
                  <div className="h-3 bg-white/5 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className={`p-6 rounded-lg border ${isDark ? 'bg-red-950/20 border-red-900 text-red-400' : 'bg-red-50 border-red-200 text-red-700'}`}>
            <p className="font-medium">{error}</p>
            <button
              onClick={loadHackathons}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && filteredHackathons.length === 0 && !error && (
          <div className={`text-center py-16 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            <p className="text-lg font-bold mb-2">No data available</p>
            <p className="text-sm">
              {searchQuery || modeFilter !== 'All' || viewMode === 'saved'
                ? 'Try adjusting your filters or saved list.'
                : 'No hackathons to show yet.'}
            </p>
          </div>
        )}

        {!loading && filteredHackathons.length > 0 && (
          <HackathonGrid
            hackathons={filteredHackathons}
            bookmarkedSet={bookmarkedSet}
            isDark={isDark}
            getStatusBadge={getStatusBadge}
            formatDate={formatDate}
            toggleBookmark={toggleBookmark}
            onSelect={setSelectedHackathon}
          />
        )}

        <div className={`mt-16 grid grid-cols-1 md:grid-cols-3 gap-6`}>
          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl border ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-200'}`}
          >
            <div className="text-xl font-black mb-2 uppercase tracking-widest text-[#7c3aed]">Global</div>
            <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Global Reach
            </h3>
            <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
              Discover hackathons happening worldwide with different modes
            </p>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`p-6 rounded-2xl border ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-200'}`}
          >
            <div className="text-xl font-black mb-2 uppercase tracking-widest text-[#7c3aed]">Prizes</div>
            <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Prize Pools
            </h3>
            <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
              Compete for amazing prizes and recognition
            </p>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`p-6 rounded-2xl border ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-gray-200'}`}
          >
            <div className="text-xl font-black mb-2 uppercase tracking-widest text-[#7c3aed]">Bookmarks</div>
            <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Save Favorites
            </h3>
            <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
              Bookmark hackathons and access them anytime
            </p>
          </m.div>
        </div>
          </m.div>
        </div>
      </div>

      {selectedHackathon && (
        <>
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedHackathon(null)}
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm"
          />
          <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-[80px] pb-[100px] md:py-12 pointer-events-none"
          >
            <div
              className="pointer-events-auto rounded-3xl w-full md:max-w-2xl max-h-full md:max-h-[80vh] flex flex-col overflow-hidden border border-[#ececf4] bg-[#f7f7fb] shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Static Header */}
              <div className="p-5 sm:p-6 border-b border-gray-200/60 bg-[#f7f7fb] flex justify-between items-center shrink-0">
                <h2 className="text-xl sm:text-2xl font-black text-[#111827] line-clamp-1 pr-4">
                  {selectedHackathon.title}
                </h2>
                <button
                  type="button"
                  onClick={() => setSelectedHackathon(null)}
                  className="w-9 h-9 rounded-full bg-[#ececf4] hover:bg-[#dedfee] text-[#4b5563] flex items-center justify-center transition-colors shrink-0"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar-dark p-5 sm:p-6">
                <div className="h-40 sm:h-48 overflow-hidden rounded-2xl mb-5">
                  <img
                    src={selectedHackathon.image || getFallbackImage('Startups', selectedHackathon.title, selectedHackathon._id, 0)}
                    alt={selectedHackathon.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getFallbackImage('Startups', selectedHackathon.title, selectedHackathon._id, 0);
                    }}
                  />
                </div>

                <div className="mb-6">
                  <p
                    className={`text-sm sm:text-base text-[#4b5563] leading-relaxed ${
                      !isExpanded ? 'line-clamp-3' : ''
                    }`}
                  >
                    {selectedHackathon.description}
                  </p>
                  {selectedHackathon.description && selectedHackathon.description.length > 180 && (
                    <button
                      type="button"
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="mt-1 text-sm font-bold text-[#7c3aed] hover:text-[#6d28d9] transition-colors focus:outline-none"
                    >
                      {isExpanded ? 'Show Less' : 'Show More'}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-2">
                  <div className="p-4 rounded-xl bg-[#ececf4]">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#6b7280] mb-0.5">Location</p>
                    <p className="font-bold text-sm text-[#111827]">{selectedHackathon.location || '-'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#ececf4]">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#6b7280] mb-0.5">Mode</p>
                    <p className="font-bold text-sm text-[#111827]">{selectedHackathon.mode}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#ececf4]">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#6b7280] mb-0.5">Organizer</p>
                    <p className="font-bold text-sm text-[#111827]">{selectedHackathon.organizer || 'TBA'}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#ececf4]">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#6b7280] mb-0.5">Start Date</p>
                    <p className="font-bold text-sm text-[#111827]">{formatDate(selectedHackathon.startDate)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#ececf4] col-span-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#6b7280] mb-0.5">Prize Pool</p>
                    <p className="font-bold text-sm text-[#7c3aed]">{selectedHackathon.prize || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              {/* Static Footer */}
              <div className={`p-5 sm:p-6 border-t border-gray-200/60 bg-[#f7f7fb] shrink-0 flex items-center justify-end gap-3 ${!selectedHackathon.registrationLink ? 'hidden sm:flex' : 'flex'}`}>
                <button
                  type="button"
                  onClick={() => setSelectedHackathon(null)}
                  className="hidden sm:flex px-5 py-3 rounded-xl font-bold text-sm bg-[#e2e8f0] hover:bg-[#cbd5e1] text-[#1f2937] transition-colors items-center justify-center"
                >
                  Close
                </button>
                {selectedHackathon.registrationLink && (
                  <a
                    href={selectedHackathon.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-sm text-white text-center bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] hover:from-[#7c3aed] hover:to-[#9333ea] transition-all shadow-[0_4px_14px_rgba(139,92,246,0.35)]"
                  >
                    Register Now
                  </a>
                )}
              </div>
            </div>
          </m.div>
        </>
      )}
    </m.div>
  )
}







