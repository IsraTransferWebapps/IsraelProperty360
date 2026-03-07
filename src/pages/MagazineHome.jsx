import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  ArrowRight,
  Calendar,
  Mail,
  CheckCircle,
  Scale,
  Landmark,
  ArrowLeftRight,
  Building2,
  Home,
  Sparkles,
} from "lucide-react";
import { MONTH_NAMES, getIssueLabel } from "@/components/magazine/magazineConstants";

export default function MagazineHome() {
  const [issues, setIssues] = useState([]);
  const [latestIssue, setLatestIssue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState(null);
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      const allIssues = await base44.entities.MagazineIssue.filter(
        { published: true },
        "-created_date"
      );
      allIssues.sort((a, b) => b.year - a.year || b.month - a.month);
      if (allIssues.length > 0) {
        setLatestIssue(allIssues[0]);
        setIssues(allIssues.slice(1));
      }
    } catch (error) {
      console.error("Error loading magazine issues:", error);
    }
    setIsLoading(false);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubscribing(true);
    try {
      await base44.entities.NewsletterSubscription.create({
        email: email.trim(),
        source: "magazine",
      });
      setSubscribeStatus("success");
      setEmail("");
    } catch (error) {
      console.error("Error subscribing:", error);
      setSubscribeStatus("error");
    }
    setIsSubscribing(false);
  };

  const categoryIcons = [
    { icon: Scale, label: "Legal", desc: "Property law & regulations" },
    { icon: Landmark, label: "Mortgages", desc: "Financing your purchase" },
    { icon: ArrowLeftRight, label: "Money Transfers", desc: "Moving funds to Israel" },
    { icon: Building2, label: "Developments", desc: "New construction & projects" },
    { icon: Home, label: "Realtors", desc: "Finding the right property" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section — Editorial style */}
      <section className="relative bg-[#0c1f3f] text-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a55c' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[#c8a55c]/[0.04] blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#1e3a6e]/40 blur-[80px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl">
            {/* Elegant label */}
            <div className="mag-sans flex items-center gap-3 mb-8">
              <div className="h-[1px] w-12 bg-[#c8a55c]" />
              <span className="text-[#c8a55c] text-xs font-medium tracking-[0.25em] uppercase">
                Monthly Publication
              </span>
            </div>

            <h1 className="mag-display text-[42px] md:text-[64px] font-bold mb-6 leading-[1.1] tracking-tight">
              Your Guide to{" "}
              <span className="italic text-[#c8a55c]">
                Buying Property
              </span>{" "}
              in Israel
            </h1>

            <p className="mag-serif text-[18px] md:text-[20px] text-[#8b9bb8] mb-10 leading-relaxed max-w-2xl font-light">
              Expert insights from lawyers, mortgage advisors, money transfer specialists,
              developers, and realtors — delivered monthly to help you make informed
              property decisions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {latestIssue && (
                <Link to={`/magazine/issue/${latestIssue.slug}`}>
                  <Button
                    size="lg"
                    className="mag-sans bg-[#c8a55c] hover:bg-[#b8953f] text-[#0c1f3f] font-semibold shadow-lg shadow-[#c8a55c]/20 px-8 h-12 text-sm tracking-wide uppercase"
                  >
                    <BookOpen className="w-4 h-4 mr-2.5" />
                    Read {getIssueLabel(latestIssue.month, latestIssue.year)}
                  </Button>
                </Link>
              )}
              <a href="#subscribe">
                <Button
                  size="lg"
                  variant="outline"
                  className="mag-sans border-[#2a4a7a] text-[#8b9bb8] hover:bg-white/5 hover:text-white hover:border-[#c8a55c]/50 h-12 px-8 text-sm tracking-wide uppercase"
                >
                  <Mail className="w-4 h-4 mr-2.5" />
                  Subscribe Free
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom decorative divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" className="w-full text-[#faf9f6]" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,40L1440,40L1440,20Q720,0,0,20Z" />
          </svg>
        </div>
      </section>

      {/* What's Inside */}
      <section className="py-20 bg-[#faf9f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="mag-sans flex items-center justify-center gap-3 mb-4">
              <div className="h-[1px] w-8 bg-[#c8a55c]" />
              <span className="text-[#c8a55c] text-xs font-medium tracking-[0.25em] uppercase">
                Every Issue
              </span>
              <div className="h-[1px] w-8 bg-[#c8a55c]" />
            </div>
            <h2 className="mag-display text-3xl md:text-4xl font-bold text-[#0c1f3f] mb-4">
              What's Inside
            </h2>
            <p className="mag-serif text-stone-500 max-w-2xl mx-auto text-[17px] font-light leading-relaxed">
              Every month we bring together Israel's leading property professionals to give
              you the knowledge you need.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            {categoryIcons.map(({ icon: Icon, label, desc }, idx) => (
              <div
                key={label}
                className="group bg-white rounded-2xl p-6 text-center border border-stone-100 hover:border-[#c8a55c]/30 hover:shadow-xl hover:shadow-[#c8a55c]/5 transition-all duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-[#0c1f3f]/[0.04] group-hover:bg-[#c8a55c]/10 rounded-2xl flex items-center justify-center transition-colors duration-500">
                  <Icon className="w-6 h-6 text-[#0c1f3f] group-hover:text-[#c8a55c] transition-colors duration-500" />
                </div>
                <h3 className="mag-sans font-semibold text-[#0c1f3f] mb-1 text-sm">{label}</h3>
                <p className="mag-sans text-xs text-stone-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Issue Spotlight */}
      {isLoading ? (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </section>
      ) : (
        latestIssue && (
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mag-sans flex items-center gap-3 mb-3">
                <div className="h-[1px] w-8 bg-[#c8a55c]" />
                <span className="text-[#c8a55c] text-xs font-medium tracking-[0.25em] uppercase">
                  Featured
                </span>
              </div>
              <h2 className="mag-display text-3xl md:text-4xl font-bold text-[#0c1f3f] mb-10">
                Latest Issue
              </h2>

              <Link to={`/magazine/issue/${latestIssue.slug}`}>
                <div className="group relative rounded-3xl overflow-hidden bg-[#0c1f3f] shadow-2xl">
                  <div className="grid md:grid-cols-2">
                    {/* Cover Image */}
                    <div className="relative h-80 md:h-[480px] overflow-hidden">
                      <img
                        src={
                          latestIssue.cover_image_url ||
                          "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80"
                        }
                        alt={latestIssue.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0c1f3f]/50 to-transparent md:bg-gradient-to-t md:from-[#0c1f3f]/40 md:to-transparent" />
                      <div className="absolute top-6 left-6">
                        <span className="mag-sans inline-flex items-center gap-1.5 bg-[#c8a55c] text-[#0c1f3f] text-[11px] font-bold px-4 py-2 rounded-full uppercase tracking-wider">
                          <Calendar className="w-3 h-3" />
                          {getIssueLabel(latestIssue.month, latestIssue.year)}
                        </span>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-10 md:p-14 flex flex-col justify-center">
                      <div className="mag-sans flex items-center gap-2 text-[#c8a55c] mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-medium tracking-[0.2em] uppercase">New Release</span>
                      </div>
                      <h3 className="mag-display text-3xl md:text-4xl font-bold text-white mb-5 leading-tight group-hover:text-[#c8a55c] transition-colors duration-300">
                        {latestIssue.title}
                      </h3>
                      <p className="mag-serif text-[#8b9bb8] text-lg mb-8 leading-relaxed font-light">
                        {latestIssue.description}
                      </p>
                      <div>
                        <span className="mag-sans inline-flex items-center gap-2.5 text-[#c8a55c] font-semibold text-sm group-hover:gap-4 transition-all duration-300 tracking-wide uppercase">
                          Read This Issue
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )
      )}

      {/* Past Issues Archive */}
      {issues.length > 0 && (
        <section id="archive" className="py-20 bg-[#faf9f6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mag-sans flex items-center gap-3 mb-3">
              <div className="h-[1px] w-8 bg-[#c8a55c]" />
              <span className="text-[#c8a55c] text-xs font-medium tracking-[0.25em] uppercase">
                Archive
              </span>
            </div>
            <h2 className="mag-display text-3xl md:text-4xl font-bold text-[#0c1f3f] mb-10">Past Issues</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {issues.map((issue) => (
                <Link key={issue.id} to={`/magazine/issue/${issue.slug}`}>
                  <div className="group bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-[#c8a55c]/30 hover:shadow-xl transition-all duration-500 h-full">
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={
                          issue.cover_image_url ||
                          "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80"
                        }
                        alt={issue.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className="absolute bottom-4 left-4 mag-sans inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#0c1f3f] text-[11px] font-semibold px-3 py-1.5 rounded-full">
                        <Calendar className="w-3 h-3 text-[#c8a55c]" />
                        {getIssueLabel(issue.month, issue.year)}
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="mag-display font-bold text-[#0c1f3f] mb-2 text-lg group-hover:text-[#c8a55c] transition-colors">
                        {issue.title}
                      </h3>
                      <p className="mag-serif text-sm text-stone-400 line-clamp-2 font-light leading-relaxed">
                        {issue.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Subscribe Section */}
      <section
        id="subscribe"
        className="py-24 bg-[#0c1f3f] text-white relative overflow-hidden"
      >
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#c8a55c]/[0.03] blur-[120px]" />
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-16 h-16 mx-auto mb-8 bg-white/[0.06] rounded-2xl flex items-center justify-center border border-white/[0.08]">
            <Mail className="w-7 h-7 text-[#c8a55c]" />
          </div>
          <h2 className="mag-display text-3xl md:text-4xl font-bold mb-5">
            Never Miss an <span className="italic text-[#c8a55c]">Issue</span>
          </h2>
          <p className="mag-serif text-[#8b9bb8] text-lg mb-10 font-light leading-relaxed">
            Get each new issue delivered straight to your inbox. Free monthly insights from
            Israel's top property professionals.
          </p>

          {subscribeStatus === "success" ? (
            <div className="flex items-center justify-center gap-3 text-emerald-400 text-lg mag-serif">
              <CheckCircle className="w-6 h-6" />
              <span>You're subscribed! Watch your inbox for the next issue.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mag-sans bg-white/[0.06] border-white/[0.12] text-white placeholder:text-[#5a6e8a] focus:border-[#c8a55c] focus:ring-[#c8a55c]/20 flex-1 h-12 rounded-xl"
              />
              <Button
                type="submit"
                disabled={isSubscribing}
                className="mag-sans bg-[#c8a55c] hover:bg-[#b8953f] text-[#0c1f3f] font-semibold whitespace-nowrap h-12 px-8 rounded-xl text-sm tracking-wide uppercase"
              >
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          )}
          {subscribeStatus === "error" && (
            <p className="mag-sans text-red-400 text-sm mt-3">
              Something went wrong. Please try again.
            </p>
          )}
          <p className="mag-sans text-[#3d5275] text-xs mt-5">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </section>

      {/* CTA to main site */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="mag-display text-2xl md:text-3xl font-bold text-[#0c1f3f] mb-4">
            Ready to Start Your Property Search?
          </h2>
          <p className="mag-serif text-stone-400 mb-8 max-w-xl mx-auto font-light text-[17px] leading-relaxed">
            Browse verified properties, connect with experts, and explore cities across
            Israel on our main platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/properties">
              <Button size="lg" className="mag-sans bg-[#0c1f3f] hover:bg-[#162d52] text-white h-12 px-8 text-sm tracking-wide uppercase">
                Browse Properties
              </Button>
            </Link>
            <Link to="/experts">
              <Button size="lg" variant="outline" className="mag-sans border-stone-200 text-stone-600 hover:border-[#c8a55c] hover:text-[#0c1f3f] h-12 px-8 text-sm tracking-wide uppercase">
                Find an Expert
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
