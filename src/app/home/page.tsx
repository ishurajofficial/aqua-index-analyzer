"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Droplets, 
  Shield, 
  BarChart3, 
  MapPin, 
  Brain, 
  Download,
  Users,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const features = [
    {
      icon: <Droplets className="h-6 w-6" />,
      title: "Heavy Metal Analysis",
      description: "Automated computation of HPI, HEI, CF, and PLI indices using standard methodologies"
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Insights",
      description: "Advanced AI analysis for pollution risk categorization and data interpretation"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Interactive Visualizations",
      description: "Comprehensive charts, graphs, and data tables for better understanding"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Geographic Mapping",
      description: "Visual representation of sample locations with geo-coordinates"
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Report Generation",
      description: "Export detailed reports in PDF and CSV formats for stakeholders"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with role-based access control"
    }
  ];

  const benefits = [
    "Reduces manual calculation errors by 95%",
    "Saves 80% of analysis time",
    "Standardized WHO/BIS compliance",
    "Real-time pollution risk assessment",
    "Multi-user collaboration support"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Droplets className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Aqua Index Analyzer</h1>
              <p className="text-sm text-gray-600">Heavy Metal Pollution Assessment</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Live & Secure
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered Water Quality Analysis
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Automated Heavy Metal
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                {" "}Pollution Indices
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Streamline water quality assessment with our advanced platform. 
              Upload your datasets, get instant AI-powered analysis, and generate 
              comprehensive reports for better environmental decision-making.
            </p>
            
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  onClick={handleSignIn}
                  disabled={loading || isSigningIn}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSigningIn ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Get Started Free
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </div>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => router.push("/dashboard")}
                  className="px-8 py-4 text-lg font-semibold"
                >
                  View Demo
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  onClick={() => router.push("/dashboard")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-gray-600">Error Reduction</div>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-green-600 mb-2">80%</div>
              <div className="text-gray-600">Time Saved</div>
            </div>
            <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-gray-600">WHO/BIS Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Water Quality Analysis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to assess heavy metal pollution in groundwater 
              with accuracy, speed, and professional-grade reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="p-3 bg-blue-100 rounded-lg w-fit text-blue-600 group-hover:bg-blue-200 transition-colors">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Standards Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Internationally Recognized Standards
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform implements WHO and BIS standards for accurate 
              heavy metal pollution assessment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-6">
                <Droplets className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">WHO Standards</h3>
              <p className="text-gray-600 mb-6">
                World Health Organization guidelines for drinking water quality assessment
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Arsenic, Cadmium, Chromium, Lead, Zinc
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  International compliance
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="p-4 bg-green-100 rounded-full w-fit mx-auto mb-6">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">BIS Standards</h3>
              <p className="text-gray-600 mb-6">
                Bureau of Indian Standards compliance for comprehensive regulatory adherence
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  IS 10500:2012 compliance
                </div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Indian regulatory standards
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Aqua Index Analyzer?
            </h2>
            <p className="text-xl text-gray-600">
              Join leading environmental scientists and researchers worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 text-lg">{benefit}</p>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-blue-100 mb-6 text-lg">
                Upload your first dataset and experience the power of automated 
                heavy metal pollution analysis in minutes.
              </p>
              {!user && (
                <Button 
                  onClick={handleSignIn}
                  disabled={loading || isSigningIn}
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-6 py-3"
                >
                  {isSigningIn ? "Signing In..." : "Start Free Analysis"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Droplets className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Aqua Index Analyzer</h3>
                  <p className="text-gray-400">Heavy Metal Pollution Assessment</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering environmental scientists and researchers with AI-powered 
                tools for accurate water quality assessment and pollution monitoring.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Core Analysis Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                  HPI Calculation
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                  HEI Analysis
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                  Contamination Factor
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                  Pollution Load Index
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-3 w-3 text-green-400 mr-2" />
                  AI Insights
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Community Forum</li>
                <li>Contact Support</li>
                <li>Status Page</li>
              </ul>
            </div>
          </div>
          <Separator className="my-8 bg-gray-800" />
          <div className="text-center text-gray-400">
            <p>&copy; 2024 Aqua Index Analyzer. Built for environmental research and public health protection.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
