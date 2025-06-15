
import { useState, useEffect, useCallback } from 'react';

export const useUnsavedChanges = () => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  const markAsSaved = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  // Warn user when leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      }
    };

    const handlePopState = (e: PopStateEvent) => {
      if (hasUnsavedChanges) {
        const confirm = window.confirm('You have unsaved changes. Are you sure you want to leave?');
        if (!confirm) {
          e.preventDefault();
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    // Intercept navigation attempts
    const handleLinkClick = (e: Event) => {
      if (hasUnsavedChanges) {
        const target = e.target as HTMLElement;
        const link = target.closest('a');
        if (link && link.href && !link.href.includes('#')) {
          const confirm = window.confirm('You have unsaved changes. Are you sure you want to leave?');
          if (!confirm) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleLinkClick, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, [hasUnsavedChanges]);

  return {
    hasUnsavedChanges,
    markAsChanged,
    markAsSaved
  };
};
