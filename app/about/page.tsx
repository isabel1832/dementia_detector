import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#24302A]">
      <div className="mx-auto max-w-4xl px-6 py-8 sm:px-10">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-[#DCE3DD] pb-6">
          <Link
            href="/"
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
            href="/"
            className="rounded-xl px-5 py-3 font-semibold text-[#315C43] hover:bg-[#E8EFE9]"
          >
            Back to Home
          </Link>
        </header>

        {/* Main */}
        <section className="py-14">
          <div className="max-w-3xl">
            <p className="text-lg font-semibold text-[#557461]">About</p>

            <h1 className="mt-3 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Simple activities for keeping your mind active.
            </h1>

            <p className="mt-6 text-xl leading-9 text-[#56615B]">
              Memory & Puzzle is designed to provide older adults with
              enjoyable, easy-to-use memory games and puzzles that can be
              completed independently or with support from a caregiver.
            </p>
          </div>

          {/* What the app does */}
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-[#DCE3DD] bg-white p-7 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl">
                🧩
              </div>

              <h2 className="mt-5 text-2xl font-bold">
                Fun, simple activities
              </h2>

              <p className="mt-3 text-lg leading-8 text-[#68736D]">
                Complete short memory games and puzzles at your own pace.
                Activities are designed to be straightforward and
                encouraging.
              </p>
            </div>

            <div className="rounded-3xl border border-[#DCE3DD] bg-white p-7 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl">
                ❤️
              </div>

              <h2 className="mt-5 text-2xl font-bold">
                Encouragement first
              </h2>

              <p className="mt-3 text-lg leading-8 text-[#68736D]">
                The goal is to encourage participation and independence.
                Completing an activity is more important than getting every
                answer right.
              </p>
            </div>

            <div className="rounded-3xl border border-[#DCE3DD] bg-white p-7 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl">
                👨‍👩‍👧
              </div>

              <h2 className="mt-5 text-2xl font-bold">
                Support for caregivers
              </h2>

              <p className="mt-3 text-lg leading-8 text-[#68736D]">
                With permission, caregivers can review activity history and
                performance trends to better understand how activities are
                going over time.
              </p>
            </div>

            <div className="rounded-3xl border border-[#DCE3DD] bg-white p-7 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDF4EE] text-2xl">
                🔒
              </div>

              <h2 className="mt-5 text-2xl font-bold">
                Privacy matters
              </h2>

              <p className="mt-3 text-lg leading-8 text-[#68736D]">
                Cognitive-performance information should be handled carefully.
                The app is designed with privacy and appropriate access in
                mind.
              </p>
            </div>
          </div>

          {/* Important information */}
          <section className="mt-12 rounded-3xl border border-[#D6E0D8] bg-[#EDF4EE] p-7 sm:p-9">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-xl">
                ℹ️
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  An activity tool, not a diagnosis
                </h2>

                <p className="mt-3 text-lg leading-8 text-[#56615B]">
                  The games in this app are intended to provide engaging
                  activities and track game performance over time. Results
                  from these activities are not a medical diagnosis and
                  should not be used on their own to determine whether someone
                  has dementia or another medical condition.
                </p>
              </div>
            </div>
          </section>

          {/* Call to action */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold">
              Ready to get started?
            </h2>

            <p className="mt-2 text-lg text-[#68736D]">
              Choose an activity and take it one step at a time.
            </p>

            <Link
              href="/login"
              className="mt-6 inline-flex min-h-16 items-center justify-center rounded-2xl bg-[#315C43] px-8 text-lg font-bold text-white shadow-sm transition hover:bg-[#274C36] focus:outline-none focus:ring-4 focus:ring-[#B8CEBD]"
            >
              Get started
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#DCE3DD] pt-6 text-center text-sm text-[#68736D]">
          <p>Simple. Encouraging. Accessible.</p>
        </footer>
      </div>
    </main>
  );
}