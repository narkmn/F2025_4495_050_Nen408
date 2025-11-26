import styles from "./JourneySection.module.css";

export default function JourneySection() {
  return (
    <section className={styles.section}>
      {/* Title */}
      <div className={styles.header}>
        <h2 className={styles.title}>Journey to Health</h2>
        <div className={styles.greenLine} />
      </div>

      {/* Timeline container */}
      <div className={styles.timelineWrapper}>
        {/* Top row cards */}
        <div className={styles.rowTop}>
          <div className={styles.card}>
            <h3>1: Foundation</h3>
            <ul>
              <li>Diet</li>
              <li>Gut health</li>
              <li>Sleep</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h3>3: Vitality</h3>
            <ul>
              <li>Cardio</li>
              <li>Hormones</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h3>5: Longevity</h3>
            <ul>
              <li>Mitochondria</li>
              <li>Cognition</li>
              <li>Genetics &amp; Prevention</li>
            </ul>
          </div>
        </div>

        {/* Track with nodes */}
        <div className={styles.track}>
          <div className={styles.node} />
          <div className={styles.node} />
          <div className={styles.node} />
          <div className={styles.node} />
          <div className={styles.node} />
        </div>

        {/* Bottom row cards */}
        <div className={styles.rowBottom}>
          <div className={styles.card}>
            <h3>2: Resilience</h3>
            <ul>
              <li>Adrenals</li>
              <li>Detox</li>
              <li>Immunity</li>
            </ul>
          </div>

          <div className={styles.card}>
            <h3>4: Maintenance</h3>
            <ul>
              <li>Bones</li>
              <li>Hair &amp; Skin</li>
              <li>Teeth</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
