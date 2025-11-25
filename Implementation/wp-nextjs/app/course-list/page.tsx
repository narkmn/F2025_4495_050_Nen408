// app/courses/page.tsx
import Image from "next/image";
import styles from "./Courses.module.css";
import { Footer } from "../../components/footer";

type Course = {
  id: number;
  title: string;
  badge: string;
  image: string;
};

const courses: Course[] = [
  {
    id: 1,
    title: "Natural Supplement Advisor",
    badge: "Free",
    image: "/courses/course-1.jpg",
  },
  {
    id: 2,
    title: "Anti-Age Nutrition Consultant",
    badge: "Free",
    image: "/courses/course-2.jpg",
  },
  {
    id: 3,
    title: "Integrative Health and Nutrition",
    badge: "Free",
    image: "/courses/course-3.jpg",
  },
  {
    id: 4,
    title: "Functional Nutrition for Mental Health",
    badge: "599",
    image: "/courses/course-4.jpg",
  },
];

export default function CoursesPage() {
  return (
    <div className={styles.page}>
      {/* HERO ------------------------------------------------------ */}
      <section className={styles.heroSection}>
  <div className={styles.heroInner}>
    <div className={styles.heroText}>
      <p className={styles.heroKicker}>
        Holistic Health &amp; <br />
        Nutrition Courses
      </p>
      <h1 className={styles.heroTitle}>
        Optimize health <br />
        with holistic nutrition
      </h1>
    </div>

    <div className={styles.heroImageWrapper}>
      <Image
        src="/fruits.jpg"           // image inside /public
        alt="Healthy food and fruit"
        fill
        priority
        className={styles.heroImage}
      />
    </div>
  </div>
</section>



      {/* ALL COURSES ---------------------------------------------- */}
      <section className={styles.allCoursesSection}>
        <div className={styles.allCoursesHeader}>
          <h2 className={styles.sectionTitle}>All Courses</h2>
          <div className={styles.sectionLine} />
        </div>

        <div className={styles.coursesGrid}>
          {courses.map((course) => (
            <article key={course.id} className={styles.courseCard}>
              <div className={styles.cardImageWrapper}>
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className={styles.cardImage}
                />
                <div className={styles.badge}>{course.badge}</div>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{course.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS --------------------------------------------- */}
      <section className={styles.testimonialsSection}>
        <div className={styles.testimonialsHeader}>
          <div className={styles.sectionLine} />
          <h2 className={styles.testimonialsTitle}>What Our Students Say</h2>
        </div>

        <div className={styles.testimonialCard}>
          <div className={styles.testimonialTextWrapper}>
            <p className={styles.testimonialText}>
              I&apos;ve taken several courses at the Natural Health Academy,
              and they have exceeded my expectations every time. The depth of
              science-backed information is impressive, providing a solid
              foundation for anyone looking to enhance their health naturally.
              The classes are interactive, making learning both engaging and
              practical. I also loved being part of a community of like-minded
              individuals who are just as passionate about wellness.
            </p>
            <p className={styles.testimonialText}>
              The instructor&apos;s enthusiasm and deep knowledge made every
              session enjoyable and informative. Now, I feel confident in
              selecting the right supplements for my needs and addressing health
              concerns with natural strategies.
            </p>

            <div className={styles.testimonialMeta}>
              <div className={styles.testimonialName}>EGLE BACENIENE</div>
              <div className={styles.testimonialRole}>Student</div>
            </div>
          </div>

          <div className={styles.testimonialAvatarWrapper}>
            <div className={styles.avatarOuter}>
              <div className={styles.avatarInner}>
                {/* Replace this with a real image later if you want */}
                <Image
                  src="/courses/student-avatar.jpg"
                  alt="Student avatar"
                  fill
                  className={styles.avatarImage}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Slider dots (static for now, just visual) */}
        <div className={styles.sliderDots}>
          <span className={`${styles.dot} ${styles.dotActive}`} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
