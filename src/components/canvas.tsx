
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { FormField } from "./builder/FormField";
import { SortableFormItem } from "./builder/SortableFormItem";
import { useFormBuilderStore } from "@/lib/store";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";

interface CanvasProps {
  isPreviewMode: boolean;
  onSelectedComponentChange?: (component: any) => void;
  formSettings?: any;
}

export const Canvas = ({ isPreviewMode, onSelectedComponentChange, formSettings }: CanvasProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const {
    components,
    selectedComponent,
    addComponent,
    removeComponent,
    selectComponent,
    updateComponent,
    reorderComponents
  } = useFormBuilderStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPreviewMode || components.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          const nextIndex = Math.min(focusedIndex + 1, components.length - 1);
          setFocusedIndex(nextIndex);
          selectComponent(components[nextIndex]);
          break;
        case 'ArrowUp':
          e.preventDefault();
          const prevIndex = Math.max(focusedIndex - 1, 0);
          setFocusedIndex(prevIndex);
          selectComponent(components[prevIndex]);
          break;
        case 'Home':
          e.preventDefault();
          setFocusedIndex(0);
          selectComponent(components[0]);
          break;
        case 'End':
          e.preventDefault();
          const lastIndex = components.length - 1;
          setFocusedIndex(lastIndex);
          selectComponent(components[lastIndex]);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewMode, components, focusedIndex, selectComponent]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const componentType = e.dataTransfer.getData("componentType");
    if (componentType) {
      const newComponent = {
        id: `${componentType}_${Date.now()}`,
        type: componentType,
        label: `${componentType.charAt(0).toUpperCase() + componentType.slice(1)} Field`,
        placeholder: "Enter your answer...",
        required: false,
        options: componentType === "select" || componentType === "radio" || componentType === "checkbox" ? ["Option 1", "Option 2"] : undefined
      };
      
      addComponent(newComponent);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleRemoveComponent = (id: string) => {
    removeComponent(id);
  };

  const handleSelectComponent = (id: string) => {
    const component = components.find(c => c.id === id);
    const newSelected = selectedComponent?.id === id ? null : component || null;
    selectComponent(newSelected);
    if (onSelectedComponentChange) {
      onSelectedComponentChange(newSelected);
    }
    
    // Update focused index
    const index = components.findIndex(c => c.id === id);
    if (index !== -1) {
      setFocusedIndex(index);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const newComponents = components.slice();
      const oldIndex = newComponents.findIndex((item) => item.id === active.id);
      const newIndex = newComponents.findIndex((item) => item.id === over.id);
      const reorderedComponents = arrayMove(newComponents, oldIndex, newIndex);
      
      reorderComponents(reorderedComponents);
    }
  };

  const handleDragStart = (event: { active: { id: any; }; }) => {
    setActiveId(event.active.id);
  };

  if (isPreviewMode) {
    return (
      <div className="flex-1 bg-accent/20 p-8 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 bg-gradient-card shadow-lg">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-card-foreground mb-2">
                {formSettings?.title || "Form Preview"}
              </h1>
              {formSettings?.description && (
                <p className="text-muted-foreground">
                  {formSettings.description}
                </p>
              )}
            </div>
            
            {components.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No form fields added yet. Switch to edit mode to start building.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {components.map((component) => (
                  <FormField key={component.id} component={component} isPreview />
                ))}
                
                <Button className="w-full" size="lg">
                  Submit Form
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-accent/20 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div
          className={cn(
            "min-h-[600px] border-2 border-dashed rounded-lg transition-all duration-200",
            dragOver 
              ? "border-primary bg-primary/5 shadow-glow" 
              : "border-border bg-background/50",
            components.length === 0 && "flex items-center justify-center"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          role="region"
          aria-label="Form builder canvas"
        >
          {components.length === 0 ? (
            <div className="text-center p-12">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Plus className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Start Building Your Form
              </h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Drag form components from the sidebar to begin creating your form. 
                Use keyboard navigation with arrow keys to navigate between components.
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              accessibility={{
                announcements: {
                  onDragStart: ({ active }) => {
                    const component = components.find(c => c.id === active.id);
                    return `Picked up ${component?.label || 'component'}`;
                  },
                  onDragOver: ({ active, over }) => {
                    if (over) {
                      const activeComponent = components.find(c => c.id === active.id);
                      const overComponent = components.find(c => c.id === over.id);
                      return `${activeComponent?.label || 'Component'} is over ${overComponent?.label || 'component'}`;
                    }
                    return '';
                  },
                  onDragEnd: ({ active, over }) => {
                    if (over) {
                      const activeComponent = components.find(c => c.id === active.id);
                      const overComponent = components.find(c => c.id === over.id);
                      return `${activeComponent?.label || 'Component'} was dropped over ${overComponent?.label || 'component'}`;
                    }
                    return `${components.find(c => c.id === active.id)?.label || 'Component'} was dropped`;
                  },
                  onDragCancel: ({ active }) => {
                    const component = components.find(c => c.id === active.id);
                    return `Dragging ${component?.label || 'component'} was cancelled`;
                  },
                },
              }}
            >
              <div 
                className="p-6 space-y-4"
                role="list"
                aria-label="Form components"
              >
                <SortableContext items={components} strategy={verticalListSortingStrategy}>
                  {components.map((component, index) => (
                    <div key={component.id} role="listitem">
                      <SortableFormItem
                        component={component}
                        onDelete={handleRemoveComponent}
                        onSelect={handleSelectComponent}
                        onUpdate={updateComponent}
                        isSelected={selectedComponent?.id === component.id}
                      />
                    </div>
                  ))}
                </SortableContext>
              </div>

              <DragOverlay>
                {activeId ? (
                  <Card className="p-4 bg-gradient-card border-border/50 opacity-90 shadow-lg">
                    <FormField component={components.find(c => c.id === activeId)!} />
                  </Card>
                ) : null}
              </DragOverlay>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
};
