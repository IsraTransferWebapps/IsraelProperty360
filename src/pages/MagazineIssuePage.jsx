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
  ChevronDown,
  ChevronUp,
  Share2,
  User,
  ExternalLink,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
  MAGAZINE_CATEGORIES,
  CATEGORY_ORDER,
  getIssueLabel,
} from "@/components/magazine/magazineConstants";

export default function MagazineIssuePage() {
  const { slug } = useParams();
  const [issue, setIssue] = useState(null);
  const [articles, setArticles] = useState([]);
  const [experts, setExperts] = useState({});
  const [expandedArticles, setExpandedArticles] = useState({});
  const [adjacentIssues, setAdjacentIssues] = useState({ prev: null, next: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIssue(slug || "latest");
  }, [slug]);

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

      // Load articles for this issue
      const issueArticles = await base44.entities.MagazineArticle.filter(
        { issue_id: issueData.id, published: true },
        "display_order"
      );
      setArticles(issueArticles);

      // Load expert authors
      const expertIds = [
        ...new Set(
          issueArticles
            .map((a) => a.author_expert_id)
            .filter(Boolean)
        ),
      ];
      if (expertIds.length > 0) {
        const expertMap = {};
        await Promise.all(
          expertIds.map(async (eid) => {
            try {
              const results = await base44.entities.Expert.filter({ id: eid });
              if (results.length > 0) expertMap[eid] = results[0];
            } catch (e) {
              console.log("Expert not found:", eid);
            }
          })
        );
        setExperts(expertMap);
      }

      // Load adjacent issues for prev/next navigation
      const allIssues = await base44.entities.MagazineIssue.filter(
        { published: true },
        "-created_date"
      );
      allIssues.sort((a, b) => b.year - a.year || b.month - a.month);
      const currentIdx = allIssues.findIndex((i) => i.id === issueData.id);
      setAdjacentIssues({
        prev: currentIdx < allIssues.length - 1 ? allIssues[currentIdx + 1] : null,
        next: currentIdx > 0 ? allIssues[currentIdx - 1] : null,
      });
    } catch (error) {
      console.error("Error loading issue:", error);
    }
    setIsLoading(false);
  };

  const toggleArticle = (articleId) => {
    setExpandedArticles((prev) => ({
      ...prev,
      [articleId]: !prev[articleId],
    }));
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: issue?.title || "Israel Property Magazine",
          text: issue?.description || "Check out this issue",
          url,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  // Group articles by category
  const articlesByCategory = {};
  CATEGORY_ORDER.forEach((cat) => {
    const catArticles = articles.filter((a) => a.category === cat);
    if (catArticles.length > 0) {
      articlesByCategory[cat] = catArticles;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Skeleton className="h-80 w-full" />
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8 max-w-md">
          <CardContent>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Issue Not Found
            </h2>
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

  return (
    <div className="min-h-screen">
      {/* Cover Hero */}
      <section className="relative">
        <div className="h-80 md:h-[28rem] overflow-hidden relative">
          <img
            src={
              issue.cover_image_url ||
              "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1600&q=80"
            }
            alt={issue.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/magazine"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Issues
            </Link>
            <Badge className="bg-amber-500 text-white border-0 mb-4 block w-fit">
              <Calendar className="w-3 h-3 mr-1" />
              {getIssueLabel(issue.month, issue.year)}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
              {issue.title}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
              {issue.description}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Table of Contents */}
        <section className="py-10 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">In This Issue</h2>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Issue
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORY_ORDER.filter((cat) => articlesByCategory[cat]).map((cat) => {
              const catInfo = MAGAZINE_CATEGORIES[cat];
              const Icon = catInfo.icon;
              return (
                <a
                  key={cat}
                  href={`#section-${cat}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${catInfo.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-amber-600 transition-colors">
                      {catInfo.label}
                    </p>
                    <p className="text-xs text-gray-500">
                      {articlesByCategory[cat].length} article{articlesByCategory[cat].length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Article Sections */}
        {CATEGORY_ORDER.filter((cat) => articlesByCategory[cat]).map((cat) => {
          const catInfo = MAGAZINE_CATEGORIES[cat];
          const Icon = catInfo.icon;
          return (
            <section
              key={cat}
              id={`section-${cat}`}
              className="py-10 border-b border-gray-100 last:border-0"
            >
              {/* Section Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${catInfo.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{catInfo.label}</h2>
                </div>
              </div>

              {/* Articles */}
              <div className="space-y-6">
                {articlesByCategory[cat].map((article) => {
                  const expert = experts[article.author_expert_id];
                  const isExpanded = expandedArticles[article.id];

                  return (
                    <Card
                      key={article.id}
                      className={`overflow-hidden transition-all duration-300 border-l-4 ${catInfo.accent}`}
                    >
                      {/* Article Preview */}
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          {/* Image */}
                          {article.image_url && (
                            <div className="md:w-64 h-48 md:h-auto flex-shrink-0 overflow-hidden">
                              <img
                                src={article.image_url}
                                alt={article.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          {/* Content */}
                          <div className="flex-1 p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                              {article.title}
                            </h3>

                            {/* Author */}
                            <div className="flex items-center gap-2 mb-3">
                              {expert?.image_url ? (
                                <img
                                  src={expert.image_url}
                                  alt={article.author_name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-gray-500" />
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  {article.author_name || "Editorial Team"}
                                </p>
                                {expert?.company && (
                                  <p className="text-xs text-gray-500">{expert.company}</p>
                                )}
                              </div>
                            </div>

                            <p className="text-gray-600 mb-4">{article.excerpt}</p>

                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleArticle(article.id)}
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="w-4 h-4 mr-1" />
                                    Collapse
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-4 h-4 mr-1" />
                                    Read Article
                                  </>
                                )}
                              </Button>
                              <Link to={`/magazine/article/${article.slug}`}>
                                <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700">
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  Open Full Page
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Article Content */}
                        {isExpanded && (
                          <div className="border-t border-gray-100">
                            <div className="p-6 md:p-10">
                              <style>{`
                                .magazine-content {
                                  color: #1f2937;
                                  font-size: 1.125rem;
                                  line-height: 1.9;
                                }
                                .magazine-content p {
                                  margin-bottom: 1.75rem;
                                  line-height: 1.9;
                                }
                                .magazine-content h1, .magazine-content h2, .magazine-content h3 {
                                  margin-top: 2.5rem;
                                  margin-bottom: 1.25rem;
                                  font-weight: 700;
                                  color: #111827;
                                }
                                .magazine-content h2 {
                                  font-size: 1.5rem;
                                  border-left: 4px solid #f59e0b;
                                  padding-left: 1rem;
                                }
                                .magazine-content h3 {
                                  font-size: 1.25rem;
                                  color: #92400e;
                                }
                                .magazine-content ul, .magazine-content ol {
                                  margin-bottom: 2rem;
                                  padding-left: 0;
                                  list-style: none;
                                }
                                .magazine-content ul li {
                                  position: relative;
                                  padding-left: 2rem;
                                  margin-bottom: 1rem;
                                  line-height: 1.8;
                                }
                                .magazine-content ul li:before {
                                  content: "\\25B8";
                                  position: absolute;
                                  left: 0;
                                  color: #f59e0b;
                                  font-size: 1.5rem;
                                  font-weight: bold;
                                  line-height: 1.8;
                                }
                                .magazine-content ol {
                                  counter-reset: item;
                                }
                                .magazine-content ol li {
                                  position: relative;
                                  padding-left: 2.5rem;
                                  margin-bottom: 1rem;
                                  line-height: 1.8;
                                  counter-increment: item;
                                }
                                .magazine-content ol li:before {
                                  content: counter(item) ".";
                                  position: absolute;
                                  left: 0;
                                  color: #f59e0b;
                                  font-weight: bold;
                                }
                                .magazine-content blockquote {
                                  border-left: 5px solid #f59e0b;
                                  background: linear-gradient(to right, #fffbeb, transparent);
                                  padding: 1.5rem 1.5rem 1.5rem 2rem;
                                  margin: 2rem 0;
                                  font-style: italic;
                                  color: #92400e;
                                  border-radius: 0.5rem;
                                }
                                .magazine-content strong {
                                  color: #111827;
                                  font-weight: 700;
                                }
                                .magazine-content a {
                                  color: #d97706;
                                  text-decoration: none;
                                  border-bottom: 2px solid #fcd34d;
                                }
                                .magazine-content a:hover {
                                  color: #b45309;
                                  border-bottom-color: #d97706;
                                }
                              `}</style>
                              <div className="magazine-content prose prose-lg max-w-none">
                                <ReactMarkdown>{article.content}</ReactMarkdown>
                              </div>

                              {/* Expert Author Card */}
                              {expert && (
                                <div className="mt-10 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                                    About the Author
                                  </h4>
                                  <div className="flex flex-col sm:flex-row gap-4">
                                    <img
                                      src={
                                        expert.image_url ||
                                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80"
                                      }
                                      alt={expert.name}
                                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
                                    />
                                    <div>
                                      <h5 className="text-lg font-bold text-gray-900">
                                        {expert.name}
                                      </h5>
                                      {expert.company && (
                                        <p className="text-amber-700 font-medium text-sm">
                                          {expert.company}
                                        </p>
                                      )}
                                      <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                                        {expert.description}
                                      </p>
                                      <Link to={`/expert?id=${expert.id}`}>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="mt-3"
                                        >
                                          View Full Profile
                                        </Button>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div className="mt-6 text-center">
                                <Button
                                  variant="outline"
                                  onClick={() => toggleArticle(article.id)}
                                >
                                  <ChevronUp className="w-4 h-4 mr-2" />
                                  Collapse Article
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Issue Navigation */}
        <section className="py-10">
          <div className="flex items-center justify-between">
            {adjacentIssues.prev ? (
              <Link to={`/magazine/issue/${adjacentIssues.prev.slug}`}>
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {getIssueLabel(adjacentIssues.prev.month, adjacentIssues.prev.year)}
                  </span>
                  <span className="sm:hidden">Previous</span>
                </Button>
              </Link>
            ) : (
              <div />
            )}
            <Link to="/magazine">
              <Button variant="ghost" className="text-gray-500">
                All Issues
              </Button>
            </Link>
            {adjacentIssues.next ? (
              <Link to={`/magazine/issue/${adjacentIssues.next.slug}`}>
                <Button variant="outline" className="gap-2">
                  <span className="hidden sm:inline">
                    {getIssueLabel(adjacentIssues.next.month, adjacentIssues.next.year)}
                  </span>
                  <span className="sm:hidden">Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
