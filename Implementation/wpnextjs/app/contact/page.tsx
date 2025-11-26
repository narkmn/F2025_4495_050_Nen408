// app/contact/page.tsx
import styles from "./Contact.module.css";

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Contact info row */}
        <section className={styles.infoRow}>
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>📞</span>
            <span className={styles.infoText}>647-568-6542</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>✉️</span>
            <span className={styles.infoText}>happynutritionhealth@gmail.com</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoIcon}>📍</span>
            <span className={styles.infoText}>
              Yonge Street · Thornhill ON L3T 0C6
            </span>
          </div>
        </section>

        {/* Form */}
        <section className={styles.formSection}>
          <form className={styles.form}>
            {/* First / Last name */}
            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="firstName">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  className={styles.input}
                  type="text"
                  placeholder="First Name"
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="lastName">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  className={styles.input}
                  type="text"
                  placeholder="Last Name"
                />
              </div>
            </div>

            {/* Email */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="email">
                Email <span className={styles.required}>*</span>
              </label>
              <input
                id="email"
                name="email"
                className={styles.input}
                type="email"
                placeholder="Email Address"
                required
              />
            </div>

            {/* Subject */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="subject">
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                className={styles.input}
                type="text"
                placeholder="Subject"
              />
            </div>

            {/* Message */}
            <div className={styles.fieldGroup}>
              <label className={styles.label} htmlFor="message">
                Your Message <span className={styles.required}>*</span>
              </label>
              <textarea
                id="message"
                name="message"
                className={styles.textarea}
                placeholder="Your Message"
                rows={5}
                required
              />
            </div>

            {/* Submit */}
            <div className={styles.buttonRow}>
              <button type="submit" className={styles.submitButton}>
                Submit Form
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
