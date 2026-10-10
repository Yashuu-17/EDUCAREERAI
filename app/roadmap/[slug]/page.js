import { redirect } from 'next/navigation';

export default function RoadmapSlugPage({ params }) {
  redirect(`/roadmaps/${params.slug}`);
}
