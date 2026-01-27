"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Code2, 
  Users, 
  Sparkles, 
  Trophy,
  GitBranch,
  MessageSquare,
  ArrowRight,
  Github,
  Zap,
  Shield
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Projects",
    description: "Get personalized project ideas based on your stack and experience level. AI breaks them into manageable tasks."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work with other developers in sprints. Build real teamwork skills while creating impressive projects."
  },
  {
    icon: Trophy,
    title: "Proof of Experience",
    description: "Your profile becomes a verified portfolio. Show employers exactly what you've built and accomplished."
  },
  {
    icon: GitBranch,
    title: "GitHub Integration",
    description: "Seamless PR integration. Your contributions are automatically tracked and verified."
  },
  {
    icon: MessageSquare,
    title: "AI Code Review",
    description: "Get instant feedback on your code. Learn best practices from an AI mentor that actually cares."
  },
  {
    icon: Shield,
    title: "Structured Learning",
    description: "Skill recommendations tailored to your growth. Never feel lost about what to learn next."
  }
];

const stats = [
  { value: "10K+", label: "Developers" },
  { value: "5K+", label: "Projects Completed" },
  { value: "500+", label: "Team Formations" },
  { value: "95%", label: "Success Rate" }
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">For Junior & Intermediate Developers</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="gradient-text">Build Real Experience.</span>
              <br />
              <span className="text-foreground">Land Your Dream Job.</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-10">
              CoForge is the first ecosystem that gives junior and intermediate developers 
              real, proven experience. Stop struggling with "need experience to get experience."
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="glass-button bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center gap-2 text-lg px-8 py-4"
              >
                <Github className="w-5 h-5" />
                Start Building with GitHub
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#features"
                className="glass-button flex items-center justify-center gap-2 text-lg px-8 py-4"
              >
                Learn More
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                  <div className="text-foreground/60">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 md:p-12"
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  The <span className="text-red-500">Problem</span>
                </h2>
                <p className="text-lg text-foreground/70 mb-6">
                  Junior developers face an impossible catch-22: employers demand experience, 
                  but new graduates can't get experience without a job.
                </p>
                <p className="text-lg text-foreground/70">
                  Most resort to fake portfolio projects that don't impress employers. 
                  They learn in isolation, missing real teamwork skills.
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur-xl" />
                <div className="relative glass-card bg-red-500/10 border-red-500/20">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-red-500/20">
                      <Code2 className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">The Experience Gap</h3>
                      <ul className="space-y-2 text-foreground/70">
                        <li>• 73% of junior devs struggle to find their first job</li>
                        <li>• Average time to land first job: 8-12 months</li>
                        <li>• 65% say "portfolio projects aren't enough"</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How <span className="gradient-text">CoForge</span> Works
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Everything you need to build real experience and showcase your skills.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card group"
              >
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your Journey to <span className="gradient-text">Real Experience</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Tell Us About Yourself",
                description: "Select your tech stack, experience level, and goals. Our AI learns what you need."
              },
              {
                step: "02",
                title: "Build Real Projects",
                description: "Work solo or in teams on AI-curated projects. Get guidance every step of the way."
              },
              {
                step: "03",
                title: "Prove Your Skills",
                description: "Your profile becomes verified proof of experience. Share it with employers."
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <div className="relative glass-card text-center h-full">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary text-white font-bold text-lg mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-foreground/70">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10" />
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Build <span className="gradient-text">Real Experience</span>?
              </h2>
              <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-10">
                Join thousands of developers who are building their future with CoForge. 
                Start your journey today.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 glass-button bg-gradient-to-r from-primary to-secondary text-white text-lg px-8 py-4"
              >
                <Github className="w-5 h-5" />
                Get Started with GitHub
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

