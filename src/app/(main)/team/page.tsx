import { Metadata } from 'next';
import { getTeamMembers } from '@/app/admin/team/actions';
import { TeamClient } from './team-client';

export const metadata: Metadata = {
  title: 'Our Team',
  description: 'Meet the dedicated people behind Jeany\'s Olshoppe.',
};

export const dynamic = 'force-dynamic'

export default async function TeamPage() {
  // Fetch initial state server-side for SEO and fast First-Paint
  const initialMembers = await getTeamMembers();

  return <TeamClient initialMembers={initialMembers} />;
}
