import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { BRAND_NAME, SUPPORT_EMAIL } from '@/lib/config';
import { PageHeader } from '@/components/shared/page-header';

export const metadata: Metadata = {
  title: `Privacy — ${BRAND_NAME}`,
  description:
    'How the platform collects, uses, stores, and protects account information, project files, and order data.',
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

export default function PrivacyPage() {
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
            title="Privacy, without the fog"
            highlight="fog"
            description="What we collect, why we need it, and the choices you have over your information and project files."
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
              This policy describes how {BRAND_NAME} handles information when
              you visit the public site, create an account, place an order, or
              contact the team. It applies to the platform and the services
              delivered through it.
            </div>

            <LegalSection title="Information we collect">
              <p>
                We collect the details you provide directly, including your
                name, email address, account credentials, workspace details, and
                the content of messages you send. When you place an order, we
                also collect the brief, reference links, footage, draft notes,
                approval decisions, and delivery preferences you share.
              </p>
              <p>
                We receive limited technical information automatically, such as
                browser type, device information, approximate location derived
                from an IP address, and basic usage events needed to keep the
                service secure and reliable.
              </p>
            </LegalSection>

            <LegalSection title="How we use information">
              <p>
                We use information to create and manage accounts, prepare and
                deliver orders, respond to support requests, process payments,
                send service messages, prevent misuse, and improve the editing
                workflow. We may also use aggregated, de-identified information
                to understand which parts of the platform need work.
              </p>
              <p>
                We do not sell personal information. We do not use your footage
                or project files in public marketing unless you give us
                permission to do so.
              </p>
            </LegalSection>

            <LegalSection title="Project files and footage">
              <p>
                Footage, drafts, comments, and deliverables are stored in
                private project spaces and made available to the people who need
                them to complete your order. Access is limited by account role
                and workspace membership. You are responsible for having the
                rights and permissions needed to share any material you upload.
              </p>
              <p>
                You can request deletion of project files when they are no
                longer needed. Some records may be retained for billing, legal,
                security, or dispute-resolution purposes.
              </p>
            </LegalSection>

            <LegalSection title="Payments">
              <p>
                Payments are processed by a third-party payment provider. We
                receive transaction details such as the amount, status, and a
                limited billing identifier. We do not store full card numbers or
                security codes on our own systems.
              </p>
            </LegalSection>

            <LegalSection title="Sharing information">
              <p>
                We share information with service providers that help us operate
                the platform, including hosting, storage, authentication,
                payment processing, email delivery, and error monitoring. These
                providers receive only the information needed to perform their
                work and are expected to protect it.
              </p>
              <p>
                We may disclose information if required by law, to protect the
                rights or safety of the platform or others, or as part of a
                merger, acquisition, or transfer of the business. We will take
                reasonable steps to ensure a successor handles information
                consistently with this policy.
              </p>
            </LegalSection>

            <LegalSection title="Cookies and similar technologies">
              <p>
                We use cookies and similar technologies to keep you signed in,
                remember preferences, protect forms, and understand basic usage.
                You can control cookies through your browser, but blocking
                essential cookies may prevent parts of the platform from working
                correctly.
              </p>
            </LegalSection>

            <LegalSection title="Retention">
              <p>
                We retain account and order records for as long as your account
                is active and for a reasonable period afterward to meet legal,
                accounting, security, and operational needs. Project files may
                be retained for a limited period after delivery so revisions and
                re-downloads remain possible.
              </p>
            </LegalSection>

            <LegalSection title="Security">
              <p>
                We use access controls, private storage, encryption in transit,
                and other safeguards designed to protect information. No system
                is completely secure, so we cannot promise absolute security. If
                you believe your account or files have been compromised, contact
                us promptly.
              </p>
            </LegalSection>

            <LegalSection title="Your choices">
              <p>
                You can update account details from your workspace, request a
                copy of your information, ask us to correct inaccurate details,
                or request deletion where applicable. You can also opt out of
                non-essential product updates while continuing to receive
                messages about active orders and account security.
              </p>
              <p>
                If your region provides additional privacy rights, contact us
                and we will review the request under the applicable rules.
              </p>
            </LegalSection>

            <LegalSection title="Children">
              <p>
                The platform is intended for business and professional use and
                is not directed to children under 16. We do not knowingly collect
                personal information from children. If you believe a child has
                provided information, contact us so we can review and remove it.
              </p>
            </LegalSection>

            <LegalSection title="International processing">
              <p>
                Our service providers may process information in countries other
                than yours. Where required, we use appropriate safeguards for
                those transfers. Data protection rules may differ from the rules
                in your location.
              </p>
            </LegalSection>

            <LegalSection title="Changes to this policy">
              <p>
                We may update this policy as the service changes. When we make a
                material change, we will update the effective date and provide a
                notice through the platform or by email where appropriate. The
                revised policy applies when it is posted.
              </p>
            </LegalSection>

            <LegalSection title="Contact">
              <p>
                Questions about this policy or a privacy request can be sent to{' '}
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
