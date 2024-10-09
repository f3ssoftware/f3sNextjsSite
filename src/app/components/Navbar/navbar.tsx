"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./navbar.module.css";

interface MenuItem {
  label: string;
  url: string;
  target?: string;
  rel?: string;
  subMenu?: MenuItem[]; // Submenu como array de MenuItem
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<number | null>(null);

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
    { label: "About us", url: "/" },
    {
      label: "Development",
      url: "#", // Impede o redirecionamento
      subMenu: [{ label: "Design", url: "/design" }],
    },
    { label: "Business", url: "https://medium.com/@f3ssoftware", target: "_blank", rel: "noopener noreferrer" },
    { label: "Games", url: "https://wa.me/5561981494249", target: "_blank", rel: "noopener noreferrer" },
    { label: "Contact", url: "/", rel: "noopener noreferrer" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSubMenu = (index: number) => {
    setOpenSubMenu(openSubMenu === index ? null : index); 
  };

  return (
    <>
      <header className={`${styles.navbar} ${isScrolled ? styles.scrolled : styles.transparent}`}>
        <div className={styles.navContent}>
          {/* Logo */}
          <div className={styles.logo}>
            <Image
              src="/img/logo_f3s_site.png"
              width={200}
              height={35}
              alt="F3S Software Logo"
            />
          </div>

          {/* Botão para mobile */}
          <button className={styles.menuToggle} onClick={toggleMobileMenu}>
            <i className="pi pi-bars" />
          </button>

          {/* Menu de navegação */}
          <nav className={`${styles.navMenu} ${isMobileMenuOpen ? styles.open : ""}`}>
            <ul>
              {menuItems.map((item, index) => (
                <li key={index} onClick={() => toggleSubMenu(index)}>
                  <a href={item.url} target={item.target} rel={item.rel}>
                    {item.label}
                  </a>
                  {/* Verifique se item.subMenu existe e tem elementos */}
                  {item.subMenu && item.subMenu.length > 0 && openSubMenu === index && (
                    <ul className={styles.subMenu}>
                      {item.subMenu.map((subItem, subIndex) => (
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

      {/* Sobreposição */}
      {isMobileMenuOpen && <div className={styles.overlay} onClick={toggleMobileMenu}></div>}
    </>
  );
}
