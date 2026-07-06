import React, { useState } from 'react'
import { Info, Calendar, Users, X, ChevronRight, HelpCircle, Loader2 } from 'lucide-react'
import { Tooltip } from './Tooltip'
import toast from 'react-hot-toast'

// Helper Badge component conforming to STACK.md
function Badge({ variant = 'neutral', children }) {
  const variantStyles = {
    success: 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50',
    warning: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50',
    critical: 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50',
    neutral: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    info: 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/50',
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${variantStyles[variant]}`}>
      {children}
    </span>
  )
}

export function BookingSidebar({
  selectedProperty,
  isOpen,
  onToggle,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
  guests,
  setGuests,
}) {
  const [isPending, setIsPending] = useState(false)

  // Calculations
  const getDaysDifference = (start, end) => {
    if (!start || !end) return 0
    const startDate = new Date(start)
    const endDate = new Date(end)
    const timeDiff = endDate.getTime() - startDate.getTime()
    if (timeDiff <= 0) return 0
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  }

  const nights = getDaysDifference(checkIn, checkOut)

  // Validations
  const isDateRangeInvalid = nights <= 0
  const isGuestsInvalid = selectedProperty && guests > selectedProperty.maxGuests

  let validationError = null
  if (!selectedProperty) {
    validationError = 'Select a property'
  } else if (!checkIn || !checkOut) {
    validationError = 'Choose booking dates'
  } else if (isDateRangeInvalid) {
    validationError = 'Check-out date must be after check-in date'
  } else if (isGuestsInvalid) {
    validationError = `Capacity exceeded (Max ${selectedProperty.maxGuests} guests)`
  }

  const isButtonDisabled = !!validationError || isPending

  // Pricing calculations
  const calculatePricing = () => {
    if (!selectedProperty || isDateRangeInvalid) return { base: 0, cleaning: 0, service: 0, taxes: 0, total: 0 }
    
    const base = selectedProperty.pricePerNight * nights
    const cleaning = selectedProperty.cleaningFee
    const service = Math.round(base * selectedProperty.serviceFeeRate)
    const taxes = Math.round((base + cleaning + service) * selectedProperty.taxesRate)
    const total = base + cleaning + service + taxes

    return { base, cleaning, service, taxes, total }
  }

  const { base, cleaning, service, taxes, total } = calculatePricing()

  const handleReserve = () => {
    if (isButtonDisabled) return

    setIsPending(true)
    // Simulate booking API call
    setTimeout(() => {
      setIsPending(false)
      toast.success(
        <div className="flex flex-col text-sm">
          <span className="font-semibold text-slate-900 dark:text-white">Booking confirmed!</span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Successfully reserved {selectedProperty.title} for {nights} nights ({guests} guests).
          </span>
        </div>,
        { duration: 5000 }
      )
    }, 2000)
  }

  return (
    <div
      className={`fixed md:sticky top-0 right-0 z-40 h-screen md:h-[calc(100vh-80px)] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-all duration-300 flex flex-col ${
        isOpen ? 'w-full sm:w-[380px] md:w-[400px] opacity-100' : 'w-0 opacity-0 overflow-hidden border-none pointer-events-none md:w-0'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 m-0">
          <Calendar className="h-4 w-4 text-rose-500" />
          Booking Calculator
        </h2>
        <button
          onClick={onToggle}
          className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          aria-label="Collapse sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Main content scroll area */}
      <div className="flex-1 overflow-y-auto p-5">
        {!selectedProperty ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="rounded-full bg-rose-50 dark:bg-rose-950/20 p-4 mb-4">
              <Calendar className="h-8 w-8 text-rose-500" />
            </div>
            <h3 className="text-sm font-semibold text-slate-950 dark:text-slate-100 mb-1">
              No property selected
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 max-w-[240px]">
              Select one of the listings from the list to display dates, occupancy options, and pricing estimates.
            </p>
            <button
              onClick={() => {
                // Selects the first listing dynamically, triggered in App.jsx or parent.
                toast('Please click on a property card to start booking!', { icon: '👉' })
              }}
              className="inline-flex items-center justify-center rounded-lg bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-semibold text-white shadow transition-colors"
            >
              Choose a property
            </button>
          </div>
        ) : (
          /* Booking form and details */
          <div className="space-y-6">
            {/* Quick Listing Info */}
            <div className="flex gap-3 pb-4 border-b border-slate-100 dark:border-slate-900">
              <img
                src={selectedProperty.images[0]}
                alt={selectedProperty.title}
                className="h-16 w-16 object-cover rounded-lg bg-slate-100"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">
                  {selectedProperty.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {selectedProperty.location}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                    ${selectedProperty.pricePerNight}
                  </span>
                  <span className="text-[10px] text-slate-400">/ night</span>
                </div>
              </div>
            </div>

            {/* Inputs Form */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Booking Parameters
              </h3>

              {/* Date Pickers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="check-in"
                    className="block text-[10px] font-bold text-slate-500 uppercase mb-1"
                  >
                    Check-in
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="check-in"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="check-out"
                    className="block text-[10px] font-bold text-slate-500 uppercase mb-1"
                  >
                    Check-out
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="check-out"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Guest Count */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label
                    htmlFor="guests"
                    className="block text-[10px] font-bold text-slate-500 uppercase"
                  >
                    Guests
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Max capacity: {selectedProperty.maxGuests}
                  </span>
                </div>
                <div className="relative">
                  <select
                    id="guests"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 appearance-none"
                  >
                    {Array.from({ length: selectedProperty.maxGuests + 2 }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} guest{i + 1 > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                  <Users className="absolute right-3 top-3 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Validation Badges */}
            {isDateRangeInvalid && checkIn && checkOut && (
              <div className="flex justify-start">
                <Badge variant="critical">Invalid Date Range</Badge>
              </div>
            )}
            {isGuestsInvalid && (
              <div className="flex justify-start">
                <Badge variant="warning">Exceeds Max Guests</Badge>
              </div>
            )}

            {/* Price breakdown table */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-900">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Price Breakdown
              </h3>

              {isDateRangeInvalid ? (
                <div className="rounded-lg border border-slate-100 dark:border-slate-900 p-4 text-center text-xs text-slate-400">
                  Please select valid check-in and check-out dates to display pricing breakdown.
                </div>
              ) : (
                <table className="w-full text-xs">
                  <tbody>
                    <tr className="border-b border-slate-50 dark:border-slate-900/50">
                      <td className="py-2.5 text-slate-600 dark:text-slate-400 text-left">
                        ${selectedProperty.pricePerNight} &times; {nights} night{nights > 1 ? 's' : ''}
                      </td>
                      <td className="py-2.5 text-right font-mono tabular-nums text-slate-900 dark:text-slate-100">
                        ${base.toLocaleString()}
                      </td>
                    </tr>

                    <tr className="border-b border-slate-50 dark:border-slate-900/50">
                      <td className="py-2.5 text-slate-600 dark:text-slate-400 text-left flex items-center gap-1.5">
                        Cleaning fee
                        <Tooltip content="One-time fee charged by host to clean the space upon check-out." side="top">
                          <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 cursor-help" />
                        </Tooltip>
                      </td>
                      <td className="py-2.5 text-right font-mono tabular-nums text-slate-900 dark:text-slate-100">
                        ${cleaning.toLocaleString()}
                      </td>
                    </tr>

                    <tr className="border-b border-slate-50 dark:border-slate-900/50">
                      <td className="py-2.5 text-slate-600 dark:text-slate-400 text-left flex items-center gap-1.5">
                        Airbnb service fee
                        <Tooltip content="Helps us run our platform and provide services like 24/7 support. Calculated as 12% of night total." side="top">
                          <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 cursor-help" />
                        </Tooltip>
                      </td>
                      <td className="py-2.5 text-right font-mono tabular-nums text-slate-900 dark:text-slate-100">
                        ${service.toLocaleString()}
                      </td>
                    </tr>

                    <tr className="border-b border-slate-100 dark:border-slate-900">
                      <td className="py-2.5 text-slate-600 dark:text-slate-400 text-left flex items-center gap-1.5">
                        Occupancy taxes
                        <Tooltip content="Local lodging tax of 10% applied to base rate, cleaning, and platform service fees." side="top">
                          <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 cursor-help" />
                        </Tooltip>
                      </td>
                      <td className="py-2.5 text-right font-mono tabular-nums text-slate-900 dark:text-slate-100">
                        ${taxes.toLocaleString()}
                      </td>
                    </tr>

                    <tr className="font-semibold text-sm">
                      <td className="py-3 text-slate-900 dark:text-slate-100 text-left">
                        Total before taxes
                      </td>
                      <td className="py-3 text-right font-mono tabular-nums text-slate-500 dark:text-slate-400 text-xs">
                        ${(base + cleaning + service).toLocaleString()}
                      </td>
                    </tr>

                    <tr className="font-bold text-sm border-t-2 border-slate-200 dark:border-slate-800">
                      <td className="py-3 text-slate-900 dark:text-slate-100 text-left">
                        Total
                      </td>
                      <td className="py-3 text-right font-mono tabular-nums text-rose-600 dark:text-rose-400 text-base">
                        ${total.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>

            {/* Action button */}
            <Tooltip
              content={
                validationError ? (
                  <div className="text-center font-medium">{validationError}</div>
                ) : (
                  "Confirm and reserve this property for your selected dates."
                )
              }
              side="top"
            >
              <div className="w-full">
                <button
                  type="button"
                  disabled={isButtonDisabled}
                  onClick={handleReserve}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 ${
                    isButtonDisabled
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 active:scale-98 cursor-pointer'
                  }`}
                >
                  {isPending && <Loader2 className="h-4 w-4 animate-spin text-white" />}
                  {isPending ? 'Processing booking...' : 'Reserve'}
                </button>
              </div>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  )
}
