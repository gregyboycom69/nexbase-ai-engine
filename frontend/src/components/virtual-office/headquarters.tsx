"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { OfficeFloor } from "./office-floor";
import styles from "./office.module.css";

export function Headquarters({ tagline }: { tagline: ReactNode }) {
  const t = useTranslations("virtualOffice");

  return (
    <div className={styles.headquarters}>
      <div className={styles.model} aria-hidden>
        <div className={styles.modelFloat}>
          <OfficeFloor />
        </div>
      </div>
      <div className={styles.headquartersCopy}>
        <p className={styles.headquartersTitle}>{t("headquarters")}</p>
        <p className={styles.headquartersTagline}>{tagline}</p>
      </div>
    </div>
  );
}
