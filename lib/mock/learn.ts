import type { GlossaryTerm, Lesson, QuizQuestion } from "@/lib/types";

export const GLOSSARY: GlossaryTerm[] = [
  { term: "Bid / Ask", definition: "The highest price a buyer will pay (bid) and the lowest a seller will take (ask). The gap between them is the spread — a real, recurring cost of trading.", tag: "Orders" },
  { term: "Market order", definition: "An order that executes immediately at the best available price. Fast, but you accept whatever the spread gives you.", tag: "Orders" },
  { term: "Limit order", definition: "An order that only executes at your price or better. You control the price, not the timing.", tag: "Orders" },
  { term: "Stop order", definition: "An order that becomes a market order once a trigger price is reached. Commonly used to cap losses — slippage past the trigger is possible.", tag: "Risk" },
  { term: "Position size", definition: "How much of an asset you hold. Sizing decides your risk far more than stock-picking does.", tag: "Risk" },
  { term: "Diversification", definition: "Spreading exposure across uncorrelated assets so one bad outcome cannot define your portfolio.", tag: "Basics" },
  { term: "Volatility", definition: "How much and how fast prices move. Higher volatility means wider swings — and larger potential errors.", tag: "Markets" },
  { term: "Liquidity", definition: "How easily an asset converts to cash without moving its price. Thin books widen spreads and increase slippage.", tag: "Markets" },
  { term: "P&L (unrealised)", definition: "Open profit or loss on a position you still hold, marked to the current (simulated) price.", tag: "Basics" },
  { term: "ETF", definition: "A fund that trades like a single stock, bundling a basket of assets — instant diversification in one ticker.", tag: "Basics" },
  { term: "Order book", definition: "The ladder of resting bids and asks. Depth shows how much is waiting at each price.", tag: "Orders" },
  { term: "Risk-reward ratio", definition: "Potential gain divided by potential loss on a planned trade. Decide it before you enter, not after.", tag: "Risk" },
  { term: "Stablecoin", definition: "A crypto token designed to hold a fixed value. De-pegging risk is real — it is not cash.", tag: "Crypto" },
  { term: "Gas fee", definition: "The network cost of moving a crypto asset. It varies with congestion and is paid regardless of outcome.", tag: "Crypto" },
  { term: "Portfolio weight", definition: "A holding's share of total portfolio value. Concentration is a silent risk multiplier.", tag: "Risk" },
  { term: "Bear / Bull market", definition: "Sustained downtrend vs sustained uptrend. Labels describe direction, not permission to trade.", tag: "Markets" },
];

export const LESSONS: Lesson[] = [
  { id: "l1", title: "Reading a candle chart in 6 minutes", minutes: 6, level: "Beginner", blurb: "Open, high, low, close — and what the wicks are telling you about pressure." },
  { id: "l2", title: "Position sizing: the 1% rule", minutes: 8, level: "Beginner", blurb: "How much to risk per idea so a losing streak never ends the account." },
  { id: "l3", title: "Limit vs market vs stop orders", minutes: 5, level: "Beginner", blurb: "Which order type matches your intent, and what each one costs you." },
  { id: "l4", title: "Building an NGX watchlist", minutes: 10, level: "Intermediate", blurb: "Screening sectors, liquidity and corporate-action timing on the local exchange." },
  { id: "l5", title: "Crypto risk beyond price", minutes: 9, level: "Intermediate", blurb: "Venue risk, custody, fees and volatility — the parts beginners skip." },
  { id: "l6", title: "Journalling your simulated trades", minutes: 7, level: "Intermediate", blurb: "Turning a blotter into feedback: what to record after every fill." },
];

export const RISK_PRINCIPLES = [
  {
    title: "Risk a fixed fraction",
    body: "Decide the maximum loss per idea before entry. Consistent sizing beats clever entry timing.",
    icon: "shield",
  },
  {
    title: "Know your invalidation",
    body: "If the reason for the trade is gone, the position is gone. Write the level down first.",
    icon: "crosshair",
  },
  {
    title: "Mind the spread",
    body: "Every round trip pays the bid-ask. In illiquid names, that cost can exceed the move you hoped for.",
    icon: "activity",
  },
  {
    title: "Concentration compounds risk",
    body: "Five positions in one sector are one bet. Track portfolio weight, not just ticker count.",
    icon: "pie-chart",
  },
];

export const QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "You want to buy MTNN but only at ₦255.00 or less. Which order fits?",
    options: ["Market order", "Limit order at 255.00", "Stop order at 255.00", "Hold the cash"],
    answerIndex: 1,
    explanation: "A limit order caps your price. It may never fill — that is the trade-off.",
  },
  {
    id: "q2",
    question: "The bid is ₦48.85 and the ask is ₦48.95. The spread is…",
    options: ["₦0.10", "10%", "₦48.90", "₦0.01"],
    answerIndex: 0,
    explanation: "Spread = ask − bid = ₦0.10, roughly 0.2% of price — a cost you pay on entry and exit.",
  },
  {
    id: "q3",
    question: "A stop-loss is designed to…",
    options: [
      "Guarantee your exit price",
      "Trigger a market order once a price level is hit",
      "Remove all slippage",
      "Lock in profits tax-free",
    ],
    answerIndex: 1,
    explanation: "It converts to a market order on trigger, so the fill can slip through the level in fast markets.",
  },
  {
    id: "q4",
    question: "Your portfolio is 80% banking stocks. This is mainly a problem of…",
    options: ["Fees", "Concentration risk", "Liquidity", "Currency"],
    answerIndex: 1,
    explanation: "Counting tickers is not diversification — correlated exposure behaves like a single bet.",
  },
  {
    id: "q5",
    question: "In this prototype, where do prices come from?",
    options: [
      "A live exchange feed",
      "Your connected broker account",
      "Local mock data with a simulated random walk",
      "Crowdsourced trader sentiment",
    ],
    answerIndex: 2,
    explanation: "Everything you see is generated locally — no APIs, no real money, no real markets.",
  },
];
