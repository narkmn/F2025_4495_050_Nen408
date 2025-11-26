import Image from "next/image";
import styles from "./About.module.css";
import JourneySection from "@/components/about/JourneySection";
import WheelOfHealthSection from "@/components/about/WheelOfHealthSection";
import AnimatedNumber from "@/components/about/AnimatedNumber";

export default function About() {
  return (
    <div className={styles.page}>
      {/* 1. HERO TITLE + STATS -------------------------------------- */}
      <section className={styles.heroSection}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            Advanced Nutrition &amp; <br />
            Holistic Health Courses
          </h1>
            <div className={styles.statsRow}>
  <div className={styles.statItem}>
    <div className={styles.statCircle}>
      <span className={styles.statNumber}>
        <AnimatedNumber target={100} />
      </span>
      <span className={styles.statPlus}>+</span>
    </div>
    <div className={styles.statLabel}>Hours Of Instruction</div>
  </div>

  <div className={styles.statItem}>
    <div className={styles.statCircle}>
      <span className={styles.statNumber}>
        <AnimatedNumber target={50} />
      </span>
      <span className={styles.statPlus}>+</span>
    </div>
    <div className={styles.statLabel}>Students</div>
  </div>

  <div className={styles.statItem}>
    <div className={styles.statCircle}>
      <span className={styles.statNumber}>
        <AnimatedNumber target={10} />
      </span>
      <span className={styles.statPlus}>+</span>
    </div>
    <div className={styles.statLabel}>Active Courses</div>
  </div>
</div>

          
        </div>
      </section>

      {/* 2. WHAT WE DO + INTRO TEXT -------------------------------- */}
      <section className={styles.whatSection}>
        <div className={styles.whatLeft}>
          <div className={styles.smallLabel}>WHAT WE DO</div>
          <div className={styles.smallGreenLine}></div>
        </div>

        <div className={styles.whatRight}>
          <p>
            Welcome to the Natural Health Academy by Happy Nutrition LTD, where
            we&apos;re passionate about empowering individuals with the
            knowledge and skills to take charge of their health through
            natural, evidence-based approaches. Our academy provides
            comprehensive education, resources, and support to guide our
            students toward holistic wellness, blending ancient traditions with
            modern insights to foster sustainable health solutions.
          </p>
        </div>
      </section>

      {/* 3. OUR INSTRUCTORS ---------------------------------------- */}
      <section className={styles.instructorsSection}>
        <div className={styles.instructorsHeader}>
          <div className={styles.smallLabel}>MEET THE TEAM</div>
          <div className={styles.smallGreenLine}></div>
          <h2 className={styles.instructorsTitle}>Our Instructors</h2>
        </div>

        <div className={styles.instructorsGrid}>
          {/* Olga card */}
          <article className={styles.instructorCard}>
            <div className={styles.instructorImagePlaceholder}>
              <img src="https://healthacademy.ca/wp-content/uploads/2025/03/pinterest-profile-Olga-1.jpg" 
                alt="Olga"
                className="w-full h-96 object-cover object-center"
              />
            </div>

            <div className={styles.instructorInfo}>
              <h3 className={styles.instructorName}>OLGA GRASS</h3>
              <div className={styles.instructorRole}>Founder</div>
              <p className={styles.instructorText}>
                Olga Grass is a Certified Nutritional Practitioner and Holistic
                Health Coach dedicated to empowering clients through
                personalized nutrition and holistic wellness strategies. She
                helps individuals achieve their health goals and embrace lasting
                lifestyle changes.
              </p>
            </div>
          </article>

          {/* Alex card */}
          <article className={styles.instructorCard}>
            <div className={styles.instructorImagePlaceholder}>
              <img src="https://healthacademy.ca/wp-content/uploads/2025/03/pinterest-profile-Alex.jpg" 
                alt="Alex Kostikov" 
                className="w-full h-96 object-cover object-center"
              />
            </div>

            <div className={styles.instructorInfo}>
              <h3 className={styles.instructorName}>ALEX KOSTIKOV</h3>
              <div className={styles.instructorRole}>Founder</div>
              <p className={styles.instructorText}>
                Alex Kostikov is a European-trained Medical Doctor and health
                educator with extensive experience in research and practice. He
                is committed to advancing health knowledge and helping
                individuals make informed, proactive decisions.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* 4. MISSION / WHY / WHAT WE OFFER (3 columns) --------------- */}
      <section className={styles.columnsSection}>
        <div className={styles.columnsGrid}>
          <div className={styles.columnCard}>
            <div className={styles.columnNumber}>01</div>
            <h3 className={styles.columnTitle}>Our Mission</h3>
            <p className={styles.columnText}>
              To make holistic health knowledge accessible, practical, and
              transformative. Our courses are designed to nurture personal and
              professional growth and equip students with tools to inspire
              others.
            </p>
          </div>

          <div className={styles.columnCard}>
            <div className={styles.columnNumber}>02</div>
            <h3 className={styles.columnTitle}>Why Choose Us</h3>
            <p className={styles.columnText}>
              Our educators are leaders in their fields, with experience in both
              academic and clinical settings. We offer interactive learning,
              community support, and a teaching style that is engaging and
              accessible.
            </p>
          </div>

          <div className={styles.columnCard}>
            <div className={styles.columnNumber}>03</div>
            <h3 className={styles.columnTitle}>What We Offer</h3>
            <p className={styles.columnText}>
              A range of programs and certifications in natural health,
              nutrition, herbal medicine, and mindfulness. Our curriculum
              combines scientific research with time-tested practices.
            </p>
          </div>
        </div>
      </section>

      {/* 5. JOURNEY TO HEALTH TIMELINE (component) ------------------ */}
      <JourneySection />

      {/* 6. WHEEL OF HEALTH ----------------------------------------- */}
      <WheelOfHealthSection />


    </div>
  );
}
