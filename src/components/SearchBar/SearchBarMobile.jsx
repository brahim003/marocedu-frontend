import './SearchBar.css';

export default function SearchBarMobile({ onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const q = new FormData(form).get('q')?.toString().trim() || '';
    onSubmit?.(q);
  };

  return (
    <form className="container searchbar-mobile" role="search" onSubmit={handleSubmit}>
      <div className="position-relative">
        <input
          name="q"
          type="search"
          className="form-control ps-4 pe-5"
          placeholder="Rechercher..."
          aria-label="Search"
        />
        <button
          type="submit"
          className="btn border-0 position-absolute top-50 end-0 translate-middle-y me-2"
          aria-label="Search"
        >
          <i className="bi bi-search fs-5" />
        </button>
      </div>
    </form>
  );
}
