import { Building, Users, FileText, Bell } from "lucide-react";

const stats = [
  {
    icon: Building,
    number: "100+",
    label: "Hospitals Connected",
    description: "Leading facilities",
    color: "from-primary to-accent"
  },
  {
    icon: Users,
    number: "5,000+",
    label: "Doctors Onboarded",
    description: "Healthcare professionals",
    color: "from-accent to-primary"
  },
  {
    icon: FileText,
    number: "1M+",
    label: "Digital Prescriptions",
    description: "Processed monthly",
    color: "from-secondary to-primary"
  },
  {
    icon: Bell,
    number: "95%",
    label: "Patient Adherence",
    description: "Medication compliance",
    color: "from-primary to-secondary"
  }
];

const Stats = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-block px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-sm font-semibold text-primary">TRUSTED BY LEADERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 leading-tight">
            Join Thousands of Healthcare
            <span className="block text-muted-foreground mt-2">Professionals</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transforming patient care with cutting-edge technology and proven results.
          </p>
        </div>
        
        {/* Stats grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group glass-card p-8 lg:p-10 text-center hover:shadow-hover transition-all duration-500 hover:-translate-y-3 rounded-2xl cursor-pointer animate-scale-in border-primary/5 hover:border-primary/20"
              style={{ animationDelay: `${index * 100}ms` }}
              role="figure"
              aria-label={`${stat.number} ${stat.label}`}
            >
              <div className="flex justify-center mb-6">
                <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-card group-hover:shadow-glow relative`}>
                  <stat.icon className="w-8 h-8 lg:w-10 lg:h-10 text-background" />
                  <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
              
              <div className={`text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                {stat.number}
              </div>
              
              <div className="text-base lg:text-lg font-semibold text-foreground mb-1">
                {stat.label}
              </div>
              
              <div className="text-sm text-muted-foreground">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
