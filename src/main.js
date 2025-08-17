import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery } from './js/pixabay-api.js';
import {
    createGallery,
    clearGallery,
    showLoader,
    hideLoader,
    showLoadMoreButton,
    hideLoadMoreButton,
    smoothScroll,
} from './js/render-functions.js';


const form = document.querySelector('.form');
const loadMoreBtn = document.querySelector('.load-more');

let query = '';
let page = 1;
let totalPages = 0;

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
    e.preventDefault();
    query = e.currentTarget.elements['search-text'].value.trim();
    // const query = input.value.trim();

    if (!query) {
        iziToast.error({
            title: 'Error',
            message: 'Please enter a search query!',
            position: 'topRight',
        });
        return;
    }

    clearGallery();
    page = 1;

    showLoader();
    hideLoadMoreButton();

    try {
        const data = await getImagesByQuery(query, page);

        if (data.hits.length === 0) {
            iziToast.info({
                title: 'No Results',
                message: 'Sorry, no images found. Please try again!',
                position: 'topRight',
            });
            return;
        }
        const perPage = 15;
        totalPages = Math.ceil(data.totalHits / perPage);

        createGallery(data.hits);

        if (page < totalPages) {
            showLoadMoreButton();
        }
    } catch (error) {
        iziToast.error({
            title: 'Error',
            message: 'Something went wrong!',
            position: 'topRight',
        });
    } finally {
        hideLoader();
    }
}

async function onLoadMore() {
    page += 1;

    showLoader();
    hideLoadMoreButton();

    try {
        const data = await getImagesByQuery(query, page);

        createGallery(data.hits);
        smoothScroll();

        if (page < totalPages) {
            showLoadMoreButton();
        } else {
            iziToast.info({
                title: '',
                message: "We're sorry, but you've reached the end of search results.",
                position: 'bottomCenter',
            });
        }
    } catch (error) {
        iziToast.error({
            title: 'Error',
            message: 'Something went wrong!',
            position: 'topRight',
        });
    } finally {
        hideLoader();
    }
}
//console.log(data.totalHits)