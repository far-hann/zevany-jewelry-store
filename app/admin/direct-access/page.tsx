'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDirectAccess() {
  const router = useRouter();

  useEffect(() => {
    // Create a simple admin token cookie directly
    document.cookie = "admin-token=direct-access-token; path=/; max-age=28800";
    
    // Redirect to the admin products page
    setTimeout(() => {
      router.push('/admin/products');
    }, 1000);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            ZEVANY Admin Direct Access
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Setting up direct admin access...
          </p>
          <p className="mt-4 text-lg font-medium text-blue-600">
            Redirecting to admin panel...
          </p>
        </div>
      </div>
    </div>
  );
}
