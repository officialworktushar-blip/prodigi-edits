'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import { Logo } from '@/components/shared/logo';
import { PageHeader } from '@/components/shared/page-header';
import { FadeIn } from '@/components/shared/fade-in';

function ContactForm({ onSuccess }: { onSuccess?: () => void }) {
  const [values, setValues] = useState({ name: '', email: '', message: '' });
  const toast = useToast();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!values.name.trim()) errs.name = 'Name is required';
    if (!values.email.trim()) errs.email = 'Email is required';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) errs.email = 'Invalid email';
    if (!values.message.trim()) errs.message = 'Message is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      toast.success('Message sent!');
      router.push('/contact');
      if (onSuccess) onSuccess();
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <FadeIn delay={0}>
      <div className="mx-auto max-w-screen-1200px px-6 py-12">
        <PageHeader headline="Contact CutCrew" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
            <Logo />
            <h3 className="mt-5 text-lg font-semibold text-slate-900">Get in touch</h3>
            <p className="mt-2 text-sm text-slate-500">Whether you want an estimate, a custom workflow, or a demo — reply below and we'll get back within one business day.</p>
            <ul className="mt-5 space-y-2 text-sm text-slate-500">
              <li className="flex items-center gap-2"><span>📧</span> support@cutcrew.com</li>
              <li className="flex items-center gap-2"><span>🐦</span> @CutCrew on X / Bluesky</li>
              <li className="flex items-center gap-2"><span>💬</span> Drop us a DM</li>
            </ul>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
              <h3 className="text-lg font-semibold text-slate-900">Send a message</h3>
              <div className="mt-6 space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={values.name}
                  onChange={(e) => setValues({ ...values, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                <input
                  type="email"
                  placeholder="Your email"
                  value={values.email}
                  onChange={(e) => setValues({ ...values, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                <textarea
                  placeholder="Tell us about your project…"
                  rows={5}
                  value={values.message}
                  onChange={(e) => setValues({ ...values, message: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
                />
                {errors.message && <p className="text-sm text-red-500">{errors.message}</p>}
                <button type="submit" className="bg-primary-gradient text-white font-semibold rounded-full px-6 py-3 hover:opacity-90 transition-opacity shadow-soft">
                  Send message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

export default ContactForm;