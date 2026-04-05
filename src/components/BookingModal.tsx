import React, { useState, useMemo } from 'react'
import { CheckCircle2, CalendarPlus, Clock } from 'lucide-react'
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
  const [reservationCode, setReservationCode] = useState('')
  const [submissionData, setSubmissionData] = useState<any>(null)

  // Configuration
  const BUSINESS_HOURS = useMemo(() => ({
    start: 11, // 11:00
    end: 25,   // 01:00 next day (24 + 1)
    breakStart: 15,
    breakEnd: 17
  }), [])

  // Generate valid time slots
  const timeSlots = useMemo(() => {
    const slots = []

    for (let h = BUSINESS_HOURS.start; h < BUSINESS_HOURS.end; h++) {
      if (h >= BUSINESS_HOURS.breakStart && h < BUSINESS_HOURS.breakEnd) continue

      const hour = h % 24
      const displayHour = hour.toString().padStart(2, '0')

      slots.push(`${displayHour}:00`)
      slots.push(`${displayHour}:30`)
    }

    return slots
  }, [BUSINESS_HOURS])

  const today = new Date().toISOString().split('T')[0]

  const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let result = 'ZEN-'

    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return result
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')

    const formDataObj = new FormData(e.currentTarget)
    const data: Record<string, string> = {}

    formDataObj.forEach((value, key) => {
      data[key] = value.toString()
    })

    const code = generateCode()

    data['reservation_code'] = code
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
        setReservationCode(code)
        setSubmissionData(data)
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

  const getGoogleCalendarUrl = () => {
    if (!submissionData) return ''

    const title = encodeURIComponent('Sushi Zen Reservation')
    const details = encodeURIComponent(`Reservation Code: ${reservationCode}\nGuests: ${submissionData.guests}\nPhone: ${submissionData.phone}`)
    const dateStr = submissionData.date.replace(/-/g, '')
    const timeStr = submissionData.time.replace(/:/g, '')
    const start = `${dateStr}T${timeStr}00`

    // Default 1.5 hour duration
    const startTimeParts = submissionData.time.split(':')
    let endHour = parseInt(startTimeParts[0]) + 1
    let endMin = parseInt(startTimeParts[1]) + 30

    if (endMin >= 60) {
      endHour += 1
      endMin -= 60
    }

    const end = `${dateStr}T${endHour.toString().padStart(2, '0')}${endMin.toString().padStart(2, '0')}00`

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${start}/${end}`
  }

  const getIcsCalendarUrl = () => {
    if (!submissionData) return ''

    const title = 'Sushi Zen Reservation'
    const details = `Reservation Code: ${reservationCode}\nGuests: ${submissionData.guests}\nPhone: ${submissionData.phone}`
    
    // Format: YYYYMMDDTHHMMSS
    const dateStr = submissionData.date.replace(/-/g, '')
    const timeStr = submissionData.time.replace(/:/g, '')
    const start = `${dateStr}T${timeStr}00`
    
    // Default 1.5 hour duration
    const startTimeParts = submissionData.time.split(':')
    let endHour = parseInt(startTimeParts[0]) + 1
    let endMin = parseInt(startTimeParts[1]) + 30
    if (endMin >= 60) {
      endHour += 1
      endMin -= 60
    }
    const end = `${dateStr}T${endHour.toString().padStart(2, '0')}${endMin.toString().padStart(2, '0')}00`

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${details.replace(/\n/g, '\\n')}`,
      'LOCATION:Sushi Zen',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n')

    return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[440px] border-zinc-800 bg-black/95 backdrop-blur-xl text-white rounded-[2.5rem]! p-0 overflow-hidden'>
        <div className='p-8'>
          <DialogHeader className='mb-6'>
            <DialogTitle className='text-3xl font-serif tracking-tight text-white mb-2 text-left'>
              {status === 'success' ? 'Confirmed!' : 'Book a Table'}
            </DialogTitle>
            <DialogDescription className='text-zinc-400 text-left text-base italic'>
              {status === 'success' ? 'Your culinary journey awaits.' : 'Experience the art of Sushi Zen.'}
            </DialogDescription>
          </DialogHeader>

          {status === 'success' ? (
            <div className='space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
              <div className='bg-white/5 border border-white/10 rounded-3xl p-6 text-center'>
                <div className='bg-primary/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <CheckCircle2 className='text-primary size-7' />
                </div>
                <p className='text-zinc-400 text-sm uppercase tracking-widest mb-1'>Reservation Code</p>
                <h3 className='text-4xl font-mono font-bold text-white tracking-tighter'>{reservationCode}</h3>
              </div>

              <div className='grid grid-cols-1 gap-3'>
                <p className='text-zinc-500 text-sm font-medium px-1'>Sync to Calendar</p>
                <div className='grid grid-cols-2 gap-3'>
                  <Button 
                    asChild
                    variant='outline'
                    className='w-full justify-start gap-2 border-white/5 bg-white/5 hover:bg-white/10 text-white rounded-2xl h-12 px-3'
                  >
                    <a href={getGoogleCalendarUrl()} target='_blank' rel='noreferrer'>
                      <CalendarPlus className='size-5 text-primary shrink-0' />
                      <span className='truncate text-xs'>Google</span>
                    </a>
                  </Button>
                  <Button 
                    asChild
                    variant='outline'
                    className='w-full justify-start gap-2 border-white/5 bg-white/5 hover:bg-white/10 text-white rounded-2xl h-12 px-3'
                  >
                    <a href={getIcsCalendarUrl()} download='reservation.ics'>
                      <CalendarPlus className='size-5 text-primary shrink-0' />
                      <span className='truncate text-xs'>Apple / Outlook</span>
                    </a>
                  </Button>
                </div>
              </div>

              <div className='pt-2'>
                <Button 
                  onClick={() => setStatus('idle')} 
                  className='w-full bg-white text-black hover:bg-zinc-200 rounded-2xl h-12 font-semibold transition-all'
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className='space-y-5'>
              <div className='space-y-2'>
                <label className='text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1'>Guest Information</label>
                <Input name='name' placeholder='Your Name' required className='h-12 bg-white/5 border-white/10 rounded-2xl focus:ring-primary' />
                <div className='grid grid-cols-2 gap-3'>
                  <Input name='phone' type='tel' placeholder='Phone' required className='h-12 bg-white/5 border-white/10 rounded-2xl focus:ring-primary' />
                  <Input name='email' type='email' placeholder='Email' required className='h-12 bg-white/5 border-white/10 rounded-2xl focus:ring-primary' />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-xs font-semibold uppercase tracking-wider text-zinc-500 ml-1'>Reservation Details</label>
                <div className='grid grid-cols-2 gap-3'>
                  <Input 
                    name='date' 
                    type='date' 
                    min={today} 
                    required 
                    className='h-12 bg-white/5 border-white/10 rounded-2xl focus:ring-primary appearance-none dark:[color-scheme:dark]' 
                  />
                  <div className='relative'>
                    <select 
                      name='time' 
                      required 
                      className='flex h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none'
                    >
                      <option value='' className='bg-zinc-900'>Select Time</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time} className='bg-zinc-900 text-white'>{time}</option>
                      ))}
                    </select>
                    <Clock className='absolute right-4 top-1/2 -translate-y-1/2 size-4 text-zinc-500 pointer-events-none' />
                  </div>
                </div>
                <select 
                  name='guests' 
                  required 
                  className='flex h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary appearance-none'
                >
                  <option value='' className='bg-zinc-900'>Number of Guests</option>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => (
                    <option key={n} value={n} className='bg-zinc-900'>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                  <option value='12+' className='bg-zinc-900'>12+ Guests</option>
                </select>
              </div>

              {status === 'error' && (
                <div className='bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm text-center'>
                  Something went wrong. Please try again.
                </div>
              )}

              <Button 
                type='submit' 
                disabled={status === 'submitting'}
                className='w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-2xl transition-all shadow-lg shadow-primary/20'
              >
                {status === 'submitting' ? 'Securing your table...' : 'Confirm Reservation'}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
