import Link from "next/link";

export default function PlayerHomePage() {
  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#24302A]">
      <div className="mx-auto min-h-screen max-w-6xl px-6 py-8 sm:px-10">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#DCE3DD] pb-6">
          <Link
            href="/player"
            className="flex items-center gap-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DCE9DF] text-2xl">
              🧠
            </div>

            <span className="text-xl font-semibold tracking-tight">
              Memory & Puzzle
            </span>
          </Link>

          <Link
            href="/player/settings"
            className="flex min-h-12 items-center gap-2 rounded-xl px-4 text-base font-semibold text-[#315C43] hover:bg-[#E8EFE9] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
          >
            <span>⚙️</span>
            <span className="hidden sm:inline">Settings</span>
          </Link>
        </header>

        {/* Welcome */}
        <section className="py-10 sm:py-14">
          <div className="max-w-3xl">
            <p className="text-lg font-semibold text-[#557461]">
              Good morning!
            </p>

            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
              Ready for today&apos;s activities?
            </h1>

            <p className="mt-4 text-xl leading-8 text-[#68736D]">
              Choose an activity below. Take your time and enjoy yourself.
            </p>
          </div>
        </section>

        {/* Activities */}
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Today&apos;s Activities
            </h2>

            <span className="rounded-full bg-[#E5EFE7] px-4 py-2 text-sm font-semibold text-[#315C43]">
              3 activities
            </span>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {/* Memory Match */}
            <div className="flex flex-col rounded-[2rem] border border-[#DCE3DD] bg-white p-6 shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDF4EE] text-3xl">
                🧠
              </div>

              <h3 className="mt-5 text-2xl font-bold">
                Memory Match
              </h3>

              <p className="mt-2 flex-1 text-lg leading-7 text-[#68736D]">
                Match the cards that belong together.
              </p>

              <div className="mt-5 flex items-center gap-2 text-base font-semibold text-[#557461]">
                <span>⏱</span>
                <span>About 5 minutes</span>
              </div>

              <Link
                href="/player/games/memory-match"
                className="mt-6 flex min-h-16 items-center justify-center rounded-2xl bg-[#315C43] px-5 text-lg font-bold text-white transition hover:bg-[#274C36] focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
              >
                Start Activity
              </Link>
            </div>

            {/* Picture Recall */}
            <div className="flex flex-col rounded-[2rem] border border-[#DCE3DD] bg-white p-6 shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDF4EE] text-3xl">
                🖼️
              </div>

              <h3 className="mt-5 text-2xl font-bold">
                Picture Recall
              </h3>

              <p className="mt-2 flex-1 text-lg leading-7 text-[#68736D]">
                Look at some pictures and see what you remember.
              </p>

              <div className="mt-5 flex items-center gap-2 text-base font-semibold text-[#557461]">
                <span>⏱</span>
                <span>About 5 minutes</span>
              </div>

              <Link
                href="/player/games/picture-recall"
                className="mt-6 flex min-h-16 items-center justify-center rounded-2xl bg-[#315C43] px-5 text-lg font-bold text-white transition hover:bg-[#274C36] focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
              >
                Start Activity
              </Link>
            </div>

            {/* Sequence */}
            <div className="flex flex-col rounded-[2rem] border border-[#DCE3DD] bg-white p-6 shadow-sm">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDF4EE] text-3xl">
                🔢
              </div>

              <h3 className="mt-5 text-2xl font-bold">
                Sequence
              </h3>

              <p className="mt-2 flex-1 text-lg leading-7 text-[#68736D]">
                Remember a sequence and repeat it back.
              </p>

              <div className="mt-5 flex items-center gap-2 text-base font-semibold text-[#557461]">
                <span>⏱</span>
                <span>About 5 minutes</span>
              </div>

              <Link
                href="/player/games/sequence"
                className="mt-6 flex min-h-16 items-center justify-center rounded-2xl bg-[#315C43] px-5 text-lg font-bold text-white transition hover:bg-[#274C36] focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
              >
                Start Activity
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-bold">
            Need something?
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Hear Instructions */}
            <button
              type="button"
              className="flex min-h-20 items-center gap-4 rounded-2xl border-2 border-[#DCE3DD] bg-white px-5 text-left transition hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EDF4EE] text-2xl">
                🔊
              </span>

              <span>
                <span className="block text-lg font-bold">
                  Hear instructions
                </span>
                <span className="block text-sm text-[#68736D]">
                  Listen to the instructions
                </span>
              </span>
            </button>

            {/* Progress */}
            <Link
              href="/player/progress"
              className="flex min-h-20 items-center gap-4 rounded-2xl border-2 border-[#DCE3DD] bg-white px-5 text-left transition hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EDF4EE] text-2xl">
                ⭐
              </span>

              <span>
                <span className="block text-lg font-bold">
                  My progress
                </span>
                <span className="block text-sm text-[#68736D]">
                  See your activities
                </span>
              </span>
            </Link>

            {/* Help */}
            <Link
              href="/help"
              className="flex min-h-20 items-center gap-4 rounded-2xl border-2 border-[#DCE3DD] bg-white px-5 text-left transition hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EDF4EE] text-2xl">
                ❓
              </span>

              <span>
                <span className="block text-lg font-bold">
                  Get help
                </span>
                <span className="block text-sm text-[#68736D]">
                  We&apos;re here to help
                </span>
              </span>
            </Link>
          </div>
        </section>

        {/* Encouragement */}
        <section className="mt-10 rounded-[2rem] border border-[#D6E0D8] bg-[#EDF4EE] p-7 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl">
              🌱
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Take your time
              </h2>

              <p className="mt-1 text-lg leading-7 text-[#56615B]">
                There is no need to rush. Do your best and enjoy the activity.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 border-t border-[#DCE3DD] py-6 text-center text-sm text-[#68736D]">
          <p>Simple. Encouraging. Accessible.</p>
        </footer>
      </div>
    </main>
  );
}