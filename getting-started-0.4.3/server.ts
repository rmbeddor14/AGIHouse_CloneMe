import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import {
  GraphBuilder,
  NodeFactory,
  GraphOutputStreamResponseType,
} from '@inworld/runtime/graph';

// Load environment variables
dotenv.config();

// Import the meeting agent node type and interfaces from the original file
import { meetingAgentNodeType } from './index';

// Interfaces
interface MeetingInput {
  audioData: string; // Base64 encoded audio or audio file path
  meetingId: string;
  participantId: string;
}

interface MeetingOutput {
  meetingId: string;
  participantId: string;
  transcribedText: string;
  extractedTasks: Task[];
  aiCharacter: AICharacter;
  updatedTasks: Task[];
  processingSummary: {
    speechToTextConfidence: number;
    tasksExtracted: number;
    characterCreated: boolean;
    tasksUpdated: number;
  };
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  dueDate?: Date;
}

interface AICharacter {
  id: string;
  name: string;
  description: string;
  memory: CharacterMemory[];
  mode: 'llm' | 'memory';
}

interface CharacterMemory {
  id: string;
  type: 'task' | 'conversation' | 'decision';
  content: string;
  timestamp: Date;
  importance: number; // 1-10 scale
}

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increased limit for audio data
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// GRAPH CONSTRUCTION
// ============================================================================

// Create the meeting agent node
const meetingAgentNode = NodeFactory.createCustomNode(
  'meeting-agent-node',
  meetingAgentNodeType,
);

// Build the graph
const graphBuilder = new GraphBuilder()
  .addNode(meetingAgentNode)
  .setStartNode(meetingAgentNode)
  .setEndNode(meetingAgentNode);

// Create executor
const executor = graphBuilder.getExecutor({
  disableRemoteConfig: true,
});

// ============================================================================
// API ROUTES
// ============================================================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'Meeting Agent API',
    version: '0.4.3',
    timestamp: new Date().toISOString()
  });
});

// Main endpoint to process meeting data
app.post('/api/process-meeting', async (req, res) => {
  try {
    const { audioData, meetingId, participantId } = req.body;

    // Validate required fields
    if (!audioData || !meetingId || !participantId) {
      return res.status(400).json({
        error: 'Missing required fields: audioData, meetingId, and participantId are required'
      });
    }

    console.log(`🤖 Processing meeting ${meetingId} for participant ${participantId}`);

    // Prepare meeting input
    const meetingInput: MeetingInput = {
      audioData,
      meetingId,
      participantId,
    };

    // Execute the graph
    const outputStream = await executor.execute(
      JSON.stringify(meetingInput),
      uuidv4()
    );

    // Get the final result
    const result = await outputStream.next();

    if (result.type === GraphOutputStreamResponseType.CUSTOM && result.data) {
      const meetingOutput: MeetingOutput = result.data as MeetingOutput;
      
      console.log(`✅ Meeting ${meetingId} processed successfully`);
      
      res.json({
        success: true,
        data: meetingOutput,
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error('No valid output received from graph execution');
    }

  } catch (error) {
    console.error('❌ Error processing meeting:', error);
    res.status(500).json({
      error: 'Failed to process meeting',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint to get processing status (for long-running operations)
app.get('/api/status/:executionId', (req, res) => {
  const { executionId } = req.params;
  
  // This could be enhanced to track execution status
  res.json({
    executionId,
    status: 'completed', // For now, assuming immediate completion
    timestamp: new Date().toISOString()
  });
});

// Endpoint to get available AI characters (if you want to persist them)
app.get('/api/characters', (req, res) => {
  // This could be enhanced to return stored characters from a database
  res.json({
    characters: [],
    message: 'No characters stored yet. Characters are created per meeting.',
    timestamp: new Date().toISOString()
  });
});

// Endpoint to get task history
app.get('/api/tasks', (req, res) => {
  // This could be enhanced to return stored tasks from a database
  res.json({
    tasks: [],
    message: 'No tasks stored yet. Tasks are processed per meeting.',
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'POST /api/process-meeting',
      'GET /api/status/:executionId',
      'GET /api/characters',
      'GET /api/tasks'
    ],
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message || 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

app.listen(PORT, () => {
  console.log(`🚀 Meeting Agent API Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 API endpoint: http://localhost:${PORT}/api/process-meeting`);
  console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (!process.env.INWORLD_API_KEY) {
    console.warn('⚠️  Warning: INWORLD_API_KEY not set in environment variables');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  executor.cleanupAllExecutions();
  executor.destroy();
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  executor.cleanupAllExecutions();
  executor.destroy();
  process.exit(0);
}); 