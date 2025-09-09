import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, Code2, FileText, Home, Sparkles } from "lucide-react";
const Header = () => {
  const location = useLocation();
  const navigation = [{
    name: "Home",
    href: "/",
    icon: Home
  }, {
    name: "Templates",
    href: "/gallery",
    icon: FileText
  }, {
    name: "Editor",
    href: "/editor",
    icon: Code2
  }];
  return <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center glow-accent">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ChartStudio
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navigation.map(item => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          return <Link key={item.name} to={item.href}>
                <Button variant={isActive ? "default" : "ghost"} size="sm" className={isActive ? "glow-primary" : ""}>
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Button>
              </Link>;
        })}
        </nav>

        {/* CTA Button */}
        
      </div>
    </header>;
};
export default Header;