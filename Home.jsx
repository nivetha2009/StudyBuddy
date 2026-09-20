import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Plus,
  Minus,
  MessageSquare,
  FileSearch,
  NotebookPen,
  ListChecks,
  Layers,
  Timer,
  GraduationCap,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import { FEATURES, STEPS, REASONS, TESTIMONIALS, FAQS } from '../data/landing.js';

// Mapped explicitly rather than with a namespace import, so the build only
// bundles the icons actually used.
const FEATURE_ICONS = {
  MessageSquare,
  FileSearch,
  NotebookPen,
  ListChecks,
  Layers,
  Timer,
  GraduationCap,
  TrendingUp
};

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <WhyStudents />
      <StudyTools />
      <Testimonials />
      <Faq />
      <CallToAction />
    </>
  );
}

function Hero() {
  return (
    <section className="ruled border-b">
      <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-[1.05fr,1fr] lg:py-24">
        <div className="animate-rise-in">
          <h1 className="text-[44px] sm:text-[58px] lg:text-[64px]">
            Study smarter.
            <br />
            Understand faster.
            <svg
              viewBox="0 0 420 14"
              className="mt-1 block h-3 w-[min(100%,420px)] text-pen"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 9.5C64 4.2 147 2.6 238 4.4c58 1.1 118 3.4 179 6.1"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="420"
                className="animate-draw-line"
              />
            </svg>
          </h1>

          <p className="mt-6 max-w-lg text-[19px] text-muted">
            Your AI-powered study companion for notes, quizzes, flashcards and exam preparation.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/materials" className="btn btn-primary px-6 py-3 text-base">
              Start studying
            </Link>
            <Link to="/tutor" className="btn btn-secondary px-6 py-3 text-base">
              Try AI Tutor
            </Link>
          </div>

          <p className="mt-5 text-[15px] text-muted">
            Works without an API key in demo mode. Upload a PDF to see it read your own syllabus.
          </p>
        </div>

        <HeroDemo />
      </div>
    </section>
  );
}

/** The hero graphic: a study exchange, shown the way the product actually works. */
function HeroDemo() {
  return (
    <div className="relative animate-rise-in [animation-delay:.12s]">
      <div
        className="absolute -left-4 -top-4 hidden h-full w-full rounded-card border sm:block"
        style={{ backgroundColor: 'var(--raised)' }}
        aria-hidden="true"
      />
      <div className="card relative p-6 sm:p-7">
        <div className="flex items-center gap-2 text-[14px] text-muted">
          <span className="h-2 w-2 rounded-full bg-mint" />
          Reading: Unit 3 — Demand analysis.pdf
        </div>

        <div className="mt-5 flex justify-end">
          <p className="max-w-[80%] rounded-2xl rounded-br-md bg-pen px-4 py-2.5 text-[15px] text-white">
            Explain elasticity of demand simply
          </p>
        </div>

        <div className="mt-4 rounded-2xl rounded-bl-md border p-4" style={{ backgroundColor: 'var(--raised)' }}>
          <p className="text-[13px] font-semibold text-muted">Source: your material — Unit 3</p>
          <p className="mt-2 text-[16px] leading-relaxed">
            It measures how much buyers react when a price changes. Think of a tap: turn it a little, a little water
            comes out.
          </p>
          <ul className="mt-3 space-y-1.5 text-[15px]">
            <li>• Big reaction to a small price change: elastic</li>
            <li>• Small reaction to a big price change: inelastic</li>
          </ul>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
          {['Explain simply', 'Give an example', 'Exam answer', 'Ask me questions'].map((label, index) => (
            <span key={label} className={`chip text-muted ${index === 0 ? 'chip-active' : ''}`}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Features() {
  return (
    <section className="container-page py-16 lg:py-20">
      <SectionHeading
        title="Eight tools, one uploaded file"
        subtitle="Everything below reads the same material, so your notes, questions and flashcards stay consistent with each other."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature) => {
          const Icon = FEATURE_ICONS[feature.icon] || Sparkles;
          return (
            <Link
              key={feature.title}
              to={feature.to}
              className="card group flex flex-col p-5 transition-shadow hover:shadow-lift"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-pen-soft text-pen">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 font-display text-lg">{feature.title}</h3>
              <p className="mt-2 flex-1 text-[15px] text-muted">{feature.body}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-pen">
                Open
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="border-y" style={{ backgroundColor: 'var(--surface)' }}>
      <div className="container-page py-16 lg:py-20">
        <SectionHeading title="How it works" subtitle="Three steps, in order, from a file on your laptop to questions you can answer." />

        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="relative pl-14">
              <span className="absolute left-0 top-0 grid h-10 w-10 place-items-center rounded-full border-2 border-pen font-display text-lg text-pen">
                {index + 1}
              </span>
              <h3 className="font-display text-xl">{step.title}</h3>
              <p className="mt-2 text-[16px] text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function WhyStudents() {
  return (
    <section className="container-page py-16 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[.9fr,1.1fr]">
        <SectionHeading
          title="Why students use it"
          subtitle="Most study tools summarise. This one is built around the thing that actually decides your marks: practice against your own syllabus."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {REASONS.map((reason) => (
            <div key={reason.title} className="card-quiet p-5">
              <h3 className="font-display text-lg">{reason.title}</h3>
              <p className="mt-2 text-[15px] text-muted">{reason.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StudyTools() {
  const rows = [
    ['Explain simply', 'A short, plain-language version with an everyday comparison.'],
    ['Explain in detail', 'Definition, mechanism, why it matters, and the usual misunderstandings.'],
    ['Give an example', 'One worked example solved step by step.'],
    ['Exam answer', 'A model answer laid out the way an examiner marks it.'],
    ['Summarize', 'Five to eight bullets you can revise in two minutes.'],
    ['Ask me questions', 'The tutor stops explaining and starts testing you.']
  ];

  return (
    <section className="border-y" style={{ backgroundColor: 'var(--surface)' }}>
      <div className="container-page py-16 lg:py-20">
        <SectionHeading
          title="Six ways to ask the same question"
          subtitle="Pick the mode that matches what you need right now, without rewriting your question."
        />

        <div className="mt-10 grid gap-x-10 gap-y-5 md:grid-cols-2">
          {rows.map(([title, body]) => (
            <div key={title} className="flex gap-4 border-t pt-5">
              <h3 className="w-40 shrink-0 font-display text-[17px]">{title}</h3>
              <p className="text-[16px] text-muted">{body}</p>
            </div>
          ))}
        </div>

        <Link to="/tutor" className="btn btn-primary mt-10">
          Open the AI Tutor
        </Link>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="container-page py-16 lg:py-20">
      <SectionHeading title="What students say" subtitle="Placeholder reviews written for this demo. Replace them with real ones before you launch." />

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {TESTIMONIALS.map((testimonial) => (
          <figure key={testimonial.name} className="card flex h-full flex-col p-6">
            <blockquote className="flex-1 text-[17px] leading-relaxed">{testimonial.quote}</blockquote>
            <figcaption className="mt-5 border-t pt-4">
              <p className="font-semibold">{testimonial.name}</p>
              <p className="text-[14px] text-muted">{testimonial.detail}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="border-y" style={{ backgroundColor: 'var(--surface)' }}>
      <div className="container-page grid gap-10 py-16 lg:grid-cols-[.8fr,1.2fr] lg:py-20">
        <SectionHeading title="Questions students ask" />

        <div>
          {FAQS.map((faq, index) => {
            const open = openIndex === index;
            return (
              <div key={faq.question} className="border-t last:border-b">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : index)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-4 py-4 text-left"
                >
                  <span className="font-display text-[18px]">{faq.question}</span>
                  {open ? <Minus size={18} className="shrink-0 text-pen" /> : <Plus size={18} className="shrink-0 text-muted" />}
                </button>
                {open && <p className="-mt-1 pb-5 pr-8 text-[16px] text-muted">{faq.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="container-page py-16 lg:py-20">
      <div className="card ruled overflow-hidden px-7 py-12 text-center sm:px-12">
        <h2 className="mx-auto max-w-2xl text-[34px] sm:text-[42px]">Your next exam starts with one upload</h2>
        <p className="mx-auto mt-4 max-w-xl text-[17px] text-muted">
          Drop in a chapter, generate a quiz, and find out in five minutes which parts you actually know.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link to="/materials" className="btn btn-primary px-6 py-3 text-base">
            Start studying
          </Link>
          <Link to="/quiz" className="btn btn-highlight px-6 py-3 text-base">
            Take a quick quiz
          </Link>
        </div>
      </div>
    </section>
  );
}
