"use client"
import React, { useEffect, useState } from "react";
import { Menubar } from "primereact/menubar";
import Image from "next/image";
import styles from "./navbar.module.css";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {

      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);


    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const menuItems = [
    {
      label: "About us",
      url: "/",
    },
    {
      label: "Development",
      url: "/",
    },
    {
      label: "Business",
      url: "https://medium.com/@f3ssoftware",
      target: "_blank",
      rel: "noopener noreferrer",
    },
    {
      label: "Games",
      url: "https://wa.me/5561981494249",
      target: "_blank",
      rel: "noopener noreferrer",
    },
    {
      label: "Contact",
      url: '/',
      rel: "noopener noreferrer",
    },
  ];

  return (
    <div>
      <header>
        <section className={!isScrolled ? `${styles.f3sHeader} ${styles.transparent}` : styles.f3sHeader}>
          <nav>
            <Menubar model={menuItems} start={<Image
              src="/img/logo_f3s_site.png"
              width={200}
              height={35}
              alt="F3S Software Logo"
            />} />
          </nav>
        </section>
      </header>
    </div>
  );
}

