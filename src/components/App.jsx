import { Component } from 'react';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { TailSpin } from 'react-loader-spinner';
import API from 'services/api';
import Searchbar from './Searchbar';
import ImageGallery from './ImageGallery';
import Modal from './Modal';
import Button from './Button';
import s from './Button/Button.module.css';

class App extends Component {
  state = {
    pictures: [],
    query: '',
    isLoading: false,
    status: null,
    error: null,
    page: 1,
    total: 0,
    imageIdForModal: null,
    imageURLForModal: null,
    isOpen: false,
    totalHits: 0,
  };

  async componentDidUpdate(prevProps, prevState) {
    if (
      prevState.query !== this.state.query ||
      prevState.page !== this.state.page
    ) {
      this.setState(
        {
          isLoading: true,
          status: 'pending',
        },
        this.getImages
      );
    }
  }

  getImages = () => {
    const { query, page } = this.state;
    try {
      API(query, page).then(this.dataProccesing);
    } catch (error) {
      this.setState({ error, status: 'rejected' });
    }
  };

  dataProccesing = response => {
    const { error, status } = this.state;
    const { hits: dataArray, totalHits } = response.data;
    this.setState({ totalHits });
    if (error || status === 'rejected' || response.data.length === 0) {
      return;
    }

    if (response.status >= 400) {
      this.setState({ status: 'rejected' });
      return;
    }

    this.setState({ status: 'fullfilled' });

    const newImagesObjects = dataArray.map(
      ({ id, largeImageURL, webformatURL, tags }) => {
        return { id, largeImageURL, webformatURL, tags };
      }
    );

    this.setState(({ pictures }) => ({
      pictures: [...pictures, ...newImagesObjects],
      total: totalHits,
      isLoading: false,
    }));

    window.scrollBy({
      top: document.body.clientHeight,
      behavior: 'smooth',
    });
  };

  onSubmitForm = ({ value }) => {
    this.setState({ query: value, pictures: [], page: 1, totalHits: 0 });
  };

  showModal = id => {
    this.setState({ imageIdForModal: Number(id) }, this.getUrlImageForModal);
    this.toogleIsOpen();
  };

  getUrlImageForModal = () => {
    const { imageIdForModal, pictures } = this.state;
    const { largeImageURL } = pictures.filter(
      ({ id }) => id === imageIdForModal
    )[0];
    this.setState({ imageURLForModal: largeImageURL });
  };

  toogleIsOpen = () => {
    this.setState(({ isOpen }) => ({ isOpen: !isOpen }));
  };

  LoadMoreButton = () => {
    this.setState(({ page }) => {
      return { page: page + 1 };
    });
  };

  isTotal = () => {
    const { totalHits, pictures } = this.state;
    return totalHits === pictures.length;
  };

  render() {
    const { pictures, isOpen, imageURLForModal, isLoading, error, status } =
      this.state;

    return (
      <div>
        <Searchbar onSubmitForm={this.onSubmitForm} />
        {pictures.length > 0 && (
          <ImageGallery images={pictures} imageClick={this.showModal} />
        )}
        <div className={s.ButtonSection}>
          {isLoading && <TailSpin color="#00BFFF" height={80} width={80} />}
        </div>

        <div className={s.ButtonSection}>
          {!!pictures.length && !this.isTotal() && (
            <Button onClick={this.LoadMoreButton} />
          )}
        </div>

        {!pictures.length && status === 'fullfilled' && (
          <p>No images that approve your request</p>
        )}
        {status === 'rejected' && <p>Some thing wrong {error} occured</p>}
        {isOpen && (
          <Modal onClose={this.toogleIsOpen}>
            <img src={imageURLForModal} alt="" />
          </Modal>
        )}
      </div>
    );
  }
}

export default App;
