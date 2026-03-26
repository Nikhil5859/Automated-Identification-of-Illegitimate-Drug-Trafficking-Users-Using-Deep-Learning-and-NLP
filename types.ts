
export enum SocialPlatform {
  Telegram = 'Telegram',
  Instagram = 'Instagram',
  WhatsApp = 'WhatsApp',
}

export interface Post {
  id: number;
  text: string;
  timestamp: string;
  imageUrl?: string;
  videoUrl?: string;
  videoMimeType?: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  platform: SocialPlatform;
  profilePicUrl: string;
  posts: Post[];
}

export enum RiskLevel {
    High = 'High',
    Medium = 'Medium',
    Low = 'Low',
    Unknown = 'Unknown',
}

// --- NEW Structured Analysis Types ---

export interface VisualAnalysisResult {
  classification: string;
  score: number; // 0-100
  detectedItems: string[];
}

export interface TextAnalysisResult {
  intent: 'Trafficking' | 'Awareness' | 'Neutral' | 'Suspicious' | 'Analysis Error';
  score: number; // 0-100
  flaggedKeywords: string[];
}


export interface AnalysisResult {
    // Final Fused Results
    riskLevel: RiskLevel;
    riskScore: number; // The final fused score
    summary: string;

    // Detailed Breakdown
    visualAnalysis: VisualAnalysisResult;
    textAnalysis: TextAnalysisResult;
}

export interface HighRiskAlert {
  user: User;
  result: AnalysisResult;
}