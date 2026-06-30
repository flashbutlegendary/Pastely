import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Clock, Eye, Keyboard, Type, AlertCircle } from 'lucide-react';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { useDragDrop } from '../../hooks/useDragDrop';
import { encryptContent } from '../../lib/crypto';
import { api } from '../../lib/api';
import { addHistoryEntry } from '../../lib/history';
import { validateCustomCode } from '../../lib/codegen';
import { ExpiryOption, MaxViewsOption } from '../../types/paste';

// Max allowed character count
const MAX_CHARACTERS = 100000;
// Max allowed bytes (100KB)
const MAX_BYTES = 102400;

// Schema for form validation
const pasteSchema = z.object({
  title: z.string().max(100, 'Title cannot exceed 100 characters').optional(),
  content: z.string()
    .min(1, 'Content is required')
    .max(MAX_CHARACTERS, `Content cannot exceed ${MAX_CHARACTERS.toLocaleString()} characters`),
  expiresIn: z.enum(['10m', '1h', '24h', '7d', 'never'] as const),
  maxViews: z.union([z.literal(1), z.literal(5), z.literal(10), z.literal(25), z.null()]),
  customCode: z.string()
    .max(8, 'Custom code cannot exceed 8 characters')
    .optional(),
});

type PasteFormValues = z.infer<typeof pasteSchema>;

export const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  
  // Custom code checking states
  const [codeChecking, setCodeChecking] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [codeSuccess, setCodeSuccess] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PasteFormValues>({
    resolver: zodResolver(pasteSchema),
    defaultValues: {
      title: '',
      content: '',
      expiresIn: '24h',
      maxViews: null,
      customCode: '',
    },
  });

  const contentValue = watch('content') || '';
  const customCodeValue = watch('customCode') || '';
  const characterCount = contentValue.length;

  // Handle drag and drop text import
  const onTextDrop = (text: string) => {
    // Truncate to maximum characters
    const truncatedText = text.slice(0, MAX_CHARACTERS);
    setValue('content', truncatedText, { shouldValidate: true });
  };
  const { isDragging, dragHandlers } = useDragDrop({ onTextDrop });

  // Debounced check for custom code availability
  useEffect(() => {
    if (!customCodeValue) {
      setCodeError(null);
      setCodeSuccess(false);
      return;
    }

    const trimmed = customCodeValue.toUpperCase().trim();
    const validation = validateCustomCode(trimmed);
    if (!validation.isValid) {
      setCodeError(validation.error || 'Invalid code format.');
      setCodeSuccess(false);
      return;
    }

    setCodeChecking(true);
    setCodeError(null);
    setCodeSuccess(false);

    const timer = setTimeout(async () => {
      try {
        const isAvailable = await api.checkCodeAvailability(trimmed);
        if (isAvailable) {
          setCodeSuccess(true);
          setCodeError(null);
        } else {
          setCodeError('This code is already taken.');
          setCodeSuccess(false);
        }
      } catch (err) {
        setCodeError('Failed to verify code availability.');
      } finally {
        setCodeChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [customCodeValue]);

  // Form submission handler
  const onSubmit = async (values: PasteFormValues) => {
    setGlobalError(null);
    const byteSize = new TextEncoder().encode(values.content).length;

    if (byteSize > MAX_BYTES) {
      setGlobalError(`Payload is too large. Max size allowed is 100 KB (your paste is ${(byteSize / 1024).toFixed(1)} KB).`);
      return;
    }

    if (values.customCode && (codeError || codeChecking)) {
      return; // Prevent submission if custom code has error or checking is in progress
    }

    setIsSubmitting(true);

    try {
      // 1. Perform client-side encryption
      const { encryptedPayload, iv, keyBase64 } = await encryptContent(values.content);

      // 2. Call backend API
      const response = await api.createPaste({
        code: values.customCode ? values.customCode.toUpperCase().trim() : undefined,
        title: values.title || undefined,
        encryptedPayload,
        iv,
        contentType: 'text/plain',
        size: byteSize,
        expiresIn: values.expiresIn,
        maxViews: values.maxViews,
      });

      // 3. Save to browser local history
      const shareUrl = `${window.location.origin}/view/${response.code}#k=${keyBase64}`;
      addHistoryEntry({
        code: response.code,
        title: values.title || null,
        expiresAt: response.expiresAt,
        deleteToken: response.deleteToken,
        shareUrl,
      });

      // 4. Navigate to success page with key fragment
      navigate(`/created/${response.code}#k=${keyBase64}`);
    } catch (err: any) {
      console.error('Failed to create paste', err);
      if (err.code === 'CODE_TAKEN') {
        setCodeError('This code is already taken.');
      } else {
        setGlobalError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper className="max-w-4xl" animate>
      <div className="flex flex-col gap-6" {...dragHandlers}>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight">Create Paste</h1>
          <p className="text-sm text-secondary mt-1">Your content is fully encrypted in the browser before leaving.</p>
        </div>

        {globalError && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2.5 animate-slide-up">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Creation Failed:</span> {globalError}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <Card className="flex flex-col gap-5 p-6 md:p-8">
            {/* Title field */}
            <Input
              label="Title (Optional)"
              placeholder="Give your paste a title..."
              leftIcon={<Type className="w-4 h-4" />}
              error={errors.title?.message}
              disabled={isSubmitting}
              {...register('title')}
            />

            {/* Text editor */}
            <Textarea
              label="Content"
              placeholder="Paste or drop your text, code, links or notes here..."
              characterCount={characterCount}
              maxLength={MAX_CHARACTERS}
              isDragging={isDragging}
              error={errors.content?.message}
              disabled={isSubmitting}
              {...register('content')}
            />

            {/* Configuration Selects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Expiration selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-secondary tracking-wider uppercase ml-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Expiration
                </label>
                <select
                  className="input-base cursor-pointer"
                  disabled={isSubmitting}
                  {...register('expiresIn')}
                >
                  <option value="10m">10 Minutes</option>
                  <option value="1h">1 Hour</option>
                  <option value="24h">24 Hours</option>
                  <option value="7d">7 Days</option>
                  <option value="never">Never (Keep Forever)</option>
                </select>
              </div>

              {/* Max Views selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-secondary tracking-wider uppercase ml-1 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> Expiry by Views
                </label>
                <Controller
                  name="maxViews"
                  control={control}
                  render={({ field }) => (
                    <select
                      className="input-base cursor-pointer"
                      disabled={isSubmitting}
                      value={field.value === null ? 'null' : field.value}
                      onChange={(e) => {
                        const val = e.target.value;
                        field.onChange(val === 'null' ? null : parseInt(val, 10));
                      }}
                    >
                      <option value="null">Unlimited (Depends on Expiration)</option>
                      <option value="1">1 View (Burn after read)</option>
                      <option value="5">5 Views</option>
                      <option value="10">10 Views</option>
                      <option value="25">25 Views</option>
                    </select>
                  )}
                />
              </div>
            </div>

            {/* Custom Code field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-secondary tracking-wider uppercase ml-1 flex items-center gap-1.5">
                <Keyboard className="w-3.5 h-3.5" /> Custom Code (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. N7KP, TX8D"
                  className={`input-base uppercase tracking-wider ${
                    codeError
                      ? 'border-red-500/50 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]'
                      : codeSuccess
                      ? 'border-emerald-500/50 focus:border-emerald-500 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.12)]'
                      : ''
                  }`}
                  disabled={isSubmitting}
                  {...register('customCode')}
                />
                
                {/* Visual feedback helper status inside input */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center text-xs font-semibold">
                  {codeChecking && <span className="text-muted animate-pulse">Checking...</span>}
                  {!codeChecking && codeSuccess && <span className="text-emerald-400">Available</span>}
                  {!codeChecking && codeError && <span className="text-red-400">{codeError}</span>}
                </div>
              </div>
              <span className="text-[10px] text-muted ml-1">
                4 to 8 characters. Safe alphabet only (excludes easily confused letters like O, 0, I, 1, L).
              </span>
            </div>
          </Card>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full font-bold shadow-glow text-base py-4"
          >
            Encrypt & Generate Code
          </Button>
        </form>
      </div>
    </PageWrapper>
  );
};
