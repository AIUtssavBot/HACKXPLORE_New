import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PromptTemplate } from 'langchain/prompts';
import { StringOutputParser } from 'langchain/schema/output_parser';
import { RunnableSequence } from 'langchain/schema/runnable';
import { Crew, Agent, Task } from 'crewai';

// Initialize OpenAI chat model
const chatModel = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo',
  temperature: 0.7,
});

// Email generation agent
export async function generateSponsorshipEmail(
  eventDetails: {
    title: string;
    description: string;
    date: string;
    venue: string;
    expectedAttendees: number;
    organizingCommittee: string;
  },
  companyDetails: {
    name: string;
    industry: string;
    contactPerson: string;
  }
) {
  const emailPrompt = new PromptTemplate({
    template: `Generate a professional sponsorship email for an event with the following details:

Event Information:
- Title: {title}
- Description: {description}
- Date: {date}
- Venue: {venue}
- Expected Attendees: {expectedAttendees}
- Organizing Committee: {organizingCommittee}

Company Information:
- Company Name: {companyName}
- Industry: {industry}
- Contact Person: {contactPerson}

The email should:
1. Be professional and engaging
2. Highlight the event's value proposition
3. Include sponsorship benefits
4. Have a clear call to action
5. Maintain a formal yet friendly tone`,
    inputVariables: [
      'title',
      'description',
      'date',
      'venue',
      'expectedAttendees',
      'organizingCommittee',
      'companyName',
      'industry',
      'contactPerson',
    ],
  });

  const chain = RunnableSequence.from([
    emailPrompt,
    chatModel,
    new StringOutputParser(),
  ]);

  const response = await chain.invoke({
    ...eventDetails,
    companyName: companyDetails.name,
    industry: companyDetails.industry,
    contactPerson: companyDetails.contactPerson,
  });

  return response;
}

// Content recommendation agent
export async function generateContentRecommendations(eventData: {
  type: string;
  targetAudience: string;
  previousEvents?: any[];
  goals: string[];
}) {
  const marketingAgent = new Agent({
    name: 'Marketing Strategist',
    goal: 'Create effective marketing strategies for events',
    backstory: 'Expert in digital marketing and event promotion',
    allowDelegation: true,
    verbose: true,
  });

  const contentAgent = new Agent({
    name: 'Content Creator',
    goal: 'Generate engaging content ideas and formats',
    backstory: 'Experienced in creating viral content and social media campaigns',
    allowDelegation: true,
    verbose: true,
  });

  const analyticsAgent = new Agent({
    name: 'Analytics Expert',
    goal: 'Analyze data to optimize marketing performance',
    backstory: 'Specialist in marketing analytics and audience insights',
    allowDelegation: true,
    verbose: true,
  });

  const crew = new Crew({
    agents: [marketingAgent, contentAgent, analyticsAgent],
    tasks: [
      new Task({
        description: `Analyze the following event data and provide marketing recommendations:
          - Event Type: ${eventData.type}
          - Target Audience: ${eventData.targetAudience}
          - Goals: ${eventData.goals.join(', ')}
          ${eventData.previousEvents ? `- Previous Events Data: ${JSON.stringify(eventData.previousEvents)}` : ''}
          
          Provide recommendations for:
          1. Content Strategy
          2. Marketing Channels
          3. Engagement Ideas
          4. Performance Metrics`,
        agent: marketingAgent,
      }),
    ],
  });

  const result = await crew.run();
  return result;
}

// Quiz generation agent
export async function generateEventQuiz(
  eventDetails: {
    title: string;
    description: string;
    topics: string[];
  },
  options: {
    difficulty: 'easy' | 'medium' | 'hard';
    questionCount: number;
    includePuzzles: boolean;
  }
) {
  const quizPrompt = new PromptTemplate({
    template: `Create an engaging quiz for an event with the following details:

Event Information:
- Title: {title}
- Description: {description}
- Topics: {topics}

Quiz Requirements:
- Difficulty: {difficulty}
- Number of Questions: {questionCount}
- Include Puzzles: {includePuzzles}

Generate questions that:
1. Are relevant to the event topics
2. Have clear and unambiguous answers
3. Include a mix of formats (MCQ, puzzles if requested)
4. Match the specified difficulty level
5. Include explanations for answers`,
    inputVariables: [
      'title',
      'description',
      'topics',
      'difficulty',
      'questionCount',
      'includePuzzles',
    ],
  });

  const chain = RunnableSequence.from([
    quizPrompt,
    chatModel,
    new StringOutputParser(),
  ]);

  const response = await chain.invoke({
    ...eventDetails,
    topics: eventDetails.topics.join(', '),
    ...options,
    includePuzzles: options.includePuzzles.toString(),
  });

  return JSON.parse(response);
}

// Feedback analysis agent
export async function analyzeFeedback(feedbackData: {
  ratings: number[];
  comments: string[];
  eventType: string;
}) {
  const feedbackPrompt = new PromptTemplate({
    template: `Analyze the following event feedback:

Event Type: {eventType}
Ratings: {ratings}
Comments: {comments}

Provide analysis on:
1. Overall sentiment
2. Key strengths
3. Areas for improvement
4. Actionable recommendations`,
    inputVariables: ['eventType', 'ratings', 'comments'],
  });

  const chain = RunnableSequence.from([
    feedbackPrompt,
    chatModel,
    new StringOutputParser(),
  ]);

  const response = await chain.invoke({
    eventType: feedbackData.eventType,
    ratings: feedbackData.ratings.join(', '),
    comments: feedbackData.comments.join('\n'),
  });

  return response;
} 