export function renderImagesMarkup(imagesArray, galleryRef) {
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

export function renderAdditionalImagesMarkup(imagesArray, galleryRef) {
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
