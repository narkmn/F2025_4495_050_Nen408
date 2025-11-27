// app/courses/page.tsx
import Image from "next/image";
import styles from "./Courses.module.css";
import { getCourses } from "@/lib/learnDash";
import type { Course } from "@/lib/types"
import { getCourseImage } from "@/lib/learnDash";


export default async function CoursesPage() {
  let courses: Course[] = [];

  try {
    courses = await getCourses(); 
    courses = courses.slice(0, 4);
    console.log("Homepage courses fetched:", courses);
  } catch (err: any) {
    console.error("Homepage courses error:", err.message || err);
  }
  
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
        src="https://healthacademy.ca/wp-content/uploads/2025/01/d6f66398-192b-467a-b4e8-c2df89f2e1be.jpg"
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
              <a href={`https://healthacademy.ca/courses/${course.slug}`}>
                <div className={styles.cardImageWrapper}>
                  <Image
                    src={getCourseImage(course)}
                    alt={course.title.rendered}
                    fill
                    className={styles.cardImage}
                  />
                  {/* <div className={styles.badge}>$599</div> */}
                </div>
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{course.title.rendered}</h3>
                </div>
              </a>
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
                  src="https://healthacademy.ca/wp-content/uploads/2025/02/8103f8e4-07ab-4b9f-98ad-2cdc9cb173bb.png"
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
    </div>
  );
}
