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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    
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
      alert("Failed to submit. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] border-white/10 bg-black/95 backdrop-blur-xl text-white !rounded-[2rem]'>
        {isSuccess ? (
          <div className='flex flex-col items-center justify-center py-10 text-center'>
            <div className='text-5xl mb-6'>✨</div>
            <h3 className='text-2xl font-serif tracking-wide text-white mb-3'>Reservation Sent!</h3>
            <p className='text-zinc-400 max-w-[280px]'>
              Thank you for choosing Sushi Zen. We will contact you shortly to confirm your table.
            </p>
            <Button 
              className='mt-8 bg-white/10 hover:bg-white/20 text-white rounded-full px-8'
              onClick={() => setIsSuccess(false)}
            >
              Book Another Table
            </Button>
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
                {isSubmitting ? 'Sending...' : 'Confirm Reservation'}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
