import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Home, Mail, Menu, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

export default function MagazineLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Home", href: "/magazine" },
    { label: "Latest Issue", href: "/magazine/latest" },
    { label: "Archive", href: "/magazine#archive" },
    { label: "Subscribe", href: "/magazine#subscribe" },
  ];

  const isActive = (href) => {
    if (href === "/magazine" && location.pathname === "/magazine") return true;
    if (href !== "/magazine" && location.pathname.startsWith(href.split("#")[0]) && href !== "/magazine") return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Magazine Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Back to main site */}
            <Link
              to="/"
              className="hidden lg:flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Main Site
            </Link>

            {/* Magazine Logo/Title */}
            <Link to="/magazine" className="flex items-center gap-3 mx-auto lg:mx-0">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-none">
                  Israel Property
                </h1>
                <p className="text-xs font-semibold text-amber-600 tracking-[0.2em] uppercase">
                  Magazine
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-amber-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden absolute right-4">
                <Button variant="ghost" size="icon">
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="py-6">
                  <nav className="flex flex-col space-y-1">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link
                          to={link.href}
                          className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-amber-50 hover:text-amber-700 rounded-md transition-colors"
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                  <div className="border-t mt-6 pt-6 px-4">
                    <SheetClose asChild>
                      <Link
                        to="/"
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800"
                      >
                        <Home className="w-4 h-4" />
                        Back to IsraelProperty360
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Magazine Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white leading-none">Israel Property</h3>
                  <p className="text-xs text-amber-400 tracking-[0.2em] uppercase">Magazine</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your monthly guide to purchasing property in Israel. Expert insights on law,
                mortgages, money transfers, and market trends.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Magazine</h3>
              <div className="space-y-2">
                <Link to="/magazine" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  Current Issue
                </Link>
                <Link to="/magazine#archive" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  Past Issues
                </Link>
                <Link to="/magazine#subscribe" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  Subscribe
                </Link>
              </div>
            </div>

            {/* Main Site Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">IsraelProperty360</h3>
              <div className="space-y-2">
                <Link to="/" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  Main Website
                </Link>
                <Link to="/properties" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  Browse Properties
                </Link>
                <Link to="/experts" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  Find Experts
                </Link>
                <Link to="/blog" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  Blog
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} IsraelProperty360 Magazine. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-sm">Brought to you by</span>
              <a
                href="https://isratransfer.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <img
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b59458f2008a3ee903522b/a2109d6fb_isratrasfer_color_CMYK_01.png"
                  alt="IsraTransfer"
                  className="h-6 w-auto filter brightness-0 invert"
                />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
