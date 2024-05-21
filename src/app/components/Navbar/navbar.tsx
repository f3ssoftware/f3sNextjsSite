import React from "react";
import { Menubar } from "primereact/menubar";
import Image from "next/image";
import "./navbar.css";

export function Navbar() {
  const menuItems = [
    {
      label: "About",
      icon: "pi pi-fw pi-info",
      url: "/",
    },
    {
      label: "Blog",
      icon: "pi pi-fw pi-pencil",
      url: "https://medium.com/@f3ssoftware",
      target: "_blank",
      rel: "noopener noreferrer",
    },
    {
      label: "Hire Us",
      icon: "pi pi-fw pi-users",
      url: "https://wa.me/5561981494249",
      target: "_blank",
      rel: "noopener noreferrer",
    },
  ];

  return (
    <div>
      <header>
        <section className="f3s-header">
          <div className="initial-card">
            <Image
              src="/img/F3S Software.png"
              width={200}
              height={50}
              alt="F3S Software Logo"
            />
          </div>
          <nav>
            <Menubar model={menuItems} />
          </nav>
        </section>
      </header>
    </div>
  );
}
