import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, User, Share2, Mail, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function BlogPostPage() {
  const [post, setPost] = useState(null);
  const [expert, setExpert] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const slug = urlParams.get('slug');
    if (slug) {
      loadPost(slug);
    }
  }, [location.search]);

  const loadPost = async (slug) => {
    try {
      // Try to find by slug first
      let posts = await base44.entities.BlogPost.filter({ slug: slug });
      
      // If not found by slug, try by ID (for backwards compatibility)
      if (posts.length === 0) {
        posts = await base44.entities.BlogPost.filter({ id: slug });
      }
      
      if (posts.length > 0) {
        const postData = posts[0];
        setPost(postData);

        // Load expert author (only if valid expert ID exists)
        if (postData.author_expert_id && !postData.author_expert_id.includes('EXPERT_ID_')) {
          try {
            const experts = await base44.entities.Expert.filter({ id: postData.author_expert_id });
            if (experts.length > 0) {
              setExpert(experts[0]);
            } else {
              console.log(`Expert with ID ${postData.author_expert_id} not found, skipping expert data.`);
              setExpert(null);
            }
          } catch (error) {
            console.log(`Error loading expert with ID ${postData.author_expert_id}:`, error);
            console.log('Expert not found or error occurred, skipping expert data');
            setExpert(null);
          }
        } else {
          setExpert(null);
        }

        // Load related posts
        const related = await base44.entities.BlogPost.filter({ 
          category: postData.category,
          published: true 
        }, '-created_date', 4);
        setRelatedPosts(related.filter(p => p.id !== postData.id));
      }
    } catch (error) {
      console.error('Error loading post:', error);
    }
    setIsLoading(false);
  };

  const getCategoryColor = (category) => {
    const colors = {
      legal: 'bg-blue-100 text-blue-800',
      finance: 'bg-green-100 text-green-800',
      market_update: 'bg-purple-100 text-purple-800',
      buying_guide: 'bg-yellow-100 text-yellow-800',
      investment: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      legal: 'Legal',
      finance: 'Finance',
      market_update: 'Market Trends',
      buying_guide: 'Buying Guide',
      investment: 'Investment'
    };
    return labels[category] || category;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-96 w-full mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
            <p className="text-gray-600 mb-6">The article you're looking for doesn't exist.</p>
            <Link to={createPageUrl('Blog')}>
              <Button>Browse All Articles</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to={createPageUrl('Blog')}>
          <Button variant="outline" className="mb-6 hover:shadow-md transition-shadow">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </Link>

        {/* Article Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8 border border-gray-100">
          <div className="mb-6">
            <Badge className={`text-sm px-4 py-1.5 ${getCategoryColor(post.category)}`}>
              {getCategoryLabel(post.category)}
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8 pb-8 border-b-2 border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                {expert ? (
                  <Link 
                    to={createPageUrl(`Expert?id=${expert.id}`)}
                    className="font-semibold hover:text-blue-600 transition-colors block"
                  >
                    {post.author_name}
                  </Link>
                ) : (
                  <span className="font-semibold block">{post.author_name}</span>
                )}
                {post.author_expertise && (
                  <span className="text-sm text-gray-500">{post.author_expertise.replace('_', ' ')}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span className="font-medium">{new Date(post.created_date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>

          {/* Featured Video */}
          {post.video_url && (
            <div className="relative mb-10 rounded-xl overflow-hidden shadow-lg aspect-video">
              {post.video_url.includes('youtube.com') || post.video_url.includes('youtu.be') ? (
                <iframe
                  src={post.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  className="w-full h-full"
                  allowFullScreen
                  title="Blog post video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : post.video_url.includes('vimeo.com') ? (
                <iframe
                  src={post.video_url.replace('vimeo.com/', 'player.vimeo.com/video/')}
                  className="w-full h-full"
                  allowFullScreen
                  title="Blog post video"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                />
              ) : (
                <video controls className="w-full h-full">
                  <source src={post.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}

          {/* Audio Player */}
          {post.audio_url && (
            <div className="mb-10 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Listen to this article</h3>
              </div>
              <audio controls className="w-full">
                <source src={post.audio_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {/* Featured Image */}
          {post.image_url && !post.video_url && (
            <div className="relative mb-10 rounded-xl overflow-hidden shadow-lg">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          )}

          {/* Article Content with enhanced styling */}
          <style>{`
            .blog-content {
              color: #1f2937;
              font-size: 1.125rem;
              line-height: 1.9;
            }
            .blog-content p {
              margin-bottom: 1.75rem;
              line-height: 1.9;
            }
            .blog-content h1, .blog-content h2, .blog-content h3 {
              margin-top: 2.5rem;
              margin-bottom: 1.25rem;
              font-weight: 700;
              color: #111827;
            }
            .blog-content h1 {
              font-size: 2.25rem;
              border-bottom: 3px solid #3b82f6;
              padding-bottom: 0.5rem;
              margin-bottom: 1.5rem;
            }
            .blog-content h2 {
              font-size: 1.875rem;
              border-left: 4px solid #3b82f6;
              padding-left: 1rem;
            }
            .blog-content h3 {
              font-size: 1.5rem;
              color: #1e40af;
            }
            .blog-content ul, .blog-content ol {
              margin-bottom: 2rem;
              padding-left: 0;
              list-style: none;
            }
            .blog-content ul li {
              position: relative;
              padding-left: 2rem;
              margin-bottom: 1rem;
              line-height: 1.8;
            }
            .blog-content ul li:before {
              content: "▸";
              position: absolute;
              left: 0;
              color: #3b82f6;
              font-size: 1.5rem;
              font-weight: bold;
              line-height: 1.8;
            }
            .blog-content ol {
              counter-reset: item;
            }
            .blog-content ol li {
              position: relative;
              padding-left: 2.5rem;
              margin-bottom: 1rem;
              line-height: 1.8;
              counter-increment: item;
            }
            .blog-content ol li:before {
              content: counter(item) ".";
              position: absolute;
              left: 0;
              color: #3b82f6;
              font-weight: bold;
              font-size: 1.125rem;
            }
            .blog-content blockquote {
              border-left: 5px solid #3b82f6;
              background: linear-gradient(to right, #eff6ff, transparent);
              padding: 1.5rem 1.5rem 1.5rem 2rem;
              margin: 2rem 0;
              font-style: italic;
              color: #1e40af;
              border-radius: 0.5rem;
              box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
            }
            .blog-content a {
              color: #2563eb;
              text-decoration: none;
              border-bottom: 2px solid #93c5fd;
              transition: all 0.2s;
            }
            .blog-content a:hover {
              color: #1d4ed8;
              border-bottom-color: #2563eb;
            }
            .blog-content img {
              margin: 2rem 0;
              border-radius: 0.75rem;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
              max-width: 100%;
              height: auto;
            }
            .blog-content code {
              background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
              padding: 0.25rem 0.6rem;
              border-radius: 0.375rem;
              font-size: 0.95rem;
              font-family: 'Courier New', monospace;
              color: #1e40af;
              border: 1px solid #cbd5e1;
            }
            .blog-content strong {
              color: #111827;
              font-weight: 700;
            }
            .blog-content em {
              color: #374151;
            }
          `}</style>
          <div className="blog-content prose prose-lg max-w-none mb-10">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b-2 border-gray-100">
              <span className="text-sm font-semibold text-gray-600 mr-2">Tags:</span>
              {post.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-sm px-3 py-1 hover:bg-blue-50 transition-colors">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Share */}
          <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
            <span className="text-gray-700 font-semibold">Found this helpful? Share it:</span>
            <Button variant="outline" size="sm" className="hover:bg-white hover:shadow-md transition-all">
              <Share2 className="w-4 h-4 mr-2" />
              Share Article
            </Button>
          </div>
        </div>

        {/* Author Card */}
        {expert && (
          <Card className="mb-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200 shadow-xl">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-blue-600 rounded"></div>
                About the Author
              </h3>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative">
                  <img
                    src={expert.image_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}
                    alt={expert.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-gray-900 mb-1">{expert.name}</h4>
                  <p className="text-blue-600 font-semibold mb-3">{expert.company}</p>
                  <p className="text-gray-700 mb-5 leading-relaxed">{expert.description}</p>
                  <div className="flex flex-wrap gap-3">
                    <Link to={createPageUrl(`Expert?id=${expert.id}`)}>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-md">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Full Profile
                      </Button>
                    </Link>
                    {expert.email && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => window.location.href = `mailto:${expert.email}`}
                        className="hover:bg-white hover:shadow-md transition-all"
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

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded"></div>
              Related Articles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <Card key={relatedPost.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-200">
                  <div className="h-40 overflow-hidden relative">
                    <img
                      src={relatedPost.image_url || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                  <CardContent className="p-5">
                    <Badge className={`mb-3 ${getCategoryColor(relatedPost.category)}`}>
                      {getCategoryLabel(relatedPost.category)}
                    </Badge>
                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg leading-snug">
                      {relatedPost.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                      {relatedPost.excerpt}
                    </p>
                    <Link to={createPageUrl(`BlogPost?slug=${relatedPost.slug || relatedPost.id}`)}>
                      <Button variant="outline" size="sm" className="w-full hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all">
                        Read Article →
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}