# Voice Transcriber with SVM & Attention Mechanism

An advanced Speech-to-Text application built with React, featuring Support Vector Machine (SVM) classification and Attention Mechanism for enhanced speech recognition and analysis.

## 🚀 Live Demo

**Try it now**: [https://voice-transcriber-svm.vercel.app/](https://voice-transcriber-svm.vercel.app/)

> **Note**: For full functionality, ensure you grant microphone permissions and use a supported browser (Chrome recommended).

## Features

### 🎯 Core Functionality
- **Real-time Speech Recognition**: Uses Web Speech API for instant transcription
- **Multi-language Support**: English (US/UK), Spanish, French, German, Italian, Portuguese
- **SVM Classification**: Intelligent speech pattern classification
- **Attention Mechanism**: Advanced word importance analysis and visualization
- **Audio Quality Monitoring**: Real-time audio level analysis

### 🧠 AI-Powered Features
- **Speech Classification**: Categorizes speech types (Clear, Noisy, Emotional, etc.)
- **Attention Weights**: Visual representation of word importance
- **Confidence Scoring**: Real-time transcription confidence metrics
- **Audio Quality Assessment**: Intelligent audio quality evaluation

### 🎨 Google Material Design
- **Google Color Scheme**: Consistent with Google's design language
- **Responsive Layout**: Optimized for desktop and mobile devices
- **Modern UI Components**: Clean, professional interface
- **Smooth Animations**: Engaging user interactions

### 📊 Analytics & Visualization
- **Real-time Audio Levels**: Visual audio input monitoring
- **Attention Heatmaps**: Color-coded word importance visualization
- **Processing Status**: Live feedback on AI processing
- **Quality Metrics**: Comprehensive audio and speech quality indicators

## Technology Stack

- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS with custom Google-themed colors
- **Icons**: Lucide React
- **Speech Recognition**: Web Speech API
- **Audio Processing**: Web Audio API
- **Deployment**: Vercel-ready configuration

## Quick Start

### 🌐 Use Online (Recommended)
Simply visit [https://voice-transcriber-svm.vercel.app/](https://voice-transcriber-svm.vercel.app/) and start transcribing immediately!

### 💻 Local Development

1. Clone the repository:
```bash
git clone https://github.com/thetruesammyjay/voice-transcriber-svm
cd voice-transcriber-svm
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Basic Transcription
1. Visit [https://voice-transcriber-svm.vercel.app/](https://voice-transcriber-svm.vercel.app/)
2. Select your preferred language from the dropdown
3. Click "Start Listening" to begin transcription
4. Speak clearly into your microphone
5. View real-time transcription results
6. Use "Stop Listening" to end the session

### Advanced Features
- **Monitor Audio Levels**: Watch the real-time audio level indicator
- **View SVM Classification**: See intelligent speech pattern analysis
- **Observe Attention Weights**: Analyze word importance through color-coded visualization
- **Check Confidence Scores**: Monitor transcription accuracy in real-time

### Saving Transcripts
- Click "Download" to save your transcript as a text file
- Use "Clear" to reset the current session

## Project Structure

```
src/
├── components/
│   └── VoiceTranscriber.js    # Main transcription component
├── utils/
│   ├── svm.js                 # SVM classification utilities
│   ├── attention.js           # Attention mechanism implementation
│   └── audio.js               # Audio processing utilities
├── App.js                     # Main application component
├── App.css                    # Component-specific styles
├── index.js                   # Application entry point
└── index.css                  # Global styles with Tailwind
```

## Key Components

### SVM Classification
The application simulates Support Vector Machine classification to categorize speech patterns:
- **Clear Speech**: High-quality, understandable speech
- **Noisy Environment**: Speech with background interference
- **Emotional Speech**: Speech with emotional undertones
- **Fast/Slow Speech**: Rate-based classification
- **Accented Speech**: Non-native speaker detection

### Attention Mechanism
Advanced attention algorithm that:
- Calculates word importance weights
- Provides visual feedback through color intensity
- Considers context and semantic relationships
- Supports multi-head attention simulation

### Audio Processing
Real-time audio analysis including:
- Volume level monitoring
- Frequency distribution analysis
- Voice activity detection
- Quality assessment and recommendations

## Browser Compatibility

- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Partial support (Web Speech API limitations)
- **Edge**: Full support

**Note**: Web Speech API requires HTTPS in production environments. The live demo at [https://voice-transcriber-svm.vercel.app/](https://voice-transcriber-svm.vercel.app/) fully supports HTTPS.

## Deployment

### Vercel Deployment (Current Live Version)
The application is currently deployed on Vercel at: [https://voice-transcriber-svm.vercel.app/](https://voice-transcriber-svm.vercel.app/)

To deploy your own version:
1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Deploy with default settings
4. Ensure HTTPS is enabled for speech recognition

### Environment Setup
No additional environment variables required. The application uses browser APIs exclusively.

## Performance Optimization

- **Efficient State Management**: Optimized React hooks usage
- **Memory Management**: Proper cleanup of audio contexts
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Code Splitting**: Ready for production bundling

## Security Considerations

- **Microphone Permissions**: Proper permission handling
- **Data Privacy**: No speech data sent to external servers
- **Local Processing**: All AI simulations run client-side
- **HTTPS Security**: Deployed with SSL/TLS encryption

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## Links

- **Live Demo**: [https://voice-transcriber-svm.vercel.app/](https://voice-transcriber-svm.vercel.app/)
- **GitHub Repository**: [https://github.com/thetruesammyjay/voice-transcriber-svm](https://github.com/thetruesammyjay/voice-transcriber-svm)
- **Developer**: Samuel Justin Ifiezibe

## Credits

**Developer**: Samuel Justin Ifiezibe  
**Technology**: Speech-to-Text with SVM & Attention Mechanism  
**Year**: 2025

## License

MIT License - see LICENSE file for details.

## Support

For technical support or questions:
- Try the live demo at [https://voice-transcriber-svm.vercel.app/](https://voice-transcriber-svm.vercel.app/)
- Review the documentation above
- Check browser console for error messages
- Ensure microphone permissions are granted
- Verify HTTPS connection for production use

---

*Powered by SVM & Attention Mechanism*  
*© 2025 sammyjayisthename, Inc*
