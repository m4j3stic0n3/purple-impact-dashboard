import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const sampleOpportunities = [
  {
    id: 1,
    title: "Solar Farm Development",
    location: "Arizona, USA",
    impact: "Renewable Energy",
    minInvestment: 5000,
    expectedReturn: "12-15%",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027"
  },
  {
    id: 2,
    title: "Sustainable Agriculture Fund",
    location: "Multiple Locations",
    impact: "Food Security",
    minInvestment: 10000,
    expectedReturn: "8-10%",
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716"
  },
  {
    id: 3,
    title: "Ocean Cleanup Initiative",
    location: "Pacific Ocean",
    impact: "Ocean Conservation",
    minInvestment: 2500,
    expectedReturn: "5-7%",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9"
  }
];

const Explore = () => {
  const handleLearnMore = (id: number) => {
    toast({
      title: "Investment Details",
      description: "Detailed information about this opportunity will be available soon.",
    });
  };

  return (
    <div className="min-h-screen flex w-full bg-[#1A1F2C] text-white">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Explore Opportunities</h1>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search opportunities..."
                  className="pl-10 bg-[#2A2F3C] border-purple-800"
                />
              </div>
              <Button variant="outline" className="bg-purple-700 hover:bg-purple-600">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="overflow-hidden bg-[#2A2F3C]/60 backdrop-blur-lg border-purple-800">
                <img 
                  src={opportunity.image} 
                  alt={opportunity.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{opportunity.title}</h3>
                  <p className="text-purple-400 text-sm mb-4">{opportunity.impact}</p>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>📍 {opportunity.location}</p>
                    <p>💰 Min. Investment: ${opportunity.minInvestment.toLocaleString()}</p>
                    <p>📈 Expected Return: {opportunity.expectedReturn}</p>
                  </div>
                  <Button 
                    className="w-full mt-4 bg-purple-700 hover:bg-purple-600"
                    onClick={() => handleLearnMore(opportunity.id)}
                  >
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Explore;
