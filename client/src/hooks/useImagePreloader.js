import { useState, useEffect } from 'react';

export default function useImagePreloader(imageUrls = []) {
  const [imagesPreloaded, setImagesPreloaded] = useState(false);

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      setImagesPreloaded(true);
      return;
    }

    let isMounted = true;
    let timeoutId;

    const loadImage = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => {
          console.warn(`Failed to preload image: ${url}`);
          resolve(false); // resolve anyway to avoid deadlocks
        };
        img.src = url;
      });
    };

    const preloadAll = async () => {
      try {
        await Promise.all(imageUrls.map(loadImage));
        if (isMounted) {
          setImagesPreloaded(true);
          clearTimeout(timeoutId);
        }
      } catch (err) {
        console.warn('Error in image preloader', err);
        if (isMounted) {
          setImagesPreloaded(true);
        }
      }
    };

    // Failsafe: 4.5 seconds maximum asset wait
    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('Image preloader timed out after 4500ms failsafe.');
        setImagesPreloaded(true);
      }
    }, 4500);

    preloadAll();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [imageUrls]);

  return { imagesPreloaded };
}
