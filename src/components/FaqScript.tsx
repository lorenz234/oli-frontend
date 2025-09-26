'use client';

import { useEffect } from 'react';

const FaqScript: React.FC = () => {
  useEffect(() => {
    // Initialize FAQ functionality
    const setupFaq = () => {
      const faqItems = document.querySelectorAll('.custom-faq-item');
      
      faqItems.forEach(item => {
        const button = item.querySelector('.custom-faq-question');
        
        if (button) {
          // Remove any existing event listeners to avoid duplicates
          const newButton = button.cloneNode(true);
          button.parentNode?.replaceChild(newButton, button);
          
          // Add the click event listener
          newButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle current item
            item.classList.toggle('active');
          });
        }
      });
      
      // Also handle any markdown-generated details/summary elements
      const detailsElements = document.querySelectorAll('details');
      detailsElements.forEach(details => {
        if (!details.classList.contains('faq-initialized')) {
          details.classList.add('faq-initialized');
          const summary = details.querySelector('summary');
          if (summary) {
            // Add custom styling classes
            details.classList.add('faq-item');
            summary.classList.add('faq-question');
            const content = details.querySelector('summary ~ *');
            if (content) {
              content.classList.add('faq-answer');
            }
          }
        }
      });
    };

    // Run setup after content is loaded and then periodically check
    const initialTimeoutId = setTimeout(setupFaq, 100);
    const periodicTimeoutId = setInterval(setupFaq, 1000); // Check every second for new FAQ items

    // Setup observer to handle dynamically loaded content
    const observer = new MutationObserver((mutations) => {
      let shouldSetup = false;
      
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          // Check if any added nodes contain FAQ items
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.querySelector && 
                  (element.querySelector('.custom-faq-item') || 
                   element.classList.contains('custom-faq-item') ||
                   element.querySelector('details') ||
                   element.tagName.toLowerCase() === 'details')) {
                shouldSetup = true;
              }
            }
          });
        }
      });
      
      if (shouldSetup) {
        setTimeout(setupFaq, 100);
      }
    });

    // Start observing the document body for DOM changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup
    return () => {
      clearTimeout(initialTimeoutId);
      clearInterval(periodicTimeoutId);
      observer.disconnect();
    };
  }, []);

  return null;
};

export default FaqScript;
