import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Background */}
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered Analysis
        </div>

        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
          <span className="text-foreground">CSV</span>{" "}
          <span className="gradient-text">Insights</span>
        </h1>

        <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
          Instantly unlock trends and hidden patterns in your data using AI.
          Upload a CSV and get actionable insights in seconds.
        </p>

        <div className="mt-10 flex items-center gap-4 justify-center">
          <Button asChild size="lg" className="gap-2 glow-primary">
            <Link to="/dashboard">
              Start Analyzing
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/status">System Status</Link>
          </Button>
        </div>

        {/* Feature pills */}
        <div className="mt-16 flex flex-wrap gap-4 justify-center">
          {[
            { icon: Zap, text: "Instant Preview" },
            { icon: BarChart3, text: "Auto Charts" },
            { icon: Sparkles, text: "AI Summaries" },
          ].map(({ icon: Icon, text }) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card px-4 py-2 flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Icon className="w-4 h-4 text-primary" />
              {text}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Landing;
