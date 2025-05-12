"use client";
import { BreadCrumb } from "primereact/breadcrumb";
import { usePathname, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function NavigationBredCrumb() {
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations();
  const locale = params.locale as string;

  const generateBreadcrumbItems = () => {
    const paths = pathname.split('/').filter(Boolean);
    const items = [];

    // Skip the locale in the breadcrumb display but keep it in the URL
    if (paths[0] === locale) {
      paths.shift();
    }

    let currentPath = `/${locale}`;
    for (const path of paths) {
      currentPath += `/${path}`;
      // Capitalize first letter and replace hyphens with spaces
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
      
      items.push({
        label: t(label.toUpperCase()) || label,
        icon: getIconForPath(path),
        url: currentPath
      });
    }

    return items;
  };

  const getIconForPath = (path: string) => {
    switch (path.toLowerCase()) {
      case 'games':
        return 'pi pi-gamepad';
      case 'tibia':
        return 'pi pi-gamepad';
      case 'blog':
        return 'pi pi-book';
      case 'contact':
        return 'pi pi-envelope';
      case 'about':
        return 'pi pi-info-circle';
      default:
        return 'pi pi-folder';
    }
  };

  const home = { 
    icon: "pi pi-home", 
    url: `/${locale}` 
  };

  return <BreadCrumb model={generateBreadcrumbItems()} home={home} />;
}
