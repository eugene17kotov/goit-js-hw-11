import { Notify } from 'notiflix';

export function failureMessage() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

export function successMessage(imagesCount) {
  Notify.success(`Hooray! We found ${imagesCount} images.`);
}

export function endScrollMessage() {
  Notify.info("We're sorry, but you've reached the end of search results.");
}
