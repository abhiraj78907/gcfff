import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "Case Studies", href: "#case-studies" }
    ],
    company: [
      { label: "About Us", href: "#about" },
      { label: "Careers", href: "#careers" },
      { label: "Blog", href: "#blog" },
      { label: "Press", href: "#press" }
    ],
    support: [
      { label: "Help Center", href: "#help" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact Support", href: "#contact" },
      { label: "API Docs", href: "#api" }
    ],
    legal: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Cookie Policy", href: "#cookies" },
      { label: "GDPR", href: "#gdpr" }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" }
  ];

  return (
    <footer className="bg-card/50 border-t border-border/50 backdrop-blur-sm relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-transparent pointer-events-none"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-12 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow">
                <Heart className="w-7 h-7 text-background" />
              </div>
              <span className="text-2xl lg:text-3xl font-bold text-foreground">Medichain</span>
            </div>
            <p className="text-muted-foreground mb-8 max-w-sm leading-relaxed text-base">
              Empowering Indian healthcare with unified, AI-driven solutions for hospitals, clinics, and pharmacies.
            </p>
            
            {/* Contact info */}
            <div className="space-y-4">
              <a href="mailto:support@medichain.in" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <span>support@medichain.in</span>
              </a>
              <a href="tel:+911234567890" className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Phone className="w-4 h-4 text-primary" />
                </div>
                <span>+91 123 456 7890</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>
          
          {/* Links columns */}
          <div>
            <h3 className="font-bold text-foreground mb-6 text-base">Product</h3>
            <ul className="space-y-4">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block hover:translate-x-1 duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-foreground mb-6 text-base">Company</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block hover:translate-x-1 duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-foreground mb-6 text-base">Support</h3>
            <ul className="space-y-4">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block hover:translate-x-1 duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-foreground mb-6 text-base">Legal</h3>
            <ul className="space-y-4">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block hover:translate-x-1 duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="pt-8 border-t border-border/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Medichain. All rights reserved.
            </p>
            
            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-11 h-11 rounded-xl glass-card flex items-center justify-center transition-all duration-300 group hover:scale-110 hover:shadow-glow border-primary/5 hover:border-primary/20"
                >
                  <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
