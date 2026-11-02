import type { ComponentType } from 'react';
import { LongFormMockup } from './LongFormMockup';
import { ShortFormMockup } from './ShortFormMockup';
import { ChannelManagementMockup } from './ChannelManagementMockup';
import { YouTubersMockup } from './YouTubersMockup';
import { BusinessesMockup } from './BusinessesMockup';
import { PodcastersMockup } from './PodcastersMockup';
import { RealtorsMockup } from './RealtorsMockup';
import { CourseCreatorsMockup } from './CourseCreatorsMockup';
import { DoctorsMockup } from './DoctorsMockup';
import { LawyersMockup } from './LawyersMockup';

export const heroMockups: Record<string, ComponentType> = {
  'long-form': LongFormMockup,
  'short-form': ShortFormMockup,
  'channel-management': ChannelManagementMockup,
  youtubers: YouTubersMockup,
  businesses: BusinessesMockup,
  podcasters: PodcastersMockup,
  realtors: RealtorsMockup,
  'course-creators': CourseCreatorsMockup,
  doctors: DoctorsMockup,
  lawyers: LawyersMockup,
};

export interface HeroMockupProps {
  slug: string;
}

export function HeroMockup({ slug }: HeroMockupProps) {
  const MockupComponent = heroMockups[slug];
  return MockupComponent ? <MockupComponent /> : null;
}

export {
  LongFormMockup,
  ShortFormMockup,
  ChannelManagementMockup,
  YouTubersMockup,
  BusinessesMockup,
  PodcastersMockup,
  RealtorsMockup,
  CourseCreatorsMockup,
  DoctorsMockup,
  LawyersMockup,
};
