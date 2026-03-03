import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, BookOpen, ArrowRight } from "lucide-react";

export default function WikiPage() {
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = topics.filter(topic =>
        topic.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTopics(filtered);
    } else {
      setFilteredTopics(topics);
    }
  }, [searchTerm, topics]);

  const loadTopics = async () => {
    setIsLoading(true);
    try {
      const data = await base44.entities.WikiTopic.filter({ published: true });
      const sorted = data.sort((a, b) => a.title.localeCompare(b.title));
      setTopics(sorted);
      setFilteredTopics(sorted);
    } catch (error) {
      console.error('Error loading topics:', error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-12 w-96 mx-auto mb-4 bg-white/20" />
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Real Estate A-Z | Israel Property Guide | IsraelProperty360</title>
        <meta name="description" content="Complete A-Z guide to Israeli real estate. Learn about property terms, legal processes, taxes, financing, and regulations for buying property in Israel." />
        <meta name="keywords" content="Israel real estate guide, property terms, real estate glossary, buying property Israel, Israeli real estate law, property taxes Israel" />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <BookOpen className="w-16 h-16" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Real Estate A-Z
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Your comprehensive guide to understanding Israeli real estate terms, processes, and regulations
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search wiki topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredTopics.length > 0 ? (
          <div className="space-y-3">
            {filteredTopics.map((topic) => (
              <Link key={topic.id} to={createPageUrl(`WikiTopic?slug=${topic.slug}`)}>
                <div className="group bg-white rounded-lg px-6 py-4 hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-blue-500">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {topic.title}
                      </h3>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Topics Found
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search' : 'Wiki topics will appear here'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}