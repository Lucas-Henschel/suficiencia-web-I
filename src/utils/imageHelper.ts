export const preloadImage = (src: string) => {
  return new Promise<void>((resolve) => {
    const img = new Image();

    img.src = src;
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
  });
};
