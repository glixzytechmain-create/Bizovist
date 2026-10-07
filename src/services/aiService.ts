import { AIAnalysisResult, ManufacturerComparisonResult } from '../types';

export interface SystemStatus {
  status: string;
  version: string;
  geminiConfigured: boolean;
  mapsConfigured?: boolean;
  sheetsConfigured?: boolean;
  model: string;
  timestamp: string;
}

export const aiService = {
  async compareManufacturers(
    manufacturers: any[],
    project?: any
  ): Promise<ManufacturerComparisonResult> {
    const res = await fetch('/api/ai/compare-manufacturers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ manufacturers, project }),
    });

    if (!res.ok) {
      throw new Error('Failed to run head-to-head comparison');
    }

    const json = await res.json();
    return {
      ...json.data,
      engine: json.engine,
    };
  },
  async getSystemStatus(): Promise<SystemStatus> {
    try {
      const res = await fetch('/api/system/status');
      if (!res.ok) throw new Error('Status endpoint failed');
      return await res.json();
    } catch {
      return {
        status: 'online',
        version: '1.0.0',
        geminiConfigured: false,
        model: 'gemini-3.8-flash',
        timestamp: new Date().toISOString(),
      };
    }
  },

  async interpretProject(prompt: string, currentProject?: any): Promise<{ success: boolean; data: AIAnalysisResult; engine: string }> {
    const res = await fetch('/api/ai/interpret', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, currentProject }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to interpret project');
    }

    return await res.json();
  },

  async refineBom(
    currentAnalysis: any,
    userInstruction: string
  ): Promise<{ success: boolean; data: AIAnalysisResult; engine: string }> {
    const res = await fetch('/api/ai/refine-bom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentAnalysis, userInstruction }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to refine BOM');
    }

    return await res.json();
  },

  async evaluateMatch(project: any, manufacturer: any): Promise<{
    matchScore: number;
    confidenceScore: number;
    whyItMatches: string[];
    needsConfirmation: string[];
    riskAssessment: string;
    recommendedNextStep: string;
    engine: string;
  }> {
    const res = await fetch('/api/ai/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project, manufacturer }),
    });

    if (!res.ok) {
      throw new Error('Failed to evaluate match');
    }

    const json = await res.json();
    return {
      ...json.data,
      engine: json.engine,
    };
  },

  async chatCoFounder(
    message: string,
    context?: any,
    history?: { role: string; content: string }[]
  ): Promise<{ reply: string; engine: string }> {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context, history }),
    });

    if (!res.ok) {
      throw new Error('Failed to communicate with AI co-founder');
    }

    const data = await res.json();
    return {
      reply: data.reply,
      engine: data.engine,
    };
  },

  async auditManufacturer(manufacturer: any, targetProduct?: string): Promise<{
    productionReadiness: string;
    machinerySufficiency: string;
    auditChecklist: string[];
    redFlagsToWatch: string[];
    sampleEvaluationStrategy: string;
    engine: string;
  }> {
    const res = await fetch('/api/ai/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ manufacturer, targetProduct }),
    });

    if (!res.ok) {
      throw new Error('Failed to audit manufacturer');
    }

    const json = await res.json();
    return {
      ...json.data,
      engine: json.engine,
    };
  },

  async liveWebSearch(query: string, geography?: string): Promise<{
    success: boolean;
    facilities: any[];
    groundingMetadata?: any;
    engine: string;
  }> {
    const res = await fetch('/api/ai/live-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, geography }),
    });

    if (!res.ok) {
      throw new Error('Failed to run live web search');
    }

    return await res.json();
  },

  async exportProjectToSheets(project: any): Promise<{
    success: boolean;
    csvContent: string;
    sheetsApiActive: boolean;
    downloadFilename: string;
  }> {
    const res = await fetch('/api/export/sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project }),
    });

    if (!res.ok) {
      throw new Error('Failed to export BOM to Sheets format');
    }

    return await res.json();
  },

  async lookupClusterGeo(address: string): Promise<any> {
    const res = await fetch(`/api/geo/lookup?address=${encodeURIComponent(address)}`);
    if (!res.ok) {
      throw new Error('Failed to lookup cluster geography');
    }
    return await res.json();
  },
};
