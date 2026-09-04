import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#24302A]">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-8 sm:px-10">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#DCE9DF] text-2xl">
              🧠
            </div>

            <span className="text-xl font-semibold tracking-tight">
              Memory & Puzzle
            </span>
          </div>

          <Link
            href="/login"
            className="rounded-xl px-5 py-3 text-base font-semibold text-[#315C43] hover:bg-[#E8EFE9]"
          >
            Sign in
          </Link>
        </header>

        {/* Main content */}
        <section className="flex flex-1 items-center py-16">
          <div className="grid w-full items-center gap-12 md:grid-cols-2">
            {/* Text */}
            <div className="max-w-xl">
              <p className="mb-5 text-lg font-semibold text-[#557461]">
                Welcome
              </p>

              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                A simple way to keep your mind active.
              </h1>

              <p className="mt-6 max-w-lg text-xl leading-9 text-[#56615B]">
                Enjoy short, engaging memory games and puzzles designed to be
                simple, encouraging, and easy to use.
              </p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/signup"
                  className="flex min-h-16 items-center justify-center rounded-2xl bg-[#315C43] px-8 text-lg font-bold text-white shadow-sm transition hover:bg-[#274C36] focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
                >
                  Create account
                </Link>

                <Link
                  href="/login"
                  className="flex min-h-16 items-center justify-center rounded-2xl border-2 border-[#B9C8BD] bg-white px-8 text-lg font-bold text-[#315C43] transition hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
                >
                  Sign in
                </Link>
              </div>

              <div className="mt-4">
                <Link
                  href="/access-code"
                  className="text-base font-semibold text-[#557461] underline-offset-4 hover:underline"
                >
                  I have a 6-digit access code →
                </Link>
              </div>

              <p className="mt-6 text-sm leading-6 text-[#68736D]">
                You can use the app on your own or with help from a family
                member or caregiver.
              </p>
            </div>

            {/* Illustration / welcome card */}
            <div className="flex justify-center">
              <div className="w-full max-w-md rounded-[2rem] border border-[#DCE3DD] bg-white p-6 shadow-sm">
                <div className="rounded-3xl bg-[#EDF4EE] p-8">
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-[#DCE9DF] text-5xl">
                    🧩
                  </div>

                  <div className="mt-8 text-center">
                    <h2 className="text-2xl font-bold">
                      Today&apos;s activities
                    </h2>

                    <p className="mt-2 text-base leading-7 text-[#68736D]">
                      Short activities you can complete at your own pace.
                    </p>
                  </div>

                  <div className="mt-7 space-y-3">
                    <div className="flex items-center justify-between rounded-2xl bg-white px-5 py-4">
                      <div>
                        <p className="font-semibold">Memory Match</p>
                        <p className="text-sm text-[#68736D]">About 5 min</p>
                      </div>

                      <span className="text-xl">🧠</span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-white px-5 py-4">
                      <div>
                        <p className="font-semibold">Picture Recall</p>
                        <p className="text-sm text-[#68736D]">About 5 min</p>
                      </div>

                      <span className="text-xl">🖼️</span>
                    </div>

                    <div className="flex items-center justify-between rounded-2xl bg-white px-5 py-4">
                      <div>
                        <p className="font-semibold">Sequence</p>
                        <p className="text-sm text-[#68736D]">About 5 min</p>
                      </div>

                      <span className="text-xl">🔢</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col gap-3 border-t border-[#DCE3DD] pt-6 text-sm text-[#68736D] sm:flex-row sm:items-center sm:justify-between">
          <p>Simple. Encouraging. Accessible.</p>

          <div className="flex gap-5">
            <Link href="/help" className="hover:text-[#315C43]">
              Help
            </Link>

            <Link href="/privacy" className="hover:text-[#315C43]">
              Privacy
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}