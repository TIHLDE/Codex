import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react';
import authOptions from '@/auth/auth';

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.tihldeUserToken) {
    return redirect('/auth/signin');
  }

  return children;
}
