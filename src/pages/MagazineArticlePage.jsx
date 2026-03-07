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

      // Load parent issue
      const issues = await base44.entities.MagazineIssue.filter({
        id: articleData.issue_id,
      });
      if (issues.length > 0) setIssue(issues[0]);

      // Load expert author
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

      // Load sibling articles
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
      <div className="min-h-screen bg-white">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8 max-w-md">
          <CardContent>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Article Not Found
            </h2>
            <p className="text-gray-600 mb-6">
              The article you're looking for doesn't exist.
            </p>
            <Link to="/magazine">
              <Button>Browse Magazine</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const catInfo = MAGAZINE_CATEGORIES[article.category] || MAGAZINE_CATEGORIES.editorial;
  const CatIcon = catInfo.icon;

  // Find prev/next in siblings
  const allInIssue = [...siblingArticles, article].sort(
    (a, b) => a.display_order - b.display_order
  );
  const currentIdx = allInIssue.findIndex((a) => a.id === article.id);
  const prevArticle = currentIdx > 0 ? allInIssue[currentIdx - 1] : null;
  const nextArticle =
    currentIdx < allInIssue.length - 1 ? allInIssue[currentIdx + 1] : null;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back navigation */}
        <div className="flex items-center gap-4 mb-8">
          {issue && (
            <Link to={`/magazine/issue/${issue.slug}`}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {getIssueLabel(issue.month, issue.year)} Issue
              </Button>
            </Link>
          )}
        </div>

        {/* Article Header */}
        <article>
          <div className="mb-8">
            <Badge className={`${catInfo.color} mb-4`}>
              <CatIcon className="w-3 h-3 mr-1" />
              {catInfo.label}
            </Badge>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-2">
                {expert?.image_url ? (
                  <img
                    src={expert.image_url}
                    alt={article.author_name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  {expert ? (
                    <Link
                      to={`/expert?id=${expert.id}`}
                      className="font-semibold hover:text-amber-600 transition-colors"
                    >
                      {article.author_name}
                    </Link>
                  ) : (
                    <span className="font-semibold">
                      {article.author_name || "Editorial Team"}
                    </span>
                  )}
                  {expert?.company && (
                    <p className="text-xs text-gray-500">{expert.company}</p>
                  )}
                </div>
              </div>
              {issue && (
                <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-lg text-sm">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  {getIssueLabel(issue.month, issue.year)}
                </div>
              )}
            </div>
          </div>

          {/* Featured Image */}
          {article.image_url && (
            <div className="mb-10 rounded-xl overflow-hidden shadow-lg">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-[350px] object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <style>{`
            .magazine-article-content {
              color: #1f2937;
              font-size: 1.125rem;
              line-height: 1.9;
            }
            .magazine-article-content p {
              margin-bottom: 1.75rem;
              line-height: 1.9;
            }
            .magazine-article-content h1, .magazine-article-content h2, .magazine-article-content h3 {
              margin-top: 2.5rem;
              margin-bottom: 1.25rem;
              font-weight: 700;
              color: #111827;
            }
            .magazine-article-content h2 {
              font-size: 1.5rem;
              border-left: 4px solid #f59e0b;
              padding-left: 1rem;
            }
            .magazine-article-content h3 {
              font-size: 1.25rem;
              color: #92400e;
            }
            .magazine-article-content ul, .magazine-article-content ol {
              margin-bottom: 2rem;
              padding-left: 0;
              list-style: none;
            }
            .magazine-article-content ul li {
              position: relative;
              padding-left: 2rem;
              margin-bottom: 1rem;
              line-height: 1.8;
            }
            .magazine-article-content ul li:before {
              content: "\\25B8";
              position: absolute;
              left: 0;
              color: #f59e0b;
              font-size: 1.5rem;
              font-weight: bold;
              line-height: 1.8;
            }
            .magazine-article-content ol {
              counter-reset: item;
            }
            .magazine-article-content ol li {
              position: relative;
              padding-left: 2.5rem;
              margin-bottom: 1rem;
              line-height: 1.8;
              counter-increment: item;
            }
            .magazine-article-content ol li:before {
              content: counter(item) ".";
              position: absolute;
              left: 0;
              color: #f59e0b;
              font-weight: bold;
            }
            .magazine-article-content blockquote {
              border-left: 5px solid #f59e0b;
              background: linear-gradient(to right, #fffbeb, transparent);
              padding: 1.5rem 1.5rem 1.5rem 2rem;
              margin: 2rem 0;
              font-style: italic;
              color: #92400e;
              border-radius: 0.5rem;
            }
            .magazine-article-content strong {
              color: #111827;
              font-weight: 700;
            }
            .magazine-article-content a {
              color: #d97706;
              text-decoration: none;
              border-bottom: 2px solid #fcd34d;
            }
            .magazine-article-content a:hover {
              color: #b45309;
              border-bottom-color: #d97706;
            }
          `}</style>
          <div className="magazine-article-content prose prose-lg max-w-none mb-10">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>

          {/* Share */}
          <div className="flex items-center gap-4 bg-amber-50 p-4 rounded-lg mb-8">
            <span className="text-gray-700 font-semibold">Found this helpful?</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Article
            </Button>
          </div>
        </article>

        {/* Author Card */}
        {expert && (
          <Card className="mb-8 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-200 shadow-xl">
            <CardContent className="p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-amber-500 rounded" />
                About the Author
              </h3>
              <div className="flex flex-col sm:flex-row gap-6">
                <img
                  src={
                    expert.image_url ||
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80"
                  }
                  alt={expert.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                    {expert.name}
                  </h4>
                  {expert.company && (
                    <p className="text-amber-700 font-semibold mb-3">
                      {expert.company}
                    </p>
                  )}
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {expert.description}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/expert?id=${expert.id}`}>
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Full Profile
                      </Button>
                    </Link>
                    {expert.email && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          (window.location.href = `mailto:${expert.email}`)
                        }
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Get in Touch
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prev/Next Article Navigation */}
        <div className="flex items-center justify-between py-8 border-t border-gray-200">
          {prevArticle ? (
            <Link to={`/magazine/article/${prevArticle.slug}`}>
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline line-clamp-1 max-w-[200px]">
                  {prevArticle.title}
                </span>
                <span className="sm:hidden">Previous</span>
              </Button>
            </Link>
          ) : (
            <div />
          )}
          {nextArticle ? (
            <Link to={`/magazine/article/${nextArticle.slug}`}>
              <Button variant="outline" className="gap-2">
                <span className="hidden sm:inline line-clamp-1 max-w-[200px]">
                  {nextArticle.title}
                </span>
                <span className="sm:hidden">Next</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* More from This Issue */}
        {siblingArticles.length > 0 && (
          <section className="py-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              More from This Issue
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {siblingArticles.slice(0, 4).map((sibling) => {
                const sibCat =
                  MAGAZINE_CATEGORIES[sibling.category] ||
                  MAGAZINE_CATEGORIES.editorial;
                return (
                  <Link
                    key={sibling.id}
                    to={`/magazine/article/${sibling.slug}`}
                  >
                    <Card className="hover:shadow-lg transition-shadow h-full">
                      <CardContent className="p-4 flex gap-4">
                        {sibling.image_url && (
                          <img
                            src={sibling.image_url}
                            alt={sibling.title}
                            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div>
                          <Badge className={`${sibCat.color} text-xs mb-2`}>
                            {sibCat.label}
                          </Badge>
                          <h4 className="font-semibold text-gray-900 line-clamp-2 text-sm">
                            {sibling.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {sibling.author_name}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
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
