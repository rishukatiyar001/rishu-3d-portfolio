export type WorldId =
  | 'workspace'
  | 'architecture'
  | 'erp'
  | 'payments'
  | 'mobile'
  | 'cloud'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'contact';

export type QualityLevel = 'auto' | 'high' | 'medium' | 'low';

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Enterprise / Smart Grid' | 'FinTech / Payments' | 'Full Stack Web' | 'Productivity / Utility' | 'AI / Machine Learning';
  technologies: string[];
  description: string;
  role: string;
  architectureHighlights: string[];
  githubUrl?: string;
  liveUrl?: string;
  status: 'Production' | 'Live' | 'Featured' | 'Completed';
  worldCoordinate?: [number, number, number];
  color: string;
}

export interface SkillItem {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Mobile' | 'Cloud & DevOps' | '3D & Creative' | 'Core Engineering';
  roleInStack: string;
  highlight?: boolean;
}

export interface SkillCategoryGroup {
  category: string;
  tagline: string;
  color: string;
  skills: SkillItem[];
}

export interface ArchitectureNode {
  id: string;
  tier: number;
  name: string;
  technology: string;
  category: string;
  description: string;
  howUsedByRishu: string;
  color: string;
  requestOrder: number;
  responseOrder: number;
  codeSnippet?: string;
}

export interface ExperienceItem {
  period: string;
  role: string;
  companyOrContext: string;
  location: string;
  summary: string;
  highlights: string[];
  keyStack: string[];
}

export interface TerminalCommandOutput {
  command: string;
  lines: string[];
  type?: 'success' | 'info' | 'warning' | 'error' | 'system';
}

export interface ErpStageItem {
  id: string;
  step: number;
  name: string;
  subtitle: string;
  technology: string;
  flowRole: string;
  description: string;
  technicalDetails: string[];
  codeOrSchema?: string;
  color: string;
}

export interface PaymentStageItem {
  id: string;
  order: number;
  stage: 'REQUEST' | 'HASH' | 'PAYMENT' | 'TRANSACTION' | 'CALLBACK' | 'RESULT';
  name: string;
  subtitle: string;
  technicalRole: string;
  protocolOrAlgorithm: string;
  description: string;
  parameters: Array<{ key: string; value: string; note?: string }>;
  codeExample?: string;
  color: string;
}

export interface MobileFeatureItem {
  id: string;
  name: string;
  category: 'Hardware & Plugins' | 'Data & Storage' | 'Cloud & Messaging' | 'Native OS Runtimes';
  technology: string;
  description: string;
  implementationDetail: string;
  codeSnippet?: string;
  color: string;
}

