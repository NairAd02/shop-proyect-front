import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'

export default function ModalPasswordResetEmail(props: {
  findUserWithEmail: (email: string) => Promise<void>
}) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')


    // Basic email validation
    if (!email.includes('@')) {
      setError('Please enter a valid email address')
      setIsSubmitting(false)
      return
    }

    // se indica el estado de carga
    setIsSubmitting(true)
    await props.findUserWithEmail(email)
    // cuando termine el proceso entonces de indica la finalización de la carga
    setIsSubmitting(false)

  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-2xl rounded-lg p-8"
    >
      <div className="flex justify-center mb-8">
        <Mail className="h-12 w-12 text-indigo-600" />
      </div>
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-4">
        Verify Your Email
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Please enter the email address associated with your account. We'll send you instructions to reset your password.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
        </Button>
      </form>
    </motion.div>
  )
}
