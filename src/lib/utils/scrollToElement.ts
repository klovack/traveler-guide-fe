export const scrollToElement = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 60,
      behavior: 'smooth',
    });
  }
};
