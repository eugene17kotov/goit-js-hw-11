import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/fetchImages';

// Task

// переписать на Async/Await

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const scrollGuardRef = document.querySelector('.scroll-guard');

let lightboxGallery = null;
let page = 1;
const per_page = 40;
let lastPage = 0;
let input = '';
const options = {
  rootMargin: '200px',
  threshold: 1.0,
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (input === '') {
      return;
    }

    if (page === lastPage) {
      setTimeout(() => {
        endScrollMessage();
      }, 1000);
      return;
    }

    if (entry.isIntersecting) {
      page += 1;

      fetchOnScroll(input, page);
    }
  });
}, options);

observer.observe(scrollGuardRef);

formRef.addEventListener('submit', onSubmitForm);

function onSubmitForm(e) {
  e.preventDefault();

  page = 1;
  input = e.target.elements.searchQuery.value;

  if (input === '') {
    failureMessage();
    return;
  }

  fetchOnSubmit(input, page);
}

function fetchOnSubmit(input, page) {
  fetchImages(input, page)
    .then(images => {
      const imagesArray = images.hits;
      const imagesCount = images.totalHits;

      galleryRef.innerHTML = '';

      renderImagesMarkup(imagesArray);

      lastPage = Math.ceil(imagesCount / per_page);

      if (lastPage) {
        successMessage(imagesCount);
      }

      createLightBox();

      // Плавная прокрутка страницы
      slowScroll();
    })
    .catch(error => {
      failureMessage();
    })
    .finally(() => {
      formRef.reset();
    });
}

function fetchOnScroll(input, page) {
  fetchImages(input, page)
    .then(images => {
      const imagesArray = images.hits;

      renderAdditionalImagesMarkup(imagesArray);

      lightboxGallery.refresh();

      console.log(page);
    })
    .catch(error => failureMessage());
}

function renderImagesMarkup(imagesArray) {
  galleryRef.innerHTML = imagesArray
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
<div class="gallery__item">                   
  <a class="gallery__link" href=${largeImageURL}>
      <img class="gallery__image" src='${webformatURL}' alt='${tags}' loading="lazy" />
  </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
  </div>
</div>`
    )
    .join('');
}

function renderAdditionalImagesMarkup(imagesArray) {
  galleryRef.insertAdjacentHTML(
    'beforeend',
    imagesArray
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => `
<div class="gallery__item">                   
  <a class="gallery__link" href=${largeImageURL}>
      <img class="gallery__image" src='${webformatURL}' alt='${tags}' loading="lazy" />
  </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
  </div>
</div>`
      )
      .join('')
  );
}

function slowScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function createLightBox() {
  lightboxGallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
}

function failureMessage() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function successMessage(imagesCount) {
  Notify.success(`Hooray! We found ${imagesCount} images.`);
}

function endScrollMessage() {
  Notify.info("We're sorry, but you've reached the end of search results.");
}
