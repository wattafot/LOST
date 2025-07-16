"use client";

import { useEffect } from "react";
import LevelEditor from "@/components/LevelEditor";

// Mobile-friendly viewport settings
if (typeof window !== 'undefined') {
  // Add mobile viewport meta tag if not present
  const existingViewport = document.querySelector('meta[name="viewport"]');
  if (!existingViewport) {
    const viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    document.head.appendChild(viewportMeta);
  }
}

export default function LevelEditorPage() {
  useEffect(() => {
    // Hide navbar and footer for level editor
    const navbar = document.querySelector('nav');
    const footer = document.querySelector('footer');
    const main = document.querySelector('main');
    
    if (navbar) navbar.style.display = 'none';
    if (footer) footer.style.display = 'none';
    if (main) {
      main.style.flex = 'unset';
      main.style.height = '100vh';
      main.style.overflow = 'hidden';
    }
    
    // Set body to prevent scrolling and improve mobile experience
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.touchAction = 'none'; // Prevent mobile scroll/zoom
    document.body.style.userSelect = 'none'; // Prevent text selection on mobile
    
    return () => {
      // Restore on cleanup
      if (navbar) navbar.style.display = '';
      if (footer) footer.style.display = '';
      if (main) {
        main.style.flex = '';
        main.style.height = '';
        main.style.overflow = '';
      }
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
      document.body.style.userSelect = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900" style={{ 
      WebkitTouchCallout: 'none',
      WebkitUserSelect: 'none',
      touchAction: 'manipulation'
    }}>
      <LevelEditor />
    </div>
  );
}