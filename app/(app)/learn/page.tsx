"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  BookOpen,
  CheckCircle2,
  Crosshair,
  GraduationCap,
  PieChart,
  Search,
  ShieldAlert,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GLOSSARY, LESSONS, QUIZ, RISK_PRINCIPLES } from "@/lib/mock/learn";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ElementType> = {
  shield: ShieldCheck,
  crosshair: Crosshair,
  activity: Activity,
  "pie-chart": PieChart,
};

export default function LearnPage() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string>("All");

  // Quiz state
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const tags = useMemo(() => ["All", ...Array.from(new Set(GLOSSARY.map((g) => g.tag)))], []);

  const terms = useMemo(() => {
    const term = q.trim().toLowerCase();
    return GLOSSARY.filter(
      (g) =>
        (tag === "All" || g.tag === tag) &&
        (!term || g.term.toLowerCase().includes(term) || g.definition.toLowerCase().includes(term)),
    );
  }, [q, tag]);

  const score = useMemo(() => {
    if (!submitted) return null;
    return QUIZ.reduce((s, item) => s + (answers[item.id] === item.answerIndex ? 1 : 0), 0);
  }, [submitted, answers]);

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-white">
            Learn <span className="text-volt">/ risk first</span>
          </h1>
          <p className="text-[11px] text-slate-500">
            Understand the mechanics before you ever risk real capital — this prototype is the
            sandbox.
          </p>
        </div>
        <Badge variant="neon">Academy (demo)</Badge>
      </div>

      {/* How the simulation works */}
      <div className="panel p-4">
        <div className="flex items-center gap-2">
          <ShieldAlert size={14} className="text-alert" />
          <span className="label-caps">How this prototype works</span>
        </div>
        <ol className="mt-3 grid gap-2.5 md:grid-cols-5">
          {[
            { n: "01", t: "Discover", d: "Screen the mock universe by class, sector and move." },
            { n: "02", t: "Analyze", d: "Read simulated candles, depth and time & sales." },
            { n: "03", t: "Simulate", d: "Submit orders to local React state — never a broker." },
            { n: "04", t: "Track", d: "Watch marked-to-market P&L, weights and stress." },
            { n: "05", t: "Review", d: "Journalling, glossary and quiz build the habit." },
          ].map((s) => (
            <li key={s.n} className="rounded-lg border border-white/[0.07] bg-surface-950/60 p-3">
              <span className="num text-[11px] font-black text-volt">{s.n}</span>
              <p className="mt-1 text-[12.5px] font-bold text-white">{s.t}</p>
              <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Risk principles */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {RISK_PRINCIPLES.map((p) => {
          const Icon = ICONS[p.icon] ?? ShieldCheck;
          return (
            <div key={p.title} className="panel p-4">
              <span className="grid h-8 w-8 place-items-center rounded-md border border-neon/30 bg-neon/10 text-neon">
                <Icon size={15} />
              </span>
              <p className="mt-2.5 text-[13px] font-bold text-white">{p.title}</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-slate-400">{p.body}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* Glossary */}
        <div className="panel overflow-hidden">
          <div className="panel-header h-auto flex-wrap gap-2 py-2">
            <span className="label-caps">Glossary</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {tags.map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={cn(
                    "focus-ring h-6 rounded-md border px-2 text-[10px] font-semibold transition-colors",
                    tag === t
                      ? "border-volt/40 bg-volt/12 text-volt"
                      : "border-white/[0.08] text-slate-400 hover:text-slate-200",
                  )}
                >
                  {t}
                </button>
              ))}
              <div className="relative">
                <Search size={11} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search terms…"
                  aria-label="Search glossary"
                  className="focus-ring h-6 w-32 rounded-md border border-white/10 bg-surface-950 pl-6 pr-2 text-[11px] text-plat placeholder:text-slate-500"
                />
              </div>
            </div>
          </div>
          <ul className="max-h-[420px] divide-y divide-white/[0.04] overflow-y-auto">
            {terms.map((g) => (
              <li key={g.term} className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-[12.5px] font-bold text-white">{g.term}</span>
                  <Badge variant="default">{g.tag}</Badge>
                </div>
                <p className="mt-0.5 text-[11.5px] leading-relaxed text-slate-400">{g.definition}</p>
              </li>
            ))}
            {terms.length === 0 && (
              <li className="px-4 py-6 text-center text-xs text-slate-500">No matching term.</li>
            )}
          </ul>
        </div>

        {/* Quiz */}
        <div className="panel overflow-hidden">
          <div className="panel-header">
            <span className="label-caps flex items-center gap-1.5">
              <GraduationCap size={12} className="text-neon" /> Knowledge check
            </span>
            {submitted ? (
              <Badge variant={score! >= 4 ? "bull" : score! >= 3 ? "alert" : "bear"}>
                {score!} / {QUIZ.length}
              </Badge>
            ) : (
              <Badge variant="neon">{QUIZ.length} questions</Badge>
            )}
          </div>

          <div className="max-h-[420px] space-y-3 overflow-y-auto p-4">
            {QUIZ.map((item, qi) => {
              const picked = answers[item.id];
              const correct = submitted && picked === item.answerIndex;
              const wrong = submitted && picked !== undefined && picked !== item.answerIndex;
              return (
                <div key={item.id} className="rounded-lg border border-white/[0.07] bg-surface-950/60 p-3">
                  <p className="flex gap-2 text-[12.5px] font-semibold text-white">
                    <span className="num text-volt">{qi + 1}.</span> {item.question}
                  </p>
                  <div className="mt-2 grid gap-1.5">
                    {item.options.map((opt, oi) => {
                      const isPicked = picked === oi;
                      const isAnswer = item.answerIndex === oi;
                      return (
                        <button
                          key={oi}
                          disabled={submitted}
                          onClick={() =>
                            setAnswers((a) => ({
                              ...a,
                              [item.id]: oi,
                            }))
                          }
                          className={cn(
                            "focus-ring flex items-center justify-between gap-2 rounded-md border px-2.5 py-1.5 text-left text-[11.5px] transition-colors",
                            !submitted &&
                              (isPicked
                                ? "border-volt/50 bg-volt/10 text-white"
                                : "border-white/[0.08] text-slate-400 hover:border-white/25 hover:text-slate-200"),
                            submitted && isAnswer && "border-bull/50 bg-bull/10 text-bull",
                            submitted && wrong && isPicked && "border-bear/50 bg-bear/10 text-bear",
                            submitted && !isAnswer && !isPicked && "border-white/[0.05] text-slate-600",
                          )}
                        >
                          <span>{opt}</span>
                          {submitted && isAnswer && <CheckCircle2 size={13} />}
                          {submitted && wrong && isPicked && <XCircle size={13} />}
                        </button>
                      );
                    })}
                  </div>
                  {submitted && (
                    <p className="mt-2 rounded border border-white/[0.06] bg-white/[0.03] px-2 py-1.5 text-[11px] leading-snug text-slate-400">
                      {item.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-white/[0.06] px-4 py-3">
            <p className="text-[10px] text-slate-600">
              {submitted
                ? score! >= 4
                  ? "Strong grasp of the mechanics — now keep the habit."
                  : "Re-read the glossary rows you missed and try again."
                : "Pick an answer for each question, then submit."}
            </p>
            <div className="flex gap-2">
              {submitted && (
                <Button size="sm" variant="ghost" onClick={resetQuiz}>
                  Retry
                </Button>
              )}
              <Button
                size="sm"
                variant={submitted ? "outline" : "neon"}
                disabled={!submitted && Object.keys(answers).length < QUIZ.length}
                onClick={() => setSubmitted(true)}
              >
                {submitted ? "Scored" : "Submit answers"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons */}
      <div className="panel overflow-hidden">
        <div className="panel-header">
          <span className="label-caps flex items-center gap-1.5">
            <BookOpen size={12} className="text-volt" /> Lesson track
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-600">
            demo curriculum
          </span>
        </div>
        <div className="grid gap-2 p-3 md:grid-cols-2 xl:grid-cols-3">
          {LESSONS.map((l) => (
            <div
              key={l.id}
              className="row-hover rounded-lg border border-white/[0.07] bg-surface-950/60 p-3"
            >
              <div className="flex items-center justify-between">
                <Badge variant={l.level === "Beginner" ? "bull" : "neon"}>{l.level}</Badge>
                <span className="num text-[10px] text-slate-500">{l.minutes} min</span>
              </div>
              <p className="mt-2 text-[13px] font-bold text-white">{l.title}</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-slate-400">{l.blurb}</p>
              <button className="focus-ring mt-2 rounded text-[11px] font-semibold text-volt hover:underline">
                Start lesson (demo) →
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="panel flex items-start gap-3 p-4">
        <ShieldAlert size={16} className="mt-0.5 shrink-0 text-alert" />
        <p className="text-[11.5px] leading-relaxed text-slate-400">
          <span className="font-bold text-alert">Educational prototype only.</span> TradeStream is a
          frontend mock. It does not provide financial advice, analysis, or recommendations, and it
          is connected to no market, broker, bank or wallet. Simulated performance never indicates
          real results. Always do your own research and consider speaking to a licensed adviser
          before investing real money.
        </p>
      </div>
    </motion.div>
  );
}
