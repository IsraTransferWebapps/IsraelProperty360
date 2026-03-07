import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Share2,
  User,
  Mail,
  ExternalLink,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  MAGAZINE_CATEGORIES,
  getIssueLabel,
} from "@/components/magazine/magazineConstants";

export default function MagazineArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [issue, setIssue] = useState(null);
  const [expert, setExpert] = useState(null);
  const [siblingArticles, setSiblingArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) loadArticle(slug);
  }, [slug]);

  const loadArticle = async (articleSlug) => {
    setIsLoading(true);
    try {
      const articles = await base44.entities.MagazineArticle.filter({
        slug: articleSlug,
      });
      if (articles.length === 0) {
        setIsLoading(false);
        return;
      }
      const articleData = articles[0];
      setArticle(articleData);

      const issues = await base44.entities.MagazineIssue.filter({
        id: articleData.issue_id,
      });
      if (issues.length > 0) setIssue(issues[0]);

      if (articleData.author_expert_id) {
        try {
          const experts = await base44.entities.Expert.filter({
            id: articleData.author_expert_id,
          });
          if (experts.length > 0) setExpert(experts[0]);
        } catch (e) {
          console.log("Expert not found");
        }
      }

      const siblings = await base44.entities.MagazineArticle.filter(
        { issue_id: articleData.issue_id, published: true },
        "display_order"
      );
      setSiblingArticles(siblings.filter((a) => a.id !== articleData.id));
    } catch (error) {
      console.error("Error loading article:", error);
    }
    setIsLoading(false);
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: article?.title,
          text: article?.excerpt,
          url,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f6]">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf9f6]">
        <Card className="text-center p-10 max-w-md border-stone-100 shadow-xl">
          <CardContent>
            <h2 className="mag-display text-2xl font-bold text-[#0c1f3f] mb-4">
              Article Not Found
            </h2>
            <p className="mag-serif text-stone-400 mb-6">
              The article you're looking for doesn't exist.
            </p>
            <Link to="/magazine">
              <Button className="mag-sans bg-[#0c1f3f] hover:bg-[#162d52] text-white">Browse Magazine</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const catInfo = MAGAZINE_CATEGORIES[article.category] || MAGAZINE_CATEGORIES.editorial;
  const CatIcon = catInfo.icon;

  const allInIssue = [...siblingArticles, article].sort(
    (a, b) => a.display_order - b.display_order
  );
  const currentIdx = allInIssue.findIndex((a) => a.id === article.id);
  const prevArticle = currentIdx > 0 ? allInIssue[currentIdx - 1] : null;
  const nextArticle =
    currentIdx < allInIssue.length - 1 ? allInIssue[currentIdx + 1] : null;

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back navigation */}
        <div className="flex items-center gap-4 mb-10">
          {issue && (
            <Link to={`/magazine/issue/${issue.slug}`}>
              <button className="mag-sans inline-flex items-center gap-2 text-[13px] tracking-wide uppercase text-stone-400 hover:text-[#0c1f3f] transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to {getIssueLabel(issue.month, issue.year)} Issue
              </button>
            </Link>
          )}
        </div>

        {/* Article Header */}
        <article>
          <div className="mb-10">
            <Badge className={`${catInfo.color} mb-5 mag-sans text-[11px] tracking-wide uppercase px-3 py-1`}>
              <CatIcon className="w-3 h-3 mr-1.5" />
              {catInfo.label}
            </Badge>

            <h1 className="mag-display text-[32px] md:text-[44px] font-bold text-[#0c1f3f] mb-5 leading-[1.15] tracking-tight">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-5 mb-8 pb-8 border-b border-stone-200">
              <div className="flex items-center gap-3">
                {expert?.image_url ? (
                  <img
                    src={expert.image_url}
                    alt={article.author_name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-[#c8a55c]/20 ring-offset-2"
                  />
                ) : (
                  <div className="w-11 h-11 bg-[#0c1f3f] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-[#c8a55c]" />
                  </div>
                )}
                <div>
                  {expert ? (
                    <Link
                      to={`/expert?id=${expert.id}`}
                      className="mag-sans font-semibold text-[#0c1f3f] hover:text-[#c8a55c] transition-colors text-[15px]"
                    >
                      {article.author_name}
                    </Link>
                  ) : (
                    <span className="mag-sans font-semibold text-[#0c1f3f] text-[15px]">
                      {article.author_name || "Editorial Team"}
                    </span>
                  )}
                  {expert?.company && (
                    <p className="mag-sans text-xs text-stone-400">{expert.company}</p>
                  )}
                </div>
              </div>
              {issue && (
                <div className="mag-sans flex items-center gap-1.5 bg-white px-3.5 py-2 rounded-full text-[13px] text-stone-500 border border-stone-100">
                  <Calendar className="w-3.5 h-3.5 text-[#c8a55c]" />
                  {getIssueLabel(issue.month, issue.year)}
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          {article.image_url && (
            <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl shadow-stone-200/50">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-[380px] object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <style>{`
            .magazine-article-v2 {
              color: #374151;
              font-size: 1.125rem;
              line-height: 1.9;
              font-family: 'Source Serif 4', Georgia, serif;
            }
            .magazine-article-v2 p {
              margin-bottom: 1.75rem;
              line-height: 1.9;
            }
            .magazine-article-v2 h1, .magazine-article-v2 h2, .magazine-article-v2 h3 {
              margin-top: 2.5rem;
              margin-bottom: 1.25rem;
              font-weight: 700;
              color: #0c1f3f;
            }
            .magazine-article-v2 h2 {
              font-size: 1.5rem;
              border-left: 3px solid #c8a55c;
              padding-left: 1rem;
              font-family: 'Playfair Display', serif;
            }
            .magazine-article-v2 h3 {
              font-size: 1.25rem;
              font-family: 'DM Sans', sans-serif;
              letter-spacing: 0.01em;
            }
            .magazine-article-v2 ul, .magazine-article-v2 ol {
              margin-bottom: 2rem;
              padding-left: 0;
              list-style: none;
            }
            .magazine-article-v2 ul li {
              position: relative;
              padding-left: 2rem;
              margin-bottom: 1rem;
              line-height: 1.8;
            }
            .magazine-article-v2 ul li:before {
              content: "";
              position: absolute;
              left: 0;
              top: 0.75em;
              width: 6px;
              height: 6px;
              background: #c8a55c;
              border-radius: 50%;
            }
            .magazine-article-v2 ol {
              counter-reset: item;
            }
            .magazine-article-v2 ol li {
              position: relative;
              padding-left: 2.5rem;
              margin-bottom: 1rem;
              line-height: 1.8;
              counter-increment: item;
            }
            .magazine-article-v2 ol li:before {
              content: counter(item);
              position: absolute;
              left: 0;
              top: 0;
              width: 1.75rem;
              height: 1.75rem;
              background: #0c1f3f;
              color: #c8a55c;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 0.75rem;
              font-weight: 700;
              font-family: 'DM Sans', sans-serif;
            }
            .magazine-article-v2 blockquote {
              border-left: 3px solid #c8a55c;
              background: linear-gradient(135deg, #faf9f6, #f5f0e8);
              padding: 1.5rem 1.5rem 1.5rem 2rem;
              margin: 2rem 0;
              font-style: italic;
              color: #6b5c3e;
              border-radius: 0.75rem;
              font-size: 1.05rem;
            }
            .magazine-article-v2 strong {
              color: #0c1f3f;
              font-weight: 700;
            }
            .magazine-article-v2 a {
              color: #c8a55c;
              text-decoration: none;
              border-bottom: 2px solid #c8a55c40;
              transition: border-color 0.2s;
            }
            .magazine-article-v2 a:hover {
              border-bottom-color: #c8a55c;
            }
          `}</style>
          <div className="magazine-article-v2 max-w-none mb-12">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>

          {/* Share */}
          <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-stone-100 mb-10">
            <span className="mag-sans text-[#0c1f3f] font-semibold text-sm">Found this helpful?</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="mag-sans border-stone-200 text-stone-500 hover:text-[#0c1f3f] hover:border-[#c8a55c]"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Article
            </Button>
          </div>
        </article>

        {/* Author Card */}
        {expert && (
          <Card className="mb-10 bg-[#0c1f3f] border-0 shadow-2xl overflow-hidden">
            <CardContent className="p-8 relative">
              {/* Subtle background pattern */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23c8a55c' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
              }} />
              <div className="relative z-10">
                <div className="mag-sans flex items-center gap-2 mb-6">
                  <div className="h-[2px] w-6 bg-[#c8a55c]" />
                  <span className="text-[#c8a55c] text-[10px] font-medium tracking-[0.2em] uppercase">About the Author</span>
                </div>
                <div className="flex flex-col sm:flex-row gap-6">
                  <img
                    src={
                      expert.image_url ||
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80"
                    }
                    alt={expert.name}
                    className="w-24 h-24 rounded-2xl object-cover ring-2 ring-[#c8a55c]/20 ring-offset-2 ring-offset-[#0c1f3f]"
                  />
                  <div className="flex-1">
                    <h4 className="mag-display text-xl font-bold text-white mb-1">
                      {expert.name}
                    </h4>
                    {expert.company && (
                      <p className="mag-sans text-[#c8a55c] font-semibold text-sm mb-3">
                        {expert.company}
                      </p>
                    )}
                    <p className="mag-serif text-[#8b9bb8] text-[15px] mb-5 leading-relaxed font-light">
                      {expert.description}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link to={`/expert?id=${expert.id}`}>
                        <Button size="sm" className="mag-sans bg-[#c8a55c] hover:bg-[#b8953f] text-[#0c1f3f] font-semibold text-xs tracking-wide uppercase">
                          <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                          View Profile
                        </Button>
                      </Link>
                      {expert.email && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            (window.location.href = `mailto:${expert.email}`)
                          }
                          className="mag-sans border-white/10 text-[#8b9bb8] hover:text-white hover:border-white/20 text-xs tracking-wide uppercase"
                        >
                          <Mail className="w-3.5 h-3.5 mr-1.5" />
                          Get in Touch
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prev/Next Article Navigation */}
        <div className="flex items-center justify-between py-8 border-t border-stone-200">
          {prevArticle ? (
            <Link to={`/magazine/article/${prevArticle.slug}`}>
              <button className="mag-sans inline-flex items-center gap-2 text-[13px] text-stone-400 hover:text-[#0c1f3f] transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline line-clamp-1 max-w-[200px]">
                  {prevArticle.title}
                </span>
                <span className="sm:hidden">Previous</span>
              </button>
            </Link>
          ) : (
            <div />
          )}
          {nextArticle ? (
            <Link to={`/magazine/article/${nextArticle.slug}`}>
              <button className="mag-sans inline-flex items-center gap-2 text-[13px] text-stone-400 hover:text-[#0c1f3f] transition-colors">
                <span className="hidden sm:inline line-clamp-1 max-w-[200px]">
                  {nextArticle.title}
                </span>
                <span className="sm:hidden">Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* More from This Issue */}
        {siblingArticles.length > 0 && (
          <section className="py-10 border-t border-stone-200">
            <div className="mag-sans flex items-center gap-3 mb-3">
              <div className="h-[2px] w-6 bg-[#c8a55c]" />
              <span className="text-[#c8a55c] text-[10px] font-medium tracking-[0.2em] uppercase">More Articles</span>
            </div>
            <h3 className="mag-display text-2xl font-bold text-[#0c1f3f] mb-8">
              From This Issue
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {siblingArticles.slice(0, 4).map((sibling) => {
                const sibCat =
                  MAGAZINE_CATEGORIES[sibling.category] ||
                  MAGAZINE_CATEGORIES.editorial;
                return (
                  <Link
                    key={sibling.id}
                    to={`/magazine/article/${sibling.slug}`}
                  >
                    <div className="group bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-[#c8a55c]/30 hover:shadow-xl transition-all duration-500 h-full">
                      <div className="p-5 flex gap-4">
                        {sibling.image_url && (
                          <img
                            src={sibling.image_url}
                            alt={sibling.title}
                            className="w-20 h-20 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                        <div>
                          <Badge className={`${sibCat.color} mag-sans text-[10px] mb-2 tracking-wide uppercase px-2 py-0.5`}>
                            {sibCat.label}
                          </Badge>
                          <h4 className="mag-display font-semibold text-[#0c1f3f] line-clamp-2 text-[15px] group-hover:text-[#c8a55c] transition-colors">
                            {sibling.title}
                          </h4>
                          <p className="mag-sans text-[11px] text-stone-400 mt-1">
                            {sibling.author_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
