import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Building2, Home, TrendingUp } from "lucide-react";

export default function PropertiesMenuContent() {
  return (
    <div className="grid w-[400px] gap-3 p-4">
      <Link
        to={createPageUrl("Properties")}
        className="block p-3 rounded-md hover:bg-accent transition-colors"
      >
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-primary mt-1" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">All Properties</h4>
            <p className="text-sm text-gray-600">Browse our complete property listings</p>
          </div>
        </div>
      </Link>

      <Link
        to={createPageUrl("Properties") + "?status=for_sale"}
        className="block p-3 rounded-md hover:bg-accent hover:shadow-md transition-all"
      >
        <div className="flex items-start gap-3">
          <Home className="w-5 h-5 text-primary mt-1" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">For Sale</h4>
            <p className="text-sm text-gray-600">Ready to move in properties</p>
          </div>
        </div>
      </Link>

      <Link
        to={createPageUrl("Properties") + "?status=in_development"}
        className="block p-3 rounded-md hover:bg-accent hover:shadow-md transition-all"
      >
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-primary mt-1" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">New Construction</h4>
            <p className="text-sm text-gray-600">Pre-construction and new developments</p>
          </div>
        </div>
      </Link>
    </div>
  );
}