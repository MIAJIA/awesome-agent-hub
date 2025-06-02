"use client";

import { useState, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MailCheck, AlertTriangle } from 'lucide-react';

export default function NewsletterSubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe. Please try again.');
      }

      setStatus('success');
      // Use message from API if available, otherwise a default success message
      setMessage(data.message || "Thanks for subscribing! We'll be in touch.");
      setEmail(''); // Clear email field on success

    } catch (error) {
      setStatus('error');
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      // Ensure loading status is removed if it was set and an error occurred before it could be unset
      if (status === 'loading' && (status !== 'success' && status !== 'error')) {
        setStatus('idle');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          aria-label="Email for newsletter"
          className="flex-grow bg-gray-700/50 border-gray-600 placeholder-gray-400 text-white"
        />
        <Button
          type="submit"
          disabled={status === 'loading'}
          className="bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap shrink-0"
        >
          {status === 'loading' ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Subscribe
        </Button>
      </div>
      {message && status === 'success' && (
        <div className="flex items-center text-sm text-green-400">
          <MailCheck className="mr-2 h-4 w-4" /> {message}
        </div>
      )}
      {message && status === 'error' && (
        <div className="flex items-center text-sm text-red-400">
          <AlertTriangle className="mr-2 h-4 w-4" /> {message}
        </div>
      )}
    </form>
  );
}