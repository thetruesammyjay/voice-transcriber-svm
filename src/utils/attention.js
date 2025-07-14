// Simulated Attention Mechanism for speech processing

export class AttentionMechanism {
  constructor() {
    // Initialize attention parameters
    this.contextWindow = 10; // Number of words to consider for context
    this.attentionWeights = [];
    this.memoryBank = []; // Store previous utterances for context
  }

  // Calculate attention weights for words in a sentence
  calculateAttention(words, context = []) {
    const weights = [];
    const wordImportance = this.getWordImportance();
    
    words.forEach((word, index) => {
      let weight = 0.3; // Base weight
      
      // Increase weight for important word types
      if (wordImportance.highImportance.includes(word.toLowerCase())) {
        weight += 0.4;
      } else if (wordImportance.mediumImportance.includes(word.toLowerCase())) {
        weight += 0.2;
      }
      
      // Position-based attention (beginning and end get more attention)
      if (index === 0 || index === words.length - 1) {
        weight += 0.2;
      }
      
      // Length-based attention (longer words often more important)
      if (word.length > 6) {
        weight += 0.1;
      }
      
      // Context-based attention
      if (context.length > 0) {
        const contextRelevance = this.calculateContextRelevance(word, context);
        weight += contextRelevance * 0.3;
      }
      
      // Normalize weight to be between 0.2 and 1.0
      weight = Math.min(1.0, Math.max(0.2, weight));
      weights.push(weight);
    });
    
    return this.softmax(weights);
  }

  // Softmax normalization for attention weights
  softmax(weights) {
    const expWeights = weights.map(w => Math.exp(w));
    const sumExp = expWeights.reduce((sum, exp) => sum + exp, 0);
    return expWeights.map(exp => exp / sumExp);
  }

  // Calculate relevance to previous context
  calculateContextRelevance(word, context) {
    const contextWords = context.join(' ').toLowerCase().split(' ');
    const wordLower = word.toLowerCase();
    
    // Check if word appears in recent context
    if (contextWords.includes(wordLower)) {
      return 0.8;
    }
    
    // Check for semantic similarity (simplified)
    const semanticGroups = this.getSemanticGroups();
    for (const group of semanticGroups) {
      if (group.includes(wordLower)) {
        const contextOverlap = contextWords.some(cWord => group.includes(cWord));
        if (contextOverlap) return 0.6;
      }
    }
    
    return 0.1;
  }

  // Define word importance categories
  getWordImportance() {
    return {
      highImportance: [
        'important', 'critical', 'urgent', 'problem', 'solution', 'error',
        'success', 'failure', 'meeting', 'deadline', 'project', 'result'
      ],
      mediumImportance: [
        'please', 'thank', 'help', 'question', 'answer', 'information',
        'data', 'report', 'analysis', 'summary', 'detail', 'process'
      ],
      lowImportance: [
        'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
        'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during'
      ]
    };
  }

  // Define semantic word groups for context understanding
  getSemanticGroups() {
    return [
      ['meeting', 'conference', 'call', 'discussion', 'talk'],
      ['project', 'task', 'work', 'job', 'assignment'],
      ['problem', 'issue', 'bug', 'error', 'trouble'],
      ['data', 'information', 'report', 'analysis', 'statistics'],
      ['time', 'schedule', 'deadline', 'date', 'calendar'],
      ['money', 'cost', 'budget', 'price', 'financial']
    ];
  }

  // Update memory bank with new utterance
  updateMemory(utterance) {
    this.memoryBank.push(utterance);
    // Keep only recent context (last 5 utterances)
    if (this.memoryBank.length > 5) {
      this.memoryBank.shift();
    }
  }

  // Get recent context for attention calculation
  getRecentContext(numUtterances = 3) {
    return this.memoryBank.slice(-numUtterances);
  }

  // Advanced attention with multi-head mechanism simulation
  multiHeadAttention(words, numHeads = 3) {
    const headResults = [];
    
    for (let head = 0; head < numHeads; head++) {
      // Each head focuses on different aspects
      let weights;
      switch (head) {
        case 0: // Content head - focuses on content words
          weights = this.calculateContentAttention(words);
          break;
        case 1: // Position head - focuses on positional importance
          weights = this.calculatePositionalAttention(words);
          break;
        case 2: // Context head - focuses on contextual relevance
          weights = this.calculateContextualAttention(words);
          break;
        default:
          weights = this.calculateAttention(words);
      }
      headResults.push(weights);
    }
    
    // Combine multi-head results (average)
    const combinedWeights = [];
    for (let i = 0; i < words.length; i++) {
      const avgWeight = headResults.reduce((sum, head) => sum + head[i], 0) / numHeads;
      combinedWeights.push(avgWeight);
    }
    
    return combinedWeights;
  }

  // Content-focused attention
  calculateContentAttention(words) {
    const stopWords = this.getWordImportance().lowImportance;
    return words.map(word => 
      stopWords.includes(word.toLowerCase()) ? 0.2 : 0.8
    );
  }

  // Position-focused attention
  calculatePositionalAttention(words) {
    return words.map((_, index) => {
      const relativePos = index / (words.length - 1);
      // U-shaped attention - high at beginning and end
      return 0.3 + 0.7 * (Math.abs(relativePos - 0.5) * 2);
    });
  }

  // Context-focused attention
  calculateContextualAttention(words) {
    const context = this.getRecentContext();
    return words.map(word => {
      const relevance = this.calculateContextRelevance(word, context);
      return 0.3 + relevance * 0.7;
    });
  }
}

// Export utility functions
export const attentionUtils = {
  // Visualize attention weights with colors
  getAttentionColor: (weight, opacity = 1) => {
    const intensity = Math.round(weight * 255);
    return `rgba(59, 130, 246, ${weight * opacity})`;
  },

  // Get attention intensity description
  getAttentionDescription: (weight) => {
    if (weight > 0.8) return 'Very High';
    if (weight > 0.6) return 'High';
    if (weight > 0.4) return 'Medium';
    if (weight > 0.2) return 'Low';
    return 'Very Low';
  },

  // Calculate average attention for a sentence
  getAverageAttention: (weights) => {
    return weights.reduce((sum, weight) => sum + weight, 0) / weights.length;
  }
};

export default AttentionMechanism;