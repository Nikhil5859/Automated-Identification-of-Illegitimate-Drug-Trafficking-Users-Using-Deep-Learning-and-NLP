
import React from 'react';

export const DocumentationView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-indigo-400 mb-4">Methodology & Algorithms</h2>
        <p className="text-gray-300 leading-relaxed">
          This system uses a <strong>Multimodal Ensemble Learning Framework</strong> running entirely on the client-side. 
          It integrates Natural Language Processing (NLP) and Computer Vision (CNN) to detect illicit activity.
        </p>
      </div>

      {/* Section 2 */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center mb-4">
            <div className="bg-blue-500/20 p-2 rounded-lg mr-4">
                <span className="text-blue-400 font-mono text-xl">2.0</span>
            </div>
            <h3 className="text-xl font-bold text-white">Text Preprocessing & Feature Extraction (NLP)</h3>
        </div>
        <p className="text-gray-400 mb-4">
            Textual content is processed using NLP techniques to reduce noise and extract features.
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-300 mb-6">
            <li><strong>Tokenization:</strong> Splitting raw text into individual terms.</li>
            <li><strong>Stop-word removal:</strong> Removing common words (e.g., "the", "is") using a predefined set.</li>
            <li><strong>Normalization:</strong> Converting to lowercase and removing punctuation.</li>
        </ul>
        <div className="bg-black/30 p-4 rounded border border-gray-600 font-mono text-sm text-green-400">
            <p className="text-gray-500">// Algorithm: TF-IDF</p>
            <p>TF-IDF(t,d) = TF(t,d) × IDF(t)</p>
            <p className="mt-2 text-gray-400 text-xs">Where TF emphasizes drug-related slang appearing frequently in suspicious messages, and IDF weights rare, specific terms higher.</p>
        </div>
      </div>

      {/* Section 3.3 */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center mb-4">
            <div className="bg-purple-500/20 p-2 rounded-lg mr-4">
                <span className="text-purple-400 font-mono text-xl">3.3</span>
            </div>
            <h3 className="text-xl font-bold text-white">Image Feature Extraction (CNN)</h3>
        </div>
        
        <div className="text-gray-300 space-y-4 leading-relaxed">
            <p>
                In addition to text analysis, image data shared on social media platforms is analyzed using <strong>Convolutional Neural Networks (CNNs)</strong>, following the approaches proposed in multimodal illicit drug detection studies [1], [5].
            </p>
            <p>
                CNNs are effective in extracting spatial and visual features related to illicit drugs, pills, syringes, and drug packaging. CNN architectures consist of convolutional and pooling layers that automatically learn discriminative visual patterns, a technique widely validated in computer vision research [6].
            </p>
            <p>
                The use of CNN-based image analysis enhances detection accuracy by incorporating visual evidence that cannot be captured through text analysis alone.
            </p>
        </div>
      </div>

      {/* Section 3.4 */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center mb-4">
            <div className="bg-orange-500/20 p-2 rounded-lg mr-4">
                <span className="text-orange-400 font-mono text-xl">3.4</span>
            </div>
            <h3 className="text-xl font-bold text-white">Multimodal Feature Fusion</h3>
        </div>
        
        <div className="text-gray-300 space-y-4 leading-relaxed">
             <p>
                Motivated by the multimodal framework introduced by Hu et al. [1], the proposed system integrates textual features extracted using TF–IDF and visual features extracted using CNNs.
            </p>
            <p>
                Unlike transformer-based fusion techniques that involve high computational overhead [1][5], the proposed system adopts a lightweight feature-level fusion strategy, ensuring lower latency and improved scalability. This fusion enables the system to leverage complementary information from both text and images for accurate detection.
            </p>
        </div>
      </div>

      {/* Section 3.5 */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center mb-4">
            <div className="bg-teal-500/20 p-2 rounded-lg mr-4">
                <span className="text-teal-400 font-mono text-xl">3.5</span>
            </div>
            <h3 className="text-xl font-bold text-white">Risk Classification Using Random Forest</h3>
        </div>
        
        <div className="text-gray-300 space-y-4 leading-relaxed mb-6">
            <p>
                The fused multimodal feature set is provided as input to a Random Forest classifier, an ensemble learning technique known for its robustness, interpretability, and ability to handle heterogeneous feature sets [3].
            </p>
            <p>
                Random Forest consists of multiple decision trees, each producing an independent prediction. The final classification output is obtained through majority voting, which is the standard decision mechanism for ensemble classifiers.
            </p>
        </div>

        <div className="bg-black/30 p-4 rounded border border-gray-600 font-mono text-sm text-teal-300 text-center mb-4">
            <p>ŷ = mode &#123; h1(x), h2(x), ... , hN(x) &#125;</p>
        </div>
        
        <div className="text-gray-400 text-sm space-y-2 font-mono bg-gray-900/50 p-4 rounded">
            <p>where:</p>
            <ul className="list-disc pl-5 space-y-1">
                <li><span className="text-white">hi(x)</span> is the prediction of the i-th decision tree</li>
                <li><span className="text-white">N</span> is the total number of trees</li>
                <li><span className="text-white">ŷ</span> is the final predicted class</li>
            </ul>
            <p className="mt-2 pt-2 border-t border-gray-700 text-xs italic">
                This formulation represents a decision function, not a closed-form mathematical equation, which is appropriate for Random Forest–based classification.
            </p>
        </div>
      </div>

      {/* Section 3.6 - Replaced Broken Section */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <div className="flex items-center mb-4">
            <div className="bg-red-500/20 p-2 rounded-lg mr-4">
                <span className="text-red-400 font-mono text-xl">3.6</span>
            </div>
            <h3 className="text-xl font-bold text-white">Risk Scoring Framework</h3>
        </div>
        
        <p className="text-gray-300 leading-relaxed mb-4">
            The system normalizes the output of the ensemble classifier into a 0-100 Confidence Score. This score determines the final risk level assigned to a profile.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <h4 className="text-red-400 font-bold mb-2">High Risk ({'>'}75%)</h4>
                <p className="text-sm text-gray-400">Strong visual evidence of paraphernalia (Syringes, Scales) OR strong intent keywords.</p>
            </div>
            <div className="p-4 bg-orange-900/20 border border-orange-500/30 rounded-lg">
                <h4 className="text-orange-400 font-bold mb-2">Medium Risk (40-75%)</h4>
                <p className="text-sm text-gray-400">Ambiguous visuals (Powder, Plants) combined with suspicious slang.</p>
            </div>
            <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                <h4 className="text-green-400 font-bold mb-2">Low Risk (&lt;40%)</h4>
                <p className="text-sm text-gray-400">Benign content, awareness posts, or lack of significant features.</p>
            </div>
        </div>
      </div>

      {/* References */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-4 border-b border-gray-700 pb-2">Academic References</h3>
          <ul className="space-y-3 text-sm text-gray-500 font-mono">
              <li>[1] Hu, D., et al. "Multimodal detection of illicit drug trafficking on social media." <em>Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)</em>, 2021.</li>
              <li>[2] Zhang, Y., & Chen, X. "Natural Language Processing for Dark Web Market Analysis." <em>IEEE Transactions on Information Forensics and Security</em>, 2020.</li>
              <li>[3] Breiman, L. "Random Forests." <em>Machine Learning</em>, 45(1), 5-32, 2001.</li>
              <li>[4] "MobileNetV2: Inverted Residuals and Linear Bottlenecks." <em>Google AI Research</em>, 2018.</li>
              <li>[5] Li, J., et al. "Deep learning for detecting drug abuse risk behavior in social media." <em>Journal of Biomedical Informatics</em>, 2020.</li>
          </ul>
      </div>
    </div>
  );
};
