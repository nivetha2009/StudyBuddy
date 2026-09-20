import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Shuffle, Layers, ThumbsUp, AlertCircle, Download } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import MaterialPicker from '../components/MaterialPicker.jsx';
import OptionChips from '../components/OptionChips.jsx';
import FlashcardView from '../components/FlashcardView.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorNote from '../components/ErrorNote.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { api } from '../services/api.js';
import { useStudy } from '../context/StudyContext.jsx';
import { readStore, writeStore } from '../utils/storage.js';
import { downloadText, safeFileName } from '../utils/download.js';
import { cn } from '../utils/cn.js';

const COUNTS = [10, 15, 20, 30];

export default function Flashcards() {
  const { activeMaterial, activeMaterialId, recordEvent } = useStudy();

  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(10);
  const [cards, setCards] = useState(() => readStore('flashcards', []));
  const [marks, setMarks] = useState(() => readStore('flashcardMarks', {}));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => writeStore('flashcards', cards), [cards]);
  useEffect(() => writeStore('flashcardMarks', marks), [marks]);

  const visibleCards = useMemo(() => {
    if (filter === 'difficult') return cards.filter((card) => marks[card.id] === 'difficult');
    if (filter === 'easy') return cards.filter((card) => marks[card.id] === 'easy');
    return cards;
  }, [cards, marks, filter]);

  const current = visibleCards[Math.min(index, Math.max(visibleCards.length - 1, 0))];

  useEffect(() => {
    setIndex(0);
    setFlipped(false);
  }, [filter, cards.length]);

  const generate = async () => {
    if (!activeMaterialId && !topic.trim()) {
      setError('Choose an uploaded material or type a topic first.');
      return;
    }

    setError('');
    setBusy(true);
    try {
      const data = await api.flashcards({
        materialId: activeMaterialId || undefined,
        topic: topic.trim() || undefined,
        count
      });
      setCards(data.cards);
      setMarks({});
      setIndex(0);
      setFlipped(false);
      setFilter('all');
      recordEvent('flashcards', data.cards.length);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  };

  const move = (step) => {
    if (!visibleCards.length) return;
    setFlipped(false);
    setIndex((current) => (current + step + visibleCards.length) % visibleCards.length);
  };

  const mark = (value) => {
    if (!current) return;
    setMarks((currentMarks) => ({ ...currentMarks, [current.id]: value }));
    move(1);
  };

  const shuffle = () => {
    setCards((current) => {
      const copy = [...current];
      for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    });
    setIndex(0);
    setFlipped(false);
  };

  const exportCards = () => {
    const content = cards.map((card, cardIndex) => `${cardIndex + 1}. ${card.front}\n   ${card.back}\n`).join('\n');
    downloadText(safeFileName(`${activeMaterial?.name || topic || 'studybuddy'}-flashcards`, 'txt'), content, 'text/plain');
  };

  // Arrow keys move through the deck, space flips the current card.
  useEffect(() => {
    const onKey = (event) => {
      if (event.target.matches('input, textarea, select')) return;
      if (event.key === 'ArrowRight') move(1);
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === ' ') {
        event.preventDefault();
        setFlipped((value) => !value);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const difficultCount = cards.filter((card) => marks[card.id] === 'difficult').length;
  const easyCount = cards.filter((card) => marks[card.id] === 'easy').length;

  return (
    <>
      <PageHeader title="Flashcards" subtitle="Flip, mark, and keep only the cards you keep forgetting." />

      <div className="container-page grid gap-6 py-8 lg:grid-cols-[320px,1fr]">
        <aside className="space-y-5">
          <MaterialPicker />

          <label className="block">
            <span className="mb-2 block text-[14px] font-semibold text-muted">Topic (optional)</span>
            <input
              className="field"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="e.g. Organic chemistry reactions"
            />
          </label>

          <OptionChips
            label="Number of cards"
            options={COUNTS.map(String)}
            value={String(count)}
            onChange={(value) => setCount(Number(value))}
          />

          <button onClick={generate} className="btn btn-primary w-full" disabled={busy}>
            <Layers size={16} /> Generate flashcards
          </button>

          {cards.length > 0 && (
            <>
              <OptionChips
                label="Show"
                options={[
                  { value: 'all', label: `All (${cards.length})` },
                  { value: 'difficult', label: `Difficult (${difficultCount})` },
                  { value: 'easy', label: `Easy (${easyCount})` }
                ]}
                value={filter}
                onChange={setFilter}
              />
              <div className="space-y-2">
                <button onClick={shuffle} className="btn btn-secondary w-full">
                  <Shuffle size={15} /> Shuffle deck
                </button>
                <button onClick={exportCards} className="btn btn-ghost w-full">
                  <Download size={15} /> Download deck
                </button>
              </div>
            </>
          )}
        </aside>

        <section className="space-y-5">
          {error && <ErrorNote message={error} onRetry={generate} />}

          {busy && (
            <div className="card p-6">
              <Spinner label="Building your deck" />
            </div>
          )}

          {!busy && !cards.length && !error && (
            <EmptyState
              icon={Layers}
              title="No cards yet"
              body="Generate a deck from your material, then run through it between classes. Cards you mark difficult stay in rotation."
            />
          )}

          {!busy && cards.length > 0 && !visibleCards.length && (
            <EmptyState
              icon={ThumbsUp}
              title="Nothing in this pile"
              body="You have not marked any cards this way yet. Switch back to all cards."
              actionLabel="Show all cards"
              onAction={() => setFilter('all')}
            />
          )}

          {current && (
            <>
              <FlashcardView card={current} flipped={flipped} onFlip={() => setFlipped((value) => !value)} />

              <div className="flex items-center gap-3">
                <div className="h-2 flex-1 overflow-hidden rounded-pill" style={{ backgroundColor: 'var(--raised)' }}>
                  <div
                    className="h-full rounded-pill bg-pen transition-[width] duration-300"
                    style={{ width: `${((index + 1) / visibleCards.length) * 100}%` }}
                  />
                </div>
                <span className="text-[15px] text-muted">
                  {index + 1} / {visibleCards.length}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                  <button onClick={() => move(-1)} className="btn btn-secondary btn-sm" aria-label="Previous card">
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <button onClick={() => move(1)} className="btn btn-secondary btn-sm" aria-label="Next card">
                    Next <ChevronRight size={16} />
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => mark('easy')}
                    className={cn('btn btn-sm', marks[current.id] === 'easy' ? 'btn-primary' : 'btn-secondary')}
                  >
                    <ThumbsUp size={15} /> Easy
                  </button>
                  <button
                    onClick={() => mark('difficult')}
                    className={cn('btn btn-sm', marks[current.id] === 'difficult' ? 'btn-highlight' : 'btn-secondary')}
                  >
                    <AlertCircle size={15} /> Difficult
                  </button>
                </div>
              </div>

              <p className="text-[14px] text-muted">
                Keyboard: left and right arrows move, space flips the card.
              </p>
            </>
          )}
        </section>
      </div>
    </>
  );
}
