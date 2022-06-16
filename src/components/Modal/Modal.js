import PropTypes from 'prop-types';
import { Component } from 'react';
import { createPortal } from 'react-dom';
import s from './Modal.module.css';

const modalRoot = document.querySelector('#modal');

class Modal extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    children: PropTypes.object.isRequired,
  };
  static defaultProps = { onClose: null, children: null };

  state = {
    idListener: null,
  };

  componentDidMount() {
    document.addEventListener('keydown', this.checkButton);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.checkButton);
  }

  checkButton = e => {
    if (e.code === 'Escape') {
      console.log('esc pressed');
      this.props.onClose();
    }
  };

  handlerOverlayClick = e => {
    if (e.target === e.currentTarget) {
      this.props.onClose();
    }
  };

  render() {
    return createPortal(
      <div className={s.Overlay} onClick={this.handlerOverlayClick}>
        <div className={s.Modal}>{this.props.children}</div>
      </div>,
      modalRoot
    );
  }
}

export default Modal;
