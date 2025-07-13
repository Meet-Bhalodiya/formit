
import { create } from 'zustand';

interface ValidationRule {
  type: 'min' | 'max' | 'pattern' | 'custom';
  value: string | number;
  message: string;
}

interface FormComponent {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  validationRules?: ValidationRule[];
  rows?: number;
  acceptedFileTypes?: string;
}

interface FormSettings {
  title: string;
  description: string;
  requireLogin: boolean;
  collectEmail: boolean;
  theme?: 'light' | 'dark' | 'auto';
  successMessage?: string;
  redirectUrl?: string;
}

interface HistoryState {
  components: FormComponent[];
  formSettings: FormSettings;
  selectedComponent: FormComponent | null;
}

interface FormBuilderState {
  components: FormComponent[];
  selectedComponent: FormComponent | null;
  formSettings: FormSettings;
  isPreviewMode: boolean;
  
  // History management
  history: HistoryState[];
  currentHistoryIndex: number;
  
  // Undo functionality
  recentlyDeleted: {
    component: FormComponent;
    index: number;
    timestamp: number;
  } | null;
  
  // Actions
  addComponent: (component: FormComponent) => void;
  updateComponent: (id: string, updates: Partial<FormComponent>) => void;
  removeComponent: (id: string) => void;
  selectComponent: (component: FormComponent | null) => void;
  reorderComponents: (components: FormComponent[]) => void;
  updateFormSettings: (settings: Partial<FormSettings>) => void;
  setPreviewMode: (isPreview: boolean) => void;
  reset: () => void;
  
  // History actions
  undo: () => boolean;
  redo: () => boolean;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Undo deletion
  undoDelete: () => void;
  clearRecentlyDeleted: () => void;
  
  // Form validation
  validateForm: () => { isValid: boolean; errors: string[] };
  
  // Export/Import
  exportForm: () => string;
  importForm: (data: string) => boolean;
}

const initialFormSettings: FormSettings = {
  title: "",
  description: "",
  requireLogin: false,
  collectEmail: false,
  theme: 'auto',
  successMessage: 'Thank you for your submission!',
  redirectUrl: ''
};

const createHistoryState = (state: Pick<FormBuilderState, 'components' | 'formSettings' | 'selectedComponent'>): HistoryState => ({
  components: state.components.map(comp => ({ ...comp })),
  formSettings: { ...state.formSettings },
  selectedComponent: state.selectedComponent ? { ...state.selectedComponent } : null
});

export const useFormBuilderStore = create<FormBuilderState>((set, get) => {
  const pushToHistory = () => {
    const state = get();
    const newHistoryState = createHistoryState(state);
    
    // Remove any future history if we're not at the end
    const newHistory = state.history.slice(0, state.currentHistoryIndex + 1);
    newHistory.push(newHistoryState);
    
    // Limit history to 50 entries
    const limitedHistory = newHistory.slice(-50);
    
    set({
      history: limitedHistory,
      currentHistoryIndex: limitedHistory.length - 1
    });
  };

  const initialState = {
    components: [],
    selectedComponent: null,
    formSettings: initialFormSettings,
    isPreviewMode: false,
    history: [createHistoryState({ components: [], formSettings: initialFormSettings, selectedComponent: null })],
    currentHistoryIndex: 0,
    recentlyDeleted: null
  };

  return {
    ...initialState,

    addComponent: (component) => {
      pushToHistory();
      set((state) => ({
        components: [...state.components, component],
        recentlyDeleted: null
      }));
    },

    updateComponent: (id, updates) => {
      pushToHistory();
      set((state) => ({
        components: state.components.map(comp => 
          comp.id === id ? { ...comp, ...updates } : comp
        ),
        selectedComponent: state.selectedComponent?.id === id 
          ? { ...state.selectedComponent, ...updates }
          : state.selectedComponent,
        recentlyDeleted: null
      }));
    },

    removeComponent: (id) => {
      const state = get();
      const componentIndex = state.components.findIndex(comp => comp.id === id);
      const componentToDelete = state.components[componentIndex];
      
      if (componentToDelete) {
        pushToHistory();
        set({
          components: state.components.filter(comp => comp.id !== id),
          selectedComponent: state.selectedComponent?.id === id ? null : state.selectedComponent,
          recentlyDeleted: {
            component: componentToDelete,
            index: componentIndex,
            timestamp: Date.now()
          }
        });
      }
    },

    selectComponent: (component) => set({
      selectedComponent: component
    }),

    reorderComponents: (components) => {
      pushToHistory();
      set({
        components,
        recentlyDeleted: null
      });
    },

    updateFormSettings: (settings) => {
      pushToHistory();
      set((state) => ({
        formSettings: { ...state.formSettings, ...settings },
        recentlyDeleted: null
      }));
    },

    setPreviewMode: (isPreview) => set({
      isPreviewMode: isPreview
    }),

    reset: () => {
      const resetState = createHistoryState({ components: [], formSettings: initialFormSettings, selectedComponent: null });
      set({
        components: [],
        selectedComponent: null,
        formSettings: initialFormSettings,
        isPreviewMode: false,
        history: [resetState],
        currentHistoryIndex: 0,
        recentlyDeleted: null
      });
    },

    undo: () => {
      const state = get();
      if (state.currentHistoryIndex > 0) {
        const newIndex = state.currentHistoryIndex - 1;
        const historyState = state.history[newIndex];
        
        set({
          components: historyState.components.map(comp => ({ ...comp })),
          formSettings: { ...historyState.formSettings },
          selectedComponent: historyState.selectedComponent ? { ...historyState.selectedComponent } : null,
          currentHistoryIndex: newIndex,
          recentlyDeleted: null
        });
        return true;
      }
      return false;
    },

    redo: () => {
      const state = get();
      if (state.currentHistoryIndex < state.history.length - 1) {
        const newIndex = state.currentHistoryIndex + 1;
        const historyState = state.history[newIndex];
        
        set({
          components: historyState.components.map(comp => ({ ...comp })),
          formSettings: { ...historyState.formSettings },
          selectedComponent: historyState.selectedComponent ? { ...historyState.selectedComponent } : null,
          currentHistoryIndex: newIndex,
          recentlyDeleted: null
        });
        return true;
      }
      return false;
    },

    canUndo: () => {
      return get().currentHistoryIndex > 0;
    },

    canRedo: () => {
      const state = get();
      return state.currentHistoryIndex < state.history.length - 1;
    },

    undoDelete: () => {
      const state = get();
      if (state.recentlyDeleted) {
        const { component, index } = state.recentlyDeleted;
        const newComponents = [...state.components];
        newComponents.splice(index, 0, component);
        
        set({
          components: newComponents,
          recentlyDeleted: null
        });
      }
    },

    clearRecentlyDeleted: () => set({
      recentlyDeleted: null
    }),

    validateForm: () => {
      const state = get();
      const errors: string[] = [];
      
      if (!state.formSettings.title.trim()) {
        errors.push('Form title is required');
      }
      
      if (state.components.length === 0) {
        errors.push('Form must have at least one component');
      }
      
      state.components.forEach((component, index) => {
        if (!component.label.trim()) {
          errors.push(`Component ${index + 1} is missing a label`);
        }
        
        if (['select', 'radio', 'checkbox'].includes(component.type)) {
          if (!component.options || component.options.length === 0) {
            errors.push(`${component.label} must have at least one option`);
          }
        }
      });
      
      return {
        isValid: errors.length === 0,
        errors
      };
    },

    exportForm: () => {
      const state = get();
      const formData = {
        components: state.components,
        formSettings: state.formSettings,
        version: "1.0",
        timestamp: new Date().toISOString()
      };
      return JSON.stringify(formData, null, 2);
    },

    importForm: (data: string) => {
      try {
        const formData = JSON.parse(data);
        
        if (!formData.components || !formData.formSettings) {
          return false;
        }
        
        set({
          components: formData.components,
          formSettings: formData.formSettings,
          selectedComponent: null,
          isPreviewMode: false
        });
        
        return true;
      } catch (error) {
        return false;
      }
    }
  };
});
