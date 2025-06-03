"use client";

import { useTranslations } from "next-intl";
import styles from "./contact.module.css";

export function ContactSuccess() {
    const t = useTranslations();

    return (
        <div className={styles.successContainer}>
            <div className={styles.successIcon}>
                <i className="pi pi-check-circle" style={{ fontSize: '4rem' }}></i>
            </div>
            <h2 className={styles.successTitle}>{t("THANK_YOU")}</h2>
            <p className={styles.successMessage}>{t("CONTACT_SUCCESS_MESSAGE")}</p>
        </div>
    );
} 