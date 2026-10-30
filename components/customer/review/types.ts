import type {
  CommentStatus,
  OrderStatus,
  ReviewComment,
} from '@/types/db';

export interface ReviewDraft {
  id: string;
  version: number;
  note: string | null;
  createdAt: string;
  videoUrl: string | null;
  thumbnailUrl: string | null;
}

export interface ReviewAuthor {
  id: string;
  name: string | null;
  avatar_url: string | null;
}

export type ReviewActionResult =
  | {
      ok: true;
      message: string;
      comment?: ReviewComment;
      commentStatus?: CommentStatus;
      orderStatus?: OrderStatus;
    }
  | {
      ok: false;
      message: string;
      fieldErrors?: Record<string, string[]>;
    };
