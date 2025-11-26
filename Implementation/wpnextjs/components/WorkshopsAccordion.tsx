"use client";

import React, { useState } from "react";
import styles from "../app/corporate-wellness/CorporateWellness.module.css";

const workshopItems = [
  {
    title: "Healthy Diet for Stress Management",
    text: "Ditch the tension with proper nutritional strategies and practical stress relief techniques—perfect for tackling that never-ending to-do list.",
  },
  {
    title: "Nutrition for Energy and Focus",
    text: "Uncover how what you eat fuels how you feel! Learn quick tips for meal planning, smart snacking, and conquering the mid-afternoon slump.",
  },
  {
    title: "Building Natural Immunity through Diet and Supplementation",
    text: "Aches and stiffness, begone! We’ll teach your team simple stretches and exercises to stay limber and energized—all without leaving their desks.",
  },
];

export default function WorkshopsAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // first open by default

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className={styles.workshopList}>
      {workshopItems.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={item.title} className={styles.workshopItem}>
            {/* clickable header row */}
            <button
              type="button"
              className={styles.workshopItemHeader}
              onClick={() => toggle(index)}
            >
              <span className={styles.workshopPlusWrapper}>
                <span
                  className={`${styles.workshopPlus} ${
                    isOpen ? styles.workshopPlusOpen : ""
                  }`}
                >
                  +
                </span>
              </span>
              <span className={styles.workshopText}>{item.title}</span>
            </button>

            {/* expanding content */}
            <div
              className={`${styles.workshopDetails} ${
                isOpen ? styles.workshopDetailsOpen : ""
              }`}
            >
              <p>{item.text}</p>
            </div>

            <div className={styles.workshopDivider} />
          </div>
        );
      })}
    </div>
  );
}
