"use client";

import { useRef, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useTranslations } from "next-intl";
import styles from "./contact.module.css";
import { useContactForm } from "./useContactForm";
import { ContactFormData, ContactProps } from "./types";
import { ContactSuccess } from "./ContactSuccess";

export function Contact({}: ContactProps) {
    const toast = useRef<Toast>(null);
    const t = useTranslations();
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const {
        formData,
        isLoading: internalLoading,
        setIsLoading,
        subjectOptions,
        profileOptions,
        handleProfileChange,
        handleSubjectChange,
        handleNameChange,
        handleEmailChange,
        handleMessageChange,
        validateForm,
    } = useContactForm();

    const isLoading = internalLoading;

    const onSubmit = async (formData: ContactFormData) => {
        setTimeout(() => {
            console.log(formData);
        }, 1000*10);
    };

    const showSuccess = () => {
        toast?.current?.show({
            severity: "success",
            summary: t("SUCCESS"),
            detail: t("MESSAGE_SENT"),
        });
    };

    const showError = (message: string) => {
        toast?.current?.show({
            severity: "error",
            summary: t("ERROR"),
            detail: message,
        });
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            showError(t("PLEASE_FILL_ALL_FIELDS"));
            return;
        }

        try {
            setIsLoading(true);
            await onSubmit(formData);
            showSuccess();
            setIsSubmitted(true);
        } catch (error) {
            showError(error instanceof Error ? error.message : t("UNKNOWN_ERROR"));
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <section id="contact">
                <div className={styles.topSectionCt} />
                <div className={styles.backgroundCt}>
                    <ContactSuccess />
                </div>
            </section>
        );
    }

    return (
        <section id="contact">
            <Toast ref={toast} />
            <div className={styles.topSectionCt} />
            <div className={styles.backgroundCt}>
                <div className={styles.contactDiv}>
                    <h1 className={styles.contact}>{t("CONTACT")}</h1>
                </div>

                <div className={styles.contactParagraph}>
                    <p>{t("CONTACT_PARAGRAPH")}</p>
                </div>

                <div className={styles.formContainer}>
                    <div className={styles.formField}>
                        <Dropdown
                            value={formData.profile}
                            onChange={(e) => handleProfileChange(e.value)}
                            options={profileOptions}
                            optionLabel="key"
                            placeholder={t("CHOOSE_A_PROFILE")}
                            className="w-full"
                            style={{ width: "100%" }}
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.formField}>
                        <Dropdown
                            value={formData.subject}
                            onChange={(e) => handleSubjectChange(e.value)}
                            options={subjectOptions}
                            optionLabel="key"
                            placeholder={t("CHOOSE_A_SUBJECT")}
                            disabled={!formData.profile || isLoading}
                            className="w-full"
                            style={{ width: "100%" }}
                        />
                    </div>

                    <div className={styles.formField}>
                        <InputText
                            value={formData.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder={t("FULLNAME")}
                            className="w-full"
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.formField}>
                        <InputText
                            value={formData.email}
                            onChange={(e) => handleEmailChange(e.target.value)}
                            placeholder={t("EMAIL")}
                            className="w-full"
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.formField}>
                        <InputTextarea
                            value={formData.message}
                            onChange={(e) => handleMessageChange(e.target.value)}
                            placeholder={t("INSERT_A_MESSAGE")}
                            rows={20}
                            className="w-full"
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.submitButton}>
                        <Button
                            label={t("SEND_MESSAGE")}
                            onClick={handleSubmit}
                            loading={isLoading}
                            disabled={isLoading}
                            icon="pi pi-paper-plane"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
