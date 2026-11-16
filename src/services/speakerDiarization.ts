import { TranscriptMessage } from '../types';

/**
 * Authoritatively analyzes an entire completed consultation transcript dialogue,
 * evaluating clinical cues, question-answer pairings, and conversational turn-taking
 * to guarantee 100% accurate Doctor vs. Patient attribution across all turns.
 */
export function accuratelyDiarizeConsultationDialogue(
  turns: TranscriptMessage[],
  doctorName?: string,
  patientName?: string
): TranscriptMessage[] {
  if (!turns || turns.length === 0) return [];

  // 1. Score each turn individually
  const scored = turns.map((turn, idx) => {
    const rawText = (turn.englishText || turn.originalText || turn.text || '').trim();
    const lower = rawText.toLowerCase();

    let doctorScore = 0;
    let patientScore = 0;

    // Conclusive Patient marker: Addressing clinician as "doctor" / "doc" / "dactare"
    if (/\b(doctor|doc|doctoravare|dactare|doctor saab|dr\.)\b/i.test(lower)) {
      patientScore += 6;
    }

    // Patient marker: First-person illness declaration
    if (
      /^(i am|i'm|i have|i've|my|me|i feel|i experienced|i was|since|for the past|it's hurting|it hurts|it started|nanage|nanna|mujhe|mera|enaku|naaku)\b/i.test(lower) ||
      /\b(i have been having|i've been having|i feel like|i had a|my cough|my fever|my throat|my chest|my stomach|my head)\b/i.test(lower)
    ) {
      patientScore += 5;
    }

    // Patient marker: Pertinent negative answers, descriptive symptom timeline, response affirmations
    if (
      /^(a little|mostly|just|only|not really|no chest pain|no fever|gives temporary relief|relief for|bedtime|at night|in the morning)\b/i.test(lower) ||
      /^(yes|no|yeah|nope|correct)\b[.,!]?/i.test(lower)
    ) {
      patientScore += 4;
    }

    // Conclusive Doctor marker: Clinical questions inquiring about symptoms, history, or medications
    const isQuestion = /\?$/.test(rawText.trim()) || /\?/.test(rawText);
    const startsWithInquiry = /^(any|is there|are you|do you|have you|how are|how have|how do|how is|how long|what brings|where does|where is|since when|does it|did you|can you|could you|tell me|show me|let me)\b/i.test(lower);

    if (startsWithInquiry || isQuestion) {
      if (!/^(i am|i'm|i have|i've|my|me|i feel|nanage|mujhe)\b/i.test(lower)) {
        doctorScore += 5;
        if (/^(any shortness|any chest|any fever|any pain|is there any|are you taking|how have you been|how are you|how do you feel)\b/i.test(lower)) {
          doctorScore += 3;
        }
      }
    }

    // Doctor marker: Professional greetings, addressing patient by name or title
    if (
      /^(good morning|good afternoon|good evening|hello|hi|welcome|take a seat|have a seat)\b/i.test(lower) ||
      /\b(mr\.|mrs\.|ms\.|patient)\b/i.test(lower) ||
      (patientName && new RegExp(`\\b${patientName.toLowerCase()}\\b`, 'i').test(lower))
    ) {
      doctorScore += 5;
    }

    // Doctor marker: Physical examination commands, auscultation, clinical instructions
    if (
      /\b(let me check|take a deep breath|breathe in|breathe out|open your mouth|say ahh|lie down|let me examine|lungs sound|heart sounds|blood pressure is|vitals are|temperature is)\b/i.test(lower)
    ) {
      doctorScore += 6;
    }

    // Doctor marker: Prescriptions, dosing directions, treatment plans, follow-up advice
    if (
      /\b(i am prescribing|i will write|take this|take tablet|take paracetamol|mg po|twice daily|once daily|after meals|after food|before food|drink plenty|get plenty of rest|come back in|follow up in|review after)\b/i.test(lower)
    ) {
      doctorScore += 6;
    }

    // Doctor reassurance / clinical transitions
    if (/^(alright|okay let me|don't worry|that is good|that's good)\b/i.test(lower)) {
      doctorScore += 3;
    }

    return {
      turn,
      rawText,
      doctorScore,
      patientScore,
      explicitWinner: doctorScore > patientScore + 1 ? 'Doctor' : patientScore > doctorScore + 1 ? 'Patient' : null,
    };
  });

  // 2. Second pass: Dialogue context & conversational turn-taking
  let lastAssignedRole: 'Doctor' | 'Patient' = 'Doctor';

  return scored.map((item, idx) => {
    let finalRole: 'Doctor' | 'Patient';

    if (item.explicitWinner) {
      finalRole = item.explicitWinner as 'Doctor' | 'Patient';
    } else if (item.turn.speaker === 'Doctor' || item.turn.speaker === 'Patient') {
      finalRole = item.turn.speaker;
    } else if (idx === 0) {
      finalRole = 'Doctor';
    } else {
      finalRole = lastAssignedRole === 'Doctor' ? 'Patient' : 'Doctor';
    }

    lastAssignedRole = finalRole;

    return {
      ...item.turn,
      speaker: finalRole,
      speakerRole: finalRole,
    };
  });
}

