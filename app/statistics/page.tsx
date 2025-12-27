import BurgerMenu from "@/components/BurgerMenu";

export default function StatisticsPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-4 transition-colors dark:bg-zinc-950">
      <BurgerMenu />
      <header className="mb-12 text-center">
        <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white md:text-7xl">
          TRUCO<span className="text-blue-600">PRO</span>
        </h1>
      </header>
      <main className="w-full max-w-lg text-center">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-white">
            Statistics
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">To be implemented</p>
        </div>
      </main>
    </div>
  );
}
