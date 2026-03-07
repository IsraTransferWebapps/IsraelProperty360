import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Archive, Mail } from 'lucide-react';
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
          <div className="p-2 bg-amber-50 rounded-md flex-shrink-0">
            <Icon className="w-5 h-5 text-amber-600" />
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
          href="/magazine"
          title="Magazine Home"
          icon={BookOpen}
        >
          Your monthly guide to buying property in Israel — expert insights delivered free.
        </ListItem>
        <ListItem
          href="/magazine/latest"
          title="Current Issue"
          icon={Calendar}
        >
          Read the latest issue with articles from lawyers, mortgage advisors, and realtors.
        </ListItem>
        <ListItem
          href="/magazine#archive"
          title="Past Issues"
          icon={Archive}
        >
          Browse our archive of previous monthly issues.
        </ListItem>
        <ListItem
          href="/magazine#subscribe"
          title="Subscribe"
          icon={Mail}
        >
          Get each new issue delivered straight to your inbox for free.
        </ListItem>
      </ul>
    </div>
  );
}
