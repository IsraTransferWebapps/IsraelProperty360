import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Info, HelpCircle, Mail, Phone } from 'lucide-react';
import {
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const ListItem = React.forwardRef(({ className, title, children, href, icon: Icon, onClick, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          ref={ref}
          onClick={onClick}
          className={`flex items-start gap-3 select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${className}`}
          {...props}
        >
          <div className="p-2 bg-gray-100 rounded-md flex-shrink-0">
            <Icon className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium leading-tight">{title}</div>
            <p className="text-sm leading-snug text-muted-foreground mt-1">
              {children}
            </p>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default function AboutMenuContent() {
  const scrollToSection = (sectionId) => {
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="p-4 md:w-[400px] lg:w-[500px]">
      <ul className="grid gap-3">
        <ListItem 
          href={createPageUrl("About")} 
          title="About IsraelProperty360"
          icon={Info}
        >
          Our mission, vision, and comprehensive approach to Israeli real estate.
        </ListItem>
        <ListItem 
          href={createPageUrl("About")} 
          title="The Buying Process"
          icon={HelpCircle}
          onClick={() => scrollToSection('buying-process')}
        >
          Step-by-step guide to purchasing property in Israel with expert support.
        </ListItem>
        <ListItem 
          href={createPageUrl("Contact")} 
          title="Contact Us"
          icon={Phone}
        >
          Get in touch with our team for personalized assistance and guidance.
        </ListItem>
        <ListItem 
          href={createPageUrl("About")} 
          title="Connect With Us"
          icon={Mail}
          onClick={() => scrollToSection('connect-with-us')}
        >
          Subscribe to our newsletter and follow us on social media for updates.
        </ListItem>
      </ul>
    </div>
  );
}