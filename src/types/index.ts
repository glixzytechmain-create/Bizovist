export type UserRole = 'founder' | 'manufacturer' | 'both';

export type RequirementStatus = 'confirmed' | 'likely' | 'needs_confirmation';
export type EvidenceType = 'confirmed' | 'manufacturer_claimed' | 'public_evidence' | 'public_intelligence' | 'ai_inference' | 'needs_confirmation';

export interface Requirement {
  id: string;
  name: string;
  category: string;
  status: RequirementStatus;
  note: string;
  evidenceType?: EvidenceType;
}

export interface SpecificationItem {
  id: string;
  dimension: string;
  value: string;
  importance: 'critical' | 'high' | 'medium';
  unit?: string;
}

export interface MachineryItem {
  name: string;
  model?: string;
  brand?: string;
  tonnageOrPower?: string;
  count: number;
  precisionTolerance?: string;
}

export interface Manufacturer {
  id: string;
  name: string;
  subdomain?: string;
  tagline: string;
  verified: boolean;
  verificationLevel: 'verified_facility' | 'claimed_profile' | 'public_intelligence';
  location: string;
  country: string;
  stateOrProvince?: string;
  facilitySizeSqFt: number;
  workforceCount: number;
  establishedYear: number;
  industries: string[];
  products: string[];
  materials: string[];
  processes: string[];
  machinery: MachineryItem[];
  capabilities: string[];
  certifications: string[];
  moq: number;
  moqUnit: string;
  annualCapacity: string;
  leadTimeAvgWeeks: number;
  customizationRating: 'High' | 'Full OEM/ODM' | 'Standard with Custom Finish';
  coordinates?: { lat: number; lng: number };
  nearestPort?: string;
  logisticsCorridor?: string;
  evidenceSource: {
    type: EvidenceType;
    details: string;
    lastAuditedDate?: string;
  };
  samplePolicy: string;
  contactEmail?: string;
  avatarUrl?: string;
  photos?: string[];
  whyMatches?: string[];
  needsConfirmation?: string[];
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  status: 'ideation' | 'requirements_defined' | 'discovering_manufacturers' | 'rfq_sent' | 'sample_evaluation' | 'production_ready';
  createdAt: string;
  updatedAt: string;
  industry: string;
  productCategory: string;
  materials: string[];
  processes: string[];
  machineryNeeded: string[];
  targetMOQ: number;
  moqUnit: string;
  targetUnitCost?: string;
  targetLeadTime?: string;
  locationPreference?: string;
  requirements: Requirement[];
  specifications: SpecificationItem[];
  components?: BomComponent[];
  toolingSummary?: ToolingSummary;
  regulatoryConsiderations: string[];
  keyQuestionsForManufacturers: string[];
  shortlistedManufacturerIds: string[];
  rejectedManufacturerIds: { id: string; reason: string }[];
  quotesReceived: number;
  samplesReceived: number;
}

export interface BuyerDemandOpportunity {
  id: string;
  title: string;
  productType: string;
  targetQuantity: string;
  location: string;
  intentLevel: 'High Intent' | 'Sample Phase' | 'Sourcing Pilot';
  postedAgo: string;
  requiredProcesses: string[];
  budgetEstimated?: string;
  complianceNeeded?: string[];
  matchedCapability: string;
}

export interface MessageThread {
  id: string;
  manufacturerId: string;
  manufacturerName: string;
  projectId?: string;
  projectTitle?: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  messages: {
    id: string;
    sender: 'founder' | 'manufacturer' | 'system';
    text: string;
    timestamp: string;
    rfqAttachment?: {
      title: string;
      moq: string;
      specsCount: number;
    };
  }[];
}

export interface BomComponent {
  name: string;
  materialGrade: string;
  manufacturingProcess: string;
  toolingType: string;
  toolingCostEstimate: string;
  unitCostContribution?: string;
  tolerance: string;
}

export interface ToolingSummary {
  totalToolingNre: string;
  toolingLeadTimeWeeks: number;
  goldenSampleLeadTimeWeeks: number;
  massProductionWeeks: number;
}

export interface AIAnalysisResult {
  projectName: string;
  summary: string;
  industry: string;
  productCategory: string;
  materials: string[];
  processes: string[];
  machineryNeeded: string[];
  targetMOQ: number;
  moqUnit: string;
  targetUnitCostEstimate: string;
  targetLeadTime: string;
  locationPreference: string;
  components?: BomComponent[];
  toolingSummary?: ToolingSummary;
  requirements: {
    name: string;
    status: RequirementStatus;
    note: string;
  }[];
  specifications: {
    dimension: string;
    value: string;
    importance: 'critical' | 'high' | 'medium';
  }[];
  regulatoryConsiderations: string[];
  clarifyingQuestions: string[];
}

export interface PortLogisticsInfo {
  portName: string;
  distanceKm: number;
  drayageHours: number;
  corridorName: string;
  railConnectivity: boolean;
}

export interface ManufacturerComparisonResult {
  executiveRecommendation: string;
  winnerForLowNre: {
    manufacturerId: string;
    manufacturerName: string;
    reason: string;
  };
  winnerForHighPrecision: {
    manufacturerId: string;
    manufacturerName: string;
    reason: string;
  };
  winnerForVolumeAndSpeed: {
    manufacturerId: string;
    manufacturerName: string;
    reason: string;
  };
  logisticsTradeoff: string;
  negotiationTactics: {
    manufacturerId: string;
    manufacturerName: string;
    tactics: string[];
  }[];
  comparativeScores: Record<
    string,
    {
      precision: number;
      toolingEconomy: number;
      speed: number;
      verificationTrust: number;
      logistics: number;
    }
  >;
  engine?: string;
}

