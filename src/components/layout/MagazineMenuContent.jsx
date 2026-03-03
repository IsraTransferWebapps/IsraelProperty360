import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { BookOpen, TrendingUp, Users, Download } from 'lucide-react';
import {
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

const ListItem = React.forwardRef(({ className, title, children, href, icon: Icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={href}
          ref={ref}
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

export default function MagazineMenuContent() {
  return (
    <div className="p-4 md:w-[400px] lg:w-[500px]">
      <ul className="grid gap-3">
        <ListItem 
          href={createPageUrl("Magazine")} 
          title="Latest Issue"
          icon={BookOpen}
        >
          Read our comprehensive guide to Israeli real estate trends and opportunities.
        </ListItem>
        <ListItem 
          href={createPageUrl("Magazine")} 
          title="Market Analysis"
          icon={TrendingUp}
        >
          Deep dive into current market conditions and future predictions for Israeli property.
        </ListItem>
        <ListItem 
          href={createPageUrl("Magazine")} 
          title="Expert Interviews"
          icon={Users}
        >
          Exclusive conversations with leading professionals in Israeli real estate.
        </ListItem>
        <ListItem 
          href={createPageUrl("Magazine")} 
          title="Download Archive"
          icon={Download}
        >
          Access previous issues and build your property knowledge library.
        </ListItem>
      </ul>
    </div>
  );
}