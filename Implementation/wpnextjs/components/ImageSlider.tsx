"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./ImageSlider.module.css";

const images = [
  "/slider1.jpg",
  "/slider2.jpg",
  "/slider3.jpg",
];

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = images.length;

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className={styles.sliderSection}>
      <div className={styles.sliderContainer}>
        {/* Slides */}
        {images.map((src, index) => (
          <div
            key={src}
            className={`${styles.slide} ${
              index === currentIndex ? styles.active : ""
            }`}
          >
            {index === currentIndex && (
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                className={styles.image}
                priority={index === 0}
              />
            )}
          </div>
        ))}

        {/* Left Arrow */}
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowLeft}`}
          onClick={goPrev}
          aria-label="Previous slide"
        >
          ‹
        </button>

        {/* Right Arrow */}
        <button
          type="button"
          className={`${styles.arrow} ${styles.arrowRight}`}
          onClick={goNext}
          aria-label="Next slide"
        >
          ›
        </button>

        {/* Dots */}
        <div className={styles.dots}>
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`${styles.dot} ${
                index === currentIndex ? styles.dotActive : ""
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
