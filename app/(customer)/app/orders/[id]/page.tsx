import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { StatusBadge } from '@/components/shared/status-badge';
import { OrderActivity } from '@/components/customer/orders/order-activity';
import { OrderDeliverables } from '@/components/customer/orders/order-deliverables';
import {
  OrderDetailTabs,
  isOrderDetailTab,
  type OrderDetailTab,
} from '@/components/customer/orders/order-detail-tabs';
import { OrderFootage } from '@/components/customer/orders/order-footage';
import { OrderOverview } from '@/components/customer/orders/order-overview';
import {
  ORDER_KIND_LABELS,
  formatDate,
  readParam,
} from '@/components/customer/orders/order-utils';
import { ReviewWorkspace } from '@/components/customer/review/review-workspace';
import {
  getCustomerOrder,
  getDraftReviewComments,
  getOrderDeliverables,
  getOrderDrafts,
  getOrderFootage,
  getOrderMessages,
  getOrderTeamProfiles,
} from '@/lib/data/customer';
import { requireUser } from '@/lib/guards';
import {
  DELIVERABLES_BUCKET,
  DRAFTS_BUCKET,
  createDownloadUrl,
} from '@/lib/storage';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Order details',
  description: 'Track progress, files, and activity for your video order.',
};

interface OrderDetailPageProps {
  params: {
    id: string;
  };
  searchParams: {
    tab?: string | string[];
  };
}

function parseTab(value: string): OrderDetailTab {
  return isOrderDetailTab(value) ? value : 'overview';
}

export default async function OrderDetailPage({
  params,
  searchParams,
}: OrderDetailPageProps) {
  const { user } = await requireUser();
  const order = await getCustomerOrder(params.id);

  if (!order) {
    notFound();
  }

  const [footage, deliverables, messages, drafts] = await Promise.all([
    getOrderFootage(order.id),
    getOrderDeliverables(order.id),
    getOrderMessages(order.id),
    getOrderDrafts(order.id),
  ]);

  const comments = await getDraftReviewComments(
    drafts.map((draft) => draft.id)
  );

  const [signedDeliverables, signedDrafts] = await Promise.all([
    Promise.all(
      deliverables.map(async (deliverable) => {
        if (!deliverable.path?.trim()) {
          return { ...deliverable, downloadUrl: null };
        }

        try {
          const downloadUrl = await createDownloadUrl(
            deliverable.path,
            3600,
            DELIVERABLES_BUCKET
          );

          return { ...deliverable, downloadUrl };
        } catch {
          return { ...deliverable, downloadUrl: null };
        }
      })
    ),
    Promise.all(
      drafts.map(async (draft) => {
        let videoUrl: string | null = null;
        let thumbnailUrl: string | null = null;

        if (draft.path?.trim()) {
          try {
            videoUrl = await createDownloadUrl(
              draft.path,
              3600,
              DRAFTS_BUCKET
            );
          } catch {
            videoUrl = null;
          }
        }

        if (draft.thumbnail_path?.trim()) {
          try {
            thumbnailUrl = await createDownloadUrl(
              draft.thumbnail_path,
              3600,
              DRAFTS_BUCKET
            );
          } catch {
            thumbnailUrl = null;
          }
        }

        return {
          id: draft.id,
          version: draft.version,
          note: draft.note,
          createdAt: draft.created_at,
          videoUrl,
          thumbnailUrl,
        };
      })
    ),
  ]);

  const teamIds = [
    order.manager_id,
    order.editor_id,
    order.thumbnail_artist_id,
  ];
  const profiles = await getOrderTeamProfiles([
    ...teamIds,
    ...comments.map((comment) => comment.author_id),
  ]);
  const team = profiles.filter((profile) =>
    teamIds.includes(profile.id)
  );

  const activeTab = parseTab(readParam(searchParams.tab));

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/app/orders"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-indigo focus-visible:ring-offset-2"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Back to orders
        </Link>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
              Order #{order.order_no}
            </p>
            <h1 className="mt-2 break-words text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
              {order.title}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <StatusBadge status={order.status} />
              <span aria-hidden="true">·</span>
              <span>{ORDER_KIND_LABELS[order.kind]}</span>
              <span aria-hidden="true">·</span>
              <span>Created {formatDate(order.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      <OrderDetailTabs orderId={order.id} activeTab={activeTab} />

      {activeTab === 'overview' ? (
        <OrderOverview order={order} team={team} />
      ) : null}

      {activeTab === 'footage' ? (
        <OrderFootage files={footage} />
      ) : null}

      {activeTab === 'review' ? (
        <ReviewWorkspace
          orderId={order.id}
          orderStatus={order.status}
          drafts={signedDrafts}
          comments={comments}
          authors={profiles}
          currentUserId={user.id}
        />
      ) : null}

      {activeTab === 'deliverables' ? (
        <OrderDeliverables deliverables={signedDeliverables} />
      ) : null}

      {activeTab === 'activity' ? (
        <OrderActivity
          messages={messages}
          currentUserId={user.id}
          team={team}
        />
      ) : null}
    </div>
  );
}
