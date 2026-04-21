import { Link } from "react-router-dom";
import { Gift, TreePine, ExternalLink } from "lucide-react";
import { useFloatingMenu } from "@/hooks/useFloatingMenu";

const FloatingMenu = () => {
  const { data: config, isLoading } = useFloatingMenu();

  if (isLoading) {
    return null;
  }

  // Default buttons if no config found in database
  const defaultButtons = [
    { id: "1", label: "Papan Bunga", href: "/katalog?kategori=papan-bunga", color: "red", icon: "TreePine", visible: true },
    { id: "2", label: "Katalog Parsel Natal", href: "/katalog?kategori=parsel-natal", color: "red", icon: "Gift", visible: true },
  ];

  // Use saved buttons if they exist and are not empty, otherwise use defaults
  const buttons = (config?.buttons && config.buttons.length > 0) 
    ? config.buttons 
    : defaultButtons;
    
  const visibleButtons = buttons.filter(b => b.visible);

  if (visibleButtons.length === 0) return null;

  // Helper to get icon
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "TreePine": return <TreePine className="w-4 h-4" />;
      case "Gift": return <Gift className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed bottom-24 right-3 z-50 flex flex-col items-end gap-2">
      {visibleButtons.map((button) => (
        <Link
          key={button.id}
          to={button.href}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full shadow-md transition group"
        >
          <span className="text-xs font-semibold whitespace-nowrap">
            {button.label}
          </span>
          <div className="w-8 h-8 rounded-full bg-red-700 flex items-center justify-center">
            {getIcon(button.icon)}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FloatingMenu;
