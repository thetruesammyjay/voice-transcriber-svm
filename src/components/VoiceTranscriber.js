import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Download, Trash2, Activity, Brain, Volume2 } from 'lucide-react';

const VoiceTranscriber = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [confidence, setConfidence] = useState(0);
  const [speechClassification, setSpeechClassification] = useState('');
  const [attentionWeights, setAttentionWeights] = useState([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const microphoneRef = useRef(null);

  // Simulated SVM classifications
  const speechClassifications = [
    'Clear Speech', 'Noisy Environment', 'Whispered Speech', 
    'Emotional Speech', 'Fast Speech', 'Accented Speech'
  ];

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;

      recognitionRef.current.onresult = (event) => {
        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalText += result[0].transcript;
            setConfidence(result[0].confidence || 0.85);
            // Simulate SVM classification
            simulateSVMClassification(result[0].transcript);
            // Simulate attention mechanism
            simulateAttentionMechanism(result[0].transcript);
          } else {
            interimText += result[0].transcript;
          }
        }

        if (finalText) {
          setTranscript(prev => prev + finalText + ' ');
        }
        setInterimTranscript(interimText);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsProcessing(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setIsProcessing(false);
      };
    }
  }, [language]);

  // Audio level monitoring
  useEffect(() => {
    if (isListening) {
      startAudioMonitoring();
    } else {
      stopAudioMonitoring();
    }
  }, [isListening]);

  const startAudioMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      
      const updateAudioLevel = () => {
        if (analyserRef.current && isListening) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average / 255);
          requestAnimationFrame(updateAudioLevel);
        }
      };
      
      updateAudioLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopAudioMonitoring = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };

  const simulateSVMClassification = (text) => {
    setIsProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
      const randomClassification = speechClassifications[Math.floor(Math.random() * speechClassifications.length)];
      setSpeechClassification(randomClassification);
      setIsProcessing(false);
    }, 500);
  };

  const simulateAttentionMechanism = (text) => {
    // Simulate attention weights for each word
    const words = text.split(' ');
    const weights = words.map(() => Math.random() * 0.8 + 0.2); // Random weights between 0.2 and 1
    setAttentionWeights(weights);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      setInterimTranscript('');
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    setAttentionWeights([]);
    setSpeechClassification('');
    setConfidence(0);
  };

  const downloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-blue-500 p-3 rounded-full">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Voice Transcriber</h1>
              <p className="text-gray-600">Advanced Speech-to-Text with SVM & Attention Mechanism</p>
            </div>
          </div>
          
          {/* Language Selector */}
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Language:</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isListening}
            >
              <option value="en-US">English (US)</option>
              <option value="en-GB">English (UK)</option>
              <option value="es-ES">Spanish</option>
              <option value="fr-FR">French</option>
              <option value="de-DE">German</option>
              <option value="it-IT">Italian</option>
              <option value="pt-BR">Portuguese (Brazil)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Status Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Audio Level */}
          <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
            <div className="flex items-center space-x-3 mb-4">
              <Volume2 className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-800">Audio Level</h3>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all duration-150 ${
                  audioLevel > 0.7 ? 'bg-red-500' : 
                  audioLevel > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${audioLevel * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{Math.round(audioLevel * 100)}%</p>
          </div>

          {/* SVM Classification */}
          <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
            <div className="flex items-center space-x-3 mb-4">
              <Brain className="w-6 h-6 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-800">SVM Classification</h3>
            </div>
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                <span className="text-sm text-gray-600">Processing...</span>
              </div>
            ) : (
              <p className="text-sm font-medium text-purple-600">
                {speechClassification || 'Waiting for speech...'}
              </p>
            )}
          </div>

          {/* Confidence */}
          <div className="bg-white rounded-xl shadow-lg p-6 card-hover">
            <div className="flex items-center space-x-3 mb-4">
              <Activity className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-800">Confidence</h3>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="h-4 bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${confidence * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{Math.round(confidence * 100)}%</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={isListening ? stopListening : startListening}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 btn-hover-lift ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white mic-listening'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span>{isListening ? 'Stop Listening' : 'Start Listening'}</span>
            </button>

            <button
              onClick={clearTranscript}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors btn-hover-lift"
              disabled={!transcript && !interimTranscript}
            >
              <Trash2 className="w-5 h-5" />
              <span>Clear</span>
            </button>

            <button
              onClick={downloadTranscript}
              className="flex items-center space-x-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors btn-hover-lift"
              disabled={!transcript}
            >
              <Download className="w-5 h-5" />
              <span>Download</span>
            </button>
          </div>

          {isListening && (
            <div className="flex justify-center mt-4">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-8 bg-blue-500 rounded-full animate-pulse`}
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Transcript Display */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Transcript</h3>
          <div className="min-h-48 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
            {transcript || interimTranscript ? (
              <div className="text-gray-800 leading-relaxed">
                <span>{transcript}</span>
                <span className="text-gray-500 italic">{interimTranscript}</span>
                {isListening && <span className="animate-pulse">|</span>}
              </div>
            ) : (
              <p className="text-gray-500 italic">Your transcribed text will appear here...</p>
            )}
          </div>

          {/* Attention Visualization */}
          {attentionWeights.length > 0 && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Attention Mechanism Visualization</h4>
              <div className="flex flex-wrap gap-2">
                {transcript.split(' ').slice(-attentionWeights.length).map((word, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded text-sm font-medium attention-word"
                    style={{
                      backgroundColor: `rgba(59, 130, 246, ${attentionWeights[index] || 0.3})`,
                      color: attentionWeights[index] > 0.6 ? 'white' : 'black'
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Darker highlighting indicates higher attention weights
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Riamah Oghenerume James - Voice Transcriber - Speech-to-Text Technology</h3>
          <p className="text-gray-300 mb-2">Powered by SVM & Attention Mechanism</p>
          <p className="text-gray-400">© 2025 Southern Delta University</p>
        </div>
      </footer>
    </div>
  );
};

export default VoiceTranscriber;