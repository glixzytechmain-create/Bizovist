import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Project,
  Manufacturer,
  AIAnalysisResult,
  MessageThread,
} from '../types';
import {
  INITIAL_MANUFACTURERS,
  INITIAL_PROJECT,
  INITIAL_MESSAGES,
} from '../data/seedData';
import { aiService, SystemStatus } from '../services/aiService';
import {
  auth,
  db,
  signInWithGoogle,
  signOutUser,
  testConnection,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export type AppView =
  | 'landing'
  | 'role-selection'
  | 'founder-onboarding'
  | 'mfg-onboarding'
  | 'home'
  | 'ai-understand'
  | 'projects'
  | 'pipeline'
  | 'discover'
  | 'comparison'
  | 'messages'
  | 'ai-workspace'
  | 'mfg-dashboard'
  | 'mfg-site-preview'
  | 'profile';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  currentUser: FirebaseUser | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  projects: Project[];
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  manufacturers: Manufacturer[];
  shortlistedManufacturerIds: string[];
  comparisonManufacturerIds: string[];
  activeManufacturerDetail: Manufacturer | null;
  isAiDrawerOpen: boolean;
  aiDrawerContext: { type: 'global' | 'project' | 'manufacturer' | 'comparison'; data?: any };
  messages: MessageThread[];
  activeThreadId: string | null;
  setActiveThreadId: (id: string | null) => void;
  isInterpreting: boolean;
  latestAnalysis: AIAnalysisResult | null;
  setLatestAnalysis: (analysis: AIAnalysisResult | null) => void;
  systemStatus: SystemStatus | null;
  // Dedicated multi-step inspection waiting animation state
  isInspectionOpen: boolean;
  inspectionMode: 'intent_decomposition' | 'factory_grounding' | 'factory_comparison' | 'bom_refinement';
  inspectionProductContext: string;
  closeInspection: () => void;
  analyzeIdea: (prompt: string) => Promise<AIAnalysisResult>;
  refineBomWithAi: (instruction: string) => Promise<AIAnalysisResult>;
  createProjectFromAnalysis: (analysis: AIAnalysisResult) => Project;
  searchManufacturersGrounded: (query: string) => Promise<Manufacturer[]>;
  compareManufacturersGrounded: (mfgList: Manufacturer[]) => Promise<any>;
  toggleShortlist: (mfgId: string) => void;
  toggleComparison: (mfgId: string) => void;
  clearComparison: () => void;
  openManufacturerDetail: (mfg: Manufacturer) => void;
  closeManufacturerDetail: () => void;
  openAiDrawer: (context?: { type: 'global' | 'project' | 'manufacturer' | 'comparison'; data?: any }) => void;
  closeAiDrawer: () => void;
  sendMessage: (threadId: string, text: string) => void;
  startNewRfq: (mfgId: string, customNote?: string) => string;
  switchProject: (projectId: string) => void;
  refreshSystemStatus: () => Promise<void>;
  updateProjectRequirements: (projectId: string, requirementId: string, updates: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('founder');
  const [activeView, setActiveView] = useState<AppView>('landing');
  const [projects, setProjects] = useState<Project[]>([INITIAL_PROJECT]);
  const [activeProject, setActiveProject] = useState<Project | null>(INITIAL_PROJECT);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>(INITIAL_MANUFACTURERS);
  const [shortlistedManufacturerIds, setShortlistedManufacturerIds] = useState<string[]>(['mfg-hind-metals']);
  const [comparisonManufacturerIds, setComparisonManufacturerIds] = useState<string[]>(['mfg-hind-metals', 'mfg-titan-precision']);
  const [activeManufacturerDetail, setActiveManufacturerDetail] = useState<Manufacturer | null>(null);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [aiDrawerContext, setAiDrawerContext] = useState<{ type: 'global' | 'project' | 'manufacturer' | 'comparison'; data?: any }>({
    type: 'global',
  });
  const [messages, setMessages] = useState<MessageThread[]>(INITIAL_MESSAGES);
  const [activeThreadId, setActiveThreadId] = useState<string | null>('thread-hind-01');
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [latestAnalysis, setLatestAnalysis] = useState<AIAnalysisResult | null>(null);
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);

  // Dedicated multi-step inspection waiting animation state
  const [isInspectionOpen, setIsInspectionOpen] = useState(false);
  const [inspectionMode, setInspectionMode] = useState<
    'intent_decomposition' | 'factory_grounding' | 'factory_comparison' | 'bom_refinement'
  >('intent_decomposition');
  const [inspectionProductContext, setInspectionProductContext] = useState('');

  const closeInspection = () => setIsInspectionOpen(false);

  const refreshSystemStatus = async () => {
    try {
      const status = await aiService.getSystemStatus();
      setSystemStatus(status);
    } catch (e) {
      console.warn('System status check error:', e);
    }
  };

  useEffect(() => {
    refreshSystemStatus();
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google Sign-in failed:', err);
    }
  };

  const logout = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const analyzeIdea = async (prompt: string): Promise<AIAnalysisResult> => {
    setIsInterpreting(true);
    setIsInspectionOpen(true);
    setInspectionMode('intent_decomposition');
    setInspectionProductContext(prompt);

    try {
      // Paced engineering pipeline (min 3.4 seconds)
      const minDelay = new Promise((resolve) => setTimeout(resolve, 3400));
      const [response, discoveredMfg] = await Promise.all([
        aiService.interpretProject(prompt, activeProject),
        aiService.searchRealWorldManufacturers(prompt, 'India'),
        minDelay,
      ]);

      setLatestAnalysis(response.data);

      // Create new dynamic project immediately
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        title: response.data.projectName,
        summary: response.data.summary,
        status: 'requirements_defined',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        industry: response.data.industry,
        productCategory: response.data.productCategory,
        materials: response.data.materials,
        processes: response.data.processes,
        machineryNeeded: response.data.machineryNeeded,
        targetMOQ: response.data.targetMOQ,
        moqUnit: response.data.moqUnit,
        targetUnitCost: response.data.targetUnitCostEstimate,
        targetLeadTime: response.data.targetLeadTime,
        locationPreference: response.data.locationPreference,
        components: response.data.components,
        toolingSummary: response.data.toolingSummary,
        requirements: (response.data.requirements || []).map((r, idx) => ({
          id: `req-${Date.now()}-${idx}`,
          name: r.name,
          category: 'Core Spec',
          status: r.status,
          note: r.note,
          evidenceType: r.status === 'confirmed' ? 'confirmed' : 'ai_inference',
        })),
        specifications: (response.data.specifications || []).map((s, idx) => ({
          id: `spec-${Date.now()}-${idx}`,
          dimension: s.dimension,
          value: s.value,
          importance: s.importance,
        })),
        regulatoryConsiderations: response.data.regulatoryConsiderations || [],
        keyQuestionsForManufacturers: response.data.clarifyingQuestions || [],
        shortlistedManufacturerIds: [],
        rejectedManufacturerIds: [],
        quotesReceived: 0,
        samplesReceived: 0,
      };

      setProjects((prev) => [newProj, ...prev]);
      setActiveProject(newProj);

      if (discoveredMfg && discoveredMfg.length > 0) {
        setManufacturers((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newOnes = discoveredMfg.filter((m) => !existingIds.has(m.id));
          return [...newOnes, ...prev];
        });
        setShortlistedManufacturerIds([discoveredMfg[0].id]);
        if (discoveredMfg.length >= 2) {
          setComparisonManufacturerIds([discoveredMfg[0].id, discoveredMfg[1].id]);
        }
      }

      setIsInspectionOpen(false);
      setActiveView('ai-understand');
      return response.data;
    } catch (err) {
      console.error('Failed to interpret idea:', err);
      setIsInspectionOpen(false);
      throw err;
    } finally {
      setIsInterpreting(false);
    }
  };

  const searchManufacturersGrounded = async (query: string): Promise<Manufacturer[]> => {
    setIsInspectionOpen(true);
    setInspectionMode('factory_grounding');
    setInspectionProductContext(query);
    try {
      const minDelay = new Promise((resolve) => setTimeout(resolve, 3200));
      const [discovered] = await Promise.all([
        aiService.searchRealWorldManufacturers(query, activeProject?.locationPreference || 'India'),
        minDelay,
      ]);

      if (discovered && discovered.length > 0) {
        setManufacturers((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newOnes = discovered.filter((m) => !existingIds.has(m.id));
          return [...newOnes, ...prev];
        });
        setShortlistedManufacturerIds((prev) => [
          discovered[0].id,
          ...prev.filter((id) => id !== discovered[0].id),
        ]);
      }
      return discovered || [];
    } finally {
      setIsInspectionOpen(false);
    }
  };

  const compareManufacturersGrounded = async (mfgList: Manufacturer[]): Promise<any> => {
    setIsInspectionOpen(true);
    setInspectionMode('factory_comparison');
    setInspectionProductContext(activeProject?.title || 'Multi-Facility Evaluation');
    try {
      const minDelay = new Promise((resolve) => setTimeout(resolve, 3200));
      const [result] = await Promise.all([
        aiService.compareManufacturers(mfgList, activeProject),
        minDelay,
      ]);
      return result;
    } finally {
      setIsInspectionOpen(false);
    }
  };

  const refineBomWithAi = async (instruction: string): Promise<AIAnalysisResult> => {
    const baseAnalysis: AIAnalysisResult = latestAnalysis || {
      projectName: activeProject?.title || 'Custom Engineered Product',
      summary: activeProject?.summary || 'Precision contract manufacturing specifications',
      industry: activeProject?.industry || 'Industrial & Consumer Manufacturing',
      productCategory: activeProject?.productCategory || 'Contract Manufacturing',
      materials: activeProject?.materials || ['Industrial Grade Specification'],
      processes: activeProject?.processes || ['Precision Production Line'],
      machineryNeeded: activeProject?.machineryNeeded || ['Automated Production Machinery'],
      targetMOQ: activeProject?.targetMOQ || 5000,
      moqUnit: activeProject?.moqUnit || 'units',
      targetUnitCostEstimate: activeProject?.targetUnitCost || '$2.50 - $6.00 / unit',
      targetLeadTime: activeProject?.targetLeadTime || '4-6 weeks',
      locationPreference: activeProject?.locationPreference || 'India',
      components: activeProject?.components || [],
      toolingSummary: activeProject?.toolingSummary,
      requirements: (activeProject?.requirements || []).map((r) => ({
        name: r.name,
        status: r.status,
        note: r.note,
      })),
      specifications: (activeProject?.specifications || []).map((s) => ({
        dimension: s.dimension,
        value: s.value,
        importance: s.importance,
      })),
      regulatoryConsiderations: activeProject?.regulatoryConsiderations || [],
      clarifyingQuestions: activeProject?.keyQuestionsForManufacturers || [],
    };

    setIsInterpreting(true);
    try {
      const response = await aiService.refineBom(baseAnalysis, instruction);
      setLatestAnalysis(response.data);
      if (activeProject) {
        setActiveProject({
          ...activeProject,
          title: response.data.projectName,
          summary: response.data.summary,
          industry: response.data.industry,
          productCategory: response.data.productCategory,
          components: response.data.components,
          toolingSummary: response.data.toolingSummary,
          materials: response.data.materials,
          processes: response.data.processes,
          machineryNeeded: response.data.machineryNeeded,
          targetMOQ: response.data.targetMOQ,
          targetUnitCost: response.data.targetUnitCostEstimate,
          targetLeadTime: response.data.targetLeadTime,
          specifications: response.data.specifications.map((s, idx) => ({
            id: `spec-${Date.now()}-${idx}`,
            dimension: s.dimension,
            value: s.value,
            importance: s.importance,
          })),
        });
      }
      return response.data;
    } catch (err) {
      console.error('Failed to refine BOM:', err);
      throw err;
    } finally {
      setIsInterpreting(false);
    }
  };

  const createProjectFromAnalysis = (analysis: AIAnalysisResult): Project => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: analysis.projectName,
      summary: analysis.summary,
      status: 'requirements_defined',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      industry: analysis.industry,
      productCategory: analysis.productCategory,
      materials: analysis.materials,
      processes: analysis.processes,
      machineryNeeded: analysis.machineryNeeded,
      targetMOQ: analysis.targetMOQ,
      moqUnit: analysis.moqUnit,
      targetUnitCost: analysis.targetUnitCostEstimate,
      targetLeadTime: analysis.targetLeadTime,
      locationPreference: analysis.locationPreference,
      components: analysis.components,
      toolingSummary: analysis.toolingSummary,
      requirements: analysis.requirements.map((r, idx) => ({
        id: `req-${Date.now()}-${idx}`,
        name: r.name,
        category: 'Specification',
        status: r.status,
        note: r.note,
        evidenceType: r.status === 'confirmed' ? 'confirmed' : r.status === 'likely' ? 'ai_inference' : 'needs_confirmation',
      })),
      specifications: analysis.specifications.map((s, idx) => ({
        id: `spec-${Date.now()}-${idx}`,
        dimension: s.dimension,
        value: s.value,
        importance: s.importance,
      })),
      regulatoryConsiderations: analysis.regulatoryConsiderations,
      keyQuestionsForManufacturers: analysis.clarifyingQuestions,
      shortlistedManufacturerIds: [],
      rejectedManufacturerIds: [],
      quotesReceived: 0,
      samplesReceived: 0,
    };

    setProjects((prev) => [newProj, ...prev]);
    setActiveProject(newProj);
    return newProj;
  };

  const toggleShortlist = (mfgId: string) => {
    setShortlistedManufacturerIds((prev) => {
      const exists = prev.includes(mfgId);
      const next = exists ? prev.filter((id) => id !== mfgId) : [...prev, mfgId];
      if (activeProject) {
        setActiveProject({
          ...activeProject,
          shortlistedManufacturerIds: next,
        });
      }
      return next;
    });
  };

  const toggleComparison = (mfgId: string) => {
    setComparisonManufacturerIds((prev) => {
      if (prev.includes(mfgId)) {
        return prev.filter((id) => id !== mfgId);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), mfgId];
      }
      return [...prev, mfgId];
    });
  };

  const clearComparison = () => {
    setComparisonManufacturerIds([]);
  };

  const openManufacturerDetail = (mfg: Manufacturer) => {
    setActiveManufacturerDetail(mfg);
  };

  const closeManufacturerDetail = () => {
    setActiveManufacturerDetail(null);
  };

  const openAiDrawer = (context?: { type: 'global' | 'project' | 'manufacturer' | 'comparison'; data?: any }) => {
    if (context) {
      setAiDrawerContext(context);
    } else {
      setAiDrawerContext({
        type: activeProject ? 'project' : 'global',
        data: activeProject,
      });
    }
    setIsAiDrawerOpen(true);
  };

  const closeAiDrawer = () => {
    setIsAiDrawerOpen(false);
  };

  const sendMessage = (threadId: string, text: string) => {
    setMessages((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            lastMessage: text,
            timestamp: 'Just now',
            messages: [
              ...thread.messages,
              {
                id: `msg-${Date.now()}`,
                sender: 'founder',
                text,
                timestamp: 'Just now',
              },
            ],
          };
        }
        return thread;
      })
    );
  };

  const startNewRfq = (mfgId: string, customNote?: string): string => {
    const mfg = manufacturers.find((m) => m.id === mfgId);
    const existingThread = messages.find((m) => m.manufacturerId === mfgId);

    if (existingThread) {
      setActiveThreadId(existingThread.id);
      setActiveView('messages');
      return existingThread.id;
    }

    const newThreadId = `thread-${Date.now()}`;
    const newThread: MessageThread = {
      id: newThreadId,
      manufacturerId: mfgId,
      manufacturerName: mfg?.name || 'Manufacturing Facility',
      projectId: activeProject?.id,
      projectTitle: activeProject?.title,
      lastMessage: customNote || 'Formal RFQ Specification packet transmitted via Bizovist.',
      timestamp: 'Just now',
      unread: false,
      messages: [
        {
          id: `msg-${Date.now()}-1`,
          sender: 'founder',
          text: customNote || `Hello ${mfg?.name || 'Engineering Team'}, we are officially initiating discovery for our project "${activeProject?.title || 'Custom Product'}". Please review our engineering parameters.`,
          timestamp: 'Just now',
          rfqAttachment: activeProject
            ? {
                title: `${activeProject.title} RFQ Spec Packet`,
                moq: `${activeProject.targetMOQ.toLocaleString()} ${activeProject.moqUnit}`,
                specsCount: activeProject.specifications.length,
              }
            : undefined,
        },
      ],
    };

    setMessages((prev) => [newThread, ...prev]);
    setActiveThreadId(newThreadId);
    setActiveView('messages');
    return newThreadId;
  };

  const switchProject = (projectId: string) => {
    const found = projects.find((p) => p.id === projectId);
    if (found) {
      setActiveProject(found);
    }
  };

  const updateProjectRequirements = (projectId: string, requirementId: string, updates: any) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updatedReqs = p.requirements.map((r) => (r.id === requirementId ? { ...r, ...updates } : r));
          const updatedProj = { ...p, requirements: updatedReqs };
          if (activeProject?.id === projectId) {
            setActiveProject(updatedProj);
          }
          return updatedProj;
        }
        return p;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        activeView,
        setActiveView,
        currentUser,
        loginWithGoogle,
        logout,
        projects,
        activeProject,
        setActiveProject,
        manufacturers,
        shortlistedManufacturerIds,
        comparisonManufacturerIds,
        activeManufacturerDetail,
        isAiDrawerOpen,
        aiDrawerContext,
        messages,
        activeThreadId,
        setActiveThreadId,
        isInterpreting,
        latestAnalysis,
        setLatestAnalysis,
        systemStatus,
        isInspectionOpen,
        inspectionMode,
        inspectionProductContext,
        closeInspection,
        analyzeIdea,
        refineBomWithAi,
        createProjectFromAnalysis,
        searchManufacturersGrounded,
        compareManufacturersGrounded,
        toggleShortlist,
        toggleComparison,
        clearComparison,
        openManufacturerDetail,
        closeManufacturerDetail,
        openAiDrawer,
        closeAiDrawer,
        sendMessage,
        startNewRfq,
        switchProject,
        refreshSystemStatus,
        updateProjectRequirements,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
