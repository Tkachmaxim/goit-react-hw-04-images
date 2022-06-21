import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { TailSpin } from 'react-loader-spinner';
import API from 'services/api';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Modal from './Modal';
import Button from './Button';
import s from './Button/Button.module.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { useLayoutEffect } from 'react';

export default function App() {
  const [pictures, setPictures] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsloading] = useState(false);
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [imageIdForModal, setImageIdForModal] = useState(null);
  const [imageURLForModal, setImageURLForModal] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [totalHits, setToataHits] = useState(0);

  useEffect(() => {
    if (!query) {
      return;
    }
    setIsloading(true);
    setStatus('pending');
    getImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, page]);

  function getImages() {
    try {
      API(query, page).then(dataProccesing);
    } catch (error) {
      setError(error);
      setStatus('rejected');
    }
  }

  useLayoutEffect(() => {
    window.scrollBy({
      top: 260,
      behavior: 'smooth',
    });
  }, [isLoading]);

  const dataProccesing = response => {
    const { hits: dataArray, totalHits } = response.data;
    setToataHits(totalHits);
    if (error || status === 'rejected' || response.data.length === 0) {
      return;
    }

    if (response.status >= 400) {
      setStatus('rejected');
      return;
    }

    setStatus('fullfilled');

    const newImagesObjects = dataArray.map(
      ({ id, largeImageURL, webformatURL, tags }) => {
        return { id, largeImageURL, webformatURL, tags };
      }
    );

    setPictures(prev => {
      return [...prev, ...newImagesObjects];
    });
    setToataHits(totalHits);
    setIsloading(false);
  };

  const onSubmitForm = ({ value }) => {
    setQuery(value);
    setPictures([]);
    setPage(1);
    setToataHits(0);
  };

  const showModal = id => {
    setImageIdForModal(id);
    getUrlImageForModal();
    toogleIsOpen();
  };

  const getUrlImageForModal = () => {
    const { largeImageURL } = pictures.filter(
      ({ id }) => id === imageIdForModal
    )[0];
    setImageURLForModal(largeImageURL);
  };

  const toogleIsOpen = () => {
    setIsOpen(prev => !prev);
  };

  const LoadMoreButton = () => {
    setPage(prev => prev + 1);
  };

  const isTotal = () => {
    return totalHits === pictures.length;
  };

  return (
    <div>
      <Searchbar onSubmitForm={onSubmitForm} />
      {pictures.length > 0 && (
        <ImageGallery images={pictures} imageClick={showModal} />
      )}
      <div className={s.ButtonSection}>
        {isLoading && <TailSpin color="#00BFFF" height={80} width={80} />}
      </div>

      <div className={s.ButtonSection}>
        {!!pictures.length && !isTotal() && <Button onClick={LoadMoreButton} />}
      </div>

      {!pictures.length && status === 'fullfilled' && (
        <p>No images that approve your request</p>
      )}
      {status === 'rejected' && <p>Some thing wrong {error} occured</p>}
      {isOpen && (
        <Modal onClose={toogleIsOpen}>
          <img src={imageURLForModal} alt="" />
        </Modal>
      )}
    </div>
  );
}
