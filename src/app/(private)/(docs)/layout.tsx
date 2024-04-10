import { Layout } from '@/components/Layout';

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
