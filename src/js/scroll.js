export function slowScrollOnSearch() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollTo({
    top: cardHeight * 0.5,
    behavior: 'smooth',
  });
}

export function slowScrollOnAddPhotos() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 1.5,
    behavior: 'smooth',
  });
}
