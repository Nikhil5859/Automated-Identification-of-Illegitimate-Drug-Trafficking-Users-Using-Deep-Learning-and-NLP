
import { AnalysisResult, RiskLevel, SocialPlatform, User } from "../types";

// --- NLP Configuration ---

const STOP_WORDS = new Set(['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'if', 'then', 'else', 'for', 'of', 'to', 'in', 'it', 'this', 'that', 'i', 'my', 'me', 'we', 'are', 'was']);

// Domain-specific IDF weights [3]
const TERM_IDF_WEIGHTS: Record<string, number> = {
    // High Risk Slang
    'snow': 2.5, 'white': 1.2, 'horse': 2.0, 'pure': 1.5, 'powder': 1.8,
    'greens': 1.5, '420': 1.0, 'loud': 1.5, 'pack': 1.2, 'stash': 1.5,
    'pills': 2.0, 'dolphins': 2.5, 'blue': 1.2, 'xan': 2.2, 'bars': 1.8,
    'monero': 3.0, 'crypto': 1.5, 'dm': 1.0, 'menu': 1.5, 'delivery': 1.2,
    'gummies': 1.5, 'tabs': 2.0, 'acid': 2.0, 'shrooms': 1.8, 'plug': 2.0,
    // Context modifiers
    'party': 0.5, 'weekend': 0.3, 'trip': 0.8, 'roll': 1.0, 'high': 0.8
};

// --- FEATURE EXTRACTION: NLP ---

function preprocessText(text: string): string[] {
    return text.toLowerCase()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "") 
        .split(/\s+/) 
        .filter(token => !STOP_WORDS.has(token) && token.length > 2); 
}

function calculateTFIDF(tokens: string[]): { vectorScore: number, keywords: string[] } {
    const docLength = tokens.length || 1;
    const tfCounts: Record<string, number> = {};
    tokens.forEach(t => tfCounts[t] = (tfCounts[t] || 0) + 1);

    let vectorScore = 0;
    const detectedKeywords: string[] = [];

    for (const term in tfCounts) {
        if (TERM_IDF_WEIGHTS[term]) {
            const tf = tfCounts[term] / docLength; 
            const idf = TERM_IDF_WEIGHTS[term];    
            vectorScore += tf * idf * 10; 
            detectedKeywords.push(term);
        }
    }
    return { vectorScore: Math.min(vectorScore, 1.0), keywords: detectedKeywords };
}

// --- FEATURE EXTRACTION: CNN (MobileNet) ---

// "Synthesized Data" Mapping:
// MobileNet is trained on ImageNet (1000 classes). 
// We map specific classes AND their common "AI Confusion" counterparts to risk categories.
const IMAGENET_RISK_MAPPING: Record<string, number> = {
    // Direct Paraphernalia (Critical Risk)
    'syringe': 1.0,
    'hypodermic syringe': 1.0,
    'needle': 1.0,
    
    // Pills & Medical (High Risk)
    'pill bottle': 0.95,
    'medicine chest': 0.8,
    'capsule': 0.9,
    'tablets': 0.9,
    
    // Processing Equipment (High Risk)
    'scale': 0.95,
    'balance beam': 0.85,
    'beaker': 0.9,
    'flask': 0.85,
    'mortar': 0.7, // Mortar and pestle
    'petri dish': 0.75,

    // Tools often found in processing scenes (Medium Risk)
    'lighter': 0.7,
    'matchstick': 0.6,
    'ladle': 0.6, // AI often sees metal spoons as ladles
    'soup spoon': 0.6,
    'spatula': 0.5, // Used for powder
    'letter opener': 0.6, // AI often sees razor blades as letter openers or knives
    'guillotine': 0.6, // Paper cutter / blade
    'can opener': 0.5,
    
    // Cannabis Proxies (AI often misclassifies buds as these vegetable/fungi classes)
    'broccoli': 0.8, 
    'cauliflower': 0.8,
    'head cabbage': 0.7,
    'potpourri': 0.75,
    'stinkhorn': 0.85, // Mushroom type
    'hen-of-the-woods': 0.85, // Mushroom type
    'mushroom': 0.8,
    
    // Packaging & Transport (Contextual Risk)
    'packet': 0.6,
    'envelope': 0.5,
    'plastic bag': 0.6,
    'dough': 0.5, // AI often sees piles of white powder as dough or flour
    'flour': 0.5,
    'salt': 0.5,
    'soap dispenser': 0.4, // Baggies sometimes look like dispensers to AI
    'purse': 0.3,
    'wallet': 0.3,
};

let cnnModel: any = null;

async function loadCNNModel() {
    const tf = (window as any).tf;
    const mobilenet = (window as any).mobilenet;

    if (!cnnModel) {
        if (!tf || !mobilenet) throw new Error("ML libraries not loaded.");
        await tf.ready();
        // Load MobileNet
        cnnModel = await mobilenet.load(); 
    }
    return cnnModel;
}

/**
 * Extracts visual features using MobileNet CNN.
 */
async function extractCNNFeatures(imageUrl: string | undefined): Promise<{ vectorScore: number, detectedObjects: string[] }> {
    if (!imageUrl) return { vectorScore: 0, detectedObjects: [] };

    try {
        const model = await loadCNNModel();
        const img = document.createElement('img');
        img.crossOrigin = "anonymous";
        img.src = imageUrl;

        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = () => reject(new Error("Image load failed"));
        });

        // CRITICAL UPDATE: Request Top 10 predictions (default is 3).
        // Complex drug scenes have many items; the "drug" items might be #4 or #5 in the list.
        const predictions = await model.classify(img, 10);
        
        let maxRiskScore = 0;
        const detectedItems: string[] = [];
        const detectedRiskCategories = new Set<string>();

        predictions.forEach((pred: any) => {
            const className = pred.className.toLowerCase();
            const probability = pred.probability; // 0.0 to 1.0

            // Check against our "Synthesized" Risk Database
            let matchFound = false;
            for (const [riskKey, riskWeight] of Object.entries(IMAGENET_RISK_MAPPING)) {
                if (className.includes(riskKey)) {
                    // Risk Calculation:
                    // We don't multiply by probability heavily because the model might be unsure about "broccoli" vs "cannabis".
                    // If it guesses "broccoli" (our proxy) with 20% confidence, we still treat it as a potential hit.
                    const confidenceAdjustment = probability < 0.2 ? 0.5 : 1.0;
                    const calculatedRisk = riskWeight * confidenceAdjustment;
                    
                    if (calculatedRisk > maxRiskScore) {
                        maxRiskScore = calculatedRisk;
                    }

                    // Categorize for cluster logic
                    if (['scale', 'balance', 'beaker', 'flask', 'mortar'].some(s => className.includes(s))) detectedRiskCategories.add('EQUIPMENT');
                    if (['syringe', 'needle', 'lighter', 'spoon', 'ladle'].some(s => className.includes(s))) detectedRiskCategories.add('PARA');
                    if (['bag', 'packet', 'envelope', 'chest'].some(s => className.includes(s))) detectedRiskCategories.add('PACKAGING');
                    if (['pill', 'capsule', 'tablet', 'powder', 'flour', 'dough', 'mushroom', 'broccoli'].some(s => className.includes(s))) detectedRiskCategories.add('SUBSTANCE');
                    
                    detectedItems.push(`${className} (${Math.round(probability * 100)}%)`);
                    matchFound = true;
                    // Break loop to avoid double counting "hypodermic syringe" as "hypodermic" and "syringe"
                    break; 
                }
            }

            // Record generic items if high confidence, just for the report
            if (!matchFound && probability > 0.4) {
                 detectedItems.push(className);
            }
        });

        // --- SCENE CLUSTERING LOGIC ---
        // A single item might be innocent. A cluster of categories is guilty.
        // e.g., "Scale" (Equipment) + "Bag" (Packaging) + "Flour" (Substance Proxy) = Trafficking
        
        const categoryCount = detectedRiskCategories.size;
        
        if (categoryCount >= 3) {
            maxRiskScore = Math.max(maxRiskScore, 0.95); // Extremely High Probability of complex scene
            detectedItems.push(`[SCENE DETECTED: ${Array.from(detectedRiskCategories).join('+')}]`);
        } else if (categoryCount === 2) {
            maxRiskScore = Math.max(maxRiskScore, 0.75); // High Probability
             detectedItems.push(`[CLUSTER DETECTED: ${Array.from(detectedRiskCategories).join('+')}]`);
        }

        return { vectorScore: Math.min(maxRiskScore, 1.0), detectedObjects: detectedItems };
    } catch (e) {
        console.error("CNN Error:", e);
        return { vectorScore: 0, detectedObjects: [] };
    }
}

// --- METHODOLOGY: MULTIMODAL FEATURE FUSION ---

interface FusedFeatures {
    nlpVector: number;
    visualVector: number;
    keywords: string[];
    objects: string[];
    combinedVector: number; 
}

/**
 * Feature-Level Fusion Strategy
 * Combines textual features (TF-IDF) and visual features (CNN) into a single feature set.
 */
function fuseFeatures(nlp: { vectorScore: number, keywords: string[] }, visual: { vectorScore: number, detectedObjects: string[] }): FusedFeatures {
    // Dynamic Weighting:
    // If we have a 'smoking gun' visual (e.g., syringe > 0.9), visual takes precedence.
    
    let visualWeight = 0.45;
    let nlpWeight = 0.55;

    if (visual.vectorScore > 0.8) {
        visualWeight = 0.8;
        nlpWeight = 0.2;
    }

    const fusedScore = (nlp.vectorScore * nlpWeight) + (visual.vectorScore * visualWeight);
    
    return {
        nlpVector: nlp.vectorScore,
        visualVector: visual.vectorScore,
        keywords: nlp.keywords,
        objects: visual.detectedObjects,
        combinedVector: fusedScore
    };
}

// --- METHODOLOGY: RISK CLASSIFICATION USING RANDOM FOREST ---

/**
 * Random Forest Classifier
 * An ensemble learning technique using multiple decision trees.
 */
class RandomForestClassifier {
    // Independent decision trees (h1...hN)
    private decisionTrees = [
        // h1(x): Visual-Critical Tree (Prioritizes ImageNet Hits)
        (f: FusedFeatures) => f.visualVector > 0.75 ? RiskLevel.High : (f.visualVector > 0.4 ? RiskLevel.Medium : RiskLevel.Low),
        
        // h2(x): NLP-Critical Tree (Prioritizes Slang)
        (f: FusedFeatures) => f.nlpVector > 0.7 ? RiskLevel.High : (f.nlpVector > 0.35 ? RiskLevel.Medium : RiskLevel.Low),
        
        // h3(x): Fusion Tree (Average weighted score)
        (f: FusedFeatures) => f.combinedVector > 0.6 ? RiskLevel.High : (f.combinedVector > 0.3 ? RiskLevel.Medium : RiskLevel.Low),
        
        // h4(x): Trigger Tree (Specific High Risk Object Check)
        (f: FusedFeatures) => {
             const triggers = ['syringe', 'hypodermic', 'cocaine', 'heroin', 'scale', 'balance beam'];
             // Check visual objects for strings
             const visualTrigger = f.objects.some(obj => triggers.some(t => obj.includes(t)));
             if (visualTrigger) return RiskLevel.High;
             return RiskLevel.Low;
        },

        // h5(x): Scene Context Tree (Looks for Clusters)
        (f: FusedFeatures) => {
            const isCluster = f.objects.some(obj => obj.includes('CLUSTER') || obj.includes('SCENE'));
            if (isCluster) return RiskLevel.High;
            return f.combinedVector > 0.4 ? RiskLevel.Medium : RiskLevel.Low;
        }
    ];

    public predict(features: FusedFeatures): { riskLevel: RiskLevel, confidence: number } {
        // Collect votes from all trees: { h1(x), h2(x), ... }
        const votes = this.decisionTrees.map(tree => tree(features));
        
        // Tally votes
        const voteCounts: Record<string, number> = { [RiskLevel.High]: 0, [RiskLevel.Medium]: 0, [RiskLevel.Low]: 0 };
        votes.forEach(v => voteCounts[v]++);

        // Majority Voting: ŷ = mode { ... }
        let mode = RiskLevel.Low;
        let maxVotes = 0;
        (Object.keys(voteCounts) as RiskLevel[]).forEach(level => {
            if (voteCounts[level] > maxVotes) {
                maxVotes = voteCounts[level];
                mode = level;
            }
        });

        // Calculate Probability Score (Confidence)
        const confidenceScore = (voteCounts[mode] / this.decisionTrees.length) * 100;
        
        return { riskLevel: mode, confidence: Math.round(confidenceScore) };
    }
}

// --- EXPORTED PIPELINE ---

export async function analyzeUserProfile(user: User): Promise<AnalysisResult> {
    // 1. Text Analysis (NLP)
    const combinedText = user.posts.map(p => p.text).join(' ');
    const nlpResult = calculateTFIDF(preprocessText(combinedText));

    // 2. Image Analysis (CNN)
    let maxVisualScore = 0;
    let allDetectedItems: string[] = [];
    for (const post of user.posts) {
        if (post.imageUrl) {
            const cnnResult = await extractCNNFeatures(post.imageUrl);
            // Max pooling strategy for user profile (take the riskiest image)
            if (cnnResult.vectorScore > maxVisualScore) maxVisualScore = cnnResult.vectorScore;
            allDetectedItems.push(...cnnResult.detectedObjects);
        }
    }

    // 3. Feature Fusion (Hu et al.)
    const fusedFeatures = fuseFeatures(nlpResult, { vectorScore: maxVisualScore, detectedObjects: [...new Set(allDetectedItems)] });

    // 4. Random Forest Classification & Risk Categorization
    const forest = new RandomForestClassifier();
    const prediction = forest.predict(fusedFeatures);

    return formatResult(prediction, fusedFeatures);
}

export async function analyzeCustomContent(text: string, platform: SocialPlatform, imageFile?: File): Promise<AnalysisResult> {
    const nlpResult = calculateTFIDF(preprocessText(text));

    let visualResult = { vectorScore: 0, detectedObjects: [] as string[] };
    if (imageFile) {
        const imageUrl = URL.createObjectURL(imageFile);
        visualResult = await extractCNNFeatures(imageUrl);
    }

    const fusedFeatures = fuseFeatures(nlpResult, visualResult);

    const forest = new RandomForestClassifier();
    const prediction = forest.predict(fusedFeatures);

    return formatResult(prediction, fusedFeatures);
}

function formatResult(prediction: { riskLevel: RiskLevel, confidence: number }, features: FusedFeatures): AnalysisResult {
    const visualScore = Math.round(features.visualVector * 100);
    const textScore = Math.round(features.nlpVector * 100);
    
    return {
        riskLevel: prediction.riskLevel,
        riskScore: prediction.confidence,
        summary: `Analysis Complete. Risk Level: ${prediction.riskLevel} (${prediction.confidence}%). Breakdown: [Image Analysis: ${visualScore}/100] | [Text Analysis: ${textScore}/100]. Detected: ${features.objects.slice(0,5).join(', ')}...`,
        textAnalysis: {
            intent: prediction.riskLevel === RiskLevel.High ? 'Trafficking' : (prediction.riskLevel === RiskLevel.Medium ? 'Suspicious' : 'Neutral'),
            score: textScore,
            flaggedKeywords: features.keywords
        },
        visualAnalysis: {
            classification: features.visualVector > 0.6 ? 'High-Risk Visuals' : (features.visualVector > 0.3 ? 'Medium-Risk Visuals' : 'Low-Risk Visuals'),
            score: visualScore,
            detectedItems: features.objects
        }
    };
}
