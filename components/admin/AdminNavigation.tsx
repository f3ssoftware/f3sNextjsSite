'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { useLogin } from '@/hooks/useLogin';

interface AdminNavigationProps {
  user?: any;
}

export default function AdminNavigation({ user }: AdminNavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useLogin();

  // Extract locale from pathname (e.g., /en/admin/posts -> en)
  const getLocaleFromPath = (path: string) => {
    const segments = path.split('/');
    return segments[1] || 'en'; // Default to 'en' if no locale found
  };

  const currentLocale = getLocaleFromPath(pathname);

  const navigationItems = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      href: `/${currentLocale}/admin`,
      active: pathname === `/${currentLocale}/admin`
    },
    {
      label: 'Posts',
      icon: 'pi pi-file-edit',
      href: `/${currentLocale}/admin/posts`,
      active: pathname.startsWith(`/${currentLocale}/admin/posts`)
    },
    {
      label: 'Categories',
      icon: 'pi pi-tags',
      href: `/${currentLocale}/admin/categories`,
      active: pathname.startsWith(`/${currentLocale}/admin/categories`)
    },
    {
      label: 'Users',
      icon: 'pi pi-users',
      href: `/${currentLocale}/admin/users`,
      active: pathname.startsWith(`/${currentLocale}/admin/users`)
    },
    {
      label: 'Comments',
      icon: 'pi pi-comments',
      href: `/${currentLocale}/admin/comments`,
      active: pathname.startsWith(`/${currentLocale}/admin/comments`)
    }
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div className="bg-white shadow-1 border-bottom-1 surface-border">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-content-between align-items-center">
          <div className="flex align-items-center">
            <div className="inline-flex align-items-center justify-content-center w-10 h-10 bg-primary border-circle mr-3">
              <i className="pi pi-shield text-white"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-900 m-0">Admin Dashboard</h1>
              <p className="text-600 text-sm m-0">F3S Software Administration</p>
            </div>
          </div>
          
          <div className="flex align-items-center gap-3">
            {user && (
              <div className="flex align-items-center gap-2">
                <div className="text-right">
                  <p className="text-900 font-medium text-sm m-0">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-600 text-xs m-0">{user.email}</p>
                </div>
              </div>
            )}
            <Button
              label="Logout"
              icon="pi pi-sign-out"
              severity="secondary"
              size="small"
              onClick={logout}
            />
          </div>
        </div>
        
        {/* Navigation Menu */}
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {navigationItems.map((item) => (
            <Button
              key={item.href}
              label={item.label}
              icon={item.icon}
              severity={item.active ? 'success' : 'secondary'}
              size="small"
              text={!item.active}
              onClick={() => handleNavigation(item.href)}
              className={item.active ? 'font-medium' : ''}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 