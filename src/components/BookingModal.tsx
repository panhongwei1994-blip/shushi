import React, { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
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
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')

    const formData = new FormData(e.currentTarget)
    const data: Record<string, string> = {}

    formData.forEach((value, key) => {
      data[key] = value.toString()
    })

    data['_captcha'] = 'false'
    data['_template'] = 'table'

    try {
      const response = await fetch('https://formsubmit.co/ajax/panhongwei1994@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        setStatus('success')
      } else {
        console.error('FormSubmit error:', result)
        setStatus('error')
      }
    } catch (error) {
      console.error('Submission error:', error)
      setStatus('error')
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] border-zinc-800 bg-black/95 backdrop-blur-xl text-white !rounded-[2rem] [&>button]:text-zinc-400 [&>button]:hover:text-white [&>button]:opacity-100 [&>button]:transition-colors'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-serif tracking-wide'>Reserve Your Table</DialogTitle>
          <DialogDescription className='text-zinc-400'>
            Join us for an unforgettable dining experience. Please fill out your details below.
          </DialogDescription>
        </DialogHeader>
        {status === 'success' ? (
          <div className='flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-300'>
            <div className='bg-primary/20 p-4 rounded-full mb-4'>
              <CheckCircle2 className='size-12 text-primary' />
            </div>
            <h3 className='text-2xl font-serif mb-2'>Reservation Received!</h3>
            <p className='text-zinc-400 max-w-[280px]'>
              We've sent a confirmation details to your email. See you soon!
            </p>
            <Button 
              onClick={() => setStatus('idle')} 
              className='mt-8 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8'
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='grid gap-5 mt-4'>
            <input type='hidden' name='_subject' value='New Table Reservation!' />

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
                className='flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 appearance-none'
              >
                <option value='' className='bg-zinc-900 text-zinc-500' disabled selected>Select guests</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num} className='bg-zinc-900 text-white'>
                    {num} {num === 1 ? 'Guest' : 'Guests'}
                  </option>
                ))}
                <option value='12+' className='bg-zinc-900 text-white'>12+ Guests</option>
              </select>
            </div>
            
            {status === 'error' && (
              <p className='text-red-400 text-sm text-center'>Something went wrong. Please try again.</p>
            )}

            <Button 
              type='submit' 
              disabled={status === 'submitting'}
              className='w-full mt-2 bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 rounded-full'
            >
              {status === 'submitting' ? 'Processing...' : 'Confirm Reservation'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
