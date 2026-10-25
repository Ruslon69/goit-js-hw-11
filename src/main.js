import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const searchInput = form.elements['search-text'];
let latestSearchId = 0;

iziToast.settings({
  position: 'topRight',
  timeout: 5000,
  maxWidth: 420,
});

form.addEventListener('submit', event => {
  event.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    iziToast.warning({ message: 'Please enter a search term.' });
    searchInput.focus();
    return;
  }

  const searchId = ++latestSearchId;
  searchInput.value = query;
  document
    .querySelectorAll('.iziToast:not(.iziToast-closing)')
    .forEach(toast => {
      iziToast.hide({}, toast);
    });
  clearGallery();
  showLoader();

  getImagesByQuery(query)
    .then(data => {
      if (searchId !== latestSearchId) return;

      if (data.hits.length === 0) {
        iziToast.error({
          message:
            'Sorry, there are no images matching your search query. Please try again!',
        });
        return;
      }

      createGallery(data.hits);
    })
    .catch(() => {
      if (searchId !== latestSearchId) return;

      iziToast.error({
        message: 'Unable to load images. Please try again in a moment.',
      });
    })
    .finally(() => {
      if (searchId === latestSearchId) hideLoader();
    });
});
