'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import type { CaseStudy, FaqItem, Testimonial } from '@/types/db';
import {
  deleteCaseStudy,
  deleteFaq,
  deleteTestimonial,
  moveFaq,
  saveCaseStudy,
  saveFaq,
  saveTestimonial,
  setCaseStudyPublished,
  setFaqPublished,
  setTestimonialPublished,
} from './actions';

export interface ContentManagerProps {
  testimonials: Testimonial[];
  caseStudies: CaseStudy[];
  faqs: FaqItem[];
}

interface TestimonialDraft {
  id?: string;
  name: string;
  role: string;
  quote: string;
  isPublished: boolean;
}

interface CaseStudyDraft {
  id?: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  isPublished: boolean;
}

interface FaqDraft {
  id?: string;
  question: string;
  answer: string;
  isPublished: boolean;
}

type Task = () => Promise<{ success: boolean; error?: string }>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function ContentManager({ testimonials, caseStudies, faqs }: ContentManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [testimonialDraft, setTestimonialDraft] = useState<TestimonialDraft | null>(null);
  const [caseStudyDraft, setCaseStudyDraft] = useState<CaseStudyDraft | null>(null);
  const [faqDraft, setFaqDraft] = useState<FaqDraft | null>(null);
  const [error, setError] = useState<string | null>(null);

  function run(task: Task, onDone?: () => void) {
    setError(null);
    startTransition(async () => {
      const result = await task();

      if (result.success) {
        onDone?.();
        router.refresh();
      } else {
        setError(result.error ?? 'Something went wrong.');
      }
    });
  }

  function confirmDelete(label: string, task: Task) {
    if (window.confirm(`Delete ${label}? This cannot be undone.`)) {
      run(task);
    }
  }

  const publishBadge = (published: boolean) => (
    <Badge variant={published ? 'success' : 'outline'}>{published ? 'Published' : 'Hidden'}</Badge>
  );

  return (
    <div className="space-y-4">
      {error && !testimonialDraft && !caseStudyDraft && !faqDraft ? (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <Tabs defaultValue="testimonials">
        <TabsList>
          <TabsTrigger value="testimonials">Testimonials ({testimonials.length})</TabsTrigger>
          <TabsTrigger value="case-studies">Case studies ({caseStudies.length})</TabsTrigger>
          <TabsTrigger value="faq">FAQ ({faqs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="testimonials" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => {
                setError(null);
                setTestimonialDraft({ name: '', role: '', quote: '', isPublished: true });
              }}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              New testimonial
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              {testimonials.length === 0 ? (
                <p className="p-8 text-center text-sm text-slate-500">No testimonials yet.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {testimonials.map((item) => (
                    <li key={item.id} className="flex flex-wrap items-start justify-between gap-3 p-4">
                      <div className="min-w-0 max-w-2xl">
                        <p className="font-semibold text-brand-ink">
                          {item.name}
                          {item.role ? (
                            <span className="ml-2 text-xs font-normal text-slate-500">{item.role}</span>
                          ) : null}
                        </p>
                        <p className="mt-1 line-clamp-3 text-sm text-slate-600">{item.quote}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {publishBadge(item.is_published)}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setError(null);
                            setTestimonialDraft({
                              id: item.id,
                              name: item.name,
                              role: item.role ?? '',
                              quote: item.quote,
                              isPublished: item.is_published,
                            });
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isPending}
                          onClick={() =>
                            run(() =>
                              setTestimonialPublished({ id: item.id, isPublished: !item.is_published })
                            )
                          }
                        >
                          {item.is_published ? 'Hide' : 'Publish'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          disabled={isPending}
                          onClick={() =>
                            confirmDelete('this testimonial', () => deleteTestimonial({ id: item.id }))
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="case-studies" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => {
                setError(null);
                setCaseStudyDraft({
                  slug: '',
                  title: '',
                  summary: '',
                  body: '',
                  isPublished: true,
                });
              }}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              New case study
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              {caseStudies.length === 0 ? (
                <p className="p-8 text-center text-sm text-slate-500">No case studies yet.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {caseStudies.map((item) => (
                    <li key={item.id} className="flex flex-wrap items-start justify-between gap-3 p-4">
                      <div className="min-w-0 max-w-2xl">
                        <p className="font-semibold text-brand-ink">{item.title}</p>
                        <p className="text-xs text-slate-400">/case-studies/{item.slug}</p>
                        {item.summary ? (
                          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.summary}</p>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-1">
                        {publishBadge(item.is_published)}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setError(null);
                            setCaseStudyDraft({
                              id: item.id,
                              slug: item.slug,
                              title: item.title,
                              summary: item.summary ?? '',
                              body: item.body ?? '',
                              isPublished: item.is_published,
                            });
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isPending}
                          onClick={() =>
                            run(() =>
                              setCaseStudyPublished({ id: item.id, isPublished: !item.is_published })
                            )
                          }
                        >
                          {item.is_published ? 'Hide' : 'Publish'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          disabled={isPending}
                          onClick={() =>
                            confirmDelete(`"${item.title}"`, () => deleteCaseStudy({ id: item.id }))
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="mt-4 space-y-3">
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => {
                setError(null);
                setFaqDraft({ question: '', answer: '', isPublished: true });
              }}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              New question
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              {faqs.length === 0 ? (
                <p className="p-8 text-center text-sm text-slate-500">No FAQ items yet.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {faqs.map((item, index) => (
                    <li key={item.id} className="flex flex-wrap items-start justify-between gap-3 p-4">
                      <div className="min-w-0 max-w-2xl">
                        <p className="font-semibold text-brand-ink">{item.question}</p>
                        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{item.answer}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {publishBadge(item.is_published)}
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Move up"
                          disabled={isPending || index === 0}
                          onClick={() => run(() => moveFaq({ id: item.id, direction: 'up' }))}
                        >
                          <ArrowUp className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label="Move down"
                          disabled={isPending || index === faqs.length - 1}
                          onClick={() => run(() => moveFaq({ id: item.id, direction: 'down' }))}
                        >
                          <ArrowDown className="h-4 w-4" aria-hidden="true" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setError(null);
                            setFaqDraft({
                              id: item.id,
                              question: item.question,
                              answer: item.answer,
                              isPublished: item.is_published,
                            });
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isPending}
                          onClick={() =>
                            run(() => setFaqPublished({ id: item.id, isPublished: !item.is_published }))
                          }
                        >
                          {item.is_published ? 'Hide' : 'Publish'}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          disabled={isPending}
                          onClick={() => confirmDelete('this question', () => deleteFaq({ id: item.id }))}
                        >
                          Delete
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog
        open={testimonialDraft !== null}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setTestimonialDraft(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{testimonialDraft?.id ? 'Edit testimonial' : 'New testimonial'}</DialogTitle>
          </DialogHeader>
          {testimonialDraft ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="t-name" className="text-sm font-medium text-slate-700">
                    Name
                  </label>
                  <Input
                    id="t-name"
                    value={testimonialDraft.name}
                    onChange={(event) =>
                      setTestimonialDraft({ ...testimonialDraft, name: event.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="t-role" className="text-sm font-medium text-slate-700">
                    Role (optional)
                  </label>
                  <Input
                    id="t-role"
                    value={testimonialDraft.role}
                    onChange={(event) =>
                      setTestimonialDraft({ ...testimonialDraft, role: event.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="t-quote" className="text-sm font-medium text-slate-700">
                  Quote
                </label>
                <Textarea
                  id="t-quote"
                  value={testimonialDraft.quote}
                  onChange={(event) =>
                    setTestimonialDraft({ ...testimonialDraft, quote: event.target.value })
                  }
                  className="mt-1"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={testimonialDraft.isPublished}
                  onChange={(event) =>
                    setTestimonialDraft({ ...testimonialDraft, isPublished: event.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />
                Published on the website
              </label>
              {error ? (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              ) : null}
              <DialogFooter>
                <Button variant="outline" onClick={() => setTestimonialDraft(null)}>
                  Cancel
                </Button>
                <Button
                  isLoading={isPending}
                  onClick={() =>
                    run(
                      () =>
                        saveTestimonial({
                          id: testimonialDraft.id,
                          name: testimonialDraft.name,
                          role: testimonialDraft.role.trim() || null,
                          quote: testimonialDraft.quote,
                          isPublished: testimonialDraft.isPublished,
                        }),
                      () => setTestimonialDraft(null)
                    )
                  }
                >
                  Save
                </Button>
              </DialogFooter>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={caseStudyDraft !== null}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setCaseStudyDraft(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{caseStudyDraft?.id ? 'Edit case study' : 'New case study'}</DialogTitle>
          </DialogHeader>
          {caseStudyDraft ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="c-title" className="text-sm font-medium text-slate-700">
                  Title
                </label>
                <Input
                  id="c-title"
                  value={caseStudyDraft.title}
                  onChange={(event) => {
                    const title = event.target.value;

                    setCaseStudyDraft({
                      ...caseStudyDraft,
                      title,
                      slug:
                        caseStudyDraft.id || caseStudyDraft.slug !== slugify(caseStudyDraft.title)
                          ? caseStudyDraft.slug
                          : slugify(title),
                    });
                  }}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="c-slug" className="text-sm font-medium text-slate-700">
                  Slug (web address)
                </label>
                <Input
                  id="c-slug"
                  value={caseStudyDraft.slug}
                  onChange={(event) =>
                    setCaseStudyDraft({ ...caseStudyDraft, slug: event.target.value.toLowerCase() })
                  }
                  className="mt-1 font-mono"
                />
              </div>
              <div>
                <label htmlFor="c-summary" className="text-sm font-medium text-slate-700">
                  Summary
                </label>
                <Textarea
                  id="c-summary"
                  value={caseStudyDraft.summary}
                  onChange={(event) =>
                    setCaseStudyDraft({ ...caseStudyDraft, summary: event.target.value })
                  }
                  className="mt-1 min-h-[80px]"
                />
              </div>
              <div>
                <label htmlFor="c-body" className="text-sm font-medium text-slate-700">
                  Full story
                </label>
                <Textarea
                  id="c-body"
                  value={caseStudyDraft.body}
                  onChange={(event) => setCaseStudyDraft({ ...caseStudyDraft, body: event.target.value })}
                  className="mt-1 min-h-[160px]"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={caseStudyDraft.isPublished}
                  onChange={(event) =>
                    setCaseStudyDraft({ ...caseStudyDraft, isPublished: event.target.checked })
                  }
                  className="h-4 w-4 rounded border-slate-300"
                />
                Published on the website
              </label>
              {error ? (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              ) : null}
              <DialogFooter>
                <Button variant="outline" onClick={() => setCaseStudyDraft(null)}>
                  Cancel
                </Button>
                <Button
                  isLoading={isPending}
                  onClick={() =>
                    run(
                      () =>
                        saveCaseStudy({
                          id: caseStudyDraft.id,
                          slug: caseStudyDraft.slug,
                          title: caseStudyDraft.title,
                          summary: caseStudyDraft.summary.trim() || null,
                          body: caseStudyDraft.body.trim() || null,
                          isPublished: caseStudyDraft.isPublished,
                        }),
                      () => setCaseStudyDraft(null)
                    )
                  }
                >
                  Save
                </Button>
              </DialogFooter>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={faqDraft !== null}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setFaqDraft(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{faqDraft?.id ? 'Edit question' : 'New question'}</DialogTitle>
          </DialogHeader>
          {faqDraft ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="f-question" className="text-sm font-medium text-slate-700">
                  Question
                </label>
                <Input
                  id="f-question"
                  value={faqDraft.question}
                  onChange={(event) => setFaqDraft({ ...faqDraft, question: event.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="f-answer" className="text-sm font-medium text-slate-700">
                  Answer
                </label>
                <Textarea
                  id="f-answer"
                  value={faqDraft.answer}
                  onChange={(event) => setFaqDraft({ ...faqDraft, answer: event.target.value })}
                  className="mt-1"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={faqDraft.isPublished}
                  onChange={(event) => setFaqDraft({ ...faqDraft, isPublished: event.target.checked })}
                  className="h-4 w-4 rounded border-slate-300"
                />
                Published on the website
              </label>
              {error ? (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              ) : null}
              <DialogFooter>
                <Button variant="outline" onClick={() => setFaqDraft(null)}>
                  Cancel
                </Button>
                <Button
                  isLoading={isPending}
                  onClick={() =>
                    run(
                      () =>
                        saveFaq({
                          id: faqDraft.id,
                          question: faqDraft.question,
                          answer: faqDraft.answer,
                          isPublished: faqDraft.isPublished,
                        }),
                      () => setFaqDraft(null)
                    )
                  }
                >
                  Save
                </Button>
              </DialogFooter>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
