import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Bell, BellOff, CheckCircle, ArrowLeft, Mail } from 'lucide-react';

export default function PropertyAlertsPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [preferences, setPreferences] = useState({
    preferred_cities: [],
    max_budget: '',
    min_bedrooms: '',
    property_types: []
  });

  const cities = [
    "Ashdod",
    "Ashkelon",
    "Be'er Sheva",
    "Beit Shemesh",
    "Haifa",
    "Herzliya",
    "Jerusalem",
    "Modi'in",
    "Netanya",
    "Ra'anana",
    "Tel Aviv",
    "Zichron Ya'akov"
  ];
  const propertyTypes = [
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "penthouse", label: "Penthouse" },
    { value: "commercial", label: "Commercial" },
    { value: "land", label: "Land" }
  ];

  useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    setIsLoading(true);
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      if (currentUser.property_alerts_enabled) {
        setAlertsEnabled(true);
      }
      
      if (currentUser.alert_preferences) {
        setPreferences({
          preferred_cities: currentUser.alert_preferences.preferred_cities || [],
          max_budget: currentUser.alert_preferences.max_budget || '',
          min_bedrooms: currentUser.alert_preferences.min_bedrooms || '',
          property_types: currentUser.alert_preferences.property_types || []
        });
      }
    } catch (error) {
      console.error('Error loading user:', error);
      navigate(createPageUrl('Home'));
    }
    setIsLoading(false);
  };

  const toggleCity = (city) => {
    setPreferences(prev => ({
      ...prev,
      preferred_cities: prev.preferred_cities.includes(city)
        ? prev.preferred_cities.filter(c => c !== city)
        : [...prev.preferred_cities, city]
    }));
  };

  const togglePropertyType = (type) => {
    setPreferences(prev => ({
      ...prev,
      property_types: prev.property_types.includes(type)
        ? prev.property_types.filter(t => t !== type)
        : [...prev.property_types, type]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await base44.auth.updateMe({
        property_alerts_enabled: alertsEnabled,
        alert_preferences: alertsEnabled ? {
          preferred_cities: preferences.preferred_cities,
          max_budget: preferences.max_budget ? Number(preferences.max_budget) : undefined,
          min_bedrooms: preferences.min_bedrooms ? Number(preferences.min_bedrooms) : undefined,
          property_types: preferences.property_types
        } : undefined
      });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your preferences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to={createPageUrl('Home')}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Bell className="w-8 h-8 text-blue-600" />
                  Property Alerts
                </CardTitle>
                <CardDescription className="mt-2">
                  Get notified via email when new properties matching your criteria are listed
                </CardDescription>
              </div>
              {showSuccess && (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Saved!</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Enable/Disable Alerts */}
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                {alertsEnabled ? (
                  <Bell className="w-6 h-6 text-blue-600" />
                ) : (
                  <BellOff className="w-6 h-6 text-gray-400" />
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    Property Alerts {alertsEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {alertsEnabled 
                      ? 'You will receive emails when matching properties are listed' 
                      : 'Enable to start receiving property notifications'}
                  </p>
                </div>
              </div>
              <Switch
                checked={alertsEnabled}
                onCheckedChange={setAlertsEnabled}
              />
            </div>

            {alertsEnabled && (
              <>
                {/* Email Confirmation */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Alerts will be sent to:</p>
                    <p className="font-medium text-gray-900">{user.email}</p>
                  </div>
                </div>

                {/* Preferred Cities */}
                <div>
                  <Label className="text-lg font-semibold mb-4 block">
                    Preferred Cities
                  </Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Select the cities you're interested in (select at least one)
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {cities.map((city) => (
                      <div
                        key={city}
                        onClick={() => toggleCity(city)}
                        className={`
                          p-4 rounded-lg border-2 cursor-pointer transition-all
                          ${preferences.preferred_cities.includes(city)
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{city}</span>
                          {preferences.preferred_cities.includes(city) && (
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <Label htmlFor="max_budget" className="text-lg font-semibold mb-2 block">
                    Maximum Budget
                  </Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Only properties within this budget will trigger alerts
                  </p>
                  <Input
                    id="max_budget"
                    type="number"
                    placeholder="e.g. 2000000"
                    value={preferences.max_budget}
                    onChange={(e) => setPreferences(prev => ({ ...prev, max_budget: e.target.value }))}
                    className="max-w-md"
                  />
                  {preferences.max_budget && (
                    <p className="text-sm text-gray-600 mt-2">
                      ₪{Number(preferences.max_budget).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Minimum Bedrooms */}
                <div>
                  <Label htmlFor="min_bedrooms" className="text-lg font-semibold mb-2 block">
                    Minimum Bedrooms
                  </Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Minimum number of bedrooms required
                  </p>
                  <Input
                    id="min_bedrooms"
                    type="number"
                    placeholder="e.g. 3"
                    value={preferences.min_bedrooms}
                    onChange={(e) => setPreferences(prev => ({ ...prev, min_bedrooms: e.target.value }))}
                    className="max-w-md"
                    min="1"
                    max="10"
                  />
                </div>

                {/* Property Types */}
                <div>
                  <Label className="text-lg font-semibold mb-4 block">
                    Property Types
                  </Label>
                  <p className="text-sm text-gray-600 mb-4">
                    Select property types you're interested in (optional - leave empty for all types)
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {propertyTypes.map((type) => (
                      <div
                        key={type.value}
                        onClick={() => togglePropertyType(type.value)}
                        className={`
                          p-4 rounded-lg border-2 cursor-pointer transition-all
                          ${preferences.property_types.includes(type.value)
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'}
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{type.label}</span>
                          {preferences.property_types.includes(type.value) && (
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Filters Summary */}
                {preferences.preferred_cities.length > 0 && (
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Your Alert Criteria:</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Cities:</span>{' '}
                        {preferences.preferred_cities.join(', ')}
                      </p>
                      {preferences.max_budget && (
                        <p>
                          <span className="font-medium">Max Budget:</span>{' '}
                          ₪{Number(preferences.max_budget).toLocaleString()}
                        </p>
                      )}
                      {preferences.min_bedrooms && (
                        <p>
                          <span className="font-medium">Min Bedrooms:</span>{' '}
                          {preferences.min_bedrooms}+
                        </p>
                      )}
                      {preferences.property_types.length > 0 && (
                        <p>
                          <span className="font-medium">Property Types:</span>{' '}
                          {preferences.property_types.map(t => 
                            propertyTypes.find(pt => pt.value === t)?.label
                          ).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Save Button */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                onClick={handleSave}
                disabled={isSaving || (alertsEnabled && preferences.preferred_cities.length === 0)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>

            {alertsEnabled && preferences.preferred_cities.length === 0 && (
              <p className="text-sm text-red-600 text-right">
                Please select at least one city to enable alerts
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}