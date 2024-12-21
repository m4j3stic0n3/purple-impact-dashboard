import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, GraduationCap, Clock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const sampleCourses = [
  {
    id: 1,
    title: "Introduction to Impact Investing",
    description: "Learn the fundamentals of impact investing and how to make a difference while generating returns.",
    duration: "2 hours",
    level: "Beginner",
    modules: 5,
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
  },
  {
    id: 2,
    title: "ESG Analysis Fundamentals",
    description: "Master the art of analyzing investments using Environmental, Social, and Governance criteria.",
    duration: "3 hours",
    level: "Intermediate",
    modules: 7,
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
  },
  {
    id: 3,
    title: "Sustainable Portfolio Management",
    description: "Advanced techniques for building and managing a sustainable investment portfolio.",
    duration: "4 hours",
    level: "Advanced",
    modules: 8,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
  }
];

const Learn = () => {
  const handleStartCourse = (id: number) => {
    toast({
      title: "Course Started",
      description: "You've successfully enrolled in this course.",
    });
  };

  return (
    <div className="min-h-screen flex w-full bg-[#1A1F2C] text-white">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Learning Center</h1>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden bg-[#2A2F3C]/60 backdrop-blur-lg border-purple-800">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-2 text-purple-400 text-sm mb-2">
                    <GraduationCap className="h-4 w-4" />
                    {course.level}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{course.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {course.modules} modules
                    </div>
                  </div>
                  <Button 
                    className="w-full bg-purple-700 hover:bg-purple-600"
                    onClick={() => handleStartCourse(course.id)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Course
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

export default Learn;