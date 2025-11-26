// app/corporate-wellness/page.tsx
import styles from "./CorporateWellness.module.css";
import WorkshopsAccordion from "@/components/WorkshopsAccordion";

export default function CorporateWellnessPage() {
  return (
    <div className={styles.page}>
      {/* 1. HERO --------------------------------------------------- */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}>
          {/* Blank background for now – you’ll add an image via CSS later */}
          <div className={styles.heroInner}>
            <h1 className={styles.heroTitle}>
              Corporate Wellness
              <br />
              Workshops
            </h1>

            <p className={styles.heroText}>
              Work doesn&apos;t have to mean stress, burnout, and endless coffee
              just to stay awake. Our corporate wellness workshops are designed
              to flip the script and help your team feel energized, focused, and
              supported.
            </p>

            <p className={styles.heroText}>
              These interactive sessions bring real tools into the workplace—no
              dull lectures, just practical strategies that actually stick.
            </p>

            <button className={styles.heroButton}>Book Today</button>
          </div>
        </div>
      </section>

      {/* 2. WHY WORKSHOPS WORK ------------------------------------ */}
      <section className={styles.whySection}>
        <div className={styles.whyHeader}>
          <h2 className={styles.whyTitle}>Why Wellness Workshops Work</h2>
          <p className={styles.whySubtitle}>
            When your team feels great, they do great. Here&apos;s how wellness
            boosts your business:
          </p>
        </div>

        <div className={styles.whyGrid}>
          <div className={styles.whyCard}>
            <div className={styles.iconCircle}>⬆</div>
            <h3 className={styles.whyCardTitle}>Higher Productivity</h3>
            <p className={styles.whyCardText}>
              Energized employees achieve more, feel more accomplished, and
              enjoy the process.
            </p>
          </div>

          <div className={styles.whyCard}>
            <div className={styles.iconCircle}>🤝</div>
            <h3 className={styles.whyCardTitle}>Better Teamwork</h3>
            <p className={styles.whyCardText}>
              Healthy minds and bodies make collaboration smoother, more
              creative, and more supportive.
            </p>
          </div>

          <div className={styles.whyCard}>
            <div className={styles.iconCircle}>💊</div>
            <h3 className={styles.whyCardTitle}>Fewer Sick Days</h3>
            <p className={styles.whyCardText}>
              Wellness strategies reduce preventable illnesses and
              &quot;out-of-office&quot; days.
            </p>
          </div>

          <div className={styles.whyCard}>
            <div className={styles.iconCircle}>😊</div>
            <h3 className={styles.whyCardTitle}>Happier Employees</h3>
            <p className={styles.whyCardText}>
              A workplace that truly cares about well-being is one people want
              to stay in and grow with.
            </p>
          </div>
        </div>
      </section>

      {/* 3. WORKSHOPS YOUR TEAM WILL LOVE ------------------------- */}
      <section className={styles.workshopsSection}>
        <div className={styles.workshopsInner}>
          <div className={styles.workshopsLeft}>
            <h2 className={styles.workshopsTitle}>
              WORKSHOPS YOUR TEAM WILL LOVE
            </h2>
            <p className={styles.workshopsSubtitle}>
              We bring wellness to life with engaging, actionable, and fun
              sessions. Explore some of our signature topics:
            </p>

            <WorkshopsAccordion />
          </div>

          {/* Right: image placeholder */}
          <div className={styles.workshopsRight}>
            <div className={styles.workshopImagePlaceholder}>
              {/* Add real image later via background-image or <Image /> */}
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHAT TO EXPECT ---------------------------------------- */}
      <section className={styles.expectSection}>
        <div className={styles.expectInner}>
          <h2 className={styles.expectTitle}>What to Expect</h2>

          <div className={styles.expectTopDivider} />

          <div className={styles.expectGrid}>
            <div className={styles.expectColumn}>
              <h3 className={styles.expectHeading}>Engaging Formats</h3>
              <p className={styles.expectText}>
                No dull slides here. Expect lively discussions, hands-on
                activities, and practical tips your team can use immediately.
              </p>

              <h3 className={styles.expectHeading}>Expert Teachers</h3>
              <p className={styles.expectText}>
                Certified professionals bring deep wellness expertise, energy,
                and enthusiasm to every session.
              </p>
            </div>

            <div className={styles.expectColumn}>
              <h3 className={styles.expectHeading}>Tailored Content</h3>
              <p className={styles.expectText}>
                We adapt every workshop to your company culture, challenges, and
                wellness goals.
              </p>

              <h3 className={styles.expectHeading}>Onsite or Online</h3>
              <p className={styles.expectText}>
                Whether in person or on Zoom, we make it seamless for your team
                to participate and connect.
              </p>
            </div>
          </div>

          <div className={styles.expectBottomDivider} />
        </div>
      </section>

      {/* 5. CTA: YOUR TEAM DESERVES THIS -------------------------- */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaOverlay}>
          {/* Background image placeholder – add later */}
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Your Team Deserves This</h2>
            <p className={styles.ctaText}>
              When wellness is fun, it sticks—and when it sticks, your business
              thrives.
            </p>
            <p className={styles.ctaText}>
              Ready to invest in your team&apos;s happiness, health, and
              success?
            </p>
            <button className={styles.ctaButton}>Book Today</button>
          </div>
        </div>
      </section>

    </div>
  );
}
