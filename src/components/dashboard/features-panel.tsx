"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Droplets, 
  BarChart3, 
  Shield, 
  MapPin, 
  Brain,
  ChevronDown,
  ChevronRight,
  Info
} from "lucide-react";

const coreFeatures = [
  {
    icon: <Droplets className="h-6 w-6" />,
    title: "HPI Calculation",
    subtitle: "Heavy Metal Pollution Index",
    description: "Comprehensive assessment of heavy metal contamination using WHO/BIS standards",
    formula: "HPI = Σ(Ci / Si) × Wi",
    details: "Where Ci = concentration, Si = standard limit, Wi = weight factor",
    benefits: ["WHO/BIS compliant", "Weighted assessment", "Comprehensive evaluation"],
    color: "blue"
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "HEI Analysis", 
    subtitle: "Heavy Metal Evaluation Index",
    description: "Quantitative evaluation of heavy metal pollution levels in groundwater",
    formula: "HEI = Σ(Ci / Si)",
    details: "Sum of ratios of metal concentrations to permissible limits",
    benefits: ["Simple calculation", "Direct comparison", "Risk quantification"],
    color: "green"
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Contamination Factor",
    subtitle: "CF Assessment",
    description: "Individual metal contamination assessment relative to background levels",
    formula: "CF = Ci / Cb",
    details: "Where Ci = metal concentration, Cb = background concentration",
    benefits: ["Individual metal analysis", "Background comparison", "Contamination degree"],
    color: "purple"
  },
  {
    icon: <MapPin className="h-6 w-6" />,
    title: "Pollution Load Index",
    subtitle: "PLI Computation",
    description: "Overall pollution assessment combining all heavy metals",
    formula: "PLI = (CF₁ × CF₂ × ... × CFₙ)^(1/n)",
    details: "Geometric mean of contamination factors",
    benefits: ["Overall assessment", "Multi-metal evaluation", "Pollution ranking"],
    color: "orange"
  },
  {
    icon: <Brain className="h-6 w-6" />,
    title: "AI Insights",
    subtitle: "Intelligent Analysis",
    description: "Advanced AI-powered risk categorization and data interpretation",
    formula: "Risk = f(HPI, HEI, CF, PLI, Standards)",
    details: "Machine learning models for pollution risk assessment",
    benefits: ["Smart categorization", "Pattern recognition", "Predictive analysis"],
    color: "indigo"
  }
];

const colorClasses = {
  blue: "from-blue-500 to-cyan-500",
  green: "from-green-500 to-emerald-500", 
  purple: "from-purple-500 to-violet-500",
  orange: "from-orange-500 to-amber-500",
  indigo: "from-indigo-500 to-blue-500"
};

export function FeaturesPanel() {
  const [expandedFeature, setExpandedFeature] = useState<string | null>(null);

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Info className="h-4 w-4 text-blue-600" />
          Analysis Features
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Heavy metal analysis capabilities
        </p>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {coreFeatures.map((feature, index) => (
          <Collapsible 
            key={index}
            open={expandedFeature === feature.title}
            onOpenChange={(open) => setExpandedFeature(open ? feature.title : null)}
          >
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-between p-2 h-auto"
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded bg-gradient-to-r ${colorClasses[feature.color as keyof typeof colorClasses]} text-white`}>
                    {feature.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-xs">{feature.title}</div>
                    <div className="text-xs text-muted-foreground">{feature.subtitle}</div>
                  </div>
                </div>
                {expandedFeature === feature.title ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 px-2 pb-2">
              <p className="text-xs text-muted-foreground">
                {feature.description}
              </p>
              
              <div className="bg-muted rounded p-2">
                <p className="text-xs font-mono text-foreground font-semibold mb-1">
                  Formula:
                </p>
                <p className="text-xs font-mono text-blue-600">
                  {feature.formula}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {feature.details}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-foreground mb-1">Benefits:</p>
                <div className="flex flex-wrap gap-1">
                  {feature.benefits.map((benefit, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs px-1 py-0">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}

        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-semibold">Standards Supported:</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">WHO</Badge>
              <Badge variant="secondary" className="text-xs">BIS</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
