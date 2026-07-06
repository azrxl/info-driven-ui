import React, { useState, useEffect } from 'react'
import { PropertyCard } from './PropertyCard'
import { BookingSidebar } from './BookingSidebar'
import { LayoutGrid, SlidersHorizontal, Eye, EyeOff, Search } from 'lucide-react'
import { Tooltip } from './Tooltip'

const LISTINGS_DATA = [
  {
    id: "listing-1",
    title: "Alpine A-Frame Cabin in the Pines",
    category: "Cabins",
    location: "Aspen, Colorado",
    images: [
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.95,
    reviewsCount: 148,
    reviewsBreakdown: { "5★": 138, "4★": 8, "3★": 2, "2★": 0, "1★": 0 },
    distance: 14,
    dates: "Aug 15 - 20",
    availableFrom: "2026-08-15",
    availableTo: "2026-08-20",
    pricePerNight: 280,
    cleaningFee: 75,
    serviceFeeRate: 0.12,
    taxesRate: 0.10,
    maxGuests: 4,
  },
  {
    id: "listing-2",
    title: "Oceanfront Santorini Cliffside Villa",
    category: "Islands",
    location: "Oia, Greece",
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.98,
    reviewsCount: 92,
    reviewsBreakdown: { "5★": 90, "4★": 2, "3★": 0, "2★": 0, "1★": 0 },
    distance: 1.2,
    dates: "Sep 1 - 7",
    availableFrom: "2026-09-01",
    availableTo: "2026-09-07",
    pricePerNight: 620,
    cleaningFee: 120,
    serviceFeeRate: 0.12,
    taxesRate: 0.10,
    maxGuests: 6,
  },
  {
    id: "listing-3",
    title: "Dar El Bacha Riad & Private Spa",
    category: "Riad",
    location: "Marrakech, Morocco",
    images: [
      "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.89,
    reviewsCount: 215,
    reviewsBreakdown: { "5★": 196, "4★": 15, "3★": 3, "2★": 1, "1★": 0 },
    distance: 2.5,
    dates: "Aug 20 - 25",
    availableFrom: "2026-08-20",
    availableTo: "2026-08-25",
    pricePerNight: 185,
    cleaningFee: 50,
    serviceFeeRate: 0.12,
    taxesRate: 0.10,
    maxGuests: 4,
  },
  {
    id: "listing-4",
    title: "Traditional Machiya Heritage House",
    category: "City",
    location: "Kyoto, Japan",
    images: [
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.96,
    reviewsCount: 88,
    reviewsBreakdown: { "5★": 85, "4★": 2, "3★": 1, "2★": 0, "1★": 0 },
    distance: 4.8,
    dates: "Oct 10 - 15",
    availableFrom: "2026-10-10",
    availableTo: "2026-10-15",
    pricePerNight: 220,
    cleaningFee: 80,
    serviceFeeRate: 0.12,
    taxesRate: 0.10,
    maxGuests: 5,
  },
  {
    id: "listing-5",
    title: "Luxury Central Park View Penthouse",
    category: "Mansions",
    location: "New York, New York",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.82,
    reviewsCount: 64,
    reviewsBreakdown: { "5★": 56, "4★": 6, "3★": 1, "2★": 1, "1★": 0 },
    distance: 0.8,
    dates: "Aug 12 - 17",
    availableFrom: "2026-08-12",
    availableTo: "2026-08-17",
    pricePerNight: 950,
    cleaningFee: 200,
    serviceFeeRate: 0.12,
    taxesRate: 0.10,
    maxGuests: 8,
  },
  {
    id: "listing-6",
    title: "Tropical Eco Bamboo Palace in Ubud",
    category: "Cabins",
    location: "Bali, Indonesia",
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
    ],
    rating: 4.92,
    reviewsCount: 310,
    reviewsBreakdown: { "5★": 290, "4★": 16, "3★": 3, "2★": 1, "1★": 0 },
    distance: 15.3,
    dates: "Aug 12 - 18",
    availableFrom: "2026-08-12",
    availableTo: "2026-08-18",
    pricePerNight: 140,
    cleaningFee: 40,
    serviceFeeRate: 0.12,
    taxesRate: 0.10,
    maxGuests: 3,
  }
]

const CATEGORIES = ["All Homes", "Cabins", "Islands", "Riad", "City", "Mansions"]

export function ListingBrowser({ activeSearch, onClearSearch }) {
  const [selectedProperty, setSelectedProperty] = useState(LISTINGS_DATA[0])
  const [activeCategory, setActiveCategory] = useState("All Homes")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Booking states inside sidebar
  const [checkIn, setCheckIn] = useState(selectedProperty?.availableFrom || '')
  const [checkOut, setCheckOut] = useState(selectedProperty?.availableTo || '')
  const [guests, setGuests] = useState(2)

  // 1. Filter listings dynamically based on active category and active search queries
  const filteredListings = LISTINGS_DATA.filter((item) => {
    // Category filter
    const matchesCategory = activeCategory === "All Homes" || item.category === activeCategory

    // Destination filter (matches location or title)
    const matchesDestination = !activeSearch.destination ||
      item.location.toLowerCase().includes(activeSearch.destination.toLowerCase()) ||
      item.title.toLowerCase().includes(activeSearch.destination.toLowerCase())

    // Guest capacity filter
    const matchesGuests = !activeSearch.guests || item.maxGuests >= activeSearch.guests

    // Available dates range check
    let matchesDates = true
    if (activeSearch.checkIn && activeSearch.checkOut) {
      const checkInDate = new Date(activeSearch.checkIn)
      const checkOutDate = new Date(activeSearch.checkOut)
      if (checkInDate < checkOutDate) {
        matchesDates = item.availableFrom <= activeSearch.checkIn && item.availableTo >= activeSearch.checkOut
      }
    }

    return matchesCategory && matchesDestination && matchesGuests && matchesDates
  })

  // 2. Select first visible listing if the currently selected one is filtered out
  useEffect(() => {
    if (selectedProperty && !filteredListings.some(item => item.id === selectedProperty.id)) {
      setSelectedProperty(filteredListings.length > 0 ? filteredListings[0] : null)
    }
  }, [filteredListings, selectedProperty])

  // 3. Sync sidebar booking inputs when active search or selected listing updates
  useEffect(() => {
    if (selectedProperty) {
      setCheckIn(activeSearch.checkIn || selectedProperty.availableFrom)
      setCheckOut(activeSearch.checkOut || selectedProperty.availableTo)
      setGuests(activeSearch.guests ? Math.min(activeSearch.guests, selectedProperty.maxGuests) : 2)
    }
  }, [selectedProperty, activeSearch])

  const handleSelectProperty = (property) => {
    setSelectedProperty(property)
    if (!sidebarOpen) {
      setSidebarOpen(true)
    }
  }

  // Check if search filters are active
  const isSearchActive = activeSearch.destination || activeSearch.checkIn || activeSearch.checkOut || activeSearch.guests > 2

  return (
    <div className="flex-1 flex flex-col md:flex-row relative">
      {/* Listings List Area */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`text-xs font-semibold px-3 py-2 rounded-full border transition-all cursor-pointer select-none whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ${
                    isActive
                      ? "bg-slate-900 border-slate-900 text-white dark:bg-slate-100 dark:border-slate-100 dark:text-slate-900"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-750"
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Sidebar toggler */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {isSearchActive && (
              <button
                onClick={onClearSearch}
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-450 px-2 py-1.5 cursor-pointer"
              >
                Clear Search
              </button>
            )}
            
            <Tooltip
              content={sidebarOpen ? "Hide booking summary panel" : "Show booking summary panel"}
              side="top"
            >
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500"
                aria-label={sidebarOpen ? "Hide booking calculator" : "Show booking calculator"}
              >
                {sidebarOpen ? (
                  <>
                    <EyeOff className="h-4 w-4 text-rose-500" />
                    <span>Hide Calculator</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 text-rose-500" />
                    <span>Show Calculator</span>
                  </>
                )}
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Search status filter indicator */}
        {isSearchActive && (
          <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-rose-500" />
              <span>
                Showing results matching destination "{activeSearch.destination || 'Anywhere'}"
                {activeSearch.checkIn && ` starting ${activeSearch.checkIn}`}
                {activeSearch.guests > 1 && ` for ${activeSearch.guests} guests`}.
              </span>
            </div>
            <button
              onClick={onClearSearch}
              className="text-[10px] font-bold text-rose-500 hover:underline uppercase tracking-wider"
            >
              Reset Search filters
            </button>
          </div>
        )}

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          /* Empty Search Results State */
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <SlidersHorizontal className="h-10 w-10 text-slate-400 mb-4" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base mb-1">
              No matching listings found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 max-w-xs">
              No properties match your current search criteria. Try modifying your check-in dates, lowering guest count, or searching a different area.
            </p>
            <div className="flex gap-2">
              <button
                onClick={onClearSearch}
                className="inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold px-4 py-2 hover:bg-slate-50 hover:border-slate-350 dark:hover:bg-slate-800 transition-colors"
              >
                Clear Search
              </button>
              {activeCategory !== "All Homes" && (
                <button
                  onClick={() => setActiveCategory("All Homes")}
                  className="inline-flex items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-semibold px-4 py-2 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                >
                  Show All Homes
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredListings.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isSelected={selectedProperty?.id === property.id}
                onSelect={handleSelectProperty}
              />
            ))}
          </div>
        )}
      </div>

      {/* Booking sidebar wrapper */}
      <BookingSidebar
        selectedProperty={selectedProperty}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(false)}
        checkIn={checkIn}
        setCheckIn={setCheckIn}
        checkOut={checkOut}
        setCheckOut={setCheckOut}
        guests={guests}
        setGuests={setGuests}
      />
    </div>
  )
}
