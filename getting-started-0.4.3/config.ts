/*
 * Meeting Agent Configuration
 * Centralized settings for customizing the meeting agent behavior
 */

export interface MeetingAgentConfig {
  // Speech-to-Text settings
  speechToText: {
    confidenceThreshold: number;
    processingDelayMs: number;
    mockTranscriptions: string[];
  };
  
  // Task extraction settings
  taskExtraction: {
    processingDelayMs: number;
    taskKeywords: string[];
    highPriorityWords: string[];
    lowPriorityWords: string[];
    assigneeNames: string[];
  };
  
  // AI Character settings
  aiCharacter: {
    creationDelayMs: number;
    defaultMode: 'llm' | 'memory';
    memoryImportanceScale: {
      high: number;
      medium: number;
      low: number;
    };
  };
  
  // Task management settings
  taskManagement: {
    updateDelayMs: number;
    llmModeUpdateProbability: number;
    memoryModeUpdateProbability: number;
    completionProbability: number;
  };
  
  // Output settings
  output: {
    enableDetailedLogging: boolean;
    showProcessingSteps: boolean;
    includeTimestamps: boolean;
  };
}

export const defaultConfig: MeetingAgentConfig = {
  speechToText: {
    confidenceThreshold: 0.8,
    processingDelayMs: 1000,
    mockTranscriptions: [
      "We need to finish the quarterly report by Friday and schedule a follow-up meeting with the marketing team.",
      "John will handle the budget review, Sarah should contact the client about the project timeline, and I'll prepare the presentation slides.",
      "The main action items are: update the website content, review the new feature requirements, and coordinate with the design team.",
      "Let's assign the following tasks: Mike to research competitors, Lisa to draft the proposal, and Tom to set up the demo environment.",
      "The urgent items for this week are: complete the security audit, finalize the Q4 budget, and schedule the team retrospective.",
      "Our priorities for next sprint: implement the new feature, update documentation, and conduct user testing.",
      "Action items from this meeting: schedule the client demo, prepare the budget proposal, and coordinate with the development team."
    ],
  },
  
  taskExtraction: {
    processingDelayMs: 1500,
    taskKeywords: [
      'finish', 'schedule', 'handle', 'contact', 'prepare', 'update', 'review', 
      'coordinate', 'assign', 'research', 'draft', 'set up', 'complete', 'finalize',
      'implement', 'conduct', 'organize', 'plan', 'execute', 'deliver'
    ],
    highPriorityWords: [
      'urgent', 'asap', 'critical', 'important', 'deadline', 'finish by', 
      'immediately', 'priority', 'essential'
    ],
    lowPriorityWords: [
      'when possible', 'low priority', 'not urgent', 'sometime', 'eventually',
      'when convenient', 'non-critical'
    ],
    assigneeNames: [
      'John', 'Sarah', 'Mike', 'Lisa', 'Tom', 'Marketing team', 'Design team',
      'Development team', 'QA team', 'Product team', 'Sales team'
    ],
  },
  
  aiCharacter: {
    creationDelayMs: 2000,
    defaultMode: 'memory',
    memoryImportanceScale: {
      high: 9,
      medium: 6,
      low: 3,
    },
  },
  
  taskManagement: {
    updateDelayMs: 1000,
    llmModeUpdateProbability: 0.3,
    memoryModeUpdateProbability: 0.5,
    completionProbability: 0.6,
  },
  
  output: {
    enableDetailedLogging: true,
    showProcessingSteps: true,
    includeTimestamps: true,
  },
};

// Export a function to create custom configs
export function createConfig(overrides: Partial<MeetingAgentConfig>): MeetingAgentConfig {
  return {
    ...defaultConfig,
    ...overrides,
    speechToText: {
      ...defaultConfig.speechToText,
      ...overrides.speechToText,
    },
    taskExtraction: {
      ...defaultConfig.taskExtraction,
      ...overrides.taskExtraction,
    },
    aiCharacter: {
      ...defaultConfig.aiCharacter,
      ...overrides.aiCharacter,
    },
    taskManagement: {
      ...defaultConfig.taskManagement,
      ...overrides.taskManagement,
    },
    output: {
      ...defaultConfig.output,
      ...overrides.output,
    },
  };
}

// Example custom configurations
export const productionConfig = createConfig({
  output: {
    enableDetailedLogging: false,
    showProcessingSteps: false,
    includeTimestamps: true,
  },
  taskManagement: {
    updateDelayMs: 500,
    llmModeUpdateProbability: 0.4,
    memoryModeUpdateProbability: 0.6,
    completionProbability: 0.7,
  },
});

export const developmentConfig = createConfig({
  output: {
    enableDetailedLogging: true,
    showProcessingSteps: true,
    includeTimestamps: true,
  },
  speechToText: {
    processingDelayMs: 500,
  },
  taskExtraction: {
    processingDelayMs: 800,
  },
}); 