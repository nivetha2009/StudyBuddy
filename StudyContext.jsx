import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';
import { readStore, writeStore } from '../utils/storage.js';

const StudyContext = createContext(null);

const DEFAULT_PROGRESS = {
  studentName: 'Student',
  questionsAsked: 0,
  flashcardsCreated: 0,
  notesGenerated: 0,
  quizzes: [], // { id, title, score, total, percentage, seconds, topics: {topic:{correct,total}}, date }
  lastStudyDates: [], // ISO date strings, one per active day
  lastActivity: null
};

export function StudyProvider({ children }) {
  const [materials, setMaterials] = useState([]);
  const [activeMaterialId, setActiveMaterialId] = useState(() => readStore('activeMaterial', null));
  const [aiStatus, setAiStatus] = useState({ demoMode: true, provider: 'demo', model: 'demo' });
  const [progress, setProgress] = useState(() => ({ ...DEFAULT_PROGRESS, ...readStore('progress', {}) }));
  const [quizQueue, setQuizQueue] = useState(() => readStore('quizQueue', null));

  useEffect(() => writeStore('progress', progress), [progress]);
  useEffect(() => writeStore('activeMaterial', activeMaterialId), [activeMaterialId]);
  useEffect(() => writeStore('quizQueue', quizQueue), [quizQueue]);

  const refreshMaterials = useCallback(async () => {
    try {
      const list = await api.listMaterials();
      setMaterials(list || []);
      return list || [];
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    refreshMaterials();
    api
      .aiStatus()
      .then(setAiStatus)
      .catch(() => setAiStatus((current) => ({ ...current, offline: true })));
  }, [refreshMaterials]);

  // Materials live in server memory, so a restart clears them. Drop a stale selection.
  useEffect(() => {
    if (activeMaterialId && materials.length && !materials.some((m) => m.id === activeMaterialId)) {
      setActiveMaterialId(null);
    }
  }, [materials, activeMaterialId]);

  const markStudied = useCallback(() => {
    const today = new Date().toISOString().slice(0, 10);
    setProgress((current) => ({
      ...current,
      lastActivity: new Date().toISOString(),
      lastStudyDates: current.lastStudyDates.includes(today)
        ? current.lastStudyDates
        : [...current.lastStudyDates, today].slice(-120)
    }));
  }, []);

  const recordEvent = useCallback(
    (type, amount = 1) => {
      markStudied();
      setProgress((current) => {
        const keys = {
          question: 'questionsAsked',
          flashcards: 'flashcardsCreated',
          notes: 'notesGenerated'
        };
        const key = keys[type];
        if (!key) return current;
        return { ...current, [key]: (current[key] || 0) + amount };
      });
    },
    [markStudied]
  );

  const recordQuiz = useCallback(
    (result) => {
      markStudied();
      setProgress((current) => ({
        ...current,
        quizzes: [{ ...result, date: new Date().toISOString() }, ...current.quizzes].slice(0, 25)
      }));
    },
    [markStudied]
  );

  const setStudentName = useCallback((studentName) => {
    setProgress((current) => ({ ...current, studentName: studentName || 'Student' }));
  }, []);

  const resetProgress = useCallback(() => setProgress({ ...DEFAULT_PROGRESS }), []);

  const streak = useMemo(() => computeStreak(progress.lastStudyDates), [progress.lastStudyDates]);

  const averageScore = useMemo(() => {
    if (!progress.quizzes.length) return 0;
    const total = progress.quizzes.reduce((sum, quiz) => sum + quiz.percentage, 0);
    return Math.round(total / progress.quizzes.length);
  }, [progress.quizzes]);

  const weakTopics = useMemo(() => computeWeakTopics(progress.quizzes), [progress.quizzes]);

  const activeMaterial = useMemo(
    () => materials.find((material) => material.id === activeMaterialId) || null,
    [materials, activeMaterialId]
  );

  const value = {
    materials,
    activeMaterial,
    activeMaterialId,
    setActiveMaterialId,
    refreshMaterials,
    aiStatus,
    progress,
    streak,
    averageScore,
    weakTopics,
    recordEvent,
    recordQuiz,
    setStudentName,
    resetProgress,
    quizQueue,
    setQuizQueue
  };

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) throw new Error('useStudy must be used inside StudyProvider');
  return context;
}

function computeStreak(dates = []) {
  if (!dates.length) return 0;
  const set = new Set(dates);
  let streak = 0;
  const cursor = new Date();

  // Yesterday still counts if today has no activity yet.
  if (!set.has(cursor.toISOString().slice(0, 10))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!set.has(cursor.toISOString().slice(0, 10))) return 0;
  }

  while (set.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function computeWeakTopics(quizzes = []) {
  const totals = new Map();

  quizzes.forEach((quiz) => {
    Object.entries(quiz.topics || {}).forEach(([topic, stat]) => {
      const existing = totals.get(topic) || { correct: 0, total: 0 };
      totals.set(topic, { correct: existing.correct + stat.correct, total: existing.total + stat.total });
    });
  });

  return [...totals.entries()]
    .map(([topic, stat]) => ({
      topic,
      correct: stat.correct,
      total: stat.total,
      accuracy: Math.round((stat.correct / stat.total) * 100)
    }))
    .filter((item) => item.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 6);
}
