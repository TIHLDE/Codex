import { Layout } from '@/components/documentation/Layout';

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
