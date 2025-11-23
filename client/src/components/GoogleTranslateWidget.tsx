// Google Translate Widget Component
// Automatically translates entire page to 100+ languages

import { useEffect } from 'react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export function GoogleTranslateWidget() {
  useEffect(() => {
    // Check if script already loaded
    if (document.getElementById('google-translate-script')) {
      return;
    }

    // Initialize Google Translate
    window.googleTranslateElementInit = function() {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'uz',
          includedLanguages: 'uz,ru,en', // Uzbek, Russian, English
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    // Load Google Translate script
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      const existingScript = document.getElementById('google-translate-script');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <div 
      id="google_translate_element" 
      className="inline-block"
      style={{
        // Hide Google branding (optional)
        '.goog-te-banner-frame': { display: 'none !important' },
        '.goog-te-gadget': { 
          fontFamily: 'inherit',
          fontSize: '0'
        }
      }}
    />
  );
}

// CSS to customize Google Translate widget
export const GoogleTranslateStyles = `
  /* Hide Google Translate banner */
  .goog-te-banner-frame {
    display: none !important;
  }
  
  /* Hide "Powered by Google" */
  .goog-te-gadget-simple .goog-te-menu-value span:first-child {
    display: none;
  }
  
  /* Style the dropdown */
  .goog-te-gadget-simple {
    background-color: transparent !important;
    border: none !important;
    padding: 4px 8px !important;
    border-radius: 6px !important;
    font-size: 14px !important;
  }
  
  /* Style the button */
  .goog-te-gadget-simple .goog-te-menu-value {
    color: inherit !important;
  }
  
  /* Remove top margin from body when translated */
  body {
    top: 0 !important;
  }
  
  /* Hide the iframe */
  .skiptranslate > iframe {
    display: none !important;
  }
`;
