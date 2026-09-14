import classNames from "classnames";
import styles from "./ActivityScore.module.scss";

interface IProps {
  label: string;
  score: number;
  reasons: string[];
  additionalInfo?: string;
}

const ActivityScore = ({
  label,
  score,
  reasons,
  additionalInfo,
}: IProps) => (
  <div className={styles.activityScore}>
    <strong>{label}</strong>
    <b className={scoreTone(score)}>{score}</b>
    <p>{reasons.join(" · ")}</p>
    {additionalInfo && <small>{additionalInfo}</small>}
  </div>
);

const scoreTone = (score: number) =>
  classNames({
    [styles.scoreGood]: score >= 75,
    [styles.scoreMixed]: score >= 50 && score < 75,
    [styles.scorePoor]: score < 50,
  });

export default ActivityScore;
