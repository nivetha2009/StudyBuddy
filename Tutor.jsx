import { useEffect, useMemo, useRef, useState } from 'react';
import { Copy, Check, RotateCw, Plus, Send, Trash2, MessageSquare } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import Markdown from '../components/Markdown.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorNote from '../components/ErrorNote.jsx';
import MaterialPicker from '../components/MaterialPicker.jsx';
import OptionChips from '../components/OptionChips.jsx';
import { api } from '../services/api.js';
import { useStudy } from '../context/StudyContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { readStore, writeStore } from '../utils/storage.js';
import { cn } from '../utils/cn.js';

const MODES = [
  { value: 'simple', label: 'Explain simply' },
  { value: 'detailed', label: 'Explain in detail' },
  { value: 'example', label: 'Give an example' },
  { value: 'exam', label: 'Exam answer' },
  { value: 'summary', label: 'Summarize' },
  { value: 'quizme', label: 'Ask me questions' }
];

const SUGGESTIONS = [
  'Explain elasticity of demand with an example',
  'What is the difference between mitosis and meiosis?',
  'Summarize the main points of my uploaded material',
  'Give me a 10-mark answer on database normalization'
];

const newConversation = () => ({
  id: `chat-${Date.now()}`,
  title: 'New conversation',
  messages: [],
  updatedAt: new Date().toISOString()
});

export default function Tutor() {
  const { activeMaterialId, recordEvent } = useStudy();
  const toast = useToast();

  const [conversations, setConversations] = useState(() => {
    const saved = readStore('conversations', []);
    return saved.length ? saved : [newConversation()];
  });
  const [currentId, setCurrentId] = useState(() => readStore('conversations', [])[0]?.id || null);
  const [mode, setMode] = useState('simple');
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);

  const scrollRef = useRef(null);

  useEffect(() => writeStore('conversations', conversations.slice(0, 20)), [conversations]);

  const current = useMemo(
    () => conversations.find((conversation) => conversation.id === currentId) || conversations[0],
    [conversations, currentId]
  );

  useEffect(() => {
    if (!currentId && conversations[0]) setCurrentId(conversations[0].id);
  }, [conversations, currentId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [current?.messages.length, busy]);

  const updateCurrent = (updater) => {
    setConversations((list) =>
      list.map((conversation) =>
        conversation.id === current.id
          ? { ...updater(conversation), updatedAt: new Date().toISOString() }
          : conversation
      )
    );
  };

  const send = async (question, { replaceLast = false } = {}) => {
    const trimmed = question.trim();
    if (!trimmed || busy) return;

    setError('');
    setBusy(true);

    const historyBase = replaceLast ? current.messages.slice(0, -1) : current.messages;
    const history = historyBase.map(({ role, content }) => ({ role, content }));

    if (!replaceLast) {
      updateCurrent((conversation) => ({
        ...conversation,
        title: conversation.messages.length ? conversation.title : trimmed.slice(0, 48),
        messages: [...conversation.messages, { role: 'user', content: trimmed }]
      }));
      setInput('');
    } else {
      updateCurrent((conversation) => ({ ...conversation, messages: historyBase }));
    }

    try {
      const data = await api.chat({
        message: trimmed,
        history: replaceLast ? history.slice(0, -1) : history,
        mode,
        materialId: activeMaterialId || undefined
      });

      updateCurrent((conversation) => ({
        ...conversation,
        messages: [...conversation.messages, { role: 'assistant', content: data.answer, mode, question: trimmed }]
      }));
      recordEvent('question');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const regenerate = () => {
    const lastAssistant = [...current.messages].reverse().find((message) => message.role === 'assistant');
    const question = lastAssistant?.question || [...current.messages].reverse().find((m) => m.role === 'user')?.content;
    if (question) send(question, { replaceLast: true });
  };

  const copyAnswer = async (content, index) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1600);
    } catch {
      toast.error('Copying is blocked in this browser. Select the text and copy it manually.');
    }
  };

  const startNew = () => {
    const conversation = newConversation();
    setConversations((list) => [conversation, ...list].slice(0, 20));
    setCurrentId(conversation.id);
  };

  const clearCurrent = () => {
    updateCurrent((conversation) => ({ ...conversation, messages: [], title: 'New conversation' }));
  };

  return (
    <>
      <PageHeader title="AI Tutor" subtitle="Ask a question, then choose how you want it explained.">
        <button onClick={startNew} className="btn btn-secondary btn-sm">
          <Plus size={15} /> New conversation
        </button>
        <button onClick={clearCurrent} className="btn btn-ghost btn-sm" disabled={!current?.messages.length}>
          <Trash2 size={15} /> Clear
        </button>
      </PageHeader>

      <div className="container-page grid gap-6 py-8 lg:grid-cols-[260px,1fr]">
        <aside className="space-y-5">
          <MaterialPicker />

          <div>
            <p className="mb-2 text-[14px] font-semibold text-muted">Conversations</p>
            <ul className="space-y-1">
              {conversations.map((conversation) => (
                <li key={conversation.id}>
                  <button
                    onClick={() => setCurrentId(conversation.id)}
                    className={cn(
                      'flex w-full items-start gap-2 rounded-xl px-3 py-2 text-left text-[15px] transition-colors',
                      conversation.id === current?.id ? 'bg-pen-soft text-pen' : 'text-muted hover:text-ink'
                    )}
                  >
                    <MessageSquare size={15} className="mt-1 shrink-0" />
                    <span className="line-clamp-2">{conversation.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="flex min-h-[70vh] flex-col">
          <div className="mb-4">
            <OptionChips label="Answer style" options={MODES} value={mode} onChange={setMode} />
          </div>

          <div ref={scrollRef} className="scroll-slim card mb-4 flex-1 overflow-y-auto p-5 sm:p-7">
            {!current?.messages.length ? (
              <div className="grid h-full place-items-center text-center">
                <div>
                  <h2 className="font-display text-2xl">What are you studying today?</h2>
                  <p className="mt-2 text-[16px] text-muted">Start with one of these, or type your own question.</p>
                  <div className="mx-auto mt-6 grid max-w-lg gap-2">
                    {SUGGESTIONS.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => send(suggestion)}
                        className="card-quiet px-4 py-3 text-left text-[15px] transition-colors hover:border-pen"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <ul className="space-y-5">
                {current.messages.map((message, index) =>
                  message.role === 'user' ? (
                    <li key={index} className="flex justify-end">
                      <p className="max-w-[85%] rounded-2xl rounded-br-md bg-pen px-4 py-2.5 text-[16px] text-white">
                        {message.content}
                      </p>
                    </li>
                  ) : (
                    <li key={index}>
                      <div className="card-quiet p-5">
                        <Markdown>{message.content}</Markdown>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <button onClick={() => copyAnswer(message.content, index)} className="btn btn-ghost btn-sm">
                          {copiedIndex === index ? <Check size={14} /> : <Copy size={14} />}
                          {copiedIndex === index ? 'Copied' : 'Copy answer'}
                        </button>
                        <button onClick={regenerate} className="btn btn-ghost btn-sm" disabled={busy}>
                          <RotateCw size={14} /> Regenerate
                        </button>
                      </div>
                    </li>
                  )
                )}
                {busy && (
                  <li>
                    <Spinner label="Thinking through your question" />
                  </li>
                )}
              </ul>
            )}
          </div>

          {error && (
            <div className="mb-4">
              <ErrorNote message={error} onRetry={regenerate} />
            </div>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              send(input);
            }}
            className="card flex items-end gap-2 p-2.5"
          >
            <label htmlFor="tutor-input" className="sr-only">
              Ask a question
            </label>
            <textarea
              id="tutor-input"
              rows={1}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask anything from your syllabus. Shift + Enter for a new line."
              className="max-h-40 flex-1 resize-y bg-transparent px-3 py-2 text-[16px] focus:outline-none"
            />
            <button type="submit" className="btn btn-primary" disabled={busy || !input.trim()}>
              <Send size={16} /> Ask
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
