'use client'

import React, { useState, useRef } from 'react'
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
  const [bookingData, setBookingData] = useState<{ date: string; time: string; guests: string; name: string; email: string; phone: string } | null>(null)
  const [errorStatus, setErrorStatus] = useState<'none' | 'activation_required' | 'network_error'>('none')
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorStatus('none')

    const formData = new FormData(e.currentTarget)
    
    // Generate a secure random Booking Reference Number
    const refNum = 'SZ-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    formData.append('Booking Reference', refNum)
    
    // Save details
    const date = formData.get('date') as string
    const time = formData.get('time') as string
    const guests = formData.get('guests') as string
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    
    setBookingData({ date, time, guests, name, email, phone })
    setBookingRef(refNum)
    
    try {
      const response = await fetch('https://formsubmit.co/ajax/panhongwei1994@gmail.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData,
      })
      
      if (response.ok) {
        setIsSuccess(true)
      } else {
        setErrorStatus('activation_required')
      }
    } catch (error) {
      console.error(error)
      setErrorStatus('network_error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getGoogleCalendarUrl = () => {
    if (!bookingData?.date || !bookingData?.time) return '#'
    const startDate = new Date(`${bookingData.date}T${bookingData.time}`)
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
    <Dialog onOpenChange={(open) => { if(!open) { setIsSuccess(false); setErrorStatus('none'); } }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className='border-white/10 bg-black/95 text-white backdrop-blur-xl sm:max-w-[425px] rounded-3xl!'>
        {isSuccess ? (
          <div className='relative z-50 flex flex-col items-center justify-center py-6 text-center pointer-events-auto'>
            <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-400 ring-8 ring-green-500/10'>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
              </svg>
            </div>
            <h3 className='font-serif text-3xl tracking-wide text-white mb-2'>Confirmed</h3>
            <p className='text-zinc-400 mb-6'>Your table has been successfully reserved.</p>
            
            <div className='mb-8 w-full rounded-2xl border border-white/10 bg-white/5 p-5 text-left shadow-inner'>
              <p className='mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500'>Booking Reference</p>
              <p className='font-mono text-2xl tracking-widest text-primary'>{bookingRef}</p>
              
              <div className='mt-5 flex gap-6 text-sm text-zinc-400 justify-between items-center'>
                <div>
                  <span className='mb-0.5 block text-xs text-zinc-500'>Date</span>
                  <span className='font-medium text-white'>{bookingData?.date}</span>
                </div>
                <div>
                  <span className='mb-0.5 block text-xs text-zinc-500'>Time</span>
                  <span className='font-medium text-white'>{bookingData?.time}</span>
                </div>
                <div>
                  <span className='mb-0.5 block text-xs text-zinc-500'>Guests</span>
                  <span className='font-medium text-white'>{bookingData?.guests}</span>
                </div>
              </div>
            </div>

            <div className='flex w-full flex-col gap-3 sm:flex-row'>
              <button 
                onClick={() => window.open(getGoogleCalendarUrl(), '_blank')}
                className='flex-1 rounded-xl border border-[#4285F4]/20 bg-[#4285F4]/10 py-3 text-sm font-semibold text-[#4285F4] transition-all hover:bg-[#4285F4]/20 cursor-pointer pointer-events-auto'
              >
                Google Calendar
              </button>
              <button 
                onClick={() => { window.location.href = getAppleCalendarUrl() }}
                className='flex-1 rounded-xl bg-white/10 py-3 text-sm font-semibold text-white transition-all hover:bg-white/20 cursor-pointer pointer-events-auto'
              >
                Apple Calendar
              </button>
            </div>
            
            <button 
              onClick={() => setIsSuccess(false)}
              className='mt-6 text-sm text-zinc-500 underline underline-offset-4 transition-colors hover:text-white cursor-pointer pointer-events-auto'
            >
              Make another reservation
            </button>
          </div>
        ) : errorStatus !== 'none' ? (
          <div className='relative z-50 flex flex-col items-center justify-center py-6 text-center pointer-events-auto'>
             <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 ring-8 ring-amber-500/10'>
              <svg xmlns='http://www.w3.org/2000/svg' className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' />
              </svg>
            </div>
            <h3 className='font-serif text-2xl tracking-wide text-white mb-3'>Action Required</h3>
            <p className='text-zinc-400 mb-6 max-w-[300px]'>
              {errorStatus === 'activation_required' 
                ? "This domain needs to be activated. Please click the button below to confirm your domain authority." 
                : "A network error occurred. Please try again with the manual link below."}
            </p>
            
            <div className='w-full'>
              <button 
                onClick={() => {
                  const form = document.createElement('form');
                  form.method = 'POST';
                  form.action = 'https://formsubmit.co/panhongwei1994@gmail.com';
                  form.target = '_blank';
                  
                  const addField = (name: string, value: string) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = name;
                    input.value = value;
                    form.appendChild(input);
                  };
                  
                  addField('_subject', 'Activation from Sushi Zen Live Site');
                  addField('name', bookingData?.name || 'User');
                  addField('email', bookingData?.email || '');
                  addField('phone', bookingData?.phone || '');
                  addField('date', bookingData?.date || '');
                  addField('time', bookingData?.time || '');
                  addField('guests', bookingData?.guests || '');
                  addField('reference', bookingRef);
                  
                  document.body.appendChild(form);
                  form.submit();
                  document.body.removeChild(form);
                }}
                className='w-full rounded-full bg-primary py-4 text-sm font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 cursor-pointer pointer-events-auto'
              >
                CONFIRM DOMAIN ACTIVATION
              </button>
            </div>
            <p className='mt-3 text-[10px] text-zinc-500'>This opens a secure confirmation tab.</p>
            
            <button 
              onClick={() => setErrorStatus('none')}
              className='mt-6 text-sm text-zinc-500 underline underline-offset-4 transition-colors hover:text-white cursor-pointer pointer-events-auto'
            >
              Go back to edit info
            </button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className='font-serif text-2xl tracking-wide'>Reserve Your Table</DialogTitle>
              <DialogDescription className='text-zinc-400'>
                Join us for an unforgettable dining experience. Please fill out your details below.
              </DialogDescription>
            </DialogHeader>
            <form ref={formRef} onSubmit={handleSubmit} className='mt-4 grid gap-5'>
              <input type='hidden' name='_subject' value='New Table Reservation!' />
              <input type='hidden' name='_template' value='table' />

              <div className='grid gap-2'>
                <label htmlFor='name' className='text-sm font-medium text-zinc-300'>
                  Full Name
                </label>
                <Input type='text' id='name' name='name' placeholder='John Doe' required className='focus-visible:ring-primary border-white/10 bg-white/5 text-white placeholder:text-zinc-500' />
              </div>
              
              <div className='grid grid-cols-2 gap-4'>
                <div className='grid gap-2'>
                  <label htmlFor='phone' className='text-sm font-medium text-zinc-300'>
                    Phone
                  </label>
                  <Input type='tel' id='phone' name='phone' placeholder='+1 234 567 890' required className='focus-visible:ring-primary border-white/10 bg-white/5 text-white placeholder:text-zinc-500' />
                </div>
                <div className='grid gap-2'>
                  <label htmlFor='email' className='text-sm font-medium text-zinc-300'>
                    Email
                  </label>
                  <Input type='email' id='email' name='email' placeholder='john@example.com' required className='focus-visible:ring-primary border-white/10 bg-white/5 text-white placeholder:text-zinc-500' />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='grid gap-2'>
                  <label htmlFor='date' className='text-sm font-medium text-zinc-300'>
                    Date
                  </label>
                  <Input type='date' id='date' name='date' required className='focus-visible:ring-primary border-white/10 bg-white/5 text-white dark:[color-scheme:dark]' />
                </div>
                <div className='grid gap-2'>
                  <label htmlFor='time' className='text-sm font-medium text-zinc-300'>
                    Time
                  </label>
                  <Input type='time' id='time' name='time' required className='focus-visible:ring-primary border-white/10 bg-white/5 text-white dark:[color-scheme:dark]' />
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
                  className='focus-visible:ring-primary flex h-10 w-full appearance-none rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
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
              
              <Button type='submit' disabled={isSubmitting} className='bg-primary hover:bg-primary/90 text-primary-foreground mt-2 w-full rounded-full transition-all duration-300'>
                {isSubmitting ? 'Securing your table...' : 'Confirm Reservation'}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
