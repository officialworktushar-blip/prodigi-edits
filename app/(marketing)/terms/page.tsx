import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { BRAND_NAME, SUPPORT_EMAIL } from '@/lib/config';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = {
  title: `Terms — ${BRAND_NAME}`,
  description:
    'The terms that govern accounts, orders, payments, revisions, deliverables, and acceptable use of the platform.',
};

function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold tracking-tight text-brand-ink sm:text-xl">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600">
        {children}
      </div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-indigo-50/80 via-blue-50/40 to-transparent"
        />
        <div className="relative mx-auto max-w-screen-1200 px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8">
          <PageHeader
            eyebrow="Legal"
            title="Terms that keep the work clear"
            highlight="clear"
            description="The rules for using the platform, placing orders, reviewing edits, and receiving final files."
          />
          <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
            Effective October 30, 2026
          </p>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-screen-1200 px-4 pb-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-10">
            <div className="rounded-2xl border border-slate-200 bg-brand-surface p-6 text-sm leading-7 text-slate-600">
              These terms are an agreement between you and {BRAND_NAME}. By
              creating an account, placing an order, or using the platform, you
              accept these terms. If you are using the service for an
              organization, you confirm that you have authority to accept them
              on its behalf.
            </div>

            <LegalSection title="Accounts and workspaces">
              <p>
                You are responsible for the accuracy of your account details,
                for keeping your login secure, and for activity performed under
                your account. Workspace owners are responsible for the people
                they invite and for the permissions they grant. Tell us promptly
                if you believe access has been compromised.
              </p>
            </LegalSection>

            <LegalSection title="Orders and briefs">
              <p>
                An order begins when you submit a complete brief and the
                required footage or access. The brief should describe the
                audience, length, format, deadline, and any brand requirements.
                We may ask clarifying questions before work starts. If the
                materials are incomplete, the schedule may change.
              </p>
              <p>
                You confirm that you have the rights to use the footage, music,
                images, names, and other materials you provide. You are
                responsible for any permissions required from third parties.
              </p>
            </LegalSection>

            <LegalSection title="Pricing and payment">
              <p>
                Prices are shown in US dollars and may change for future orders.
                The price that applies to an order is the price shown when the
                order is confirmed. Packages, channel plans, and add-ons may have
                separate minimum commitments or billing periods.
              </p>
              <p>
                Payments are processed by a third-party provider. You authorize
                the applicable charges when you complete checkout. Late or failed
                payments may pause production or access until the balance is
                resolved.
              </p>
            </LegalSection>

            <LegalSection title="Turnaround and scheduling">
              <p>
                Turnaround estimates begin when we have the complete footage,
                brief, and any required access. Review delays, missing files, or
                material changes to the brief can extend the schedule. We will
                tell you when a change affects the expected delivery date.
              </p>
            </LegalSection>

            <LegalSection title="Revisions">
              <p>
                Packages include the revision rounds described at checkout or in
                the plan details. Revisions are for refining the agreed
                direction, not for replacing the brief with a new concept. We
                will explain when a request falls outside the included scope and
                what it would cost to take on.
              </p>
            </LegalSection>

            <LegalSection title="Your content">
              <p>
                You retain ownership of the raw footage and other materials you
                provide. You grant us a limited license to store, reproduce,
                edit, and share those materials as needed to deliver the order
                and support your account.
              </p>
              <p>
                You are responsible for the content you upload and for ensuring
                it does not violate law, privacy rights, intellectual property
                rights, or the rights of another person.
              </p>
            </LegalSection>

            <LegalSection title="Deliverables and ownership">
              <p>
                Once an order is paid in full, you receive the rights to use the
                final deliverables for the purposes described in your order,
                subject to any third-party licenses for music, stock footage, or
                other assets. We retain ownership of our pre-existing tools,
                templates, workflows, and internal project files.
              </p>
              <p>
                Unless you give permission, we will not publish your finished
                work as a public case study.
              </p>
            </LegalSection>

            <LegalSection title="Acceptable use">
              <p>
                Do not use the platform to upload or request content that is
                unlawful, abusive, deceptive, infringing, or designed to harm
                another person. Do not attempt to disrupt the service, access
                another workspace, bypass access controls, or use automated
                tools in a way that creates an unreasonable load.
              </p>
            </LegalSection>

            <LegalSection title="Confidentiality">
              <p>
                We treat unreleased footage and project details as private. We
                limit access to the people working on your order and the service
                providers needed to operate the platform. If you need a separate
                confidentiality agreement for sensitive material, contact us
                before uploading it.
              </p>
            </LegalSection>

            <LegalSection title="Cancellations and refunds">
              <p>
                You may cancel an order before production begins. Once editing
                has started, cancellation may be subject to the work completed
                and any third-party costs already incurred. Subscription plans
                follow the minimum term shown at checkout. Contact us promptly if
                you believe a charge is incorrect so we can review it.
              </p>
            </LegalSection>

            <LegalSection title="Disclaimers">
              <p>
                The platform is provided on an as-available basis. We work to
                keep it reliable, but we do not guarantee uninterrupted access,
                a specific business result, or that every third-party service
                will remain available. To the extent permitted by law, the
                service is provided without warranties beyond those that cannot
                be excluded.
              </p>
            </LegalSection>

            <LegalSection title="Limitation of liability">
              <p>
                To the extent permitted by law, {BRAND_NAME} will not be liable
                for indirect, incidental, special, consequential, or punitive
                damages, or for lost profits, revenue, data, or goodwill. Our
                total liability for a claim connected to an order will not
                exceed the amount you paid for that order, except where the law
                does not allow that limit.
              </p>
            </LegalSection>

            <LegalSection title="Suspension and termination">
              <p>
                We may suspend or terminate access if an account violates these
                terms, creates a security or legal risk, or has an unresolved
                payment issue. You may stop using the platform at any time.
                Obligations that by their nature should survive termination,
                including payment and ownership provisions, will continue.
              </p>
            </LegalSection>

            <LegalSection title="Changes to these terms">
              <p>
                We may update these terms as the service changes. The revised
                version applies when it is posted, and we will update the
                effective date. If a change materially affects an active order,
                we will make a reasonable effort to notify you.
              </p>
            </LegalSection>

            <LegalSection title="Contact">
              <p>
                Questions about these terms can be sent to{' '}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="font-semibold text-brand-indigo underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
                >
                  {SUPPORT_EMAIL}
                </a>
                . You can also use the{' '}
                <Link
                  href="/contact"
                  className="font-semibold text-brand-indigo underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
                >
                  contact form
                </Link>
                .
              </p>
            </LegalSection>
          </div>
        </div>
      </section>
    </>
  );
}
