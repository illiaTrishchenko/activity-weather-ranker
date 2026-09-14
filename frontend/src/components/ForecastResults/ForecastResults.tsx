import type { ActivityForecastQuery } from "../../gql/graphql";
import classNames from "classnames";
import ForecastDayCard from "../ForecastDayCard";
import styles from "./ForecastResults.module.scss";

interface IProps {
  forecast: ActivityForecastQuery["activityForecast"];
  isLoading: boolean;
}

const ForecastResults = ({ forecast, isLoading }: IProps) => (
  <section className={styles.forecastResults}>
    <h2>
      {forecast.location.name}
      {forecast.location.country ? `, ${forecast.location.country}` : ""}
    </h2>
    <div
      className={classNames(styles.days, { [styles.isLoading]: isLoading })}
      aria-busy={isLoading}
    >
      {forecast.days.map((day) => (
        <ForecastDayCard day={day} key={day.date} />
      ))}
      {isLoading && <div className={styles.loadingOverlay}>Updating forecast…</div>}
    </div>
  </section>
);

export default ForecastResults;
