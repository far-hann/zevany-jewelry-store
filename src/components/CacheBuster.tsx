'use client'

import { useEffect } from 'react'

export default function CacheBuster() {
  useEffect(() => {
    // Force reload CSS
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const newHref = href.includes('?') 
          ? `${href}&_cache=${Date.now()}` 
          : `${href}?_cache=${Date.now()}`;
        link.setAttribute('href', newHref);
      }
    });

    // Force reload font resources
    document.fonts.ready.then(() => {
      // Trigger a reflow by accessing offsetHeight
      document.body.offsetHeight;
    });
    
    // Use a flag in sessionStorage to know if this is a fresh visit
    const pageVisited = sessionStorage.getItem('pageVisited');
    if (!pageVisited) {
      // First visit in this session, set flag
      sessionStorage.setItem('pageVisited', 'true');
      
      // Add more cache-busting logic here if needed
    }
  }, []);
  
  return null; // This component doesn't render anything
}
