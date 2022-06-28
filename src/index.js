import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/fetchImages';

// Tasks

// - повесить слушатель событий сабмит на форму
//     - создать запрос на бекенд при сабмите формы
//         - добавить пагинацию
//             - создать рендер разметки фотографий
//                 - при новом запросе полностью очищать разметку

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const scrollGuardRef = document.querySelector('.scroll-guard');

let lightboxGallery = null;
let page = 1;
let lastPage = 0;
let input = '';

formRef.addEventListener('submit', onSubmitForm);

function onSubmitForm(e) {
  e.preventDefault();

  // input = '';
  page = 1;
  input = e.target.elements.searchQuery.value;

  if (input === '') {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  fetchImages(input, page)
    .then(images => {
      galleryRef.innerHTML = '';

      renderImagesMarkup(images.hits);

      lastPage = Math.ceil(images.totalHits / 40);

      page += 1;

      if (lastPage) {
        Notify.success(`Hooray! We found ${images.totalHits} images.`);
      }

      createLightBox();

      // Плавная прокрутка страницы
      slowScroll();
    })
    .catch(error => {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    })
    .finally(() => {
      formRef.reset();
    });
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
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }, 700);
      return;
    }

    if (entry.isIntersecting) {
      fetchImages(input, page)
        .then(images => {
          renderAdditionalImagesMarkup(images.hits);

          lightboxGallery.refresh();

          page += 1;
        })
        .catch(error => console.log(error));
    }
  });
}, options);

observer.observe(scrollGuardRef);
