"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./navbar.module.css";
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { trackClickEvent } from "@/utils/analytics"; 

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
        { label: "Blog", url: "https://medium.com/@f3ssoftware" },
        { label: "Tutoriais", },
        { label: "Documentação", },
      ],
    },
    {
      label: t(`BUSINESS`),
      url: "https://medium.com/@f3ssoftware",
      target: "_blank",
      rel: "noopener noreferrer"
    },
    {
      label: t(`GAMES`),
      url: "https://wa.me/5561981494249",
      target: "_blank",
      rel: "noopener noreferrer"
    },
    { label: t(`CONTACT`), url: "/", rel: "noopener noreferrer" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClick = (index: number, item: MenuItem) => {
    if (item.subMenu && item.subMenu.length > 0) {
      setOpenSubMenu(openSubMenu === index ? null : index);
    } else if (item.url) {
      trackClickEvent(item.label);
      window.location.href = item.url;
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
      <header className={`${styles.navbar} ${isScrolled ? styles.scrolled : styles.transparent}`}>
        <div className={styles.navContent}>
          <div className={styles.languageFlags}>
            <button onClick={() => changeLanguage('en')}>
              <Image src="/img/USA flag.svg" width={1235} height={650} alt="English" className={styles.flag} />
            </button>
            <button onClick={() => changeLanguage('es')}>
              <Image src="/img/Spain Flag.png" width={30} height={30} alt="Español" className={styles.flag} />
            </button>
            <button onClick={() => changeLanguage('pt')}>
              <Image src="/img/Flag_of_Brazil.svg" width={1000} height={700} alt="Português" className={styles.flag} />
            </button>
          </div>
          <div className={styles.navMainContant}>
            <div className={styles.logo}>
              <Image src="/img/logo_f3s_site.png" width={200} height={35} alt="F3S Software Logo" className={styles.logoImage} />
            </div>
            <button className={styles.menuToggle} onClick={toggleMobileMenu}>
              <i className="pi pi-bars" />
            </button>
          </div>
          <nav className={`${styles.navMenu} ${isMobileMenuOpen ? styles.open : ""}`}>
            <ul>
              {menuItems.map((item, index) => (
                <li key={index} onClick={() => handleMenuClick(index, item)}>
                  <a href={item.url} target={item.target} rel={item.rel}>
                    {item.label}
                  </a>
                  {item.subMenu && openSubMenu === index && (
                    <ul className={styles.subMenu}>
                      {item.subMenu.map((subItem: MenuItem, subIndex: number) => (
                        <li key={subIndex}>
                          <a href={subItem.url} target={subItem.target} rel={subItem.rel}>
                            {subItem.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {isMobileMenuOpen && <div className={styles.overlay} onClick={toggleMobileMenu}></div>}
    </>
  );
}
