import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ messages: [] });
    }

    const messages = await prisma.chatMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Fetch chat messages error:', error);
    return NextResponse.json({ messages: [] });
  }
}

export async function DELETE(request) {
  try {
    const user = await getAuthUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.chatMessage.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ message: 'Chat history cleared.' });
  } catch (error) {
    console.error('Clear chat error:', error);
    return NextResponse.json({ error: 'Failed to clear chat.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getAuthUser(request);
    const body = await request.json();
    const { message, language } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty.' }, { status: 400 });
    }

    const userName = user?.name || 'Student';
    const userDept = user?.department || 'Engineering';
    const userGoal = user?.careerGoal || 'IT';
    const userStreak = user?.streak || 1;
    const prefLang = language || user?.preferredLanguage || 'English';

    // Save user's message if user is authenticated
    if (user) {
      await prisma.chatMessage.create({
        data: {
          userId: user.id,
          role: 'user',
          content: message.trim(),
        },
      });
    }

    // Generate intelligent, friendly, context-aware reply
    let replyText = '';
    const lower = message.toLowerCase();

    // Check optional AI API key in .env (Gemini / OpenAI / Anthropic)
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (geminiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are Buddy, a friendly, encouraging AI learning & career mentor for ${userName}, a ${userDept} engineering student aiming for ${userGoal} careers (Streak: ${userStreak} days).
Language preference: ${prefLang}.
Tone: Warm, encouraging, clear, simple language with occasional light humor, celebrating progress.
Guidelines: Give structured answers with examples and markdown bullet points/code blocks where appropriate. Stay on learning and career topics.
User message: ${message}`,
                    },
                  ],
                },
              ],
            }),
          }
        );
        const data = await geminiRes.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          replyText = data.candidates[0].content.parts[0].text;
        }
      } catch (err) {
        console.error('Gemini call failed, falling back to built-in knowledge base:', err);
      }
    }

    // Fallback context-rich rule & knowledge engine if no API key or external call fails
    if (!replyText) {
      if (lower.includes('explain') || lower.includes('what is') || lower.includes('how does')) {
        if (lower.includes('dsa') || lower.includes('array') || lower.includes('tree') || lower.includes('graph')) {
          replyText = `Hey ${userName}! 🚀 Let's break this down simply:
- **Concept**: Data Structures organize data so computers can read & write efficiently (like books indexed in a library).
- **Time Complexity to remember**: Lookups in HashMaps are $O(1)$, searching sorted arrays with Binary Search is $O(\\log N)$, while nested loops are $O(N^2)$.
- **Hackathon Pro-tip**: Check out the **DSA roadmap** on our Roadmaps page, and watch Abdul Bari or Striver on our YouTube Vault!`;
        } else if (lower.includes('transformer') || lower.includes('ai') || lower.includes('llm') || lower.includes('machine learning')) {
          replyText = `Great question! 🤖 **Transformers & Attention Mechanism** revolutionized AI:
1. **Self-Attention**: Allows models to weigh the importance of different words in a sentence simultaneously (no sequential bottleneck like RNNs).
2. **Encoders & Decoders**: BERT is encoder-only (understands context), GPT is decoder-only (generates next tokens).
3. **Check out our AI / Data Courses**: We have modules covering Regression all the way to RAG and Hugging Face!`;
        } else {
          replyText = `Great question, ${userName}! 💡 Here is the breakdown:
- **Core Idea**: Think of it as breaking a complex problem into smaller modular steps.
- **Why it matters in ${userDept}**: Industry interviewers always look for practical application rather than rote memorization.
- **Next Step**: Would you like a mini-quiz on this, or a code example to test?`;
        }
      } else if (lower.includes('quiz') || lower.includes('test me')) {
        replyText = `Challenge accepted! 🎯 Here is a quick ${userDept} / ${userGoal} check for you:

**Question:** What is the average time complexity of searching an element in a Balanced Binary Search Tree (AVL / Red-Black Tree)?
- A) $O(1)$
- B) $O(N)$
- C) $O(\\log N)$
- D) $O(N \\log N)$

*(Reply with your choice, or head over to the **Interview & Quizzes** page to take full timed quizzes!)*`;
      } else if (lower.includes('roadmap') || lower.includes('career') || lower.includes('suggest')) {
        replyText = `Awesome! Based on your profile (${userDept} student targeting ${userGoal}):
1. **Recommended Roadmap**: ${
          userGoal === 'IT'
            ? '🚀 **Full-Stack Development** or **AI/ML Engineer Roadmap**'
            : `⚙️ **${userDept} Core Track + GATE / PSU Preparation**`
        }
2. **First Milestone**: Master the fundamentals (Core programming + ${userDept} fundamentals)
3. **Next Milestone**: Build 2 capstone projects with Git documentation.
Check out the **Interactive Roadmaps** tab above to track each node!`;
      } else if (lower.includes('resume')) {
        replyText = `I'd love to help with your resume! 📄
- **Pro-Tip**: Use the Google XYZ formula: *"Accomplished [X], as measured by [Y], by doing [Z]"*.
- Head to our **Resume Maker** to generate ATS-friendly freshers' formats, or upload your current PDF to the **Resume Analyser** to get your instant ATS score!`;
      } else if (lower.includes('mock') || lower.includes('interview')) {
        replyText = `Ready for mock mode! 🎙️ 
Let's practice the classic opener:
*"Tell me about yourself, your department background in ${userDept}, and the project you're most proud of."*
Give me a 3-4 sentence pitch and I'll score your structure and impact!`;
      } else {
        replyText = `Hey ${userName}! 👋 I'm Buddy, your AI career and learning buddy!
You're on a **${userStreak}-day streak** 🔥. 
How can I help you today?
- 📚 Explain a concept (Programming, AI, Maths, or ${userDept} Core)
- 📝 Quiz you or run a mock interview
- 🗺️ Recommend a step-by-step career roadmap
- 📄 Optimize your resume for ATS screening`;
      }
    }

    // Save assistant reply
    if (user) {
      await prisma.chatMessage.create({
        data: {
          userId: user.id,
          role: 'assistant',
          content: replyText,
        },
      });
    }

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { reply: "I'm having a brief hiccup connecting to my knowledge base. Please try asking again in a moment!" },
      { status: 500 }
    );
  }
}
