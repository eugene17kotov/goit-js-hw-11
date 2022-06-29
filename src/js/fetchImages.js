import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.API_KEY = 'key=28299766-d83cf6cfdb58eecdb0caa94e4';
axios.defaults.queryString =
  '&image_type=photo&orientation=horizontal&safesearch=false&per_page=40';

export async function fetchImages(input, page) {
  const search = encodeURIComponent(input);
  const url = `?${axios.defaults.API_KEY}${axios.defaults.queryString}&q=${search}&page=${page}`;
  const response = await axios.get(url);
  return response.data;
}

// export function fetchImages(input, page) {
//   const search = encodeURIComponent(input);
//   const url = `?${axios.defaults.API_KEY}${axios.defaults.queryString}&q=${search}&page=${page}`;

//   return axios.get(url).then(response => response.data);
// }

// const BASE_URL = 'https://pixabay.com/api/';
// const API_KEY = '28299766-d83cf6cfdb58eecdb0caa94e4';

// export function fetchImages(input, page) {
//   const search = encodeURIComponent(input);
//   const url = `${BASE_URL}?key=${API_KEY}&q=${search}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

//   return fetch(url)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(response.status);
//       }

//       return response.json();
//     })
//     .then(images => images);
// }
