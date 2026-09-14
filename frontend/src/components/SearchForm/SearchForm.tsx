import { type SubmitEventHandler } from "react";
import styles from "./SearchForm.module.scss";

interface IProps {
  place: string;
  isLoading: boolean;
  onPlaceChange: (place: string) => void;
  onSubmit: SubmitEventHandler<HTMLFormElement>;
}

const SearchForm = ({ place, isLoading, onPlaceChange, onSubmit }: IProps) => (
  <form className={styles.searchForm} onSubmit={onSubmit}>
    <label htmlFor="place">City or town</label>
    <input
      id="place"
      value={place}
      onChange={(event) => onPlaceChange(event.target.value)}
      placeholder="e.g. London"
      required
    />
    <button disabled={isLoading}>{isLoading ? "Loading…" : "Search"}</button>
  </form>
);

export default SearchForm;
