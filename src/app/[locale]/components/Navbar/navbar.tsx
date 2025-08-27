"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./navbar.module.css";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useLogin } from "@/hooks/useLogin";
import { useLocale } from "@/hooks/useLocale";

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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, getStoredUser, logout } = useLogin();
  const [user, setUser] = useState<any>(null);
  const { currentLocale } = useLocale();

  // Ensure component is mounted before rendering authentication-dependent content
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Load user data when authenticated
  useEffect(() => {
    if (mounted && isAuthenticated()) {
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
    } else if (mounted) {
      setUser(null);
    }
  }, [mounted, isAuthenticated, getStoredUser]);

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
        { label: t(`GENERATORS`), url: "/generators" },
        { label: t(`TRAININGS`) },
        { label: t(`DOCUMENTATION`), url: "/docs" },
        { label: "Virtual Assistant", url: "/virtual-assistant" },
      ],
    },
    {
      label: t(`GAMES`),
      url: "/games",
    },
    { label: t(`CONTACT`), url: "#contact", rel: "noopener noreferrer" },
  ];

  // Admin menu items
  const adminMenuItems: MenuItem[] = [
    {
      label: "Dashboard",
      url: `/${currentLocale}/admin`,
    },
    {
      label: "Posts",
      url: `/${currentLocale}/admin/posts`,
    },
    {
      label: "Categories",
      url: `/${currentLocale}/admin/categories`,
    },
    {
      label: "Users",
      url: `/${currentLocale}/admin/users`,
    },
    {
      label: "Comments",
      url: `/${currentLocale}/admin/comments`,
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
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
        // Check if the URL already has a locale prefix
        const urlSegments = item.url.split('/');
        const hasLocale = ['en', 'es', 'pt'].includes(urlSegments[1]);
        
        if (hasLocale) {
          // URL already has locale, use it as is
          router.push(item.url);
        } else {
          // URL doesn't have locale, add it
          const cleanUrl = item.url.replace(/^\//, "");
          router.push(`/${currentLocale}/${cleanUrl}`);
        }
      }
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
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
          isScrolled || pathname !== `/${pathname.split('/')[1]}`
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
            onClick={() => router.push(`/${currentLocale}`)}
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
              
              {/* User Menu */}
              {mounted && isAuthenticated() && user && (
                <li className={styles.userMenu}>
                  <div className={styles.userInfo} onClick={toggleUserMenu}>
                    <div className={styles.userAvatar}>
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </div>
                    <span className={styles.userName}>
                      {user.first_name} {user.last_name}
                    </span>
                    <i className={`pi pi-chevron-down ${styles.userMenuIcon}`} />
                  </div>
                  
                  {isUserMenuOpen && (
                    <ul className={styles.userSubMenu}>
                      <li className={styles.userDetails}>
                        <div className={styles.userEmail}>{user.email}</div>
                        <div className={styles.userRoles}>
                          {user.roles?.map((role: string, index: number) => (
                            <span key={index} className={styles.userRole}>
                              {role}
                            </span>
                          ))}
                        </div>
                      </li>
                      
                      {/* Admin Menu Items */}
                      {user.roles?.includes('admin') && (
                        <>
                          <li className={styles.menuDivider}></li>
                          {adminMenuItems.map((item, index) => (
                            <li key={index} onClick={() => handleMenuClick(index, item)}>
                              <a onClick={(e) => e.preventDefault()}>
                                {item.label}
                              </a>
                            </li>
                          ))}
                        </>
                      )}
                      
                      <li className={styles.menuDivider}></li>
                      <li onClick={handleLogout}>
                        <a onClick={(e) => e.preventDefault()}>
                          <i className="pi pi-sign-out" />
                          Logout
                        </a>
                      </li>
                    </ul>
                  )}
                </li>
              )}
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
