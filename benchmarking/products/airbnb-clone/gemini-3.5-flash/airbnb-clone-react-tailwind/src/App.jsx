import React, { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { TooltipProvider } from './Tooltip'
import { ListingBrowser } from './ListingBrowser'
import { Search, Globe, Menu, User, Sparkles, Sun, Moon, X, Calendar, Users, MapPin } from 'lucide-react'
import { Tooltip } from './Tooltip'

function App() {
  // Theme state synced with local storage and system preferences
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved) return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Search states
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeSearch, setActiveSearch] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 2
  })

  // Modal temporary inputs
  const [modalDestination, setModalDestination] = useState('')
  const [modalCheckIn, setModalCheckIn] = useState('')
  const [modalCheckOut, setModalCheckOut] = useState('')
  const [modalGuests, setModalGuests] = useState(2)

  // Sync theme class to document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  // Open search modal and pre-fill with active search parameters
  const openSearchModal = () => {
    setModalDestination(activeSearch.destination)
    setModalCheckIn(activeSearch.checkIn)
    setModalCheckOut(activeSearch.checkOut)
    setModalGuests(activeSearch.guests)
    setIsSearchOpen(true)
  }

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setActiveSearch({
      destination: modalDestination,
      checkIn: modalCheckIn,
      checkOut: modalCheckOut,
      guests: modalGuests
    })
    setIsSearchOpen(false)
  }

  // Reset search filters
  const handleClearSearch = () => {
    setModalDestination('')
    setModalCheckIn('')
    setModalCheckOut('')
    setModalGuests(2)
    setActiveSearch({
      destination: '',
      checkIn: '',
      checkOut: '',
      guests: 2
    })
  }

  // Helper formatting for search bar texts
  const getDestinationLabel = () => {
    if (!activeSearch.destination) return 'Anywhere'
    return activeSearch.destination
  }

  const getDatesLabel = () => {
    if (!activeSearch.checkIn || !activeSearch.checkOut) return 'Any week'
    
    // Format helper e.g. "Aug 12 - 17" or simple split
    try {
      const start = new Date(activeSearch.checkIn)
      const end = new Date(activeSearch.checkOut)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      if (start.getMonth() === end.getMonth()) {
        return `${months[start.getMonth()]} ${start.getDate()} - ${end.getDate()}`
      }
      return `${months[start.getMonth()]} ${start.getDate()} - ${months[end.getMonth()]} ${end.getDate()}`
    } catch {
      return 'Any week'
    }
  }

  const getGuestsLabel = () => {
    if (activeSearch.guests <= 1) return '1 guest'
    return `${activeSearch.guests} guests`
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
        {/* Navigation Header */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 py-3 flex items-center justify-between">
          {/* Logo */}
          <div 
            onClick={handleClearSearch}
            className="flex items-center gap-2 cursor-pointer select-none"
            aria-label="Airbnb Clone Home"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-500 flex items-center justify-center shadow-md">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent hidden sm:inline">
              Airbnb Clone
            </span>
          </div>

          {/* Interactive Search Bar (Click to open modal) */}
          <button
            onClick={openSearchModal}
            className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-full py-1.5 pl-4 pr-2 shadow-sm hover:shadow transition-all bg-white dark:bg-slate-900 cursor-pointer text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            aria-label="Open search menu"
          >
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[100px] sm:max-w-[150px]">
              {getDestinationLabel()}
            </span>
            <span className="text-slate-300 dark:text-slate-700 font-light">|</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {getDatesLabel()}
            </span>
            <span className="text-slate-300 dark:text-slate-700 font-light">|</span>
            <span className="text-slate-500 dark:text-slate-400">
              {getGuestsLabel()}
            </span>
            <div className="p-1.5 bg-rose-500 rounded-full text-white">
              <Search className="h-3 w-3" />
            </div>
          </button>

          {/* User Section & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hidden md:flex">
              <span className="hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-2 rounded-full cursor-pointer transition-colors">
                Airbnb your home
              </span>
            </div>

            {/* Theme Toggle Button */}
            <Tooltip content={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"} side="bottom">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500"
                aria-label={isDark ? "Change to light theme" : "Change to dark theme"}
              >
                {isDark ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
              </button>
            </Tooltip>

            {/* Profile Dropdown Trigger */}
            <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-full py-1 px-2.5 bg-white dark:bg-slate-900 cursor-pointer hover:shadow-sm transition-all text-slate-500 dark:text-slate-400">
              <Menu className="h-4 w-4" />
              <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                <User className="h-4 w-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 flex flex-col">
          <ListingBrowser 
            activeSearch={activeSearch} 
            onClearSearch={handleClearSearch}
          />
        </main>

        {/* Dynamic Search Modal Dialog */}
        {isSearchOpen && (
          <div 
            className="fixed inset-0 z-50 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto"
            onClick={() => setIsSearchOpen(false)}
          >
            <div 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800 mb-5">
                <h2 className="text-base font-bold text-slate-900 dark:text-white m-0">
                  Search property listings
                </h2>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 focus:outline-none"
                  aria-label="Close search panel"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearchSubmit} className="space-y-4">
                {/* Destination Input */}
                <div className="space-y-1.5">
                  <label htmlFor="modal-dest" className="block text-[10px] font-bold text-slate-500 uppercase">
                    Where to?
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="modal-dest"
                      placeholder="Search destinations (e.g. Aspen, Santorini)"
                      value={modalDestination}
                      onChange={(e) => setModalDestination(e.target.value)}
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 pl-10 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    />
                    <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  </div>

                  {/* Destination Suggestion Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {['Aspen', 'Santorini', 'Marrakech', 'Kyoto', 'New York', 'Bali'].map((dest) => (
                      <button
                        type="button"
                        key={dest}
                        onClick={() => setModalDestination(dest)}
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                          modalDestination.toLowerCase() === dest.toLowerCase()
                            ? 'bg-rose-500 border-rose-500 text-white'
                            : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-950 dark:border-slate-850 dark:text-slate-400'
                        }`}
                      >
                        {dest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dates Selector */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="modal-in" className="block text-[10px] font-bold text-slate-500 uppercase">
                      Check-in
                    </label>
                    <input
                      type="date"
                      id="modal-in"
                      value={modalCheckIn}
                      onChange={(e) => setModalCheckIn(e.target.value)}
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="modal-out" className="block text-[10px] font-bold text-slate-500 uppercase">
                      Check-out
                    </label>
                    <input
                      type="date"
                      id="modal-out"
                      value={modalCheckOut}
                      onChange={(e) => setModalCheckOut(e.target.value)}
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                {/* Guest Selector */}
                <div className="space-y-1.5">
                  <label htmlFor="modal-guests" className="block text-[10px] font-bold text-slate-500 uppercase">
                    Who's coming?
                  </label>
                  <div className="relative">
                    <select
                      id="modal-guests"
                      value={modalGuests}
                      onChange={(e) => setModalGuests(Number(e.target.value))}
                      className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500 appearance-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <option key={num} value={num}>
                          {num} guest{num > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                    <Users className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="flex-1 text-xs font-semibold py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    type="submit"
                    className="flex-1 text-xs font-semibold py-3 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    <span>Search</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toast Notification Mount */}
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#0f172a',
            color: '#fff',
            borderRadius: '12px',
          }
        }} />
      </div>
    </TooltipProvider>
  )
}

export default App
