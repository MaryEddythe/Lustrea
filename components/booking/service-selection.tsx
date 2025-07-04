"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
  description: string;
  features: string[];
}

interface ServiceSelectionProps {
  services: Service[];
  selectedService: string;
  onServiceSelect: (serviceId: string) => void;
}

export default function ServiceSelection({
  services,
  selectedService,
  onServiceSelect,
}: ServiceSelectionProps) {
  return (
    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-t-lg border-b">
        <CardTitle className="flex items-center space-x-3 text-xl">
          <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Select Your Service
          </span>
        </CardTitle>
        <CardDescription className="text-gray-600 text-base">
          Choose from our luxurious professional nail treatments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {services.map((service) => (
          <div
            key={service.id}
            className={`group relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
              selectedService === service.id.toString()
                ? "border-pink-400 bg-gradient-to-r from-pink-50 to-purple-50 shadow-lg ring-2 ring-pink-200"
                : "border-gray-200 hover:border-pink-300 bg-white hover:bg-gradient-to-r hover:from-pink-25 hover:to-purple-25"
            }`}
            onClick={() => onServiceSelect(service.id.toString())}
          >
            {selectedService === service.id.toString() && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}

            <div className="flex justify-between items-start mb-4">
              <div className="flex-1 pr-4">
                <h3 className="font-semibold text-xl text-gray-900 mb-2 group-hover:text-pink-700 transition-colors">
                  {service.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-600">
                    {service.duration >= 60
                      ? `${Math.floor(service.duration / 60)} hour${service.duration >= 120 ? "s" : ""}`
                      : `${service.duration} minutes`}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {service.description}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge
                  variant="secondary"
                  className={`text-lg font-semibold px-3 py-1 ${
                    selectedService === service.id.toString()
                      ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 group-hover:bg-pink-100 group-hover:text-pink-700"
                  }`}
                >
                  ₱{service.price}
                </Badge>
              </div>
            </div>

            {service.features && service.features.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {service.features.map((feature, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className={`text-xs font-medium ${
                        selectedService === service.id.toString()
                          ? "border-pink-300 text-pink-700 bg-pink-50"
                          : "border-gray-300 text-gray-600 group-hover:border-pink-300 group-hover:text-pink-600"
                      }`}
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
