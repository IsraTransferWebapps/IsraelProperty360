import React, { useState, useEffect, useCallback } from "react";
import { Expert } from "@/entities/Expert";
import { User } from "@/entities/User";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Lock, UserPlus } from "lucide-react";
import { createPageUrl } from "@/utils";
import ExpertCard from "@/components/experts/ExpertCard";


export default function ExpertsPage() {
  const [experts, setExperts] = useState([]);
  const [filteredExperts, setFilteredExperts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    expertise: "",
    language: ""
  });
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const applyFilters = useCallback(() => {
    let filtered = experts;

    if (searchTerm) {
      filtered = filtered.filter(expert =>
        expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.specialties?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filters.expertise) {
      filtered = filtered.filter(e => e.expertise === filters.expertise);
    }

    if (filters.language) {
      filtered = filtered.filter(e => e.languages?.includes(filters.language));
    }

    setFilteredExperts(filtered);
  }, [experts, searchTerm, filters]);

  // Memoized loadExperts function
  const loadExperts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await Expert.list('-rating');
      // Only show approved experts
      const approvedExperts = data.filter(expert => expert.approval_status === 'approved');
      setExperts(approvedExperts);
    } catch (error) {
      console.error('Error loading experts:', error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const loadPageData = async () => {
      // Load user data
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
      
      // Apply URL parameters
      const urlParams = new URLSearchParams(location.search);
      const expertiseFromUrl = urlParams.get('expertise');
      if (expertiseFromUrl) {
        setFilters(prev => ({ ...prev, expertise: expertiseFromUrl }));
      }
      
      // Load experts
      loadExperts();
    };

    loadPageData();
  }, [location.search, loadExperts]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const languages = ["English", "Hebrew", "French", "Russian", "Spanish", "German", "Yiddish"];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Professional Network
          </h1>
          <p className="text-xl text-gray-600">
            Connect with verified experts to guide your property journey in Israel.
          </p>
        </div>

        {!user && (
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Register Free to Unlock Expert Contacts
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Get instant access to verified professionals' contact information, plus:
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Badge variant="secondary" className="bg-white">📧 Direct Expert Contact</Badge>
                    <Badge variant="secondary" className="bg-white">📰 Magazine to Inbox/WhatsApp</Badge>
                    <Badge variant="secondary" className="bg-white">🏠 Property Alerts</Badge>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Button 
                    onClick={() => navigate(createPageUrl('Register'))}
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Register Free
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Become an Expert Banner */}
        <Card className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Are you a property expert?
                  </h3>
                  <p className="text-gray-700">
                    Join our network and connect with property buyers across Israel
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => navigate(createPageUrl('RegisterExpert'))}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white whitespace-nowrap"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Become an Expert
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="p-6 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by name, company, specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>
            <div className="md:col-span-1">
              <Select value={filters.expertise} onValueChange={(v) => handleFilterChange('expertise', v)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Filter by Expertise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>All Expertise</SelectItem>
                  <SelectItem value="lawyer">Lawyer</SelectItem>
                  <SelectItem value="realtor">Realtor</SelectItem>
                  <SelectItem value="mortgage_advisor">Mortgage Advisor</SelectItem>
                  <SelectItem value="money_exchange">Money Exchange</SelectItem>
                  <SelectItem value="interior_designer">Interior Designer</SelectItem>
                  <SelectItem value="property_management">Property Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1">
               <Select value={filters.language} onValueChange={(v) => handleFilterChange('language', v)}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Filter by Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>All Languages</SelectItem>
                  {languages.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6 text-center">
                  <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-6 w-40 mx-auto mb-2" />
                  <Skeleton className="h-4 w-32 mx-auto mb-4" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExperts.map(expert => (
              <ExpertCard key={expert.id} expert={expert} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}