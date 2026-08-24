import Link from "next/link";

export default function PlayerSettingsPage() {
  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#24302A]">
      <div className="mx-auto min-h-screen max-w-5xl px-6 py-8 sm:px-10">
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
            href="/player"
            className="rounded-xl px-5 py-3 text-base font-semibold text-[#315C43] hover:bg-[#E8EFE9] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
          >
            Back
          </Link>
        </header>

        {/* Page heading */}
        <section className="py-10 sm:py-12">
          <p className="text-lg font-semibold text-[#557461]">
            Settings
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Make the app comfortable for you
          </h1>

          <p className="mt-4 max-w-2xl text-xl leading-8 text-[#68736D]">
            Change these settings at any time. Choose the options that make
            the activities easiest and most comfortable for you.
          </p>
        </section>

        <div className="space-y-6">
          {/* Text size */}
          <section className="rounded-[2rem] border border-[#DCE3DD] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl">
                Aa
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  Text size
                </h2>

                <p className="mt-1 text-lg text-[#68736D]">
                  Choose a text size that is easy for you to read.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    className="min-h-16 rounded-2xl border-2 border-[#B9C8BD] px-5 text-lg font-semibold hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
                  >
                    Standard
                  </button>

                  <button
                    type="button"
                    className="min-h-16 rounded-2xl border-2 border-[#315C43] bg-[#EDF4EE] px-5 text-xl font-semibold text-[#315C43] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
                  >
                    Large
                  </button>

                  <button
                    type="button"
                    className="min-h-16 rounded-2xl border-2 border-[#B9C8BD] px-5 text-2xl font-semibold hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
                  >
                    Extra Large
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Contrast */}
          <section className="rounded-[2rem] border border-[#DCE3DD] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl">
                ◐
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  Contrast
                </h2>

                <p className="mt-1 text-lg text-[#68736D]">
                  Increase contrast to make things easier to see.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    className="min-h-16 rounded-2xl border-2 border-[#B9C8BD] bg-white px-5 text-lg font-semibold hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
                  >
                    Standard contrast
                  </button>

                  <button
                    type="button"
                    className="min-h-16 rounded-2xl border-2 border-[#315C43] bg-[#EDF4EE] px-5 text-lg font-semibold text-[#315C43] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
                  >
                    High contrast
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Sound */}
          <section className="rounded-[2rem] border border-[#DCE3DD] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl">
                🔊
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  Sound & Voice
                </h2>

                <p className="mt-1 text-lg text-[#68736D]">
                  Choose how you would like to hear information.
                </p>

                <div className="mt-6 space-y-4">
                  <label className="flex min-h-20 cursor-pointer items-center justify-between gap-5 rounded-2xl border-2 border-[#DCE3DD] px-5 hover:bg-[#F8FAF8]">
                    <div>
                      <span className="block text-lg font-bold">
                        Sound effects
                      </span>
                      <span className="text-base text-[#68736D]">
                        Play sounds during activities
                      </span>
                    </div>

                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-7 w-7 accent-[#315C43]"
                    />
                  </label>

                  <label className="flex min-h-20 cursor-pointer items-center justify-between gap-5 rounded-2xl border-2 border-[#DCE3DD] px-5 hover:bg-[#F8FAF8]">
                    <div>
                      <span className="block text-lg font-bold">
                        Music
                      </span>
                      <span className="text-base text-[#68736D]">
                        Play background music
                      </span>
                    </div>

                    <input
                      type="checkbox"
                      className="h-7 w-7 accent-[#315C43]"
                    />
                  </label>

                  <label className="flex min-h-20 cursor-pointer items-center justify-between gap-5 rounded-2xl border-2 border-[#DCE3DD] px-5 hover:bg-[#F8FAF8]">
                    <div>
                      <span className="block text-lg font-bold">
                        Voice instructions
                      </span>
                      <span className="text-base text-[#68736D]">
                        Read instructions aloud
                      </span>
                    </div>

                    <input
                      type="checkbox"
                      defaultChecked
                      className="h-7 w-7 accent-[#315C43]"
                    />
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Instructions */}
          <section className="rounded-[2rem] border border-[#DCE3DD] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl">
                💬
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  Instructions
                </h2>

                <p className="mt-1 text-lg text-[#68736D]">
                  Choose how instructions are presented.
                </p>

                <label className="mt-6 flex min-h-20 cursor-pointer items-center justify-between gap-5 rounded-2xl border-2 border-[#DCE3DD] px-5 hover:bg-[#F8FAF8]">
                  <div>
                    <span className="block text-lg font-bold">
                      Repeat instructions
                    </span>
                    <span className="text-base text-[#68736D]">
                      Allow instructions to be repeated before an activity
                    </span>
                  </div>

                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-7 w-7 accent-[#315C43]"
                  />
                </label>
              </div>
            </div>
          </section>

          {/* Animation */}
          <section className="rounded-[2rem] border border-[#DCE3DD] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl">
                ✨
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  Animation
                </h2>

                <p className="mt-1 text-lg text-[#68736D]">
                  Choose how much movement you would like to see.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    className="min-h-16 rounded-2xl border-2 border-[#B9C8BD] px-5 text-lg font-semibold hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
                  >
                    Full
                  </button>

                  <button
                    type="button"
                    className="min-h-16 rounded-2xl border-2 border-[#315C43] bg-[#EDF4EE] px-5 text-lg font-semibold text-[#315C43] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
                  >
                    Reduced
                  </button>

                  <button
                    type="button"
                    className="min-h-16 rounded-2xl border-2 border-[#B9C8BD] px-5 text-lg font-semibold hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
                  >
                    None
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Save */}
          <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:justify-end">
            <Link
              href="/player"
              className="flex min-h-16 items-center justify-center rounded-2xl border-2 border-[#B9C8BD] bg-white px-8 text-lg font-bold text-[#315C43] hover:bg-[#F1F5F2] focus:outline-none focus:ring-4 focus:ring-[#D5E2D8]"
            >
              Cancel
            </Link>

            <button
              type="button"
              className="flex min-h-16 items-center justify-center rounded-2xl bg-[#315C43] px-10 text-lg font-bold text-white hover:bg-[#274C36] focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
            >
              Save settings
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 border-t border-[#DCE3DD] py-6 text-center text-sm text-[#68736D]">
          <p>Simple. Encouraging. Accessible.</p>
        </footer>
      </div>
    </main>
  );
}