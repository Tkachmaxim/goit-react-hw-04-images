import axios from 'axios';

const API = (q, page) => {
  const options = {
    params: {
      key: '26204743-91e6994ab793c005630c1d93c',
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 12,
      q,
      page,
    },
  };

  return axios.get('https://pixabay.com/api/', options);
};

export default API;
