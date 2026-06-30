import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MessageSquare, Mail, HelpCircle, CheckCircle, AlertCircle } from 'lucide-react';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { PageWrapper } from '../../components/layout/PageWrapper';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xbdvgjey';

const feedbackSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  email: z.string().email('Invalid email address').or(z.literal('')),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export const FeedbackPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    'General Feedback',
    'Bug Report',
    'Code Not Working',
    'Expired Code Issue',
    'Sharing Issue',
    'Performance Issue',
    'Website Performance',
    'Feature Request',
    'UI / UX Suggestion',
    'Support / Donation',
    'Other'
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      category: 'General Feedback',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
        reset();
      } else {
        const errData = await response.json();
        setError(errData.error || 'Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      setError('A network error occurred. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper className="max-w-md" animate>
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">Send Feedback</h1>
          <p className="text-sm text-secondary mt-1">We read every message and bug report.</p>
        </div>

        {isSuccess ? (
          <Card className="flex flex-col items-center gap-5 p-8 border border-emerald-500/10 bg-emerald-500/5 text-center animate-scale-in">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-primary">Thank you!</h3>
              <p className="text-sm text-secondary mt-1 leading-relaxed">
                Your feedback has been successfully submitted. We appreciate your support.
              </p>
            </div>
            <Button variant="primary" className="w-full" onClick={() => setIsSuccess(false)}>
              Send Another Message
            </Button>
          </Card>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            <Card className="flex flex-col gap-5 p-6 md:p-8">
              {/* Category Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-secondary tracking-wider uppercase ml-1 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" /> Category
                </label>
                <select
                  className="input-base cursor-pointer"
                  disabled={isSubmitting}
                  {...register('category')}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category?.message && (
                  <span className="text-xs text-red-500 font-medium ml-1">
                    {errors.category.message}
                  </span>
                )}
              </div>

              {/* Email Address */}
              <Input
                label="Email (Optional)"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                disabled={isSubmitting}
                {...register('email')}
              />

              {/* Message content */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-secondary tracking-wider uppercase ml-1 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Message
                </label>
                <textarea
                  placeholder="Enter details..."
                  className={`input-base min-h-[140px] resize-none ${
                    errors.message ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]' : ''
                  }`}
                  disabled={isSubmitting}
                  {...register('message')}
                />
                {errors.message?.message && (
                  <span className="text-xs text-red-500 font-medium ml-1">
                    {errors.message.message}
                  </span>
                )}
              </div>
            </Card>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full font-bold shadow-glow"
            >
              Submit Feedback
            </Button>
          </form>
        )}
      </div>
    </PageWrapper>
  );
};
