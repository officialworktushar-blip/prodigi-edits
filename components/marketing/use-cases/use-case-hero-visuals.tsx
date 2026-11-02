import Image, { type StaticImageData } from 'next/image';
import BusinessMockup from '@/components/public/UseCases_Business_transparent.png';
import CourseCreatorMockup from '@/components/public/UseCases_CourseCreator_transparent.png';
import DoctorMockup from '@/components/public/UseCases_Doctor_transparent.png';
import LawyersMockup from '@/components/public/UseCases_Lawyers_transparent.png';
import PodcasterMockup from '@/components/public/UseCases_Podcaster_transparent.png';
import RealtorMockup from '@/components/public/UseCases_Realtors_transparent.png';
import YouTubersMockup from '@/components/public/UseCases_Youtubers_transparent.png';

function UploadedMockup({
  image,
  alt,
}: {
  image: StaticImageData;
  alt: string;
}) {
  return (
    <div className="relative mx-auto w-full min-[1440px]:-mr-6 min-[1440px]:w-[calc(100%+1.5rem)]">
      <Image
        src={image}
        alt={alt}
        priority
        sizes="(max-width: 767px) 100vw, (max-width: 1439px) 52vw, 56vw"
        className="block h-auto w-full object-contain min-[1440px]:origin-right min-[1440px]:scale-[1.14]"
      />
    </div>
  );
}

export function YouTubersHeroVisual() {
  return (
    <UploadedMockup
      image={YouTubersMockup}
      alt="YouTubers creator studio with channel growth analytics, publishing calendar, content pipeline, and export settings."
    />
  );
}

export function BusinessesHeroVisual() {
  return (
    <UploadedMockup
      image={BusinessMockup}
      alt="Business video workspace mockup with branded content, review controls, and project handoff tools."
    />
  );
}

export function PodcastersHeroVisual() {
  return (
    <UploadedMockup
      image={PodcasterMockup}
      alt="Podcast editing mockup with episode artwork, audio timeline, microphone, and publishing controls."
    />
  );
}

export function RealtorsHeroVisual() {
  return (
    <UploadedMockup
      image={RealtorMockup}
      alt="Real estate video editing workspace mockup for property tours and agent marketing."
    />
  );
}

export function CourseCreatorsHeroVisual() {
  return (
    <UploadedMockup
      image={CourseCreatorMockup}
      alt="Course creator mockup showing a course workspace, curriculum slides, lesson design controls, and theme settings."
    />
  );
}

export function DoctorsHeroVisual() {
  return (
    <UploadedMockup
      image={DoctorMockup}
      alt="Doctor video workspace mockup with patient education content and review tools."
    />
  );
}

export function LawyersHeroVisual() {
  return (
    <UploadedMockup
      image={LawyersMockup}
      alt="Law firm video production mockup with private workspace, explainer video, brand controls, and export options."
    />
  );
}
