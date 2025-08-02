/*
 * Meeting Agent Backend - A comprehensive meeting assistant that processes speech,
 * extracts tasks, creates AI characters, and manages task updates.
 */

import 'dotenv/config';

// Check for required API keys
const apiKey = process.env.INWORLD_API_KEY;
if (!apiKey) {
  throw new Error(
    'INWORLD_API_KEY environment variable is not set! Either add it to .env file in the root of the package or export it to the shell.',
  );
}

import {
  CustomInputDataType,
  CustomOutputDataTypeTyped,
  GraphBuilder,
  GraphOutputStreamResponseType,
  NodeFactory,
  registerCustomNodeType,
} from '@inworld/runtime/graph';
import { v4 } from 'uuid';

// ============================================================================
// DATA TYPES
// ============================================================================

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

// ============================================================================
// MEETING AGENT NODE
// ============================================================================

export const meetingAgentNodeType = registerCustomNodeType(
  'MeetingAgent',
  [CustomInputDataType.TEXT],
  CustomOutputDataTypeTyped<MeetingOutput>(),
  async (context, input) => {
    const meetingInput: MeetingInput = JSON.parse(input);
    
    console.log(`🤖 Processing meeting ${meetingInput.meetingId} for participant ${meetingInput.participantId}`);
    
    // Step 1: Speech-to-Text Processing
    console.log('📝 Step 1: Converting speech to text...');
    const { transcribedText, confidence } = await processSpeechToText(meetingInput.audioData);
    
    // Step 2: Task Extraction using LLM
    console.log('🔍 Step 2: Extracting tasks from text...');
    const extractedTasks = await extractTasksFromText(transcribedText);
    
    // Step 3: Create AI Character
    console.log('👤 Step 3: Creating AI character...');
    const aiCharacter = await createAICharacter(extractedTasks);
    
    // Step 4: Update Tasks
    console.log('🔄 Step 4: Updating tasks...');
    const updatedTasks = await updateTasks(extractedTasks, aiCharacter);
    
    return {
      meetingId: meetingInput.meetingId,
      participantId: meetingInput.participantId,
      transcribedText,
      extractedTasks,
      aiCharacter,
      updatedTasks,
      processingSummary: {
        speechToTextConfidence: confidence,
        tasksExtracted: extractedTasks.length,
        characterCreated: true,
        tasksUpdated: updatedTasks.length,
      },
    };
  },
);

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

async function processSpeechToText(audioData: string): Promise<{ transcribedText: string; confidence: number }> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock transcription - in real implementation, this would integrate with:
  // - Google Speech-to-Text
  // - Azure Speech Services
  // - AWS Transcribe
  // - OpenAI Whisper
  
  const mockTranscriptions = [
    "We need to finish the quarterly report by Friday and schedule a follow-up meeting with the marketing team.",
    "John will handle the budget review, Sarah should contact the client about the project timeline, and I'll prepare the presentation slides.",
    "The main action items are: update the website content, review the new feature requirements, and coordinate with the design team.",
    "Let's assign the following tasks: Mike to research competitors, Lisa to draft the proposal, and Tom to set up the demo environment.",
    "The urgent items for this week are: complete the security audit, finalize the Q4 budget, and schedule the team retrospective."
  ];
  
  const transcribedText = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
  const confidence = 0.85 + Math.random() * 0.1; // 85-95% confidence
  
  console.log(`   Transcribed: "${transcribedText}"`);
  console.log(`   Confidence: ${(confidence * 100).toFixed(1)}%`);
  
  return { transcribedText, confidence };
}

async function extractTasksFromText(text: string): Promise<Task[]> {
  // Simulate LLM processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock task extraction - in real implementation, this would use an LLM API like:
  // - OpenAI GPT-4
  // - Anthropic Claude
  // - Google Gemini
  
  const tasks: Task[] = [];
  const taskKeywords = ['finish', 'schedule', 'handle', 'contact', 'prepare', 'update', 'review', 'coordinate', 'assign', 'research', 'draft', 'set up', 'complete', 'finalize'];
  
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  sentences.forEach((sentence, index) => {
    const hasTaskKeyword = taskKeywords.some(keyword => 
      sentence.toLowerCase().includes(keyword)
    );
    
    if (hasTaskKeyword) {
      const task: Task = {
        id: v4(),
        title: `Task ${index + 1}`,
        description: sentence.trim(),
        assignee: extractAssignee(sentence),
        priority: determinePriority(sentence),
        status: 'pending',
        createdAt: new Date(),
        dueDate: extractDueDate(sentence),
      };
      
      tasks.push(task);
      console.log(`   Extracted: ${task.title} - ${task.description}`);
      console.log(`   Assignee: ${task.assignee}, Priority: ${task.priority}`);
    }
  });
  
  return tasks;
}

function extractAssignee(sentence: string): string {
  const names = ['John', 'Sarah', 'Mike', 'Lisa', 'Tom', 'Marketing team', 'Design team'];
  const foundName = names.find(name => sentence.includes(name));
  return foundName || 'Unassigned';
}

function determinePriority(sentence: string): 'low' | 'medium' | 'high' {
  const highPriorityWords = ['urgent', 'asap', 'critical', 'important', 'deadline', 'finish by'];
  const lowPriorityWords = ['when possible', 'low priority', 'not urgent', 'sometime'];
  
  const lowerSentence = sentence.toLowerCase();
  
  if (highPriorityWords.some(word => lowerSentence.includes(word))) {
    return 'high';
  } else if (lowPriorityWords.some(word => lowerSentence.includes(word))) {
    return 'low';
  }
  
  return 'medium';
}

function extractDueDate(sentence: string): Date | undefined {
  const lowerSentence = sentence.toLowerCase();
  
  if (lowerSentence.includes('friday')) {
    const friday = new Date();
    friday.setDate(friday.getDate() + (5 - friday.getDay() + 7) % 7);
    return friday;
  } else if (lowerSentence.includes('this week')) {
    const endOfWeek = new Date();
    endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
    return endOfWeek;
  }
  
  return undefined;
}

async function createAICharacter(tasks: Task[]): Promise<AICharacter> {
  // Simulate character creation delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const characterId = v4();
  const characterName = `Meeting Assistant ${characterId.slice(0, 8)}`;
  
  // Create character description based on tasks
  const taskTypes = tasks.map(task => task.description.split(' ')[0]).join(', ');
  const description = `AI assistant specialized in managing ${taskTypes} tasks from meeting discussions.`;
  
  // Initialize memory with task context
  const memory: CharacterMemory[] = tasks.map(task => ({
    id: v4(),
    type: 'task',
    content: `Created task: ${task.title} - ${task.description}`,
    timestamp: new Date(),
    importance: task.priority === 'high' ? 9 : task.priority === 'medium' ? 6 : 3,
  }));
  
  // Add conversation memory
  memory.push({
    id: v4(),
    type: 'conversation',
    content: `Meeting processed with ${tasks.length} tasks identified`,
    timestamp: new Date(),
    importance: 7,
  });
  
  const character: AICharacter = {
    id: characterId,
    name: characterName,
    description,
    memory,
    mode: Math.random() > 0.5 ? 'llm' : 'memory',
  };
  
  console.log(`   Created character: ${character.name}`);
  console.log(`   Mode: ${character.mode}, Memory items: ${character.memory.length}`);
  
  return character;
}

async function updateTasks(tasks: Task[], character: AICharacter): Promise<Task[]> {
  // Simulate task update processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const updatedTasks = tasks.map(task => {
    // Simulate some tasks being completed or updated based on character mode
    const updateProbability = character.mode === 'llm' ? 0.3 : 0.5;
    
    if (Math.random() < updateProbability) {
      const newStatus = Math.random() > 0.6 ? 'in-progress' : 'completed';
      const updatedTask = {
        ...task,
        status: newStatus as 'pending' | 'in-progress' | 'completed',
        description: `${task.description} (Updated by ${character.name})`,
      };
      
      console.log(`   Updated: ${task.title} -> ${newStatus}`);
      return updatedTask;
    }
    return task;
  });
  
  return updatedTasks;
}

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
// MAIN EXECUTION
// ============================================================================

main();

async function main() {
  console.log('🤖 Meeting Agent Backend Starting...\n');
  
  // Simulate meeting input
  const meetingInput: MeetingInput = {
    audioData: 'base64_encoded_audio_data_here',
    meetingId: 'meeting-123',
    participantId: 'participant-456',
  };
  
  console.log('📝 Processing meeting speech...\n');
  
  // Execute the graph
  const outputStream = await executor.execute(
    JSON.stringify(meetingInput),
    v4()
  );
  
  // Get the final result
  const result = await outputStream.next();
  
  if (result.type === GraphOutputStreamResponseType.CUSTOM && result.data) {
    const meetingOutput: MeetingOutput = result.data as MeetingOutput;
    
    console.log('\n✅ Meeting Agent Processing Complete!\n');
    console.log('📊 Processing Summary:');
    console.log(`   Meeting ID: ${meetingOutput.meetingId}`);
    console.log(`   Participant: ${meetingOutput.participantId}`);
    console.log(`   Speech-to-Text Confidence: ${(meetingOutput.processingSummary.speechToTextConfidence * 100).toFixed(1)}%`);
    console.log(`   Tasks Extracted: ${meetingOutput.processingSummary.tasksExtracted}`);
    console.log(`   Character Created: ${meetingOutput.processingSummary.characterCreated}`);
    console.log(`   Tasks Updated: ${meetingOutput.processingSummary.tasksUpdated}\n`);
    
    console.log('👤 AI Character:');
    console.log(`   Name: ${meetingOutput.aiCharacter.name}`);
    console.log(`   Description: ${meetingOutput.aiCharacter.description}`);
    console.log(`   Mode: ${meetingOutput.aiCharacter.mode}`);
    console.log(`   Memory Items: ${meetingOutput.aiCharacter.memory.length}\n`);
    
    console.log('📋 Final Task Summary:');
    meetingOutput.updatedTasks.forEach((task, index) => {
      console.log(`   ${index + 1}. ${task.title}`);
      console.log(`      Description: ${task.description}`);
      console.log(`      Assignee: ${task.assignee}`);
      console.log(`      Priority: ${task.priority}`);
      console.log(`      Status: ${task.status}`);
      if (task.dueDate) {
        const dueDate = typeof task.dueDate === 'string' ? new Date(task.dueDate) : task.dueDate;
        console.log(`      Due Date: ${dueDate.toLocaleDateString()}`);
      }
      console.log('');
    });
  }
  
  // Cleanup
  executor.cleanupAllExecutions();
  executor.destroy();
  
  console.log('🎉 Meeting Agent Backend finished successfully!');
}
