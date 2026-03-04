import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Users,
  User,
  Menu,
  X,
  ChevronDown,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import AboutMenuContent from "./components/layout/AboutMenuContent";
import PropertiesMenuContent from "./components/layout/PropertiesMenuContent";
import ExpertsMenuContent from "./components/layout/ExpertsMenuContent";
import MagazineMenuContent from "./components/layout/MagazineMenuContent";
import AnimatedMenuIcon from "./components/layout/AnimatedMenuIcon";

const mainNavItems = [
  { title: "About", component: <AboutMenuContent /> },
  { title: "Properties", component: <PropertiesMenuContent /> },
  { title: "Experts", component: <ExpertsMenuContent /> },
  { title: "Magazine", component: <MagazineMenuContent /> },
];

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = React.useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [expandedSections, setExpandedSections] = React.useState({});

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
    };
    loadUser();
  }, []);

  const handleLogin = async () => {
    const returnUrl = window.location.href;
    await base44.auth.redirectToLogin(returnUrl);
  };
  
  const handleRegister = () => {
    window.location.href = createPageUrl('Register');
  };

  const handleLogout = async () => {
    try {
      await base44.auth.logout();
    } catch (err) {
      console.error('Logout error (ignored):', err);
    }
    // Always clear local state and reload, even if signOut threw
    setUser(null);
    window.location.href = window.location.origin;
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        :root {
          --primary: #334155;
          --primary-foreground: #f8fafc;
          --secondary: #f59e0b;
          --accent: #f1f5f9;
          --muted: #64748b;
        }
      `}</style>

      {/* Magazine Banner */}
      <Link to={createPageUrl("Magazine")} className="block">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 text-center hover:from-blue-700 hover:to-purple-700 transition-all">
          <p className="text-sm md:text-base font-semibold">
            ✨ Winter 2026 Magazine Now Live! <span className="hidden sm:inline">Click to read the latest issue</span> →
          </p>
        </div>
      </Link>

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-28 relative">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center space-x-3 mx-auto lg:mx-0">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c254383f4_IsraelProperty360logo.png"
                alt="IsraelProperty360"
                className="h-28 w-auto"
              />
            </Link>

            {/* Desktop Mega Menu Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {mainNavItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      {item.component}
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
                 <NavigationMenuItem>
                  <Link to={createPageUrl("Cities")} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Cities
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to={createPageUrl("Events")} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Events
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to={createPageUrl("Blog")} legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Blog
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* User Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <NavigationMenu>
                  <NavigationMenuList>
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>
                        <User className="w-4 h-4 mr-2" />
                        {user.full_name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-3 p-4">
                          {user.user_type === 'broker' && (
                            <>
                              <li><NavigationMenuLink asChild><Link to={createPageUrl("BrokerDashboard")} className="block p-2 rounded-md hover:bg-accent">My Dashboard</Link></NavigationMenuLink></li>
                              <li><NavigationMenuLink asChild><Link to={createPageUrl("ListProperty")} className="block p-2 rounded-md hover:bg-accent">List Property</Link></NavigationMenuLink></li>
                            </>
                          )}
                          {user.user_type === 'visitor' && (
                            <>
                              <li><NavigationMenuLink asChild><Link to={createPageUrl("VisitorDashboard")} className="block p-2 rounded-md hover:bg-accent">My Dashboard</Link></NavigationMenuLink></li>
                              <li><NavigationMenuLink asChild><Link to={createPageUrl("Favorites")} className="block p-2 rounded-md hover:bg-accent">My Favorites</Link></NavigationMenuLink></li>
                              <li><NavigationMenuLink asChild><Link to={createPageUrl("PropertyAlerts")} className="block p-2 rounded-md hover:bg-accent">Property Alerts</Link></NavigationMenuLink></li>
                            </>
                          )}
                          {user.role === 'admin' && (
                            <>
                              <li className="border-t pt-2"><NavigationMenuLink asChild><Link to={createPageUrl("AdminUsers")} className="block p-2 rounded-md hover:bg-accent font-semibold text-blue-600">Admin: Users</Link></NavigationMenuLink></li>
                              <li><NavigationMenuLink asChild><Link to={createPageUrl("AdminReviewProperties")} className="block p-2 rounded-md hover:bg-accent font-semibold text-blue-600">Admin: Review Properties</Link></NavigationMenuLink></li>
                              <li><NavigationMenuLink asChild><Link to={createPageUrl("AdminReviewExperts")} className="block p-2 rounded-md hover:bg-accent font-semibold text-blue-600">Admin: Review Experts</Link></NavigationMenuLink></li>
                              <li><NavigationMenuLink asChild><Link to={createPageUrl("AdminReviewEvents")} className="block p-2 rounded-md hover:bg-accent font-semibold text-blue-600">Admin: Review Events</Link></NavigationMenuLink></li>
                              <li><NavigationMenuLink asChild><Link to={createPageUrl("AdminSetupBlog")} className="block p-2 rounded-md hover:bg-accent font-semibold text-blue-600">Admin: Setup Blog</Link></NavigationMenuLink></li>
                            </>
                          )}
                          <li><button onClick={handleLogout} className="w-full text-left p-2 rounded-md hover:bg-accent cursor-pointer">Logout</button></li>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              ) : (
                <div className="flex items-center space-x-2">
                   <Button variant="ghost" onClick={handleLogin}>Login</Button>
                   <Button onClick={handleRegister} className="bg-[var(--secondary)] hover:bg-yellow-600 text-white">Register</Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden absolute right-4">
                <Button variant="ghost" size="icon">
                  <AnimatedMenuIcon isOpen={mobileMenuOpen} />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="py-6">
                  <nav className="flex flex-col space-y-2">
                    {/* About Section */}
                    <Collapsible open={expandedSections.about} onOpenChange={() => toggleSection('about')}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 font-semibold hover:bg-accent rounded-md">
                        About
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.about ? 'rotate-180' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4 pt-2 space-y-1">
                        <SheetClose asChild>
                          <Link to={createPageUrl("About")} className="block p-2 hover:bg-accent rounded-md text-sm">About IsraelProperty360</Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to={createPageUrl("Contact")} className="block p-2 hover:bg-accent rounded-md text-sm">Contact Us</Link>
                        </SheetClose>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Properties Section */}
                    <Collapsible open={expandedSections.properties} onOpenChange={() => toggleSection('properties')}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 font-semibold hover:bg-accent rounded-md">
                        Properties
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.properties ? 'rotate-180' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4 pt-2 space-y-1">
                        <SheetClose asChild>
                          <Link to={createPageUrl("Properties")} className="block p-2 hover:bg-accent rounded-md text-sm">All Properties</Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to={createPageUrl("Properties?status=for_sale")} className="block p-2 hover:bg-accent rounded-md text-sm">For Sale</Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to={createPageUrl("Properties?status=in_development")} className="block p-2 hover:bg-accent rounded-md text-sm">New Construction</Link>
                        </SheetClose>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Experts Section */}
                    <Collapsible open={expandedSections.experts} onOpenChange={() => toggleSection('experts')}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 font-semibold hover:bg-accent rounded-md">
                        Experts
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.experts ? 'rotate-180' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4 pt-2 space-y-1">
                        <SheetClose asChild>
                          <Link to={createPageUrl("Experts")} className="block p-2 hover:bg-accent rounded-md text-sm">All Experts</Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to={createPageUrl("Experts?expertise=lawyer")} className="block p-2 hover:bg-accent rounded-md text-sm">Lawyers</Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to={createPageUrl("Experts?expertise=realtor")} className="block p-2 hover:bg-accent rounded-md text-sm">Realtors</Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to={createPageUrl("Experts?expertise=mortgage_advisor")} className="block p-2 hover:bg-accent rounded-md text-sm">Mortgage Advisors</Link>
                        </SheetClose>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Magazine Section */}
                    <Collapsible open={expandedSections.magazine} onOpenChange={() => toggleSection('magazine')}>
                      <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 font-semibold hover:bg-accent rounded-md">
                        Magazine
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedSections.magazine ? 'rotate-180' : ''}`} />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4 pt-2 space-y-1">
                        <SheetClose asChild>
                          <Link to={createPageUrl("Magazine")} className="block p-2 hover:bg-accent rounded-md text-sm">Latest Issue</Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link to={createPageUrl("Blog")} className="block p-2 hover:bg-accent rounded-md text-sm">Articles & Blog</Link>
                        </SheetClose>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Direct Links */}
                    <SheetClose asChild>
                      <Link to={createPageUrl("Cities")} className="font-semibold px-4 py-3 hover:bg-accent rounded-md block">Cities</Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link to={createPageUrl("Events")} className="font-semibold px-4 py-3 hover:bg-accent rounded-md block">Events</Link>
                    </SheetClose>
                    </nav>

                  <div className="border-t mt-6 pt-6">
                    {user ? (
                      <div className="space-y-2">
                        <p className="font-semibold px-4 mb-3">{user.full_name}</p>
                        {user.user_type === 'visitor' && (
                          <>
                            <SheetClose asChild><Link to={createPageUrl("VisitorDashboard")} className="block px-4 py-2 hover:bg-accent rounded-md">My Dashboard</Link></SheetClose>
                            <SheetClose asChild><Link to={createPageUrl("Favorites")} className="block px-4 py-2 hover:bg-accent rounded-md">My Favorites</Link></SheetClose>
                            <SheetClose asChild><Link to={createPageUrl("PropertyAlerts")} className="block px-4 py-2 hover:bg-accent rounded-md">Property Alerts</Link></SheetClose>
                          </>
                        )}
                        {user.user_type === 'broker' && (
                          <>
                            <SheetClose asChild><Link to={createPageUrl("BrokerDashboard")} className="block px-4 py-2 hover:bg-accent rounded-md">My Dashboard</Link></SheetClose>
                            <SheetClose asChild><Link to={createPageUrl("ListProperty")} className="block px-4 py-2 hover:bg-accent rounded-md">List Property</Link></SheetClose>
                          </>
                        )}
                        {user.role === 'admin' && (
                          <div className="border-t pt-2 mt-2">
                            <SheetClose asChild><Link to={createPageUrl("AdminUsers")} className="block px-4 py-2 hover:bg-accent rounded-md font-semibold text-blue-600">Admin: Users</Link></SheetClose>
                            <SheetClose asChild><Link to={createPageUrl("AdminReviewProperties")} className="block px-4 py-2 hover:bg-accent rounded-md font-semibold text-blue-600">Admin: Review Properties</Link></SheetClose>
                            <SheetClose asChild><Link to={createPageUrl("AdminReviewExperts")} className="block px-4 py-2 hover:bg-accent rounded-md font-semibold text-blue-600">Admin: Review Experts</Link></SheetClose>
                            <SheetClose asChild><Link to={createPageUrl("AdminReviewEvents")} className="block px-4 py-2 hover:bg-accent rounded-md font-semibold text-blue-600">Admin: Review Events</Link></SheetClose>
                            <SheetClose asChild><Link to={createPageUrl("AdminSetupBlog")} className="block px-4 py-2 hover:bg-accent rounded-md font-semibold text-blue-600">Admin: Setup Blog</Link></SheetClose>
                          </div>
                        )}
                        <Button variant="ghost" onClick={handleLogout} className="w-full justify-start px-4">Logout</Button>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-2 px-4">
                        <Button variant="outline" onClick={handleLogin}>Login</Button>
                        <Button onClick={handleRegister} className="bg-[var(--secondary)] hover:bg-yellow-600 text-white">Register</Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[var(--primary)] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/c254383f4_IsraelProperty360logo.png"
                alt="IsraelProperty360"
                className="h-20 w-auto mb-4 filter brightness-0 invert"
              />
              <p className="text-gray-300 max-w-md mb-6">
                Your comprehensive guide to purchasing property in Israel.
                Connect with experts, explore cities, and find your perfect property.
              </p>
              <div className="flex items-center gap-3 border-t border-slate-600 pt-4">
                <span className="text-gray-400 text-sm">Brought to you by</span>
                <a 
                  href="https://isratransfer.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <img
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b59458f2008a3ee903522b/a2109d6fb_isratrasfer_color_CMYK_01.png"
                    alt="IsraTransfer"
                    className="h-8 w-auto"
                  />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link to={createPageUrl("Properties")} className="block text-gray-300 hover:text-white transition-colors">
                  Browse Properties
                </Link>
                <Link to={createPageUrl("Cities")} className="block text-gray-300 hover:text-white transition-colors">
                  Explore Cities
                </Link>
                <Link to={createPageUrl("Experts")} className="block text-gray-300 hover:text-white transition-colors">
                  Find Experts
                </Link>
                <Link to={createPageUrl("Blog")} className="block text-gray-300 hover:text-white transition-colors">
                  Blog & Articles
                </Link>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <div className="space-y-2">
                <Link to={createPageUrl("Wiki")} className="block text-gray-300 hover:text-white transition-colors">
                  Real Estate A-Z
                </Link>
                <Link to={createPageUrl("TermsAndConditions")} className="block text-gray-300 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
                <Link to={createPageUrl("PrivacyPolicy")} className="block text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link to={createPageUrl("Disclaimer")} className="block text-gray-300 hover:text-white transition-colors">
                  Disclaimer
                </Link>
                <Link to={createPageUrl("Contact")} className="block text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-600 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 IsraelProperty360. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}