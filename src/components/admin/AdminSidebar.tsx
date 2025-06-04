import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  Info,
  Package,
  TreeDeciduousIcon,
  Phone,
  Settings,
  Image,
  Globe
} from 'lucide-react';

const navigation = [
  { name: 'Töölaud', href: '/admin', icon: LayoutDashboard },
  { name: 'Avaleht', href: '/admin/hero', icon: Home },
  { name: 'Meist', href: '/admin/about', icon: Info },
  { name: 'Tooted', href: '/admin/products', icon: Package },
  { name: 'Puidu kokkuost', href: '/admin/wood-purchase', icon: TreeDeciduousIcon },
  { name: 'Kontakt', href: '/admin/contact', icon: Phone },
  { name: 'Pildid', href: '/admin/images', icon: Image },
  { name: 'Tõlked', href: '/admin/translations', icon: Globe },
  { name: 'Seaded', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <nav className="px-4 py-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'bg-forest-50 text-forest-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}