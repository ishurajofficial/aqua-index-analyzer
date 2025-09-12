"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PollutionData } from "@/lib/data";

interface GeographicMapProps {
  data: PollutionData[];
  selectedLocation?: PollutionData;
  onLocationSelect?: (location: PollutionData) => void;
}

// India map boundaries and major cities coordinates
const INDIA_BOUNDS = {
  north: 37.1,
  south: 6.5,
  east: 97.4,
  west: 68.2,
  width: 400,
  height: 500,
};

// Major Indian cities for reference
const MAJOR_CITIES = [
  { name: "Delhi", lat: 28.6139, lng: 77.2090, state: "Delhi" },
  { name: "Mumbai", lat: 19.0760, lng: 72.8777, state: "Maharashtra" },
  { name: "Bangalore", lat: 12.9716, lng: 77.5946, state: "Karnataka" },
  { name: "Chennai", lat: 13.0827, lng: 80.2707, state: "Tamil Nadu" },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639, state: "West Bengal" },
  { name: "Hyderabad", lat: 17.3850, lng: 78.4867, state: "Telangana" },
  { name: "Pune", lat: 18.5204, lng: 73.8567, state: "Maharashtra" },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, state: "Gujarat" },
  { name: "Jaipur", lat: 26.9124, lng: 75.7873, state: "Rajasthan" },
  { name: "Lucknow", lat: 26.8467, lng: 80.9462, state: "Uttar Pradesh" },
];

// Convert lat/lng to SVG coordinates
function latLngToSvg(lat: number, lng: number, bounds: typeof INDIA_BOUNDS) {
  const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * bounds.width;
  const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * bounds.height;
  return { x, y };
}

// Get risk color based on risk level
function getRiskColor(risk: string) {
  switch (risk.toLowerCase()) {
    case 'high':
      return '#ef4444'; // red-500
    case 'moderate':
      return '#f59e0b'; // amber-500
    case 'low':
      return '#10b981'; // emerald-500
    default:
      return '#6b7280'; // gray-500
  }
}

// Get risk size based on HPI value
function getRiskSize(hpi: number) {
  if (hpi > 80) return 12;
  if (hpi > 60) return 10;
  if (hpi > 40) return 8;
  if (hpi > 20) return 6;
  return 4;
}

export function GeographicMap({ data, selectedLocation, onLocationSelect }: GeographicMapProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [hoveredLocation, setHoveredLocation] = useState<PollutionData | null>(null);

  // Reset view
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Handle zoom
  const handleZoom = (direction: 'in' | 'out') => {
    setZoom(prev => {
      const newZoom = direction === 'in' ? prev * 1.2 : prev / 1.2;
      return Math.max(0.5, Math.min(3, newZoom));
    });
  };

  // Handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const direction = e.deltaY < 0 ? 'in' : 'out';
    handleZoom(direction);
  };

  // Handle pan
  const handleMouseDown = (e: React.MouseEvent) => {
    const startX = e.clientX - pan.x;
    const startY = e.clientY - pan.y;

    const handleMouseMove = (e: MouseEvent) => {
      setPan({
        x: e.clientX - startX,
        y: e.clientY - startY,
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Filter data to only show locations with valid coordinates
  const validData = data.filter(d => 
    d.latitude && d.longitude && 
    d.latitude >= INDIA_BOUNDS.south && d.latitude <= INDIA_BOUNDS.north &&
    d.longitude >= INDIA_BOUNDS.west && d.longitude <= INDIA_BOUNDS.east
  );

  // Group data by risk level for statistics
  const riskStats = {
    high: validData.filter(d => d.risk === 'High').length,
    moderate: validData.filter(d => d.risk === 'Moderate').length,
    low: validData.filter(d => d.risk === 'Low').length,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Geographic Distribution
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleZoom('out')}
              disabled={zoom <= 0.5}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleZoom('in')}
              disabled={zoom >= 3}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetView}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Risk Statistics */}
        <div className="flex gap-2 mb-4">
          <Badge variant="destructive" className="text-xs">
            High Risk: {riskStats.high}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Moderate: {riskStats.moderate}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Low Risk: {riskStats.low}
          </Badge>
        </div>

        {/* Map Container */}
        <div className="relative border rounded-lg overflow-hidden bg-gray-50">
          <div
            className="relative cursor-move"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transformOrigin: 'center center',
            }}
          >
            <svg
              width={INDIA_BOUNDS.width}
              height={INDIA_BOUNDS.height}
              viewBox={`0 0 ${INDIA_BOUNDS.width} ${INDIA_BOUNDS.height}`}
              className="w-full h-auto"
            >
              {/* India outline (simplified) */}
              <path
                d="M 50 100 L 100 80 L 150 90 L 200 85 L 250 95 L 300 100 L 350 110 L 380 120 L 390 140 L 385 160 L 380 180 L 375 200 L 370 220 L 365 240 L 360 260 L 355 280 L 350 300 L 345 320 L 340 340 L 335 360 L 330 380 L 325 400 L 320 420 L 315 440 L 310 460 L 305 480 L 300 500 L 280 490 L 260 480 L 240 470 L 220 460 L 200 450 L 180 440 L 160 430 L 140 420 L 120 410 L 100 400 L 80 390 L 60 380 L 40 370 L 20 360 L 10 340 L 15 320 L 20 300 L 25 280 L 30 260 L 35 240 L 40 220 L 45 200 L 50 180 L 55 160 L 60 140 L 65 120 L 70 100 Z"
                fill="#e5e7eb"
                stroke="#9ca3af"
                strokeWidth="1"
              />

              {/* Major cities (reference points) */}
              {MAJOR_CITIES.map((city) => {
                const { x, y } = latLngToSvg(city.lat, city.lng, INDIA_BOUNDS);
                return (
                  <g key={city.name}>
                    <circle
                      cx={x}
                      cy={y}
                      r="2"
                      fill="#6b7280"
                      opacity="0.6"
                    />
                    <text
                      x={x + 3}
                      y={y - 3}
                      fontSize="8"
                      fill="#6b7280"
                      className="select-none"
                    >
                      {city.name}
                    </text>
                  </g>
                );
              })}

              {/* Sample locations */}
              {validData.map((location) => {
                const { x, y } = latLngToSvg(location.latitude, location.longitude, INDIA_BOUNDS);
                const isSelected = selectedLocation?.id === location.id;
                const isHovered = hoveredLocation?.id === location.id;
                const size = getRiskSize(location.hpi);
                const color = getRiskColor(location.risk);

                return (
                  <g key={location.id}>
                    {/* Outer ring for selected/hovered state */}
                    {(isSelected || isHovered) && (
                      <circle
                        cx={x}
                        cy={y}
                        r={size + 4}
                        fill="none"
                        stroke={isSelected ? "#3b82f6" : "#f59e0b"}
                        strokeWidth="2"
                        opacity="0.8"
                      />
                    )}
                    
                    {/* Main marker */}
                    <circle
                      cx={x}
                      cy={y}
                      r={size}
                      fill={color}
                      stroke="white"
                      strokeWidth="1"
                      className="cursor-pointer"
                      onClick={() => onLocationSelect?.(location)}
                      onMouseEnter={() => setHoveredLocation(location)}
                      onMouseLeave={() => setHoveredLocation(null)}
                    />
                    
                    {/* Inner dot */}
                    <circle
                      cx={x}
                      cy={y}
                      r={size * 0.4}
                      fill="white"
                      opacity="0.8"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
            <h4 className="text-sm font-medium mb-2">Risk Levels</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>High Risk</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span>Moderate Risk</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span>Low Risk</span>
              </div>
            </div>
          </div>

          {/* Hover Tooltip */}
          {hoveredLocation && (
            <div className="absolute top-4 right-4 bg-white rounded-lg p-3 shadow-lg border max-w-xs">
              <h4 className="font-medium text-sm">{hoveredLocation.location}</h4>
              <div className="text-xs text-muted-foreground mt-1">
                <div>HPI: {hoveredLocation.hpi.toFixed(2)}</div>
                <div>HEI: {hoveredLocation.hei.toFixed(2)}</div>
                <div>PLI: {hoveredLocation.pli.toFixed(2)}</div>
                <div className="mt-1">
                  <Badge 
                    variant={hoveredLocation.risk === 'High' ? 'destructive' : 
                            hoveredLocation.risk === 'Moderate' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {hoveredLocation.risk} Risk
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Map Instructions */}
        <div className="mt-4 text-xs text-muted-foreground">
          <p>• Click and drag to pan • Mouse wheel to zoom • Click markers to select locations</p>
        </div>
      </CardContent>
    </Card>
  );
}
