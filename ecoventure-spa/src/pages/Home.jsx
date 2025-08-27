// Home.jsx
import { Link } from "react-router-dom";
import SearchFilters from "../components/SearchFilters";

export default function Home({ showSearch, onToggleSearch }) {
  return (
    <div className="bg-white text-gray-900">
      {/* HERO with video */}
      <section className="relative w-full h-[78vh] md:h-[86vh] overflow-hidden">
        {/* Background video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          poster="/hero.jpg"
        />

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* === SEARCH PANEL OVER VIDEO === */}
        {showSearch && (
          <div className="absolute left-0 right-0 top-16 z-20">
            <div className="max-w-6xl mx-auto px-4">
              <div className="rounded-2xl bg-[#3a4343]/95 text-white shadow-2xl backdrop-blur px-4 md:px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="uppercase tracking-wide text-sm font-semibold">
                    Find your next adventure
                  </p>
                  <button
                    onClick={onToggleSearch}
                    className="p-2 rounded hover:bg-white/10"
                    aria-label="Close search"
                    title="Close"
                  >
                    ✕
                  </button>
                </div>
                <SearchFilters />
              </div>
            </div>
          </div>
        )}

        {/* Headline + CTA (centered) */}
        <div className="relative z-10 h-full max-w-6xl mx-auto px-4 md:px-6 flex flex-col items-center justify-center text-center text-white">
          <p className="text-3xl md:text-4xl italic opacity-95">A World</p>
          <h1 className="text-6xl md:text-8xl font-extrabold leading-none tracking-tight">
            OF GOOD
          </h1>

          <Link
            to="/about"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-teal-600 text-white px-6 py-3 font-semibold shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-white"
          >
            FIND OUT MORE
          </Link>
        </div>
      </section>

      {/* FIND THE RIGHT ACTIVITY */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16">
        <div className="flex items-center gap-8 md:gap-12">
          {/* Left: Illustration */}
          <img
            src="/mountain.png"
            alt="difficulty levels illustration"
            className="w-24 md:w-48 lg:w-56 shrink-0"
          />

          {/* Right: Text block */}
          <div>
            <h2 className="uppercase tracking-tight text-3xl md:text-4xl font-extrabold leading-tight">
              Find the right Activity for you
            </h2>
            <p className="mt-4 text-gray-700 text-base md:text-lg max-w-[60ch]">
              Our adventures are tailored to meet a variety of fitness levels so you can pick
              the perfect match below.
            </p>
          </div>
        </div>
      </section>

      {/* ACTIVITIES ROW 1 */}
      <section className="bg-gray-100 py-12">
        <div className="font-extrabold text-3xl text-center my-4">Activities</div>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {/* Card 1 */}
            <figure className="relative w-80 h-56 overflow-hidden rounded-2xl shadow">
              <img
                src="/cycling .jpeg"   
                alt="Cycling"
                className="w-full h-full object-cover"
              />
              <figcaption className="absolute bottom-2 left-2 bg-black/60 text-white font-extrabold px-3 py-1 rounded text-2xl">
                Cycling
              </figcaption>
            </figure>

            {/* Card 2 */}
            <figure className="relative w-80 h-56 overflow-hidden rounded-2xl shadow">
              <img
                src="/hiking.jpeg"
                alt="Hiking"
                className="w-full h-full object-cover"
              />
              <figcaption className="absolute bottom-2 left-2 bg-black/60 text-white font-extrabold px-3 py-1 rounded text-2xl">
                Hiking
              </figcaption>
            </figure>

            {/* Card 3 */}
            <figure className="relative w-80 h-56 overflow-hidden rounded-2xl shadow">
              <img
                src="/mountain_climb.avif"
                alt="Mountain climbing"
                className="w-full h-full object-cover"
              />
              <figcaption className="absolute bottom-2 left-2 bg-black/60 text-white font-extrabold px-3 py-1 rounded text-2xl">
                Mountain Climbing
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ACTIVITIES ROW 2 */}
      <section className="bg-gray-100 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            {/* Card 4 */}
            <figure className="relative w-80 h-56 overflow-hidden rounded-2xl shadow">
              <img
                src="/rafting.jpeg"
                alt="Rafting"
                className="w-full h-full object-cover"
              />
              <figcaption className="absolute bottom-2 left-2 bg-black/60 text-white font-extrabold px-3 py-1 rounded text-2xl">
                Rafting
              </figcaption>
            </figure>

            {/* Card 5 */}
            <figure className="relative w-80 h-56 overflow-hidden rounded-2xl shadow">
              <img
                src="/Wild_swimming.webp"
                alt="Wild Swimming"
                className="w-full h-full object-cover"
              />
              <figcaption className="absolute bottom-2 left-2 bg-black/60 text-white font-extrabold px-3 py-1 rounded text-2xl">
                Wild Swimming
              </figcaption>
            </figure>

            {/* Card 6 */}
            <figure className="relative w-80 h-56 overflow-hidden rounded-2xl shadow">
              <img
                src="/wildlife.jpeg"
                alt="Wildlife Watching"
                className="w-full h-full object-cover"
              />
              <figcaption className="absolute bottom-2 left-2 bg-black/60 text-white font-extrabold px-3 py-1 rounded text-2xl">
                Wildlife Watching
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* FEATURES (non-overlapping icons) */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <Feature
            iconSrc="/explore.webp"
            title="Explore places you couldn't yourself"
            text="All trips are led by certified expert guides, unlocking life experiences in places most never see."
          />
          <Feature
            iconSrc="/world.svg"
            title="Go with the outdoor specialists"
            text="Choose from award-winning active adventures in wild places, whatever your mood."
          />
          <Feature
            iconSrc="/bump.webp"
            title="Join a small like-minded group"
            text="Most guests join solo in their 30s–50s. 95% rate the group dynamic 5 stars."
          />
          <Feature
            iconSrc="/yoga.webp"
            title="Hassle-free from start to finish"
            text="We sort the logistics, so you can just rock up and have a blast in the wild."
          />
        </div>
      </section>
    </div>
  );
}

/* ---------- local helper so Feature is defined ---------- */
function Feature({ iconSrc, title, text }) {
  return (
    <div className="flex flex-col items-center text-center">
      {/* fixed icon box prevents overlap */}
      <div className="w-24 h-24 md:w-28 md:h-28 mb-3 flex items-center justify-center shrink-0">
        <img
          src={iconSrc}
          alt=""
          className="max-w-full max-h-full object-contain block select-none pointer-events-none"
        />
      </div>

      <h3 className="text-[13px] md:text-sm font-extrabold uppercase tracking-widest text-slate-900 max-w-[28ch]">
        {title}
      </h3>

      <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-[42ch]">
        {text}
      </p>
    </div>
  );
}
