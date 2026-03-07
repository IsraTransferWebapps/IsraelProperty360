import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Home, Mail, Menu, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

export default function MagazineLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600&family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,500;8..60,600&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />

      <style>{`
        .mag-display { font-family: 'Playfair Display', Georgia, serif; }
        .mag-serif { font-family: 'Source Serif 4', Georgia, serif; }
        .mag-sans { font-family: 'DM Sans', system-ui, sans-serif; }
      `}</style>

      {/* Magazine Header */}
      <header className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)]"
          : "bg-white"
      }`}>
        {/* Top accent bar — refined thin gold line */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#c8a55c] to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Back to main site */}
            <Link
              to="/"
              className="hidden lg:flex items-center gap-2 text-[13px] mag-sans text-stone-400 hover:text-stone-700 transition-colors tracking-wide uppercase"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Main Site
            </Link>

            {/* Magazine Logo/Title */}
            <Link to="/magazine" className="flex items-center gap-3.5 mx-auto lg:mx-0 group">
              <div className="w-10 h-10 bg-[#0c1f3f] rounded-[10px] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <BookOpen className="w-5 h-5 text-[#c8a55c]" />
              </div>
              <div>
                <h1 className="mag-display text-[20px] font-bold text-[#0c1f3f] tracking-tight leading-none">
                  Israel Property
                </h1>
                <p className="mag-sans text-[10px] font-medium text-[#c8a55c] tracking-[0.25em] uppercase mt-0.5">
                  Magazine
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`mag-sans text-[13px] font-medium tracking-wide uppercase transition-colors relative ${
                    isActive(link.href)
                      ? "text-[#0c1f3f]"
                      : "text-stone-400 hover:text-stone-700"
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#c8a55c] rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden absolute right-4">
                <Button variant="ghost" size="icon" className="text-[#0c1f3f]">
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-[#faf9f6]">
                <div className="py-8">
                  <nav className="flex flex-col space-y-1">
                    {navLinks.map((link) => (
                      <SheetClose asChild key={link.href}>
                        <Link
                          to={link.href}
                          className="mag-sans block px-5 py-3.5 text-[15px] font-medium text-[#0c1f3f] hover:bg-[#c8a55c]/10 rounded-lg transition-colors"
                        >
                          {link.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                  <div className="border-t border-stone-200 mt-8 pt-8 px-5">
                    <SheetClose asChild>
                      <Link
                        to="/"
                        className="mag-sans flex items-center gap-2 text-sm text-stone-400 hover:text-stone-700"
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
      <footer className="bg-[#0c1f3f] text-white relative overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-10 h-10 bg-white/10 rounded-[10px] flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#c8a55c]" />
                </div>
                <div>
                  <h3 className="mag-display font-bold text-white leading-none text-lg">Israel Property</h3>
                  <p className="mag-sans text-[10px] text-[#c8a55c] tracking-[0.25em] uppercase mt-0.5">Magazine</p>
                </div>
              </div>
              <p className="mag-serif text-[#8b9bb8] text-[15px] leading-relaxed">
                Your monthly guide to purchasing property in Israel. Expert insights on law,
                mortgages, money transfers, and market trends.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="mag-sans font-semibold text-[#c8a55c] mb-5 text-xs tracking-[0.2em] uppercase">Magazine</h3>
              <div className="space-y-3">
                <Link to="/magazine" className="mag-sans block text-[#8b9bb8] hover:text-white text-sm transition-colors">
                  Current Issue
                </Link>
                <Link to="/magazine#archive" className="mag-sans block text-[#8b9bb8] hover:text-white text-sm transition-colors">
                  Past Issues
                </Link>
                <Link to="/magazine#subscribe" className="mag-sans block text-[#8b9bb8] hover:text-white text-sm transition-colors">
                  Subscribe
                </Link>
              </div>
            </div>

            {/* Main Site Links */}
            <div>
              <h3 className="mag-sans font-semibold text-[#c8a55c] mb-5 text-xs tracking-[0.2em] uppercase">IsraelProperty360</h3>
              <div className="space-y-3">
                <Link to="/" className="mag-sans block text-[#8b9bb8] hover:text-white text-sm transition-colors">
                  Main Website
                </Link>
                <Link to="/properties" className="mag-sans block text-[#8b9bb8] hover:text-white text-sm transition-colors">
                  Browse Properties
                </Link>
                <Link to="/experts" className="mag-sans block text-[#8b9bb8] hover:text-white text-sm transition-colors">
                  Find Experts
                </Link>
                <Link to="/blog" className="mag-sans block text-[#8b9bb8] hover:text-white text-sm transition-colors">
                  Blog
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="mag-sans text-[#5a6e8a] text-sm">
              &copy; {new Date().getFullYear()} IsraelProperty360 Magazine
            </p>
            <div className="flex items-center gap-3">
              <span className="mag-sans text-[#5a6e8a] text-sm">Brought to you by</span>
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
