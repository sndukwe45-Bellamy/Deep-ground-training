import Link from "next/link";

export default function Landing() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 py-10">
      <div className="mb-10">
        <div className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
          Deep Ground Training
        </div>
        <h1 className="mt-3 text-4xl font-bold leading-tight">
          Build Your Game. Your Way.
        </h1>
        <p className="mt-4 text-white/70">
          Personalized football training based on your position, time, equipment and goals.
        </p>
      </div>

      <div className="space-y-3">
        <Feature title="Find Your Training" body="Sessions built around your position and level." />
        <Feature title="Train With Your Time" body="15, 30, 45 or 60+ minutes — you choose." />
        <Feature title="Develop Your Game" body="Focused work on the skills that matter to you." />
      </div>

      <div className="mt-auto space-y-3 pt-8">
        <Link
          href="/questionnaire/position"
          className="block rounded-2xl bg-emerald-500 px-5 py-4 text-center text-base font-semibold text-black"
        >
          Start My Training
        </Link>
        <Link
          href="/questionnaire/position-finder"
          className="block rounded-2xl bg-white/5 px-5 py-4 text-center text-base font-semibold text-white"
        >
          I'm not sure what position suits me
        </Link>
      </div>
    </main>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="font-semibold">{title}</div>
      <div className="mt-1 text-sm text-white/60">{body}</div>
    </div>
  );
}
