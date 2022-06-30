import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix';
// Дополнительный импорт стилей
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImages } from './js/fetchImages';
import { successMessage } from './js/messages';
import { failureMessage } from './js/messages';
import { endScrollMessage } from './js/messages';
import { slowScrollOnSearch } from './js/scroll';
import { slowScrollOnAddPhotos } from './js/scroll';
import { renderImagesMarkup } from './js/markup-render';
import { renderAdditionalImagesMarkup } from './js/markup-render';

const formRef = document.querySelector('#search-form');
const galleryRef = document.querySelector('.gallery');
const scrollGuardRef = document.querySelector('.scroll-guard');

const lightboxGallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
let page = 1;
const per_page = 40;
let lastPage = 0;
let input = '';

formRef.addEventListener('submit', onSubmitForm);

function onSubmitForm(e) {
  e.preventDefault();

  page = 1;
  input = e.target.elements.searchQuery.value.trim();

  if (input === '') {
    failureMessage();
    return;
  }

  fetchOnSubmit(input, page);
}

function fetchOnSubmit(input, page) {
  try {
    fetchImages(input, page)
      .then(images => {
        const imagesArray = images.hits;
        const imagesCount = images.totalHits;

        galleryRef.innerHTML = '';

        if (!imagesCount) {
          failureMessage();
          return;
        }

        renderImagesMarkup(imagesArray, galleryRef);

        lastPage = Math.ceil(imagesCount / per_page);

        successMessage(imagesCount);

        slowScrollOnSearch();

        lightboxGallery.refresh();
      })

      .finally(() => {
        formRef.reset();
      });
  } catch (error) {
    console.log(error);
    failureMessage();
  }
}

function fetchOnScroll(input, page) {
  try {
    fetchImages(input, page).then(images => {
      const imagesArray = images.hits;
      const imagesCount = images.totalHits;

      if (!imagesCount) {
        return;
      }

      renderAdditionalImagesMarkup(imagesArray, galleryRef);

      slowScrollOnAddPhotos();

      lightboxGallery.refresh();
    });
  } catch (error) {
    console.log(error);
    failureMessage();
  }
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
      lastPage = 0;
      return;
    }

    if (entry.isIntersecting) {
      page += 1;

      fetchOnScroll(input, page);
    }
  });
}, options);

observer.observe(scrollGuardRef);
