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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5" />
          <span>Select Your Service</span>
        </CardTitle>
        <CardDescription>
          Choose from our professional nail services
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedService === service.id.toString()
                ? "border-pink-500 bg-pink-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onServiceSelect(service.id.toString())}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-medium text-lg">{service.name}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {service.duration >= 60
                    ? `${Math.floor(service.duration / 60)} hour${service.duration >= 120 ? "s" : ""}`
                    : `${service.duration} minutes`}
                </p>
                <p className="text-sm text-gray-600">{service.description}</p>
              </div>
              <Badge variant="secondary" className="ml-4">
                ₱{service.price}
              </Badge>
            </div>
            {service.features && service.features.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-1">
                  {service.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
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
