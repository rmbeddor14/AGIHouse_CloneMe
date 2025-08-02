# Meeting Agent Backend

A comprehensive meeting assistant backend built with Inworld Runtime that processes speech, extracts tasks, creates AI characters, and manages task updates.

## 🚀 Features

### Core Functionality
- **Speech-to-Text Processing**: Converts meeting audio to text with confidence scoring
- **Task Extraction**: Uses LLM to identify and extract actionable tasks from meeting transcripts
- **AI Character Creation**: Generates specialized AI assistants with memory and different modes
- **Task Management**: Updates and tracks task status, assignments, and priorities
- **Memory System**: Maintains conversation history and task context for AI characters

### AI Character Modes
- **LLM Mode**: Uses language model for task processing and updates
- **Memory Mode**: Leverages stored memory for context-aware task management

## 🏗️ Architecture

The meeting agent uses a single-node graph architecture with the following processing pipeline:

```
Meeting Input → Speech-to-Text → Task Extraction → AI Character Creation → Task Updates → Output
```

### Data Flow
1. **Input**: Meeting audio data, meeting ID, and participant ID
2. **Processing**: Four-step pipeline within a single custom node
3. **Output**: Comprehensive meeting analysis with tasks and AI character

## 📋 Data Models

### Meeting Input
```typescript
interface MeetingInput {
  audioData: string;        // Base64 encoded audio or file path
  meetingId: string;        // Unique meeting identifier
  participantId: string;    // Participant identifier
}
```

### Task Structure
```typescript
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
```

### AI Character
```typescript
interface AICharacter {
  id: string;
  name: string;
  description: string;
  memory: CharacterMemory[];
  mode: 'llm' | 'memory';
}
```

## 🛠️ Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Inworld API key

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your Inworld API key:
   ```bash
   export INWORLD_API_KEY=<your-api-key>
   ```
   
   Or create a `.env` file:
   ```
   INWORLD_API_KEY=<your-api-key>
   ```

### Running the Application
```bash
npm start
```

## 🔧 Configuration

### Environment Variables
- `INWORLD_API_KEY`: Your Inworld API key (required)

### Customization Points

#### Speech-to-Text Integration
Replace the mock implementation in `processSpeechToText()` with:
- Google Speech-to-Text
- Azure Speech Services
- AWS Transcribe
- OpenAI Whisper

#### LLM Integration
Replace the mock task extraction in `extractTasksFromText()` with:
- OpenAI GPT-4
- Anthropic Claude
- Google Gemini

#### Task Keywords
Modify the `taskKeywords` array in `extractTasksFromText()` to match your domain-specific action words.

## 📊 Output Example

```
🤖 Meeting Agent Backend Starting...

📝 Processing meeting speech...

🤖 Processing meeting meeting-123 for participant participant-456
📝 Step 1: Converting speech to text...
   Transcribed: "Let's assign the following tasks: Mike to research competitors, Lisa to draft the proposal, and Tom to set up the demo environment."
   Confidence: 88.4%
🔍 Step 2: Extracting tasks from text...
   Extracted: Task 1 - Let's assign the following tasks: Mike to research competitors, Lisa to draft the proposal, and Tom to set up the demo environment
   Assignee: Mike, Priority: medium
👤 Step 3: Creating AI character...
   Created character: Meeting Assistant 03b3c5bc
   Mode: memory, Memory items: 2
🔄 Step 4: Updating tasks...

✅ Meeting Agent Processing Complete!

📊 Processing Summary:
   Meeting ID: meeting-123
   Participant: participant-456
   Speech-to-Text Confidence: 88.4%
   Tasks Extracted: 1
   Character Created: true
   Tasks Updated: 1

👤 AI Character:
   Name: Meeting Assistant 03b3c5bc
   Description: AI assistant specialized in managing Let's tasks from meeting discussions.
   Mode: memory
   Memory Items: 2

📋 Final Task Summary:
   1. Task 1
      Description: Let's assign the following tasks: Mike to research competitors, Lisa to draft the proposal, and Tom to set up the demo environment
      Assignee: Mike
      Priority: medium
      Status: pending

🎉 Meeting Agent Backend finished successfully!
```

## 🔮 Future Enhancements

### Planned Features
- **Multi-participant Support**: Handle multiple speakers in meetings
- **Real-time Processing**: Stream audio for live meeting assistance
- **Task Dependencies**: Support for complex task relationships
- **Integration APIs**: Connect with project management tools
- **Advanced Memory**: Implement long-term memory and learning
- **Custom Character Types**: Specialized assistants for different meeting types

### Integration Possibilities
- **Calendar Systems**: Schedule follow-up meetings automatically
- **Project Management**: Sync with Jira, Asana, or Trello
- **Communication Platforms**: Integrate with Slack, Teams, or Discord
- **Document Management**: Link tasks to relevant documents
- **Analytics**: Track meeting productivity and task completion rates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

Built with ❤️ using Inworld Runtime
