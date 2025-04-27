"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./navbar.module.css";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

interface MenuItem {
  label: string;
  url?: string;
  target?: string;
  rel?: string;
  subMenu?: MenuItem[];
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<number | null>(null);
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const menuItems: MenuItem[] = [
    { label: t(`ABOUT_US`), url: "#section-about" },
    {
      label: t(`DEVELOPMENT`),
      subMenu: [
        {
          label: t(`BLOG`),
          url: "https://medium.com/@f3ssoftware",
          target: "_blank",
          rel: "noopener noreferrer",
        },
        { label: t(`GENERATORS`) },
        { label: t(`TRAININGS`) },
        { label: t(`DOCUMENTATION`) },
      ],
    },
    {
      label: t(`BUSINESS`),
      url: "https://medium.com/@f3ssoftware",
      target: "_blank",
      rel: "noopener noreferrer",
    },
    {
      label: t(`GAMES`),
      url: "/games",
    },
    { label: t(`CONTACT`), url: "#contact", rel: "noopener noreferrer" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClick = (index: number, item: MenuItem) => {
    if (item.subMenu && item.subMenu.length > 0) {
      setOpenSubMenu(openSubMenu === index ? null : index);
    } else if (item.url) {
      const isExternalUrl = /^https?:\/\//.test(item.url);

      if (isExternalUrl) {
        window.open(item.url, item.target || "_self");
      } else if (item.url.startsWith("#")) {
        window.location.href = item.url;
      } else {
        const currentLocale = pathname.split("/")[1];
        const cleanUrl = item.url.replace(/^\//, "");
        router.push(`/${currentLocale}/${cleanUrl}`);
      }
    }
  };

  const changeLanguage = (lang: string) => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments[0] === "en" || segments[0] === "pt" || segments[0] === "es") {
      segments[0] = lang;
    } else {
      segments.unshift(lang);
    }

    router.push(`/${segments.join("/")}`);
  };

  return (
    <>
      <header
        className={`${styles.navbar} ${
          isScrolled || pathname.includes("/games")
            ? styles.scrolled
            : styles.transparent
        }`}
      >
        <div className={styles.navContent}>
          <div className={styles.languageFlags}>
            <button onClick={() => changeLanguage("en")}>
              <Image
                src="/img/USA flag.svg"
                width={1235}
                height={650}
                alt="English"
                className={styles.flag}
              />
            </button>
            <button onClick={() => changeLanguage("es")}>
              <Image
                src="/img/Spain Flag.png"
                width={30}
                height={30}
                alt="Español"
                className={styles.flag}
              />
            </button>
            <button onClick={() => changeLanguage("pt")}>
              <Image
                src="/img/Flag_of_Brazil.svg"
                width={1000}
                height={700}
                alt="Português"
                className={styles.flag}
              />
            </button>
          </div>
          <div
            className={styles.navMainContant}
            onClick={() => router.push("/")}
          >
            <div className={styles.logo}>
              <Image
                style={{ cursor: "pointer" }}
                src="/img/logo_f3s_site.png"
                width={200}
                height={35}
                alt="F3S Software Logo"
                className={styles.logoImage}
              />
            </div>
            <button className={styles.menuToggle} onClick={toggleMobileMenu}>
              <i className="pi pi-bars" />
            </button>
          </div>
          <nav
            className={`${styles.navMenu} ${
              isMobileMenuOpen ? styles.open : ""
            }`}
          >
            <ul>
              {menuItems.map((item, index) => (
                <li key={index} onClick={() => handleMenuClick(index, item)}>
                  <a onClick={(e) => e.preventDefault()}>{item.label}</a>
                  {item.subMenu && openSubMenu === index && (
                    <ul className={styles.subMenu}>
                      {item.subMenu.map(
                        (subItem: MenuItem, subIndex: number) => (
                          <li key={subIndex} onClick={() => handleMenuClick(index, subItem)}>
                            <a onClick={(e) => e.preventDefault()}>
                              {subItem.label}
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className={styles.overlay} onClick={toggleMobileMenu}></div>
      )}
    </>
  );
}
