import PropTypes from 'prop-types';
import { useState } from 'react';
import s from './Searchbar.module.css';

export default function Searchbar({ onSubmitForm }) {
  const [value, setValue] = useState('');

  const onChange = e => {
    setValue(e.currentTarget.value);
  };

  const onSubmitHandler = e => {
    e.preventDefault();
    onSubmitForm({ value });
  };

  return (
    <header className={s.Searchbar}>
      <form className={s.SearchForm} onSubmit={onSubmitHandler}>
        <button type="submit" className={s.SearchFormButton}>
          <span className={s.SearchFormButtonLabel}>Search</span>
        </button>

        <input
          className={s.SearchFormInput}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={value}
          onChange={onChange}
        />
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onSubmitForm: PropTypes.func.isRequired,
};
