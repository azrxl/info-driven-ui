import React, { useState, useRef } from 'react'
import { Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react'
import { Tooltip } from './Tooltip'

export function PropertyCard({ property, isSelected, onSelect }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const cardRef = useRef(null)

  const handlePrevImage = (e) => {
    e.stopPropagation()
    setCurrentImgIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))
  }

  const handleNextImage = (e) => {
    e.stopPropagation()
    setCurrentImgIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setCurrentImgIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      setCurrentImgIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(property)
    }
  }

  const toggleFavorite = (e) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  // Generate review breakdown string for tooltip
  const reviewTooltipContent = (
    <div className="space-y-1 p-1">
      <div className="font-semibold text-slate-100 mb-1">
        {property.rating} out of 5 stars ({property.reviewsCount} reviews)
      </div>
      <div className="space-y-0.5 text-[10px]">
        {Object.entries(property.reviewsBreakdown)
          .map(([star, count]) => {
            const percentage = property.reviewsCount > 0 ? (count / property.reviewsCount) * 100 : 0
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="w-6 text-slate-400">{star}</span>
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full bg-amber-400"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-6 text-right text-slate-400 tabular-nums">{count}</span>
              </div>
            )
          })}
      </div>
    </div>
  )

  return (
    <article
      ref={cardRef}
      tabIndex={0}
      onClick={() => onSelect(property)}
      onKeyDown={handleKeyDown}
      className={`group relative flex flex-col rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ${
        isSelected
          ? 'border-rose-500 shadow-lg scale-[1.01] bg-rose-50/5 dark:bg-rose-950/5'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md hover:translate-y-[-2px] bg-white dark:bg-slate-900'
      }`}
      aria-label={`${property.title} in ${property.location}, $${property.pricePerNight} per night`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={property.images[currentImgIndex]}
          alt={`${property.title} view ${currentImgIndex + 1}`}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Favorite Icon */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm transition-transform active:scale-90 hover:scale-110 focus:outline-none text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-rose-500"
          aria-label={isFavorite ? "Remove from saved" : "Save to wish list"}
        >
          <Heart
            className={`h-4.5 w-4.5 transition-colors duration-300 ${
              isFavorite ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-700 dark:text-slate-300'
            }`}
          />
        </button>

        {/* Carousel Arrow Controls (Visible on Card Hover) */}
        <button
          onClick={handlePrevImage}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 shadow hover:bg-white dark:hover:bg-slate-800 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          onClick={handleNextImage}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 shadow hover:bg-white dark:hover:bg-slate-800 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
          aria-label="Next image"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
          {property.images.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentImgIndex
                  ? 'w-3 bg-white'
                  : 'w-1.5 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Description Content */}
      <div className="flex flex-col p-4 flex-grow">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm line-clamp-1">
            {property.title}
          </h3>

          {/* Rating */}
          <Tooltip content={reviewTooltipContent} side="top">
            <span className="flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-help border-b border-dashed border-slate-300 dark:border-slate-700 pb-0.5">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="tabular-nums">{property.rating.toFixed(2)}</span>
            </span>
          </Tooltip>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {property.location}
        </p>

        {/* Distance */}
        <Tooltip content={`Distance from Aspen center is ${property.distance} miles`} side="top">
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 cursor-help inline-block w-fit border-b border-dotted border-slate-300 dark:border-slate-700">
            {property.distance} miles away
          </p>
        </Tooltip>

        {/* Available dates */}
        <Tooltip content={`This listing is available from ${property.availableFrom} to ${property.availableTo}`} side="top">
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 cursor-help inline-block w-fit">
            {property.dates}
          </p>
        </Tooltip>

        {/* Price */}
        <div className="flex justify-between items-baseline mt-3">
          <Tooltip content="Excludes cleaning fees, service charges, and taxes" side="top">
            <span className="text-xs text-slate-400 dark:text-slate-500 cursor-help">
              Base Price
            </span>
          </Tooltip>
          <div className="text-slate-900 dark:text-slate-100">
            <span className="font-semibold tabular-nums text-base">
              ${property.pricePerNight}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400"> / night</span>
          </div>
        </div>
      </div>
    </article>
  )
}
