import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import HTMLFlipBook from "react-pageflip";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Share2,
  Maximize2,
  Minimize2,
  BookOpen,
  User,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  MAGAZINE_CATEGORIES,
  CATEGORY_ORDER,
  getIssueLabel,
} from "@/components/magazine/magazineConstants";

// Individual page component - must use forwardRef for react-pageflip
const Page = React.forwardRef(({ children, className = "" }, ref) => (
  <div ref={ref} className={`magazine-page ${className}`}>
    {children}
  </div>
));
Page.displayName = "Page";

// Split markdown content into chunks that fit on pages
function splitContentIntoPages(content, charsPerPage = 1200) {
  if (!content) return [""];
  const paragraphs = content.split("\n\n");
  const pages = [];
  let currentPage = "";

  for (const para of paragraphs) {
    if (currentPage.length + para.length > charsPerPage && currentPage.length > 0) {
      pages.push(currentPage.trim());
      currentPage = para;
    } else {
      currentPage += (currentPage ? "\n\n" : "") + para;
    }
  }
  if (currentPage.trim()) {
    pages.push(currentPage.trim());
  }
  return pages.length > 0 ? pages : [""];
}

export default function MagazineIssuePage() {
  const { slug } = useParams();
  const [issue, setIssue] = useState(null);
  const [articles, setArticles] = useState([]);
  const [experts, setExperts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 500, height: 700 });
  const flipBookRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    loadIssue(slug || "latest");
  }, [slug]);

  // Responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (isFullscreen) {
        const pageWidth = Math.min(Math.floor((vw - 80) / 2), 600);
        const pageHeight = Math.min(vh - 120, Math.floor(pageWidth * 1.4));
        setDimensions({ width: pageWidth, height: pageHeight });
      } else if (vw < 768) {
        const w = Math.min(vw - 32, 400);
        setDimensions({ width: w, height: Math.floor(w * 1.4) });
      } else {
        setDimensions({ width: 480, height: 672 });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [isFullscreen]);

  const loadIssue = async (issueSlug) => {
    setIsLoading(true);
    try {
      let issueData;
      if (issueSlug === "latest") {
        const allIssues = await base44.entities.MagazineIssue.filter(
          { published: true },
          "-created_date",
          1
        );
        issueData = allIssues[0];
      } else {
        const issues = await base44.entities.MagazineIssue.filter({
          slug: issueSlug,
        });
        issueData = issues[0];
      }

      if (!issueData) {
        setIsLoading(false);
        return;
      }
      setIssue(issueData);

      const issueArticles = await base44.entities.MagazineArticle.filter(
        { issue_id: issueData.id, published: true },
        "display_order"
      );
      setArticles(issueArticles);

      const expertIds = [
        ...new Set(issueArticles.map((a) => a.author_expert_id).filter(Boolean)),
      ];
      if (expertIds.length > 0) {
        const expertMap = {};
        await Promise.all(
          expertIds.map(async (eid) => {
            try {
              const results = await base44.entities.Expert.filter({ id: eid });
              if (results.length > 0) expertMap[eid] = results[0];
            } catch (e) {}
          })
        );
        setExperts(expertMap);
      }
    } catch (error) {
      console.error("Error loading issue:", error);
    }
    setIsLoading(false);
  };

  const onFlip = useCallback((e) => {
    setCurrentPage(e.data);
  }, []);

  const onInit = useCallback((e) => {
    setTotalPages(e.data?.pages?.length || 0);
  }, []);

  const goNext = () => flipBookRef.current?.pageFlip()?.flipNext();
  const goPrev = () => flipBookRef.current?.pageFlip()?.flipPrev();

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: issue?.title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  // Build the pages array
  const buildPages = () => {
    if (!issue) return [];
    const pages = [];

    // --- COVER PAGE ---
    pages.push(
      <Page key="cover">
        <div className="h-full flex flex-col relative overflow-hidden bg-[#0c1f3f]">
          <img
            src={issue.cover_image_url || "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80"}
            alt={issue.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1f3f] via-[#0c1f3f]/50 to-[#0c1f3f]/10" />

          {/* Top branding bar */}
          <div className="relative z-10 pt-6 px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#c8a55c] rounded-md flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-[#0c1f3f]" />
                </div>
                <div>
                  <p className="text-white text-[11px] font-bold tracking-tight leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>Israel Property</p>
                  <p className="text-[#c8a55c] text-[7px] tracking-[0.2em] uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>Magazine</p>
                </div>
              </div>
              <span className="text-white/60 text-[10px] tracking-wider uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {getIssueLabel(issue.month, issue.year)}
              </span>
            </div>
          </div>

          {/* Cover content */}
          <div className="relative z-10 mt-auto p-8 pb-10">
            <div className="h-[2px] w-16 bg-[#c8a55c] mb-5" />
            <h1 className="text-[22px] md:text-[26px] font-bold text-white mb-3 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              {issue.title}
            </h1>
            <p className="text-white/60 text-[13px] leading-relaxed max-w-[90%]" style={{ fontFamily: "'Source Serif 4', serif" }}>
              {issue.description}
            </p>
          </div>

          {/* Bottom gold accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c8a55c] via-[#e0c878] to-[#c8a55c]" />
        </div>
      </Page>
    );

    // --- TABLE OF CONTENTS PAGE ---
    pages.push(
      <Page key="toc">
        <div className="h-full flex flex-col p-8 bg-[#faf9f6]">
          {/* Header with decorative line */}
          <div className="mb-6">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#c8a55c] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {getIssueLabel(issue.month, issue.year)}
            </p>
            <h2 className="text-[22px] font-bold text-[#0c1f3f]" style={{ fontFamily: "'Playfair Display', serif" }}>
              In This Issue
            </h2>
            <div className="flex items-center gap-2 mt-3">
              <div className="h-[2px] w-10 bg-[#c8a55c]" />
              <div className="h-[2px] flex-1 bg-stone-200" />
            </div>
          </div>

          <div className="flex-1 space-y-0">
            {articles.map((article, idx) => {
              const catInfo = MAGAZINE_CATEGORIES[article.category] || MAGAZINE_CATEGORIES.editorial;
              const CatIcon = catInfo.icon;
              return (
                <div key={article.id} className="flex items-start gap-3 py-3.5 border-b border-stone-100 last:border-0">
                  <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center bg-[#0c1f3f]/[0.05]">
                    <CatIcon className="w-3.5 h-3.5 text-[#0c1f3f]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#0c1f3f] text-[13px] leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {article.title}
                    </p>
                    <p className="text-[10px] text-stone-400 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {catInfo.label} — {article.author_name || "Editorial Team"}
                    </p>
                  </div>
                  <span className="text-[10px] text-[#c8a55c] font-semibold mt-0.5 flex-shrink-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-4">
            <div className="h-[1px] bg-stone-200 mb-3" />
            <p className="text-[9px] text-stone-300 text-center tracking-wider uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              israelproperty360.com/magazine
            </p>
          </div>
        </div>
      </Page>
    );

    // --- ARTICLE PAGES ---
    articles.forEach((article) => {
      const catInfo = MAGAZINE_CATEGORIES[article.category] || MAGAZINE_CATEGORIES.editorial;
      const CatIcon = catInfo.icon;
      const expert = experts[article.author_expert_id];
      const contentPages = splitContentIntoPages(article.content, 900);

      // Article title page (with image)
      pages.push(
        <Page key={`art-title-${article.id}`}>
          <div className="h-full flex flex-col bg-white">
            {/* Article image - top section */}
            <div className="h-[42%] relative overflow-hidden flex-shrink-0">
              <img
                src={article.image_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
              {/* Category pill */}
              <div className="absolute top-4 left-6">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold ${catInfo.color} backdrop-blur-sm`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <CatIcon className="w-3 h-3" />
                  {catInfo.label}
                </span>
              </div>
            </div>

            {/* Article header */}
            <div className="flex-1 px-8 pb-6 flex flex-col -mt-2">
              <div className="h-[2px] w-10 bg-[#c8a55c] mb-4" />
              <h2 className="text-[20px] md:text-[22px] font-bold text-[#0c1f3f] mb-3 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                {article.title}
              </h2>
              <p className="text-stone-500 text-[13px] leading-relaxed mb-4 line-clamp-3" style={{ fontFamily: "'Source Serif 4', serif" }}>
                {article.excerpt}
              </p>
              <div className="mt-auto flex items-center gap-3">
                {expert?.image_url ? (
                  <img
                    src={expert.image_url}
                    alt={article.author_name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-[#c8a55c]/20 ring-offset-2"
                  />
                ) : (
                  <div className="w-10 h-10 bg-[#0c1f3f] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-[#c8a55c]" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-[#0c1f3f] text-[13px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {article.author_name || "Editorial Team"}
                  </p>
                  {expert?.company && (
                    <p className="text-[11px] text-stone-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{expert.company}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Page>
      );

      // Article content pages
      contentPages.forEach((pageContent, pageIdx) => {
        pages.push(
          <Page key={`art-content-${article.id}-${pageIdx}`}>
            <div className="h-full flex flex-col p-8 bg-[#faf9f6]">
              {/* Page header */}
              <div className="flex items-center justify-between pb-3 mb-5 border-b border-stone-200 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <CatIcon className="w-3 h-3 text-[#c8a55c]" />
                  <span className="text-[10px] font-medium text-[#0c1f3f] tracking-wider uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>{catInfo.label}</span>
                </div>
                <span className="text-[10px] text-stone-300 italic" style={{ fontFamily: "'Source Serif 4', serif" }}>
                  {article.author_name}
                </span>
              </div>
              {/* Content */}
              <div className="flex-1 overflow-hidden">
                <div className="flip-content-v2">
                  <ReactMarkdown>{pageContent}</ReactMarkdown>
                </div>
              </div>
              {/* Page footer */}
              <div className="pt-3 mt-auto flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="h-[1px] flex-1 bg-stone-200" />
                  <p className="text-[8px] text-stone-300 px-3 tracking-wider uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Israel Property Magazine — {getIssueLabel(issue.month, issue.year)}
                  </p>
                  <div className="h-[1px] flex-1 bg-stone-200" />
                </div>
              </div>
            </div>
          </Page>
        );
      });
    });

    // --- BACK COVER ---
    pages.push(
      <Page key="back-cover">
        <div className="h-full flex flex-col items-center justify-center p-10 bg-[#0c1f3f] text-white text-center relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8a55c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />

          <div className="relative z-10">
            <div className="w-14 h-14 bg-[#c8a55c] rounded-xl flex items-center justify-center mb-6 mx-auto">
              <BookOpen className="w-7 h-7 text-[#0c1f3f]" />
            </div>
            <h2 className="text-[24px] font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>Israel Property</h2>
            <p className="text-[#c8a55c] text-[10px] tracking-[0.25em] uppercase mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>Magazine</p>

            <div className="h-[1px] w-16 bg-white/10 mx-auto mb-8" />

            <p className="text-[#8b9bb8] text-[14px] mb-8 max-w-[260px] leading-relaxed mx-auto" style={{ fontFamily: "'Source Serif 4', serif" }}>
              Thank you for reading. Join us next month for more expert insights
              on purchasing property in Israel.
            </p>

            <div className="space-y-1.5">
              <p className="text-[#5a6e8a] text-[11px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Subscribe for free at</p>
              <p className="text-[#c8a55c] text-[13px] font-semibold tracking-wide" style={{ fontFamily: "'DM Sans', sans-serif" }}>israelproperty360.com/magazine</p>
            </div>

            <div className="mt-10 pt-6 border-t border-white/[0.06] w-48 mx-auto">
              <p className="text-[#5a6e8a] text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>Brought to you by IsraTransfer</p>
              <p className="text-[#3d5275] text-[9px] mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>isratransfer.com</p>
            </div>
          </div>

          {/* Bottom gold accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c8a55c] via-[#e0c878] to-[#c8a55c]" />
        </div>
      </Page>
    );

    return pages;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <div className="text-center">
          <Skeleton className="w-[400px] h-[560px] mx-auto rounded-xl" />
          <Skeleton className="h-5 w-48 mx-auto mt-6" />
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <Card className="text-center p-10 max-w-md border-stone-100 shadow-xl">
          <CardContent>
            <h2 className="mag-display text-2xl font-bold text-[#0c1f3f] mb-4">Issue Not Found</h2>
            <p className="mag-serif text-stone-400 mb-6">
              The magazine issue you're looking for doesn't exist or hasn't been published yet.
            </p>
            <Link to="/magazine">
              <Button className="mag-sans bg-[#0c1f3f] hover:bg-[#162d52] text-white">Browse All Issues</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const allPages = buildPages();

  return (
    <div
      ref={containerRef}
      className={`min-h-screen ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-[#0a0e1a] flex flex-col"
          : "bg-gradient-to-b from-[#f0ede6] via-[#e8e4db] to-[#f0ede6]"
      }`}
    >
      <style>{`
        .magazine-page {
          overflow: hidden;
        }
        .stf__parent {
          margin: 0 auto;
        }
        .stf__wrapper {
          box-shadow: 0 30px 80px -20px rgba(12,31,63,0.35), 0 10px 30px -10px rgba(12,31,63,0.2);
          border-radius: 4px;
        }

        /* Refined article typography */
        .flip-content-v2 {
          color: #374151;
          font-size: 0.82rem;
          line-height: 1.75;
          font-family: 'Source Serif 4', Georgia, serif;
        }
        .flip-content-v2 p {
          margin-bottom: 0.7rem;
        }
        .flip-content-v2 h2 {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0c1f3f;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          padding-left: 0.75rem;
          border-left: 2px solid #c8a55c;
          font-family: 'Playfair Display', serif;
        }
        .flip-content-v2 h3 {
          font-size: 0.9rem;
          font-weight: 700;
          color: #0c1f3f;
          margin-top: 0.75rem;
          margin-bottom: 0.5rem;
          font-family: 'DM Sans', sans-serif;
          letter-spacing: 0.02em;
        }
        .flip-content-v2 ul, .flip-content-v2 ol {
          padding-left: 1.25rem;
          margin-bottom: 0.75rem;
        }
        .flip-content-v2 li {
          margin-bottom: 0.25rem;
          line-height: 1.65;
        }
        .flip-content-v2 ul li { list-style-type: disc; }
        .flip-content-v2 ol li { list-style-type: decimal; }
        .flip-content-v2 strong { color: #0c1f3f; }
        .flip-content-v2 blockquote {
          border-left: 2px solid #c8a55c;
          background: linear-gradient(135deg, #faf9f6, #f5f0e8);
          padding: 0.75rem 1rem;
          margin: 0.75rem 0;
          font-style: italic;
          color: #6b5c3e;
          font-size: 0.85rem;
          border-radius: 0.25rem;
        }
        .flip-content-v2 a {
          color: #c8a55c;
          text-decoration: underline;
          text-decoration-color: #c8a55c40;
          text-underline-offset: 2px;
        }
      `}</style>

      {/* Top bar */}
      <div className={`${isFullscreen ? "bg-[#0a0e1a] border-b border-white/[0.06]" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/magazine"
            className={`mag-sans inline-flex items-center gap-2 text-[13px] tracking-wide uppercase ${
              isFullscreen
                ? "text-[#5a6e8a] hover:text-white"
                : "text-stone-400 hover:text-[#0c1f3f]"
            } transition-colors`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Issues
          </Link>
          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className={`p-2.5 rounded-lg transition-colors ${
                isFullscreen
                  ? "text-[#5a6e8a] hover:text-white hover:bg-white/5"
                  : "text-stone-400 hover:text-[#0c1f3f] hover:bg-stone-100"
              }`}
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className={`p-2.5 rounded-lg transition-colors ${
                isFullscreen
                  ? "text-[#5a6e8a] hover:text-white hover:bg-white/5"
                  : "text-stone-400 hover:text-[#0c1f3f] hover:bg-stone-100"
              }`}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Flipbook */}
      <div
        className={`flex-1 flex items-center justify-center ${
          isFullscreen ? "py-4" : "py-6 md:py-10"
        }`}
      >
        <div className="relative">
          {/* Previous button */}
          <button
            onClick={goPrev}
            className={`absolute left-[-56px] top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all hidden md:flex ${
              isFullscreen
                ? "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10"
                : "bg-white shadow-lg shadow-stone-200/50 hover:shadow-xl text-stone-500 hover:text-[#0c1f3f] border border-stone-100"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <HTMLFlipBook
            ref={flipBookRef}
            width={dimensions.width}
            height={dimensions.height}
            size="fixed"
            minWidth={280}
            maxWidth={600}
            minHeight={400}
            maxHeight={840}
            showCover={true}
            maxShadowOpacity={0.5}
            mobileScrollSupport={true}
            onFlip={onFlip}
            onInit={onInit}
            className="magazine-flipbook"
            flippingTime={800}
            usePortrait={window.innerWidth < 768}
            startPage={0}
            drawShadow={true}
            autoSize={false}
            clickEventForward={false}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={true}
          >
            {allPages}
          </HTMLFlipBook>

          {/* Next button */}
          <button
            onClick={goNext}
            className={`absolute right-[-56px] top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all hidden md:flex ${
              isFullscreen
                ? "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10"
                : "bg-white shadow-lg shadow-stone-200/50 hover:shadow-xl text-stone-500 hover:text-[#0c1f3f] border border-stone-100"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom controls */}
      <div className={`${isFullscreen ? "bg-[#0a0e1a] border-t border-white/[0.06]" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Mobile prev/next buttons */}
          <div className="flex items-center justify-center gap-3 md:hidden mb-3">
            <Button variant="outline" size="sm" onClick={goPrev} className="mag-sans border-stone-200 text-stone-500">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </Button>
            <Button variant="outline" size="sm" onClick={goNext} className="mag-sans border-stone-200 text-stone-500">
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Page indicator */}
          <div className="text-center">
            <p className={`mag-sans text-[13px] ${isFullscreen ? "text-[#5a6e8a]" : "text-stone-400"}`}>
              {allPages.length > 0
                ? `Page ${currentPage + 1} of ${allPages.length}`
                : ""}
            </p>
            <p className={`mag-sans text-[11px] mt-1 ${isFullscreen ? "text-[#3d5275]" : "text-stone-300"}`}>
              {window.innerWidth >= 768
                ? "Click the page edges or use arrows to turn pages"
                : "Swipe or tap to turn pages"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
