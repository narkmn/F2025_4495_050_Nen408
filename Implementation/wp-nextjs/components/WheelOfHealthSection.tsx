import styles from "./WheelOfHealthSection.module.css";
import Image from "next/image";


export default function WheelOfHealthSection() {
  return (
    <section className={styles.section}>
      {/* Title */}
      <div className={styles.header}>
        <h2 className={styles.title}>The Wheel of Health</h2>
        <div className={styles.greenLine}></div>
      </div>

      {/* Grid layout */}
      <div className={styles.grid}>
        {/* LEFT — Wheel image placeholder */}
    <div className={styles.leftCard}>
        <div className={styles.wheelImageWrapper}>
        <Image
            src="/wheel-of-health.png"
            alt="Wheel of Health"
            fill
            className={styles.wheelImage}
            priority
        />
         </div>
    </div>


        {/* RIGHT — List of systems */}
        <div className={styles.rightList}>
          <div className={styles.systemItem}>
            <span className={`${styles.dot} ${styles.dotPink}`}></span>
            Excretory System
          </div>

          <div className={styles.systemItem}>
            <span className={`${styles.dot} ${styles.dotRed}`}></span>
            Reproductive System
          </div>

          <div className={styles.systemItem}>
            <span className={`${styles.dot} ${styles.dotBlue}`}></span>
            Endocrine System
          </div>

          <div className={styles.systemItem}>
            <span className={`${styles.dot} ${styles.dotOrange}`}></span>
            Integumentary System
          </div>

          <div className={styles.systemItem}>
            <span className={`${styles.dot} ${styles.dotPurple}`}></span>
            Skeletal & Muscular System
          </div>

          <div className={styles.systemItem}>
            <span className={`${styles.dot} ${styles.dotYellow}`}></span>
            Digestive System
          </div>

          <div className={styles.systemItem}>
            <span className={`${styles.dot} ${styles.dotRedDark}`}></span>
            Cardiovascular System
          </div>
        </div>
      </div>
    </section>
  );
}
