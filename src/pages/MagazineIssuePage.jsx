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
  <div ref={ref} className={`magazine-page bg-white shadow-lg ${className}`}>
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
  const goToPage = (n) => flipBookRef.current?.pageFlip()?.flip(n);

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
        <div className="h-full flex flex-col relative overflow-hidden">
          <img
            src={issue.cover_image_url || "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80"}
            alt={issue.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
          <div className="relative z-10 mt-auto p-8">
            <div className="inline-block bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded mb-4 uppercase tracking-widest">
              {getIssueLabel(issue.month, issue.year)}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 leading-tight">
              {issue.title}
            </h1>
            <p className="text-white/70 text-sm leading-relaxed">
              {issue.description}
            </p>
            <div className="mt-6 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white text-xs font-bold">Israel Property</p>
                <p className="text-amber-400 text-[10px] tracking-[0.15em] uppercase">Magazine</p>
              </div>
            </div>
          </div>
        </div>
      </Page>
    );

    // --- TABLE OF CONTENTS PAGE ---
    pages.push(
      <Page key="toc">
        <div className="h-full flex flex-col p-8">
          <div className="border-b-2 border-amber-500 pb-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">In This Issue</h2>
            <p className="text-sm text-gray-500 mt-1">
              {getIssueLabel(issue.month, issue.year)}
            </p>
          </div>
          <div className="flex-1 space-y-4">
            {articles.map((article, idx) => {
              const catInfo = MAGAZINE_CATEGORIES[article.category] || MAGAZINE_CATEGORIES.editorial;
              const CatIcon = catInfo.icon;
              return (
                <div key={article.id} className="flex items-start gap-3 group">
                  <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${catInfo.color}`}>
                    <CatIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm leading-tight">
                      {article.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {catInfo.label} — {article.author_name || "Editorial Team"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-auto pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">israelproperty360.com/magazine</p>
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
          <div className="h-full flex flex-col">
            {/* Article image - top half */}
            <div className="h-2/5 relative overflow-hidden flex-shrink-0">
              <img
                src={article.image_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"}
                alt={article.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>
            {/* Article header - bottom half */}
            <div className="flex-1 px-8 pb-6 flex flex-col">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${catInfo.color} w-fit mb-3`}>
                <CatIcon className="w-3 h-3" />
                {catInfo.label}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight">
                {article.title}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {article.excerpt}
              </p>
              <div className="mt-auto flex items-center gap-3">
                {expert?.image_url ? (
                  <img
                    src={expert.image_url}
                    alt={article.author_name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-amber-200"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {article.author_name || "Editorial Team"}
                  </p>
                  {expert?.company && (
                    <p className="text-xs text-gray-500">{expert.company}</p>
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
            <div className="h-full flex flex-col p-8">
              {/* Page header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <CatIcon className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs font-medium text-amber-700">{catInfo.label}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {article.author_name}
                </span>
              </div>
              {/* Content */}
              <div className="flex-1 overflow-hidden">
                <style>{`
                  .flip-content {
                    color: #374151;
                    font-size: 0.85rem;
                    line-height: 1.7;
                  }
                  .flip-content p {
                    margin-bottom: 0.75rem;
                  }
                  .flip-content h2 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #111827;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                    border-left: 3px solid #f59e0b;
                    padding-left: 0.75rem;
                  }
                  .flip-content h3 {
                    font-size: 0.95rem;
                    font-weight: 700;
                    color: #92400e;
                    margin-top: 0.75rem;
                    margin-bottom: 0.5rem;
                  }
                  .flip-content ul, .flip-content ol {
                    padding-left: 1.25rem;
                    margin-bottom: 0.75rem;
                  }
                  .flip-content li {
                    margin-bottom: 0.25rem;
                    line-height: 1.6;
                  }
                  .flip-content ul li { list-style-type: disc; }
                  .flip-content ol li { list-style-type: decimal; }
                  .flip-content strong { color: #111827; }
                  .flip-content blockquote {
                    border-left: 3px solid #f59e0b;
                    background: #fffbeb;
                    padding: 0.75rem 1rem;
                    margin: 0.75rem 0;
                    font-style: italic;
                    color: #92400e;
                    font-size: 0.85rem;
                    border-radius: 0.25rem;
                  }
                  .flip-content a {
                    color: #d97706;
                    text-decoration: underline;
                  }
                `}</style>
                <div className="flip-content">
                  <ReactMarkdown>{pageContent}</ReactMarkdown>
                </div>
              </div>
              {/* Page footer */}
              <div className="pt-3 mt-auto border-t border-gray-100 flex-shrink-0">
                <p className="text-[10px] text-gray-400 text-center">
                  Israel Property Magazine — {getIssueLabel(issue.month, issue.year)}
                </p>
              </div>
            </div>
          </Page>
        );
      });
    });

    // --- BACK COVER ---
    pages.push(
      <Page key="back-cover">
        <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Israel Property</h2>
          <p className="text-amber-400 text-sm tracking-[0.2em] uppercase mb-8">Magazine</p>
          <p className="text-gray-400 text-sm mb-6 max-w-xs leading-relaxed">
            Thank you for reading. Join us next month for more expert insights
            on purchasing property in Israel.
          </p>
          <div className="space-y-2">
            <p className="text-gray-500 text-xs">Subscribe for free at</p>
            <p className="text-amber-400 text-sm font-semibold">israelproperty360.com/magazine</p>
          </div>
          <div className="mt-10 pt-6 border-t border-gray-700 w-full">
            <p className="text-gray-500 text-xs">Brought to you by IsraTransfer</p>
            <p className="text-gray-600 text-[10px] mt-1">isratransfer.com</p>
          </div>
        </div>
      </Page>
    );

    return pages;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Skeleton className="w-[400px] h-[560px] mx-auto rounded-lg" />
          <Skeleton className="h-6 w-48 mx-auto mt-4" />
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8 max-w-md">
          <CardContent>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Issue Not Found</h2>
            <p className="text-gray-600 mb-6">
              The magazine issue you're looking for doesn't exist or hasn't been published yet.
            </p>
            <Link to="/magazine">
              <Button>Browse All Issues</Button>
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
      className={`min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 ${
        isFullscreen
          ? "fixed inset-0 z-50 bg-gray-900 flex flex-col"
          : ""
      }`}
    >
      <style>{`
        .magazine-page {
          background: white;
          overflow: hidden;
        }
        .stf__parent {
          margin: 0 auto;
        }
        .stf__wrapper {
          box-shadow: 0 25px 60px -12px rgba(0,0,0,0.25), 0 10px 30px -10px rgba(0,0,0,0.15);
          border-radius: 4px;
        }
      `}</style>

      {/* Top bar */}
      <div className={`${isFullscreen ? "bg-gray-900 border-b border-gray-800" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/magazine"
            className={`inline-flex items-center gap-2 text-sm ${
              isFullscreen
                ? "text-gray-400 hover:text-white"
                : "text-gray-500 hover:text-gray-800"
            } transition-colors`}
          >
            <ArrowLeft className="w-4 h-4" />
            All Issues
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className={isFullscreen ? "text-gray-400 hover:text-white" : ""}
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className={isFullscreen ? "text-gray-400 hover:text-white" : ""}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Flipbook */}
      <div
        className={`flex-1 flex items-center justify-center ${
          isFullscreen ? "py-4" : "py-8 md:py-12"
        }`}
      >
        <div className="relative">
          {/* Previous button */}
          <button
            onClick={goPrev}
            className={`absolute left-[-50px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hidden md:flex ${
              isFullscreen
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-white shadow-lg hover:shadow-xl text-gray-700"
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
            className={`absolute right-[-50px] top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all hidden md:flex ${
              isFullscreen
                ? "bg-gray-800 hover:bg-gray-700 text-white"
                : "bg-white shadow-lg hover:shadow-xl text-gray-700"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom controls */}
      <div className={`${isFullscreen ? "bg-gray-900 border-t border-gray-800" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Mobile prev/next buttons */}
          <div className="flex items-center justify-center gap-4 md:hidden mb-3">
            <Button variant="outline" size="sm" onClick={goPrev}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </Button>
            <Button variant="outline" size="sm" onClick={goNext}>
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          {/* Page indicator */}
          <div className="text-center">
            <p className={`text-sm ${isFullscreen ? "text-gray-400" : "text-gray-500"}`}>
              {allPages.length > 0
                ? `Page ${currentPage + 1} of ${allPages.length}`
                : ""}
            </p>
            {/* Hint text */}
            <p className={`text-xs mt-1 ${isFullscreen ? "text-gray-600" : "text-gray-400"}`}>
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
