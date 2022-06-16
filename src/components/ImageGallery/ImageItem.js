import PropTypes from 'prop-types';
import s from './ImageGallery.module.css';

const ImageItem = ({ id, webformatURL, tags }) => {
  return (
    <li key={id}>
      <img className={s.ImageItem} src={webformatURL} data-id={id} alt={tags} />
    </li>
  );
};

export { ImageItem };

ImageItem.propTypes = {
  id: PropTypes.number.isRequired,
  webformatURL: PropTypes.string.isRequired,
  tags:PropTypes.string.isRequired
};
