import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { 
  Type, 
  AlignLeft, 
  ChevronDown, 
  CheckSquare, 
  Circle, 
  Hash, 
  Mail,
  Phone,
  Calendar,
  Upload
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const formComponents = [
  {
    id: "text",
    name: "Text Input",
    icon: Type,
    description: "Single line text input"
  },
  {
    id: "textarea",
    name: "Text Area",
    icon: AlignLeft,
    description: "Multi-line text input"
  },
  {
    id: "select",
    name: "Select",
    icon: ChevronDown,
    description: "Dropdown selection"
  },
  {
    id: "checkbox",
    name: "Checkbox",
    icon: CheckSquare,
    description: "Multiple choice selection"
  },
  {
    id: "radio",
    name: "Radio Group",
    icon: Circle,
    description: "Single choice selection"
  },
  {
    id: "number",
    name: "Number",
    icon: Hash,
    description: "Numeric input"
  },
  {
    id: "email",
    name: "Email",
    icon: Mail,
    description: "Email address input"
  },
  {
    id: "phone",
    name: "Phone",
    icon: Phone,
    description: "Phone number input"
  },
  {
    id: "date",
    name: "Date",
    icon: Calendar,
    description: "Date picker"
  },
  {
    id: "file",
    name: "File Upload",
    icon: Upload,
    description: "File upload input"
  }
];

export const Sidebar = ({ className }: SidebarProps) => {
  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    e.dataTransfer.setData("componentType", componentType);
  };

  return (
    <div className={cn("overflow-y-auto", className)}>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-2">
            Form Components
          </h2>
          <p className="text-sm text-muted-foreground">
            Drag components to your form canvas
          </p>
        </div>

        <div className="space-y-3">
          {formComponents.map((component) => (
            <Card
              key={component.id}
              draggable
              onDragStart={(e) => handleDragStart(e, component.id)}
              className="p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 bg-gradient-card border-border/50 group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-glow transition-all duration-200">
                  <component.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                    {component.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {component.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};