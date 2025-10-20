"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function RememberMeHandler() {
  const { data: session, update } = useSession();

  useEffect(() => {
    // Check if remember me is enabled in localStorage
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    if (rememberMe && session) {
      // Update session with remember me info
      update({
        rememberMe: true
      });
    }
  }, [session, update]);

  return null; // This component doesn't render anything
}
