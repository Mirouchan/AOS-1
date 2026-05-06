import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { 
  Compass, 
  Mountain, 
  Users, 
  Globe, 
  Leaf, 
  Award,
  MapPin,
  Phone,
  Mail,
  Heart,
  Shield,
  ChevronRight
} from "lucide-react";

const About = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const teamMembers = [
    {
      name: "Alex Rivera",
      role: "Lead Alpinist",
      quote: "The mountains are calling and I must go.",
      image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Sarah Chen",
      role: "Marine Biologist",
      quote: "Every dive is a new discovery.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Marcus Johnson",
      role: "Survival Expert",
      quote: "Respect the wild, and it will respect you.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Elena Rodriguez",
      role: "Cultural Guide",
      quote: "Every culture has a story worth telling.",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop",
    },
  ];

  const stats = [
    { number: "10+", label: "Years of Experience", icon: Award },
    { number: "50+", label: "Countries Explored", icon: Globe },
    { number: "5K+", label: "Happy Adventurers", icon: Users },
    { number: "100%", label: "Carbon Offset", icon: Leaf },
  ];

  const values = [
    {
      title: "Sustainability First",
      description: "We're committed to protecting the environments we explore through carbon-neutral operations and eco-friendly practices.",
      icon: Leaf,
    },
    {
      title: "Authentic Experiences",
      description: "No tourist traps. We connect you with local cultures and hidden gems that most travelers never see.",
      icon: Compass,
    },
    {
      title: "Safety Guaranteed",
      description: "Your safety is our priority. All expeditions are led by certified guides with emergency protocols in place.",
      icon: Shield,
    },
    {
      title: "Community Impact",
      description: "We give back 5% of profits to local communities and conservation projects in the regions we explore.",
      icon: Heart,
    },
  ];

  return (
    <div className="bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text min-h-screen transition-colors duration-300">
      <Navbar scrolled={scrolled} />

      {/* Hero Section - Our Story */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop')",
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-light-primary/20 via-transparent to-dark-background/80" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h1 className="text-6xl lg:text-8xl text-white mb-6 font-bebas tracking-tight">
            Our Story
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Born from a passion for the unknown. We are a collective of explorers, 
            conservationists, and storytellers dedicated to showing you the world in its purest form.
          </p>
        </div>
      </section>

      {/* Our Mission - Travel That Transforms */}
      <section className="py-24 bg-light-background dark:bg-dark-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full bg-light-primary/20 dark:bg-dark-primary/20 rounded-2xl"></div>
                <img 
                  className="relative rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500 w-full"
                  alt="Hiking Team" 
                  src="https://images.unsplash.com/photo-1501555088652-021faa106b9b?q=80&w=1000&auto=format&fit=crop"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-light-primary dark:text-dark-primary font-bold tracking-wider text-sm uppercase mb-2 block">
                Our Mission
              </span>
              <h2 className="text-5xl text-light-text dark:text-dark-text mb-6 font-bebas tracking-tight">
                Travel That <span className="text-light-primary dark:text-dark-primary">Transforms</span>
              </h2>
              <p className="text-lg text-light-text/70 dark:text-dark-text/70 mb-6 leading-relaxed">
                We believe that travel is more than just seeing new places; it's about shifting 
                perspectives. Our expeditions are designed to challenge you, inspire you, 
                and connect you with the natural world.
              </p>
              <p className="text-lg text-light-text/70 dark:text-dark-text/70 mb-8 leading-relaxed">
                Since 2014, we've led over 1,000 expeditions across 6 continents, always 
                prioritizing sustainability and respect for local cultures.
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center p-4 bg-white/50 dark:bg-gray-800/30 rounded-xl">
                    <stat.icon className="w-8 h-8 text-light-primary dark:text-dark-primary mx-auto mb-2" />
                    <h4 className="text-3xl text-light-primary dark:text-dark-primary font-bebas">
                      {stat.number}
                    </h4>
                    <p className="text-xs font-semibold text-light-text/80 dark:text-dark-text/80">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-24 bg-white/50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-light-primary dark:text-dark-primary font-bold tracking-wider text-sm uppercase mb-2 block">
              What We Believe
            </span>
            <h2 className="text-5xl text-light-text dark:text-dark-text mb-4 font-bebas tracking-tight">
              Our Core <span className="text-light-primary dark:text-dark-primary">Values</span>
            </h2>
            <p className="text-xl text-light-text/70 dark:text-dark-text/70 max-w-2xl mx-auto">
              The principles that guide every adventure we create.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div 
                key={value.title}
                className="group p-6 bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
              >
                <div className="w-14 h-14 bg-light-primary/10 dark:bg-dark-primary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-light-primary/20 dark:group-hover:bg-dark-primary/20 transition-colors">
                  <value.icon className="w-7 h-7 text-light-primary dark:text-dark-primary" />
                </div>
                <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-3">
                  {value.title}
                </h3>
                <p className="text-light-text/70 dark:text-dark-text/70 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet The Guides Section */}
      <section className="py-24 bg-light-background dark:bg-dark-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-light-primary dark:text-dark-primary font-bold tracking-wider text-sm uppercase mb-2 block">
              The Experts
            </span>
            <h2 className="text-5xl text-light-text dark:text-dark-text mb-4 font-bebas tracking-tight">
              Meet The <span className="text-light-primary dark:text-dark-primary">Guides</span>
            </h2>
            <p className="text-xl text-light-text/70 dark:text-dark-text/70 max-w-2xl mx-auto">
              The passionate experts who will lead you into the wild.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="group">
                <div className="relative overflow-hidden rounded-2xl mb-6 aspect-[3/4]">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={member.name} 
                    src={member.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white text-sm italic">"{member.quote}"</p>
                  </div>
                </div>
                <h3 className="text-2xl text-light-text dark:text-dark-text font-bebas">
                  {member.name}
                </h3>
                <p className="text-light-primary dark:text-dark-primary font-bold text-sm uppercase tracking-wider">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1920&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-light-primary/20 to-transparent" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl text-white mb-4 font-bebas tracking-tight">
            Ready for Your <span className="text-light-primary">Next Adventure</span>?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join thousands of adventurers who trust TerraVentures for gear, bookings, and unforgettable experiences.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-light-primary to-orange-500 dark:from-dark-primary dark:to-orange-400 text-black font-bold rounded-full hover:shadow-xl transition-all hover:-translate-y-1"
            >
              Start Exploring
              <Compass className="w-5 h-5" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold rounded-full hover:bg-white/20 transition-all"
            >
              Contact Us
              <Mail className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .font-bebas {
          font-family: 'Bebas Neue', 'Outfit', sans-serif;
          letter-spacing: 0.02em;
        }
      `}</style>
    </div>
  );
};

export default About;