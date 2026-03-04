import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Share2, TrendingUp, Users, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function MagazinePage() {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFeaturedArticles();
  }, []);

  const loadFeaturedArticles = async () => {
    try {
      // Load featured blog posts by category
      const [marketPosts, expertPosts, investmentPosts] = await Promise.all([
        base44.entities.BlogPost.filter({ 
          category: 'market_update', 
          published: true 
        }, '-created_date', 1),
        base44.entities.BlogPost.filter({ 
          category: 'legal', 
          published: true 
        }, '-created_date', 1),
        base44.entities.BlogPost.filter({ 
          category: 'investment', 
          published: true 
        }, '-created_date', 1)
      ]);

      setFeaturedArticles([
        {
          id: 1,
          icon: TrendingUp,
          color: 'blue',
          title: 'Market Analysis',
          description: marketPosts[0]?.excerpt || 'In-depth analysis of current market trends and future predictions for Israeli real estate.',
          content: marketPosts[0]?.title || 'Israeli Real Estate Market Trends 2025',
          author: marketPosts[0]?.author_name || 'Market Experts',
          link: marketPosts[0] ? createPageUrl(`BlogPost?slug=${marketPosts[0].slug || marketPosts[0].id}`) : createPageUrl('Blog?category=market_update')
        },
        {
          id: 2,
          icon: Users,
          color: 'green',
          title: 'Expert Interviews',
          description: expertPosts[0]?.excerpt || 'Exclusive interviews with leading professionals in the Israeli property market.',
          content: expertPosts[0]?.title || 'Legal Insights from Top Israeli Property Lawyers',
          author: expertPosts[0]?.author_name || 'Legal Experts',
          link: expertPosts[0] ? createPageUrl(`BlogPost?slug=${expertPosts[0].slug || expertPosts[0].id}`) : createPageUrl('Blog?category=legal')
        },
        {
          id: 3,
          icon: Lightbulb,
          color: 'purple',
          title: 'Investment Tips',
          description: investmentPosts[0]?.excerpt || 'Practical advice and strategies for successful property investment in Israel.',
          content: investmentPosts[0]?.title || 'Smart Investment Strategies for Israeli Property Market',
          author: investmentPosts[0]?.author_name || 'Investment Advisors',
          link: investmentPosts[0] ? createPageUrl(`BlogPost?slug=${investmentPosts[0].slug || investmentPosts[0].id}`) : createPageUrl('Blog?category=investment')
        }
      ]);
    } catch (error) {
      console.error('Error loading featured articles:', error);
    }
    setIsLoading(false);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'IsraelProperty360 Magazine',
        text: 'Check out the latest IsraelProperty360 property magazine',
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-6 text-yellow-500" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            IsraelProperty360 Magazine
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your comprehensive guide to Israeli real estate trends, market insights, 
            and expert advice for property buyers and investors.
          </p>
        </div>
      </div>

      {/* Magazine Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Latest Issue - Property Investment Guide 2025
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Comprehensive insights into the Israeli real estate market, featuring expert interviews, 
              market analysis, and investment opportunities.
            </p>
          </CardHeader>
          <CardContent>
            {/* Magazine Iframe */}
            <div className="w-full bg-white rounded-lg overflow-hidden shadow-inner">
              <iframe 
                src="https://player.flipsnack.com?hash=Qjc3QUZGRDZBRUQrY2ZxYjVmOGNqbA==" 
                width="100%" 
                height="600" 
                seamless="seamless" 
                scrolling="no" 
                frameBorder="0" 
                allowFullScreen 
                allow="autoplay; clipboard-read; clipboard-write"
                className="w-full"
                title="IsraelProperty360 Magazine"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button 
                variant="outline"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Magazine
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">
              Use the fullscreen button in the player above to view in a larger window
            </p>
          </CardContent>
        </Card>

        {/* Featured Articles Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Featured Articles
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Dive deeper into expert insights and analysis from our network of verified professionals
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-12 w-12 rounded-full mb-4" />
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredArticles.map((article) => {
                const IconComponent = article.icon;
                return (
                  <Card key={article.id} className="hover:shadow-xl transition-shadow duration-300 group">
                    <CardContent className="p-6">
                      <div className={`w-16 h-16 bg-${article.color}-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                        <IconComponent className={`w-8 h-8 text-${article.color}-600`} />
                      </div>
                      <h3 className="font-bold text-xl text-gray-900 mb-3 text-center">
                        {article.title}
                      </h3>
                      <h4 className="font-semibold text-gray-800 mb-2 text-center line-clamp-2">
                        {article.content}
                      </h4>
                      <p className="text-gray-600 text-sm mb-4 text-center line-clamp-3">
                        {article.description}
                      </p>
                      <div className="text-center mb-4">
                        <p className="text-xs text-gray-500">
                          By <span className="font-medium text-gray-700">{article.author}</span>
                        </p>
                      </div>
                      <Link to={article.link}>
                        <Button className="w-full" variant="outline">
                          Read Article
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Want More Expert Insights?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Explore our full blog library with articles from verified lawyers, realtors, 
            mortgage advisors, and investment experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('Blog')}>
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <BookOpen className="w-5 h-5 mr-2" />
                Browse All Articles
              </Button>
            </Link>
            <Link to={createPageUrl('Experts')}>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                <Users className="w-5 h-5 mr-2" />
                Meet Our Experts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}