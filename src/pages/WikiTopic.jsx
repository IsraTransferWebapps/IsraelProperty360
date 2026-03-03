import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, BookOpen, Share2, Calendar, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function WikiTopicPage() {
  const [topic, setTopic] = useState(null);
  const [relatedTopics, setRelatedTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const slug = urlParams.get('slug');
    if (slug) {
      loadTopic(slug);
    }
  }, [location.search]);

  const loadTopic = async (slug) => {
    setIsLoading(true);
    try {
      const topics = await base44.entities.WikiTopic.filter({ slug, published: true });
      
      if (topics.length > 0) {
        const currentTopic = topics[0];
        setTopic(currentTopic);

        // Load related topics from same category
        const related = await base44.entities.WikiTopic.filter({ 
          category: currentTopic.category,
          published: true 
        }, null, 4);
        setRelatedTopics(related.filter(t => t.id !== currentTopic.id).slice(0, 3));
      }
    } catch (error) {
      console.error('Error loading topic:', error);
    }
    setIsLoading(false);
  };

  const getCategoryLabel = (category) => {
    const labels = {
      legal: "Legal",
      financing: "Financing",
      taxes: "Taxes",
      process: "Process",
      neighborhoods: "Neighborhoods",
      investment: "Investment",
      terminology: "Terminology"
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      legal: "bg-red-100 text-red-800",
      financing: "bg-green-100 text-green-800",
      taxes: "bg-yellow-100 text-yellow-800",
      process: "bg-blue-100 text-blue-800",
      neighborhoods: "bg-purple-100 text-purple-800",
      investment: "bg-indigo-100 text-indigo-800",
      terminology: "bg-gray-100 text-gray-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Topic Not Found</h2>
            <p className="text-gray-600 mb-6">The wiki topic you're looking for doesn't exist.</p>
            <Link to={createPageUrl("Wiki")}>
              <Button>Back to Wiki</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getMetaDescription = () => {
    if (topic.content) {
      const plainText = topic.content.replace(/[#*`\[\]]/g, '').substring(0, 155);
      return plainText + '...';
    }
    return `Learn about ${topic.title} in Israeli real estate. Comprehensive guide covering everything you need to know.`;
  };

  const getReadingTime = () => {
    if (!topic.content) return 1;
    const words = topic.content.split(/\s+/).length;
    return Math.ceil(words / 200); // Average reading speed
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Helmet>
        <title>{topic.title} | Real Estate A-Z | IsraelProperty360</title>
        <meta name="description" content={getMetaDescription()} />
        <meta name="keywords" content={`${topic.title}, Israeli real estate, ${getCategoryLabel(topic.category)}, property guide Israel`} />
        <meta property="og:title" content={`${topic.title} | Real Estate A-Z`} />
        <meta property="og:description" content={getMetaDescription()} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${topic.title} | Real Estate A-Z`} />
        <meta name="twitter:description" content={getMetaDescription()} />
      </Helmet>

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={createPageUrl("Wiki")}>
            <Button variant="ghost" className="mb-6 text-white hover:text-white hover:bg-white/10 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to A-Z
            </Button>
          </Link>
          <Badge className="mb-4 bg-white/20 text-white border-white/30 text-sm px-3 py-1">
            {getCategoryLabel(topic.category)}
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {topic.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(topic.updated_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{getReadingTime()} min read</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content - Blog Style */}
        <article className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-12">
          <div className="px-8 py-12 md:px-16 md:py-16 lg:px-20 lg:py-20">
            {/* Article Body */}
            <div className="prose prose-xl max-w-none
              prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight
              prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-5 prose-p:text-lg
              prose-strong:text-slate-900 prose-strong:font-semibold
              prose-ul:my-6 prose-ul:space-y-2.5 prose-ul:ml-6
              prose-ol:my-6 prose-ol:space-y-2.5 prose-ol:ml-6
              prose-li:text-slate-700 prose-li:leading-relaxed prose-li:text-[17px] prose-li:pl-2
              prose-h1:text-4xl prose-h1:mt-0 prose-h1:mb-10 prose-h1:pb-6 prose-h1:border-b-2 prose-h1:border-slate-200 prose-h1:leading-tight
              prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b-2 prose-h2:border-slate-200 prose-h2:leading-snug
              prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-5 prose-h3:font-semibold prose-h3:text-slate-800 prose-h3:leading-snug
              prose-h4:text-xl prose-h4:mt-10 prose-h4:mb-4 prose-h4:font-semibold prose-h4:text-slate-800 prose-h4:leading-snug
              prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
              prose-code:text-base prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-blue-600
              prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:italic prose-blockquote:my-8 prose-blockquote:text-slate-700
              prose-img:rounded-xl prose-img:shadow-lg prose-img:my-10
              [&>h1:first-child]:mt-0
              [&>h2:first-child]:mt-0
              [&>p:first-of-type]:text-xl
              [&>p:first-of-type]:text-slate-600
              [&>p:first-of-type]:mb-8
              [&>p:first-of-type]:leading-relaxed">
              <ReactMarkdown>{topic.content}</ReactMarkdown>
            </div>

            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Last updated: {new Date(topic.updated_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200">
                  {getCategoryLabel(topic.category)}
                </Badge>
              </div>
            </div>
          </div>
        </article>

        {/* Related Topics */}
        {relatedTopics.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedTopics.map((related) => (
                <Link key={related.id} to={createPageUrl(`WikiTopic?slug=${related.slug}`)}>
                  <div className="h-full bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer group p-5">
                    <Badge className={`${getCategoryColor(related.category)} mb-3 text-xs`}>
                      {getCategoryLabel(related.category)}
                    </Badge>
                    <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {related.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-10 text-center shadow-lg">
          <h3 className="text-2xl font-bold mb-3">Need Professional Guidance?</h3>
          <p className="text-blue-100 mb-6 text-lg max-w-xl mx-auto">
            Connect with experienced real estate lawyers, brokers, and advisors
          </p>
          <Link to={createPageUrl("Experts")}>
            <Button variant="secondary" size="lg" className="px-8 py-6 text-base">
              Find an Expert
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}