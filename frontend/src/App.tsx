import { type SubmitEvent, useState } from "react";
import { useLazyQuery } from "@apollo/client/react";
import ForecastResults from "./components/ForecastResults";
import SearchForm from "./components/SearchForm";
import { ActivityForecastDocument } from "./gql/graphql";
import styles from "./App.module.scss";

const App = () => {
  const [place, setPlace] = useState("");

  const [getForecast, { data, previousData, loading, error }] = useLazyQuery(
    ActivityForecastDocument,
  );
  const forecast = error ? undefined : (data ?? previousData);

  const handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();

    const value = place.trim();

    if (value) getForecast({ variables: { input: { place: value } } });
  };

  return (
    <main className={styles.appShell}>
      <header className={styles.heroCopy}>
        <h1>Activity weather forecast</h1>
        <p>Find the best days for the next seven days.</p>
      </header>
      <SearchForm
        place={place}
        isLoading={loading}
        onPlaceChange={setPlace}
        onSubmit={handleSubmit}
      />
      {error && (
        <p className={styles.errorMessage} role="alert">
          {error.message.includes("Place not found")
            ? "Place not found. Try a city or town name."
            : "Could not load the forecast. Try again."}
        </p>
      )}
      {forecast && (
        <ForecastResults
          forecast={forecast.activityForecast}
          isLoading={loading}
        />
      )}
    </main>
  );
};

export default App;
