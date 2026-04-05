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

  // Use a slight delay just to show button loading state locally,
  // before the native form submission happens.
  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => setIsSubmitting(false), 3000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] border-white/10 bg-black/95 backdrop-blur-xl text-white !rounded-[2rem]'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-serif tracking-wide'>Reserve Your Table</DialogTitle>
          <DialogDescription className='text-zinc-400'>
            Join us for an unforgettable dining experience. Please fill out your details below.
          </DialogDescription>
        </DialogHeader>
        
        {/* We use standard HTML submission with target=_blank so Formsubmit can show the ReCaptcha and Activation page for the first time */}
        <form 
          action='https://formsubmit.co/panhongwei1994@gmail.com' 
          method='POST' 
          target='_blank'
          onSubmit={handleSubmit}
          className='grid gap-5 mt-4'
        >
          {/* Email Subject */}
          <input type='hidden' name='_subject' value='New Sushi Zen Reservation!' />
          {/* Use table style email template */}
          <input type='hidden' name='_template' value='table' />
          {/* Prevent redirecting, just show the formsubmit thank you page in the new tab */}
          
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
            {isSubmitting ? 'Opening secure portal...' : 'Confirm Reservation'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
