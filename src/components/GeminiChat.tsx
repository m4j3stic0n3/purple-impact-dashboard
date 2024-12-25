import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { chatWithGemini } from "@/services/geminiService";
import { toast } from "@/components/ui/use-toast";

export function GeminiChat() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      const reply = await chatWithGemini(message);
      setResponse(reply);
    } catch (error) {
      console.error('Error chatting with Gemini:', error);
      toast({
        title: "Error",
        description: "Failed to get response from Gemini. Please check your API key.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-dashboard-card/60 backdrop-blur-lg border-purple-800">
      <h3 className="text-xl font-semibold mb-4">Chat with Gemini AI</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask Gemini anything..."
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </div>
        {response && (
          <div className="mt-4 p-4 rounded-lg bg-gray-800/50">
            <p className="text-white">{response}</p>
          </div>
        )}
      </form>
    </Card>
  );
}