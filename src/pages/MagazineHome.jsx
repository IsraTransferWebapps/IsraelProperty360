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
      // Sort by year desc, month desc
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
    { icon: Building2, label: "Developers", desc: "New construction & projects" },
    { icon: Home, label: "Realtors", desc: "Finding the right property" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(circle at 25% 25%, rgba(251,191,36,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(249,115,22,0.2) 0%, transparent 50%)",
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="max-w-3xl">
            <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 mb-6 text-sm px-4 py-1.5">
              Monthly Publication
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Your Guide to{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                Buying Property
              </span>{" "}
              in Israel
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
              Expert insights from lawyers, mortgage advisors, money transfer specialists,
              developers, and realtors — delivered monthly to help you make informed
              property decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {latestIssue && (
                <Link to={`/magazine/issue/${latestIssue.slug}`}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25"
                  >
                    <BookOpen className="w-5 h-5 mr-2" />
                    Read {getIssueLabel(latestIssue.month, latestIssue.year)} Issue
                  </Button>
                </Link>
              )}
              <a href="#subscribe">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-500 text-gray-300 hover:bg-white/10 hover:text-white"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Subscribe Free
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* What's Inside */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              What's Inside Each Issue
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every month we bring together Israel's leading property professionals to give
              you the knowledge you need.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categoryIcons.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-amber-50 rounded-xl flex items-center justify-center">
                  <Icon className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{label}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Issue Spotlight */}
      {isLoading ? (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        </section>
      ) : (
        latestIssue && (
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest Issue</h2>
              <Link to={`/magazine/issue/${latestIssue.slug}`}>
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-0 shadow-xl">
                  <div className="grid md:grid-cols-2">
                    {/* Cover Image */}
                    <div className="relative h-72 md:h-auto overflow-hidden">
                      <img
                        src={
                          latestIssue.cover_image_url ||
                          "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80"
                        }
                        alt={latestIssue.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent md:bg-gradient-to-t md:from-black/30 md:to-transparent" />
                      <Badge className="absolute top-4 left-4 bg-amber-500 text-white border-0">
                        <Calendar className="w-3 h-3 mr-1" />
                        {getIssueLabel(latestIssue.month, latestIssue.year)}
                      </Badge>
                    </div>
                    {/* Content */}
                    <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                      <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-amber-600 transition-colors">
                        {latestIssue.title}
                      </h3>
                      <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                        {latestIssue.description}
                      </p>
                      <div>
                        <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white">
                          Read This Issue
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            </div>
          </section>
        )
      )}

      {/* Past Issues Archive */}
      {issues.length > 0 && (
        <section id="archive" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Past Issues</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.map((issue) => (
                <Link key={issue.id} to={`/magazine/issue/${issue.slug}`}>
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          issue.cover_image_url ||
                          "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80"
                        }
                        alt={issue.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <Badge className="absolute bottom-3 left-3 bg-white/90 text-gray-800 border-0">
                        <Calendar className="w-3 h-3 mr-1" />
                        {getIssueLabel(issue.month, issue.year)}
                      </Badge>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                        {issue.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {issue.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Subscribe Section */}
      <section
        id="subscribe"
        className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 bg-amber-500/20 rounded-2xl flex items-center justify-center">
            <Mail className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Never Miss an Issue
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Get each new issue delivered straight to your inbox. Free monthly insights from
            Israel's top property professionals.
          </p>

          {subscribeStatus === "success" ? (
            <div className="flex items-center justify-center gap-3 text-green-400 text-lg">
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
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-amber-500 flex-1"
              />
              <Button
                type="submit"
                disabled={isSubscribing}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white whitespace-nowrap"
              >
                {isSubscribing ? "Subscribing..." : "Subscribe Free"}
              </Button>
            </form>
          )}
          {subscribeStatus === "error" && (
            <p className="text-red-400 text-sm mt-3">
              Something went wrong. Please try again.
            </p>
          )}
          <p className="text-gray-500 text-xs mt-4">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </section>

      {/* CTA to main site */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Ready to Start Your Property Search?
          </h2>
          <p className="text-gray-600 mb-6 max-w-xl mx-auto">
            Browse verified properties, connect with experts, and explore cities across
            Israel on our main platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/properties">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white">
                Browse Properties
              </Button>
            </Link>
            <Link to="/experts">
              <Button size="lg" variant="outline">
                Find an Expert
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
