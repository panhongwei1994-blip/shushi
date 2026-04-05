'use client'

import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function BookingModal({ children }: { children: React.ReactNode }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [bookingRef, setBookingRef] = useState('')
  const [bookingData, setBookingData] = useState<{ date: string; time: string; guests: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    
    // Generate a secure random Booking Reference Number
    const refNum = 'SZ-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    formData.append('Booking Reference', refNum)
    
    // Save details for calendar generation
    const date = formData.get('date') as string
    const time = formData.get('time') as string
    const guests = formData.get('guests') as string
    setBookingData({ date, time, guests })
    setBookingRef(refNum)
    
    try {
      await fetch('https://formsubmit.co/ajax/panhongwei1994@gmail.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData,
      })
      setIsSuccess(true)
    } catch (error) {
      console.error(error)
      alert("Failed to connect to the booking server. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Create calendar links
  const getGoogleCalendarUrl = () => {
    if (!bookingData?.date || !bookingData?.time) return '#'
    // Convert local date/time to UTC strings for Google Calendar
    const startDate = new Date(`${bookingData.date}T${bookingData.time}`)
    // Assume 2 hours reservation duration
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000)
    
    const formatGoogleDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '')
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: 'Sushi Zen Reservation',
      dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
      details: `Table reservation for ${bookingData.guests} guests. Booking Reference: ${bookingRef}\nWe look forward to serving you!`
    })
    return `https://calendar.google.com/calendar/render?${params.toString()}`
  }

  const getAppleCalendarUrl = () => {
    if (!bookingData?.date || !bookingData?.time) return '#'
    const startDate = new Date(`${bookingData.date}T${bookingData.time}`)
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000)
    
    const formatICalDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '')
    
    const icalData = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:https://sushizen.com
DTSTART:${formatICalDate(startDate)}
DTEND:${formatICalDate(endDate)}
SUMMARY:Sushi Zen Reservation
DESCRIPTION:Table reservation for ${bookingData.guests} guests. Booking Reference: ${bookingRef}
END:VEVENT
END:VCALENDAR`
    
    return `data:text/calendar;charset=utf8,${encodeURIComponent(icalData)}`
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] border-white/10 bg-black/95 backdrop-blur-xl text-white !rounded-[2rem]'>
        {isSuccess ? (
          <div className='flex flex-col items-center justify-center py-6 text-center animate-in fade-in zoom-in duration-500'>
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-400 mb-6 ring-8 ring-green-500/10'>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
              </svg>
            </div>
            <h3 className='text-3xl font-serif tracking-wide text-white mb-2'>Confirmed</h3>
            <p className='text-zinc-400 mb-6'>Your table has been successfully reserved.</p>
            
            <div className='w-full rounded-2xl bg-white/5 border border-white/10 p-5 mb-8 text-left shadow-inner'>
              <p className='text-xs text-zinc-500 uppercase tracking-wider mb-1 font-semibold'>Booking Reference</p>
              <p className='text-2xl font-mono text-primary tracking-widest'>{bookingRef}</p>
              
              <div className='mt-5 flex gap-6 text-sm text-zinc-400'>
                <div>
                  <span className='block text-xs text-zinc-500 mb-0.5'>Date</span>
                  <span className='text-white font-medium'>{bookingData?.date}</span>
                </div>
                <div>
                  <span className='block text-xs text-zinc-500 mb-0.5'>Time</span>
                  <span className='text-white font-medium'>{bookingData?.time}</span>
                </div>
                <div>
                  <span className='block text-xs text-zinc-500 mb-0.5'>Guests</span>
                  <span className='text-white font-medium'>{bookingData?.guests}</span>
                </div>
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-3 w-full'>
              <Button asChild className='flex-1 bg-[#4285F4]/10 text-[#4285F4] hover:bg-[#4285F4]/20 border border-[#4285F4]/20 rounded-xl'>
                <a href={getGoogleCalendarUrl()} target='_blank' rel='noreferrer'>Google Calendar</a>
              </Button>
              <Button asChild className='flex-1 bg-white/10 hover:bg-white/20 text-white rounded-xl'>
                <a href={getAppleCalendarUrl()} download='sushi-zen-booking.ics'>Apple Calendar</a>
              </Button>
            </div>
            
            <button 
              onClick={() => setIsSuccess(false)}
              className='mt-6 text-sm text-zinc-500 hover:text-white transition-colors underline underline-offset-4'
            >
              Make another reservation
            </button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className='text-2xl font-serif tracking-wide'>Reserve Your Table</DialogTitle>
              <DialogDescription className='text-zinc-400'>
                Join us for an unforgettable dining experience. Please fill out your details below.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className='grid gap-5 mt-4'>
              <input type='hidden' name='_subject' value='New Table Reservation!' />
              <input type='hidden' name='_template' value='table' />

              <div className='grid gap-2'>
                <label htmlFor='name' className='text-sm font-medium text-zinc-300'>
                  Full Name
                </label>
                <Input type='text' id='name' name='name' placeholder='John Doe' required className='bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-primary' />
              </div>
              
              <div className='grid grid-cols-2 gap-4'>
                <div className='grid gap-2'>
                  <label htmlFor='phone' className='text-sm font-medium text-zinc-300'>
                    Phone
                  </label>
                  <Input type='tel' id='phone' name='phone' placeholder='+1 234 567 890' required className='bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-primary' />
                </div>
                <div className='grid gap-2'>
                  <label htmlFor='email' className='text-sm font-medium text-zinc-300'>
                    Email
                  </label>
                  <Input type='email' id='email' name='email' placeholder='john@example.com' required className='bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-primary' />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='grid gap-2'>
                  <label htmlFor='date' className='text-sm font-medium text-zinc-300'>
                    Date
                  </label>
                  <Input type='date' id='date' name='date' required className='bg-white/5 border-white/10 text-white focus-visible:ring-primary dark:[color-scheme:dark]' />
                </div>
                <div className='grid gap-2'>
                  <label htmlFor='time' className='text-sm font-medium text-zinc-300'>
                    Time
                  </label>
                  <Input type='time' id='time' name='time' required className='bg-white/5 border-white/10 text-white focus-visible:ring-primary dark:[color-scheme:dark]' />
                </div>
              </div>
              <div className='grid gap-2'>
                <label htmlFor='guests' className='text-sm font-medium text-zinc-300'>
                  Number of Guests
                </label>
                <select 
                  id='guests' 
                  name='guests' 
                  required
                  defaultValue=""
                  className='flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 appearance-none'
                >
                  <option value='' className='bg-zinc-900 text-zinc-500' disabled>Select guests</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num} className='bg-zinc-900 text-white'>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </option>
                  ))}
                  <option value='12+' className='bg-zinc-900 text-white'>12+ Guests</option>
                </select>
              </div>
              
              <Button type='submit' disabled={isSubmitting} className='w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 rounded-full'>
                {isSubmitting ? 'Securing your table...' : 'Confirm Reservation'}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
