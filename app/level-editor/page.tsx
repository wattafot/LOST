"use client";

import { useEffect } from "react";
import LevelEditor from "@/components/LevelEditor";

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
    
    // Set body to prevent scrolling
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    
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
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900">
      <LevelEditor />
    </div>
  );
}