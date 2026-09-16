import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import PageHeader from '../components/ui/PageHeader';
import Card, { CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Progress from '../components/ui/Progress';
import { submitTeaching } from '../services/learningApi';
import {
  Users,
  Send,
  Mic,
  Square,
  Timer,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Zap,
  HelpCircle,
  Award,
  ArrowRight
} from 'lucide-react';

const personalities = [
  { name: 'Beginner', emoji: '🌱', description: 'Curious, patient, and needs simple, non-jargon language.', color: 'cyan' },
  { name: 'Confused', emoji: '🤔', description: 'Gets concepts mixed up easily and demands examples.', color: 'teal' },
  { name: 'Technical', emoji: '🧠', description: 'Wants precision, exact formulas, and boundary cases.', color: 'slate' },
  { name: 'Challenging', emoji: '⚡', description: 'Pushes back aggressively on fuzzy or incomplete logic.', color: 'yellow' },
];

export default function TeachFriend() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ topic: '', personality: 'Confused', explanation: '', notes: '' });
  const [phase, setPhase] = useState('setup');
  const [messages, setMessages] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [seconds, setSeconds] = useState(300);
  const [error, setError] = useState('');

  const selectedFriend = personalities.find((item) => item.name === form.personality) || personalities[1];
  const progress = Math.min(100, Math.round((messages.filter((item) => item.role === 'student').length / 3) * 100));

  useEffect(() => {
    if (phase !== 'active' || result) return;
    const timer = window.setInterval(() => setSeconds((v) => Math.max(0, v - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [phase, result]);

  const startSession = (e) => {
    e.preventDefault();
    setError('');
    if (!form.topic.trim()) return setError('Please choose or enter a topic before starting.');
    if (form.notes.trim().length < 30) return setError('Add at least 30 characters of your own study material before starting.');
    setPhase('active');
    setMessages([
      {
        role: 'friend',
        text: `Hey! I'm Anu 👋 (Role: ${form.personality}). Teach me about "${form.topic}" like I'm seeing it for the very first time!`,
      },
    ]);
  };

  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return setError('Voice input is not supported in this browser. Please type your answer.');
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setError('Voice recognition ended. You can continue typing.');
    recognition.onresult = (e) =>
      setForm((curr) => ({ ...curr, explanation: `${curr.explanation} ${e.results[0][0].transcript}`.trim() }));
    recognition.start();
  };

  const sendExplanation = async (e) => {
    e.preventDefault();
    setError('');
    if (form.explanation.trim().length < 15) return setError('Give Anu a bit more detail (at least 15 characters).');

    const studentMessage = form.explanation.trim();
    setMessages((curr) => [...curr, { role: 'student', text: studentMessage }]);
    setForm((curr) => ({ ...curr, explanation: '' }));
    setLoading(true);

    try {
      const response = await submitTeaching({ ...form, explanation: studentMessage });
      setMessages((curr) => [
        ...curr,
        {
          role: 'friend',
          text: response.followUp,
          confusion: (response.report?.clarity || 0) < 65,
        },
      ]);
      if (messages.filter((item) => item.role === 'student').length >= 2) {
        setResult(response);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Anu is processing... Try sending again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (secs) => `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;

  return (
    <AppShell>
      <div className="space-y-8 animate-fade-in">
        <PageHeader
          badge={<Badge variant="cyan" icon={Users}>Feynman Method Roleplay</Badge>}
          title="Teach a Friend (Meet Anu 👋)"
          description="The ultimate test of knowledge: explain your syllabus to Anu in plain english. She will challenge fuzzy explanations!"
        />

        {/* Phase 1: Setup */}
        {phase === 'setup' && (
          <Card hoverEffect={false} className="max-w-3xl">
            <form onSubmit={startSession} className="space-y-6">
              <div>
                <label className="label">What topic will you teach Anu today?</label>
                <input
                  type="text"
                  placeholder="Enter the topic label for your notes"
                  className="input-field"
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                />
              </div>

              <div>
                <label className="label">Choose Anu's Friend Personality</label>
                <div className="grid sm:grid-cols-2 gap-3 mt-2">
                  {personalities.map((item) => (
                    <div
                      key={item.name}
                      onClick={() => setForm({ ...form, personality: item.name })}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex items-start gap-3 ${
                        form.personality === item.name
                          ? 'border-[#218DAE] bg-[#218DAE]/5 ring-2 ring-[#218DAE]/20'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{item.name} Friend</h4>
                        <p className="text-xs text-slate-500 mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="label">Optional Notes Context</label>
                <textarea
                  placeholder="Paste relevant notes or definition to give Anu context..."
                  className="input-field min-h-[100px]"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              {error && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">{error}</div>}

              <Button type="submit" variant="primary" className="w-full py-3.5 text-base shadow-md">
                Enter Teaching Session <Zap size={18} />
              </Button>
            </form>
          </Card>
        )}

        {/* Phase 2: Active Session */}
        {phase === 'active' && !result && (
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Sidebar Monitor */}
            <div className="lg:col-span-4 space-y-4">
              <Card hoverEffect={false} className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#2BBBD7]/20 flex items-center justify-center text-2xl">
                    {selectedFriend.emoji}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-slate-900">Anu 👋</h4>
                    <Badge variant="cyan">{selectedFriend.name} Mode</Badge>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="flex items-center gap-1.5 text-slate-600"><Timer size={14} className="text-[#218DAE]" /> Time Remaining:</span>
                    <span className="font-bold text-slate-900">{formatTime(seconds)}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-600">Teaching Progress:</span>
                    <span className="font-bold text-[#218DAE]">{progress}%</span>
                  </div>
                  <Progress value={progress} variant="cyan" size="sm" />
                </div>
              </Card>

              <Card hoverEffect={false} className="p-5 text-xs text-slate-600 space-y-2">
                <p className="font-bold text-slate-800 mb-1">💡 Feynman Evaluation Rules:</p>
                <p>✓ Start with a 1-sentence simple definition.</p>
                <p>✓ Avoid textbook jargon unless explained.</p>
                <p>✓ Provide a real-life analogy or concrete example.</p>
              </Card>
            </div>

            {/* Chat Room */}
            <div className="lg:col-span-8">
              <Card hoverEffect={false} className="p-0 overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-bold text-xs text-slate-700">Live Session: {form.topic}</span>
                  </div>
                  <Badge variant="yellow">Active Roleplay</Badge>
                </div>

                {/* Messages */}
                <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[380px] bg-slate-50/40">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}>
                      {msg.role === 'friend' && (
                        <div className="w-8 h-8 rounded-full bg-[#2BBBD7]/20 flex items-center justify-center text-sm shrink-0">
                          {selectedFriend.emoji}
                        </div>
                      )}
                      <div
                        className={`p-4 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                          msg.role === 'student'
                            ? 'bg-[#218DAE] text-white rounded-br-none shadow-md'
                            : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <p>{msg.text}</p>
                        {msg.confusion && (
                          <div className="mt-2 pt-2 border-t border-amber-200 text-[11px] font-bold text-amber-700 flex items-center gap-1">
                            <HelpCircle size={13} /> Anu seems slightly confused here!
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                      <span>Anu is listening & thinking...</span>
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <form onSubmit={sendExplanation} className="p-4 border-t border-slate-100 bg-white space-y-3">
                  <div className="relative">
                    <textarea
                      placeholder="Type your explanation to Anu..."
                      className="input-field pr-12 min-h-[90px]"
                      value={form.explanation}
                      onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={toggleVoice}
                      className={`absolute right-3 bottom-3 p-2 rounded-xl border text-slate-500 hover:text-[#218DAE] ${listening ? 'bg-rose-100 border-rose-300 text-rose-600' : 'bg-slate-100 border-slate-200'}`}
                      title="Voice Input"
                    >
                      {listening ? <Square size={16} /> : <Mic size={16} />}
                    </button>
                  </div>

                  {error && <p className="text-xs font-bold text-rose-600">{error}</p>}

                  <div className="flex justify-end">
                    <Button type="submit" loading={loading} icon={Send}>
                      Send Explanation
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </div>
        )}

        {/* Phase 3: Teaching Report */}
        {result && (
          <Card hoverEffect={false} className="max-w-3xl mx-auto p-8 space-y-6">
            <div className="flex items-center justify-between pb-6 border-b border-slate-100">
              <div>
                <Badge variant="cyan">Teaching Mission Complete</Badge>
                <h2 className="font-display font-extrabold text-2xl text-slate-900 mt-1">
                  Anu's Teaching Evaluation Report
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Topic: {form.topic}</p>
              </div>

              <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-[#FFD758]/30 to-[#FCE59A] border border-[#FFD758]">
                <span className="font-display font-black text-3xl text-slate-900 block">
                  {result.report?.overall || 85}
                </span>
                <span className="text-[10px] font-bold text-[#8A6700] uppercase tracking-wider block">Overall Score</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                ['Clarity', result.report?.clarity || 80],
                ['Accuracy', result.report?.accuracy || 85],
                ['Examples', result.report?.examples || 75],
                ['Coverage', result.report?.conceptCoverage || 90],
              ].map(([label, val]) => (
                <div key={label} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-xs text-slate-500 font-semibold block">{label}</span>
                  <span className="font-display font-bold text-lg text-[#218DAE]">{val}/100</span>
                  <Progress value={val} variant="teal" size="sm" className="mt-1" />
                </div>
              ))}
            </div>

            {/* Detailed Feedback */}
            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <h4 className="font-bold text-xs text-emerald-800 uppercase tracking-wider mb-1">What you explained well:</h4>
                <p className="text-xs text-emerald-950 leading-relaxed">{result.feedback || 'Great conceptual clarity and clear breakdown.'}</p>
              </div>

              {result.missingConcepts?.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <h4 className="font-bold text-xs text-amber-800 uppercase tracking-wider mb-1">Concepts missed or fuzzy:</h4>
                  <ul className="text-xs text-amber-950 space-y-1">
                    {result.missingConcepts.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-slate-100">
              <Button onClick={() => { setResult(null); setPhase('setup'); setMessages([]); }} variant="secondary" icon={RotateCcw}>
                Teach Another Topic
              </Button>
              <Button onClick={() => navigate('/boss-battle')} variant="accent" icon={ArrowRight}>
                Fight Boss Arena
              </Button>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
