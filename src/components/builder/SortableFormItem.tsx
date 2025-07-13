
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2 } from "lucide-react";
import { FormField } from "./FormField";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";

interface FormComponent {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

interface SortableFormItemProps {
  component: FormComponent;
  onDelete: (id: string) => void;
  onSelect?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<FormComponent>) => void;
  isSelected?: boolean;
}

export const SortableFormItem = ({ 
  component, 
  onDelete, 
  onSelect,
  onUpdate,
  isSelected = false 
}: SortableFormItemProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect?.(component.id);
        break;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        setShowDeleteDialog(true);
        break;
      case 'Escape':
        if (isSelected) {
          onSelect?.('');
        }
        break;
    }
  };

  const handleDelete = () => {
    onDelete(component.id);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className={`p-4 bg-gradient-card border-border/50 group relative transition-all duration-200 cursor-pointer ${
          isDragging ? "opacity-50 shadow-lg scale-105" : ""
        } ${
          isSelected ? "ring-2 ring-primary shadow-glow" : ""
        }`}
        onClick={() => onSelect?.(component.id)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Form component: ${component.label}. Press Enter to select, Delete to remove, or use arrow keys to navigate.`}
        aria-selected={isSelected}
      >
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 rounded hover:bg-accent focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              // Start drag operation programmatically if needed
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`Drag handle for ${component.label}`}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>

        {/* Form field content */}
        <div className="ml-6">
          <FormField component={component} />
        </div>

        {/* Delete button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground focus:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteDialog(true);
          }}
          aria-label={`Delete ${component.label}`}
          title={`Delete ${component.label}`}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </Card>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        componentLabel={component.label}
      />
    </>
  );
};
