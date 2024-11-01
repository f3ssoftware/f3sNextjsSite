"use client";
import { useRouter, usePathname } from "next/navigation";
import useTranslation from "next-translate/useTranslation";

export default function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const { t, lang } = useTranslation("common");

  const handleLanguageChange = (newLang: string) => {
    const pathWithoutLang = pathname.replace(/^\/(en|pt|es)/, "");
    router.push(`/${newLang}${pathWithoutLang}`);
  };

  return (
    <div>
      <button onClick={() => handleLanguageChange("en")}>English</button>
      <button onClick={() => handleLanguageChange("es")}>Español</button>
      <button onClick={() => handleLanguageChange("pt")}>Português</button>
    </div>
  );
}
