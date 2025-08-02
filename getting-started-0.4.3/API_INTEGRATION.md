# Meeting Agent API Integration Guide

This guide explains how to integrate the Meeting Agent backend with your frontend application.

## 🚀 Quick Start

### 1. Start the API Server

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The API server will be available at `http://localhost:3001`

### 2. Test the API

```bash
# Test with the provided script
node test-api.js

# Or open the HTML frontend example
open frontend-example.html
```

## 📡 API Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "Meeting Agent API",
  "version": "0.4.3",
  "timestamp": "2025-08-02T23:17:40.395Z"
}
```

### Process Meeting
```http
POST /api/process-meeting
```

**Request Body:**
```json
{
  "audioData": "base64_encoded_audio_data_here",
  "meetingId": "meeting-123",
  "participantId": "participant-456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "meetingId": "meeting-123",
    "participantId": "participant-456",
    "transcribedText": "We need to finish the quarterly report by Friday...",
    "extractedTasks": [...],
    "aiCharacter": {
      "id": "632737da-2cbf-4b86-9c54-03aa4615842a",
      "name": "Meeting Assistant 632737da",
      "description": "AI assistant specialized in managing We tasks...",
      "memory": [...],
      "mode": "memory"
    },
    "updatedTasks": [...],
    "processingSummary": {
      "speechToTextConfidence": 0.872,
      "tasksExtracted": 1,
      "characterCreated": true,
      "tasksUpdated": 1
    }
  },
  "timestamp": "2025-08-02T23:17:40.395Z"
}
```

### Get Characters
```http
GET /api/characters
```

### Get Tasks
```http
GET /api/tasks
```

## 🔧 Frontend Integration Examples

### JavaScript/TypeScript

```javascript
class MeetingAgentAPI {
  constructor(baseUrl = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  async checkHealth() {
    const response = await fetch(`${this.baseUrl}/health`);
    return await response.json();
  }

  async processMeeting(meetingData) {
    const response = await fetch(`${this.baseUrl}/api/process-meeting`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(meetingData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

// Usage
const api = new MeetingAgentAPI();

// Process a meeting
const result = await api.processMeeting({
  audioData: 'base64_encoded_audio_data',
  meetingId: 'meeting-123',
  participantId: 'participant-456'
});

console.log('Tasks extracted:', result.data.processingSummary.tasksExtracted);
console.log('AI Character:', result.data.aiCharacter.name);
```

### React Example

```jsx
import React, { useState } from 'react';

function MeetingProcessor() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const processMeeting = async (meetingData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3001/api/process-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(meetingData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={() => processMeeting({
          audioData: 'base64_encoded_audio_data',
          meetingId: 'meeting-123',
          participantId: 'participant-456'
        })}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Process Meeting'}
      </button>

      {error && <div className="error">{error}</div>}
      
      {result && (
        <div className="result">
          <h3>Meeting Processed!</h3>
          <p>Tasks: {result.data.processingSummary.tasksExtracted}</p>
          <p>Character: {result.data.aiCharacter.name}</p>
        </div>
      )}
    </div>
  );
}
```

### Vue.js Example

```vue
<template>
  <div>
    <button @click="processMeeting" :disabled="loading">
      {{ loading ? 'Processing...' : 'Process Meeting' }}
    </button>

    <div v-if="error" class="error">{{ error }}</div>
    
    <div v-if="result" class="result">
      <h3>Meeting Processed!</h3>
      <p>Tasks: {{ result.data.processingSummary.tasksExtracted }}</p>
      <p>Character: {{ result.data.aiCharacter.name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      result: null,
      error: null
    };
  },
  methods: {
    async processMeeting() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch('http://localhost:3001/api/process-meeting', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audioData: 'base64_encoded_audio_data',
            meetingId: 'meeting-123',
            participantId: 'participant-456'
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        this.result = await response.json();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
```

## 🎤 Audio Integration

### Recording Audio in the Browser

```javascript
class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  stopRecording() {
    return new Promise((resolve) => {
      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        const base64Audio = await this.blobToBase64(audioBlob);
        resolve(base64Audio);
      };

      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    });
  }

  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1]; // Remove data URL prefix
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

// Usage
const recorder = new AudioRecorder();
await recorder.startRecording();

// Stop recording after some time
setTimeout(async () => {
  const audioData = await recorder.stopRecording();
  
  // Send to API
  const result = await api.processMeeting({
    audioData,
    meetingId: 'meeting-123',
    participantId: 'participant-456'
  });
}, 5000);
```

## 🔒 Security Considerations

### CORS Configuration
The API server includes CORS middleware, but you may need to configure it for production:

```javascript
// In server.ts
app.use(cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  credentials: true
}));
```

### API Key Management
Store your Inworld API key securely:

```bash
# Development
export INWORLD_API_KEY=your_api_key_here

# Production (use environment variables)
INWORLD_API_KEY=your_api_key_here npm run serve
```

### Rate Limiting
Consider adding rate limiting for production use:

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run serve
```

### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/
COPY .env ./

EXPOSE 3001
CMD ["npm", "run", "serve"]
```

## 📊 Error Handling

The API returns structured error responses:

```javascript
// 400 Bad Request
{
  "error": "Missing required fields: audioData, meetingId, and participantId are required"
}

// 500 Internal Server Error
{
  "error": "Failed to process meeting",
  "message": "Specific error details",
  "timestamp": "2025-08-02T23:17:40.395Z"
}
```

## 🔧 Configuration

### Environment Variables
- `INWORLD_API_KEY`: Your Inworld API key (required)
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)

### API Limits
- Request body size: 50MB (for audio data)
- Processing time: ~3-5 seconds per meeting
- Concurrent requests: Limited by Inworld API rate limits

## 📚 Additional Resources

- [Inworld Runtime Documentation](https://docs.inworld.ai/)
- [Express.js Documentation](https://expressjs.com/)
- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## 🤝 Support

For issues and questions:
1. Check the API health endpoint
2. Review the error messages
3. Ensure your Inworld API key is valid
4. Check the server logs for detailed error information 