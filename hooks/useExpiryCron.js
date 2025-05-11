import { useEffect } from 'react';

export default function useExpiryCron() {
  useEffect(() => {
    const checkExpiry = async () => {
      try {
        await fetch('/api/food/expiry', { method: 'POST' });
        console.log('Expiry check completed');
      } catch (error) {
        console.error('Expiry check failed:', error);
      }
    };

    // Run daily at midnight (client-side approximation)
    const now = new Date();
    const delay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0, 0, 0
    ) - now;

    const timer = setTimeout(() => {
      checkExpiry();
      setInterval(checkExpiry, 86400000); // 24 hours
    }, delay);

    return () => clearTimeout(timer);
  }, []);
}