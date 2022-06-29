import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImages } from './js/fetchImages';
import { successMessage } from './js/messages';
import { failureMessage } from './js/messages';
import { endScrollMessage } from './js/messages';
import { createLightBox } from './js/createLightBox';
import { slowScrollOnSearch } from './js/scroll';
import { slowScrollOnAddPhotos } from './js/scroll';
import { renderImagesMarkup } from './js/markup-render';
import { renderAdditionalImagesMarkup } from './js/markup-render';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const scrollGuardRef = document.querySelector('.scroll-guard');

let lightboxGallery = null;
let page = 1;
const per_page = 40;
let lastPage = 0;
let input = '';

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
      slowScrollOnSearch();
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

      slowScrollOnAddPhotos();

      lightboxGallery.refresh();
    })
    .catch(error => failureMessage());
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
