import type { ActivityForecastQuery } from "../../gql/graphql";
import ActivityScore from "../ActivityScore";
import styles from "./ForecastDayCard.module.scss";

interface IProps {
  day: ActivityForecastQuery["activityForecast"]["days"][number];
}

const ForecastDayCard = ({ day }: IProps) => (
  <article className={styles.dayCard}>
    <h3>
      <time dateTime={day.date}>{formatDate(day.date)}</time>
    </h3>
    <ActivityScore
      label="Skiing"
      score={day.skiing.score}
      reasons={day.skiing.reasons}
    />
    <ActivityScore
      label="Outdoor"
      score={day.outdoorSightseeing.score}
      reasons={day.outdoorSightseeing.reasons}
    />
    <ActivityScore
      label="Indoor"
      score={day.indoorSightseeing.score}
      reasons={day.indoorSightseeing.reasons}
    />
    {day.surfing.available ? (
      <ActivityScore
        label="Surfing"
        score={day.surfing.score ?? 0}
        reasons={day.surfing.reasons ?? []}
        additionalInfo={`Best: ${day.surfing.bestHour?.slice(11)}`}
      />
    ) : (
      <div className={styles.unavailable}>
        <strong>Surfing</strong>
        <p>{day.surfing.unavailableReason}</p>
      </div>
    )}
  </article>
);

const DATE_FORMATTER = new Intl.DateTimeFormat("en", {
  weekday: "long",
  month: "short",
  day: "numeric",
});

const formatDate = (date: string) =>
  DATE_FORMATTER.format(new Date(`${date}T00:00:00`));

export default ForecastDayCard;
