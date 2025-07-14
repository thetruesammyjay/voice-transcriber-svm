// Audio processing utilities for speech analysis

export const audioProcessor = {
  // Initialize audio context and analyser
  initializeAudioContext: () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    
    // Configure analyser for optimal speech analysis
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.85;
    
    return { audioContext, analyser };
  },

  // Get microphone stream
  getMicrophoneStream: async () => {
    try {
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      return stream;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw new Error('Microphone access denied or not available');
    }
  },

  // Analyze audio frequency data
  analyzeFrequencyData: (analyser) => {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);
    
    // Calculate various audio metrics
    const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
    const peak = Math.max(...dataArray);
    const rms = Math.sqrt(dataArray.reduce((sum, value) => sum + value * value, 0) / bufferLength);
    
    // Detect speech vs silence
    const speechThreshold = 30;
    const isSpeaking = average > speechThreshold;
    
    // Analyze frequency distribution for speech characteristics
    const lowFreq = dataArray.slice(0, bufferLength / 4);
    const midFreq = dataArray.slice(bufferLength / 4, (3 * bufferLength) / 4);
    const highFreq = dataArray.slice((3 * bufferLength) / 4);
    
    const lowEnergy = lowFreq.reduce((sum, val) => sum + val, 0) / lowFreq.length;
    const midEnergy = midFreq.reduce((sum, val) => sum + val, 0) / midFreq.length;
    const highEnergy = highFreq.reduce((sum, val) => sum + val, 0) / highFreq.length;
    
    return {
      average: average / 255,
      peak: peak / 255,
      rms: rms / 255,
      isSpeaking,
      frequencyDistribution: {
        low: lowEnergy / 255,
        mid: midEnergy / 255,
        high: highEnergy / 255
      },
      timestamp: Date.now()
    };
  },

  // Detect voice activity
  detectVoiceActivity: (audioData, threshold = 0.1) => {
    const { average, frequencyDistribution } = audioData;
    
    // Voice typically has more energy in mid frequencies
    const voiceIndicator = (frequencyDistribution.mid * 2 + frequencyDistribution.low) / 3;
    
    return {
      isVoice: average > threshold && voiceIndicator > threshold,
      confidence: Math.min(1, voiceIndicator / threshold),
      quality: audioData.rms > 0.05 ? 'good' : 'poor'
    };
  },

  // Calculate speech characteristics
  calculateSpeechCharacteristics: (audioHistory) => {
    if (audioHistory.length === 0) return null;
    
    const recentData = audioHistory.slice(-10); // Last 10 samples
    const avgVolume = recentData.reduce((sum, data) => sum + data.average, 0) / recentData.length;
    const consistency = 1 - (Math.max(...recentData.map(d => d.average)) - Math.min(...recentData.map(d => d.average)));
    
    // Detect speech patterns
    const speakingFrames = recentData.filter(data => data.isSpeaking).length;
    const speechRatio = speakingFrames / recentData.length;
    
    let speechPattern = 'unknown';
    if (speechRatio > 0.8) speechPattern = 'continuous';
    else if (speechRatio > 0.5) speechPattern = 'intermittent';
    else if (speechRatio > 0.2) speechPattern = 'sparse';
    else speechPattern = 'silent';
    
    return {
      averageVolume: avgVolume,
      consistency,
      speechPattern,
      speechRatio,
      quality: avgVolume > 0.3 && consistency > 0.5 ? 'high' : 'medium'
    };
  }
};

// Audio visualization utilities
export const audioVisualizer = {
  // Create visual representation of audio levels
  generateVisualization: (audioData, width = 100, height = 40) => {
    const { frequencyDistribution } = audioData;
    const bars = [
      { height: frequencyDistribution.low * height, color: '#ef4444' },   // Red for low
      { height: frequencyDistribution.mid * height, color: '#f59e0b' },   // Orange for mid
      { height: frequencyDistribution.high * height, color: '#10b981' }   // Green for high
    ];
    
    return bars;
  },

  // Generate waveform-like visualization
  generateWaveform: (audioHistory, width = 200, height = 50) => {
    const points = audioHistory.map((data, index) => ({
      x: (index / (audioHistory.length - 1)) * width,
      y: height - (data.average * height)
    }));
    
    return points;
  }
};

// Speech quality assessment
export const speechQuality = {
  assessQuality: (audioData, speechCharacteristics) => {
    const { average, rms, frequencyDistribution } = audioData;
    
    let score = 0;
    let factors = [];
    
    // Volume level (optimal range: 0.3 - 0.8)
    if (average >= 0.3 && average <= 0.8) {
      score += 25;
      factors.push('Good volume level');
    } else if (average < 0.1) {
      factors.push('Volume too low');
    } else if (average > 0.9) {
      factors.push('Volume too high');
    }
    
    // Frequency distribution (speech typically mid-heavy)
    if (frequencyDistribution.mid > frequencyDistribution.low && 
        frequencyDistribution.mid > frequencyDistribution.high) {
      score += 25;
      factors.push('Good frequency distribution');
    }
    
    // Consistency
    if (speechCharacteristics && speechCharacteristics.consistency > 0.7) {
      score += 25;
      factors.push('Consistent audio levels');
    }
    
    // RMS (indicates good dynamic range)
    if (rms > 0.1 && rms < 0.8) {
      score += 25;
      factors.push('Good dynamic range');
    }
    
    let qualityLevel = 'poor';
    if (score >= 75) qualityLevel = 'excellent';
    else if (score >= 50) qualityLevel = 'good';
    else if (score >= 25) qualityLevel = 'fair';
    
    return {
      score,
      level: qualityLevel,
      factors,
      recommendations: generateRecommendations(score, factors)
    };
  }
};

// Generate recommendations for improving audio quality
const generateRecommendations = (score, factors) => {
  const recommendations = [];
  
  if (score < 75) {
    if (!factors.includes('Good volume level')) {
      recommendations.push('Adjust microphone distance or system volume');
    }
    if (!factors.includes('Good frequency distribution')) {
      recommendations.push('Check microphone quality and reduce background noise');
    }
    if (!factors.includes('Consistent audio levels')) {
      recommendations.push('Maintain steady speaking volume and distance');
    }
    if (!factors.includes('Good dynamic range')) {
      recommendations.push('Ensure proper microphone settings and audio drivers');
    }
  }
  
  return recommendations;
};

export default {
  audioProcessor,
  audioVisualizer,
  speechQuality
};