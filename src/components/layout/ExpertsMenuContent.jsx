import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Scale, Home, CreditCard, Banknote, Palette, Building } from 'lucide-react';

const experts = [
  { name: "Lawyers", href: createPageUrl("Experts?expertise=lawyer"), description: "Navigate legal complexities", icon: Scale },
  { name: "Realtors", href: createPageUrl("Experts?expertise=realtor"), description: "Find your perfect property", icon: Home },
  { name: "Mortgage Advisors", href: createPageUrl("Experts?expertise=mortgage_advisor"), description: "Secure the best financing", icon: CreditCard },
  { name: "Money Exchange", href: createPageUrl("Experts?expertise=money_exchange"), description: "Optimize your currency transfers", icon: Banknote },
  { name: "Interior Designers", href: createPageUrl("Experts?expertise=interior_designer"), description: "Transform your space beautifully", icon: Palette },
  { name: "Property Management", href: createPageUrl("Experts?expertise=property_management"), description: "Professional property care", icon: Building },
];

const ListItem = React.forwardRef(({ className, title, children, href, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          ref={ref}
          className={`flex items-start gap-3 select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`}
          {...props}
        >
          <div className="p-2 bg-gray-100 rounded-md mt-1">
            <Icon className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";


export default function ExpertsMenuContent() {
  return (
    <div className="p-4 md:w-[500px] lg:w-[600px]">
      <ul className="grid gap-3 grid-cols-2">
        {experts.map((expert) => (
          <ListItem
            key={expert.name}
            title={expert.name}
            href={expert.href}
            icon={expert.icon}
          >
            {expert.description}
          </ListItem>
        ))}
      </ul>
    </div>
  );
}