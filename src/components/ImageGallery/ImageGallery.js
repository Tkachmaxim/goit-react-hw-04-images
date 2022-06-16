import PropTypes from 'prop-types';
import { ImageItem } from './ImageItem';
import s from './ImageGallery.module.css';

const ImageGallery = ({ images, imageClick }) => {
  const onClick = e => {
    if (e.target.nodeName === 'IMG') {
      imageClick(e.target.dataset.id);
    } else {
      return;
    }
  };

  return (
    <ul className={s.ImageGallery} onClick={onClick}>
      {images.map(({ id, webformatURL, tags }) => {
        return (
          <ImageItem id={id} webformatURL={webformatURL} key={id} tags={tags} />
        );
      })}
    </ul>
  );
};

export default ImageGallery;

ImageGallery.propTypes = {
  imageClick: PropTypes.func.isRequired,
  images: PropTypes.arrayOf(PropTypes.object.isRequired),
};
