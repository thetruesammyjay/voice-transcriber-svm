// Simulated SVM (Support Vector Machine) utilities for speech classification

export const speechFeatures = {
  // Extract basic features from speech text for classification
  extractFeatures: (text) => {
    const words = text.toLowerCase().split(' ');
    const features = {
      wordCount: words.length,
      avgWordLength: words.reduce((sum, word) => sum + word.length, 0) / words.length || 0,
      hasQuestionMarks: (text.match(/\?/g) || []).length,
      hasExclamations: (text.match(/!/g) || []).length,
      speechRate: words.length, // Words per utterance (simplified)
      sentiment: calculateSentiment(words),
      complexity: calculateComplexity(words),
    };
    return features;
  }
};

// Simple sentiment analysis
const calculateSentiment = (words) => {
  const positiveWords = ['good', 'great', 'awesome', 'excellent', 'wonderful', 'amazing', 'fantastic'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'disgusting', 'hate', 'angry'];
  
  let score = 0;
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1;
    if (negativeWords.includes(word)) score -= 1;
  });
  
  return score;
};

// Calculate text complexity
const calculateComplexity = (words) => {
  const complexWords = words.filter(word => word.length > 6);
  return complexWords.length / words.length || 0;
};

// Simulated SVM classifier
export const svmClassifier = {
  classify: (features) => {
    // Simulate SVM decision boundary logic
    const { wordCount, avgWordLength, speechRate, sentiment, complexity } = features;
    
    // Simple rule-based classification (simulating SVM decision)
    if (complexity > 0.3 && avgWordLength > 5) {
      return { type: 'Formal Speech', confidence: 0.85 };
    } else if (speechRate > 10 && sentiment > 0) {
      return { type: 'Excited Speech', confidence: 0.78 };
    } else if (avgWordLength < 4 && wordCount < 5) {
      return { type: 'Casual Speech', confidence: 0.82 };
    } else if (sentiment < 0) {
      return { type: 'Emotional Speech', confidence: 0.76 };
    } else if (speechRate < 3) {
      return { type: 'Slow Speech', confidence: 0.80 };
    } else {
      return { type: 'Normal Speech', confidence: 0.75 };
    }
  },

  // Simulate real-time classification
  classifyRealTime: async (text) => {
    return new Promise((resolve) => {
      // Simulate processing delay
      setTimeout(() => {
        const features = speechFeatures.extractFeatures(text);
        const classification = svmClassifier.classify(features);
        resolve(classification);
      }, Math.random() * 1000 + 500); // 500-1500ms delay
    });
  }
};

// Audio quality assessment
export const audioQualityClassifier = {
  assessQuality: (audioLevel, confidence) => {
    if (audioLevel > 0.8) return 'High Quality';
    if (audioLevel > 0.5 && confidence > 0.7) return 'Good Quality';
    if (audioLevel > 0.3) return 'Moderate Quality';
    return 'Poor Quality';
  }
};

export default {
  speechFeatures,
  svmClassifier,
  audioQualityClassifier
};