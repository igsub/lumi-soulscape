import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import heroImage from "@/assets/hero-palms-sunset.jpg";
import foodImage from "@/assets/vegetarian-meals.jpg";
import villaImage from "@/assets/location.jpeg";
import beachImage from "@/assets/beach.jpeg";
import lumiLogo from "@/assets/lumi-logo-lightgreen.png";
import { CheckCircle2, Leaf, Waves, Sun, Mountain, Heart, Menu, X } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

type FormData = z.infer<typeof formSchema>;

const Index = () => {
  useScrollAnimation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });


  const submitToGoogleSheets = async (data: FormData) => {    
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('source', 'Lumi Soulscape Website');
    
    const response = await fetch('https://script.google.com/macros/s/AKfycbzzNKApQcA9TPFThHeGMt4-shsXIRZkVcSfV-5dSeF0iJSygOPpWvJUmNS2-FxPsxH0/exec', {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets error response:', errorText);
      throw new Error(`Google Sheets submission failed: ${response.status}`);
    }
    
    const result = await response.json();
    return result.success;
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const success = await submitToGoogleSheets(data);

      if (success) {
        toast({
          title: "Success!",
          description: "Thank you for subscribing! We'll keep you updated on future retreats.",
        });
        reset(); // Clear the form
      } else {
        throw new Error('Google Sheets submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Oops!",
        description: "Something went wrong. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'subscribe', 'about', 'location', 'accommodation', 'food', 'included', 'contact'];
      const scrollPosition = window.scrollY + 100; // Offset for navbar

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial active section

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen">
      {/* Fixed Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="container-custom relative">
          <div className="flex items-center justify-center py-6 md:justify-center">
            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-12">
              {[
                { id: 'subscribe', label: 'Subscribe' },
                { id: 'about', label: 'Who is it for?' },
                { id: 'location', label: 'Location' },
                { id: 'accommodation', label: 'Stay' },
                { id: 'food', label: 'Food' },
                { id: 'included', label: 'Included' },
                { id: 'contact', label: 'Contact' }
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative group text-sm font-light transition-colors py-2 ${
                    activeSection === 'hero' || activeSection === 'contact'
                      ? 'text-white hover:text-white/80' 
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  {item.label}
                  {/* Underline Animation */}
                  <span 
                    className={`absolute bottom-0 left-0 h-0.5 transition-all duration-300 ${
                      activeSection === 'hero' || activeSection === 'contact'
                        ? 'bg-white' 
                        : 'bg-primary'
                    } ${
                      activeSection === item.id 
                        ? 'w-full' 
                        : 'w-0 group-hover:w-full'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden absolute right-6 top-1/2 -translate-y-1/2 z-50 transition-colors ${
                activeSection === 'hero' || activeSection === 'contact'
                  ? 'text-white hover:text-white/80' 
                  : 'text-foreground hover:text-primary'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-8 h-8 text-black" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-white/95 backdrop-blur-md z-40">
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {[
                { id: 'subscribe', label: 'Subscribe' },
                { id: 'about', label: 'Who is it for?' },
                { id: 'location', label: 'Location' },
                { id: 'accommodation', label: 'Stay' },
                { id: 'food', label: 'Food' },
                { id: 'included', label: 'Included' },
                { id: 'contact', label: 'Contact' }
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative group text-xl font-light transition-colors py-3 ${
                    activeSection === item.id 
                      ? 'text-primary' 
                      : 'text-foreground hover:text-primary'
                  }`}
                >
                  {item.label}
                  {/* Underline Animation for Mobile */}
                  <span 
                    className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                      activeSection === item.id 
                        ? 'w-full' 
                        : 'w-0 group-hover:w-full'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section 
        id="hero"
        className="relative h-screen flex items-center overflow-hidden"
        style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url(${heroImage})`,
            backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 ml-8 md:ml-16 lg:ml-24 px-6 animate-fade-in text-left">
          <img 
            src={lumiLogo} 
            alt="Lumi Soulscape" 
            className="h-24 md:h-30 lg:h-32 mb-4 drop-shadow-lg"
          />
          <h1 className="text-5xl md:text-5xl font-light text-white mb-6 tracking-wide">
            Yoga Retreat
          </h1>
          <div className="space-y-2 text-white/90">
            <p className="text-2xl md:text-3xl font-light">Santa Teresa, Costa Rica</p>
            <p className="text-xl md:text-2xl font-light">24.01 - 31.01.2026</p>
          </div>
        </div>
        
        {/* Sign Up Now Button */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10">
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
            asChild
          >
            <a href="mailto:lumi.soulscape@gmail.com">Sign Up Now</a>
          </Button>
        </div>
      </section>

      {/* Sign In Section */}
      <section id="subscribe" className="section-padding bg-card min-h-screen flex items-center">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center scroll-fade-in">
            <h2 className="text-4xl md:text-5xl font-light mb-8 text-foreground">Join Our Community</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Subscribe to our mailing list to stay updated on future retreats and wellness events.
            </p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-left block text-foreground">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    {...register("name")}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 text-left">{errors.name.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-left block text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 text-left">{errors.email.message}</p>
                  )}
                </div>
              </div>
              
              <Button 
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Who Is It For */}
      <section id="about" className="section-padding bg-gradient-to-b from-background to-muted/30 min-h-screen flex items-center">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center scroll-fade-in">
            <h2 className="text-4xl md:text-5xl font-light mb-8 text-foreground">Who is it for?</h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
              Our Yoga Retreat is dedicated to all kind of yogis, whether you already have experience and wish to deepen your practice or you just want to start somewhere, this space is here for you.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              This is a moment for you to disconnect from the burden of the everyday life, to take care of you, your body, your soul and to reconnect with your true self.
            </p>
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="location" className="section-padding bg-card min-h-screen flex items-center">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 scroll-slide-left">
              <div className="flex items-center gap-3 text-primary">
                <Waves className="w-8 h-8" />
                <h2 className="text-4xl md:text-5xl font-light">Location</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Santa Teresa, a small surf town - where jungle meets the ocean.
                Known for its stunning sunsets, wild beaches, and laid-back energy, it is a magnetic place that attracts surfers, yogis, and free spirits from all over the world.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Wake up to the sound of the waves, move with nature, and feel the pura vida flow in every moment.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-[var(--shadow-card)] bg-muted scroll-scale-in">
              <img 
                src={beachImage}
                alt="Santa Teresa Beach"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Accommodation */}
      <section id="accommodation" className="section-padding bg-gradient-to-b from-muted/30 to-background min-h-screen flex items-center">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative h-96 rounded-2xl overflow-hidden shadow-[var(--shadow-card)] bg-muted scroll-scale-in">
              <img 
                src={villaImage}
                alt="Villa Gaspar Terrazas"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2 space-y-6 scroll-slide-right">
              <div className="flex items-center gap-3 text-primary">
                <Leaf className="w-8 h-8" />
                <h2 className="text-4xl md:text-5xl font-light">Where we'll stay</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our home for the retreat will be Villa Gaspar Terrazas - a beautiful boutique hotel nestled in the 
                lush Costa Rican jungle, just a few minutes walk from Playa Hermosa.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The villa offers two-person rooms, each with a private bathroom and spacious terrace overlooking the jungle.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Here, you'll find peace and serenity surrounded by nature. 
                Start your day flowing through your yoga practice in a jungle-view shala then choose to spend your days relaxing by the pool or exploring the area with different types of activities. At night, fall asleep to the soothing sounds of nature under a sky full of stars.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Food */}
      <section id="food" className="section-padding bg-card min-h-screen flex items-center">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 scroll-slide-left">
              <div className="flex items-center gap-3 text-primary">
                <Heart className="w-8 h-8" />
                <h2 className="text-4xl md:text-5xl font-light">What we'll eat</h2>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                For seven days, our private chef will prepare delicious, fully vegetarian meals made with fresh and local ingredients. Each dish is crafted to nourish not only your body, but also your soul.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                The colors, textures, and flavors of the food will awaken your senses and invite you to connect more 
                deeply within yourself and the vibrant energy of Costa Rica.
              </p>
            </div>
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-[var(--shadow-card)] bg-muted scroll-scale-in">
              <img 
                src={foodImage}
                alt="Vegetarian Meal"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section id="included" className="section-padding bg-gradient-to-b from-muted/30 to-background min-h-screen flex items-center">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-light mb-12 text-center scroll-fade-in">What's Included</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-12 scroll-fade-in">
              {[
                "Accommodation for 7 nights in a beautiful villa surrounded by nature",
                "Delicious meals – nourishing brunch, dinner and snacks prepared daily by our private chef",
                "Daily yoga classes, morning and evening, to help you reconnect with your body and mind",
                "Breath work and meditation sessions to deepen your awareness and help you to let go"
              ].map((item, index) => (
                <Card key={index} className="border-none shadow-[var(--shadow-soft)] bg-card hover:shadow-[var(--shadow-card)] transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <p className="text-muted-foreground leading-relaxed">{item}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-muted/50 rounded-2xl p-8 scroll-scale-in">
              <h3 className="text-2xl font-light mb-6 text-center">Optional Activities</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Mountain, text: "Cold plunge" },
                  { icon: Sun, text: "Temezcal (a tradicional sweat lodge)" },
                  { icon: Waves, text: "Surf lessons with private instructors" },
                  { icon: Leaf, text: "Sunset horseback riding on the beach" },
                  { icon: Mountain, text: "Trip to Montezuma waterfalls" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section + Footer */}
      <div className="min-h-screen bg-primary text-primary-foreground flex flex-col">
        {/* Contact Content */}
        <section id="contact" className="flex-1 flex items-center justify-center px-6 md:px-12">
          <div className="container-custom text-center">
            <h2 className="text-4xl md:text-5xl font-light mb-6 scroll-fade-in scroll-breathe">Book your spot today!</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Send us an email to receive the full retreat offer - lumi.soulscape@gmail.com
            </p>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              We can't wait to meet you and enjoy our time in Costa Rica together!
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
              asChild
            >
              <a href="mailto:lumi.soulscape@gmail.com">Contact Us</a>
            </Button>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-8 text-center text-sm text-muted-foreground bg-card">
          <p>© 2026 Lumi Soulscape Costa Rica. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
