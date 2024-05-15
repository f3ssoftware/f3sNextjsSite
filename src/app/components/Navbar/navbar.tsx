import React, { useState } from "react";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Menubar } from 'primereact/menubar';
import "./navbar.css";

export function Navbar() {


  const menuItems = [
    {
      label: "About",
      icon: "pi pi-fw pi-info",
      url: "/LandPage",
    },
    {
      label: "Blog",
      icon: "pi pi-fw pi-pencil",
      url: "https://medium.com/@f3ssoftware",
      target: "_blank",
    },
    {
      label: "Hire Us",
      icon: "pi pi-fw pi-users",
      url: "https://wa.me/5561981494249",
      target: "_blank",
    },
  ];

  return (
    <div>
      <header>
        <section className="f3s-header">
          <div className="initial-card">
            <img src="/img/F3S Software.png" alt="F3S Software Logo" />
          </div>
          <nav>
            <Menubar model={menuItems} />
          </nav>
        </section>
      </header>
    </div>
  );
}
