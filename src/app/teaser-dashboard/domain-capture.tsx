'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';

export function DomainCapture() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const domain = searchParams.get('domain');
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    const captureDomain = async () => {
      console.log("DomainCapture running with:", { 
        isLoaded: isLoaded, 
        hasUser: !!user, 
        domain: domain, 
        currentMetadata: user?.unsafeMetadata 
      });

      if (isLoaded && user && domain && !attempted) {
        setAttempted(true);
        try {
          console.log("Updating user metadata with domain:", domain);
          
          // Try to update the user metadata with the domain
          await user.update({
            unsafeMetadata: {
              ...user.unsafeMetadata,
              domain: domain,
            },
          });
          
          console.log("User metadata updated successfully, reloading page");
          
          // Force a hard reload to ensure the updated metadata is used
          window.location.href = '/dashboard';
        } catch (error) {
          console.error("Error updating user metadata:", error);
        }
      }
    };

    captureDomain();
  }, [isLoaded, user, domain, attempted]);

  return null;
}