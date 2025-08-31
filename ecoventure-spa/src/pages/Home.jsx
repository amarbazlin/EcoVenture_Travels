// Home.jsx
import { Link } from "react-router-dom";
import SearchFilters from "../components/SearchFilters";

export default function Home({ showSearch, onToggleSearch }) {
  return (
    <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors">
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
          poster="/hero.webp"
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* SEARCH PANEL */}
        {showSearch && (
          <div className="absolute left-0 right-0 top-16 z-20">
            <div className="max-w-6xl mx-auto px-4">
              <div className="rounded-2xl bg-gray-800/95 text-white shadow-2xl backdrop-blur px-4 md:px-6 py-4">
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

        {/* Headline */}
        <div className="relative z-10 h-full max-w-6xl mx-auto px-4 md:px-6 flex flex-col items-center justify-center text-center text-white">
          <p className="text-3xl md:text-4xl italic opacity-95">A World</p>
          <h1 className="text-6xl md:text-8xl font-extrabold leading-none tracking-tight">
            OF GOOD
          </h1>
          <Link
            to="/about"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-eco text-white px-6 py-3 font-semibold shadow hover:bg-eco/80 focus:outline-none focus:ring-2 focus:ring-white"
          >
            FIND OUT MORE
          </Link>
        </div>
      </section>

      {/* FIND THE RIGHT ACTIVITY */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-16">
        <div className="flex items-center gap-8 md:gap-12">
          <img src="/mountain.png" alt="illustration" className="w-24 md:w-48 lg:w-56 shrink-0" />
          <div>
            <h2 className="uppercase tracking-tight text-3xl md:text-4xl font-extrabold leading-tight">
              Find the right Activity for you
            </h2>
            <p className="mt-4 text-gray-700 dark:text-gray-300 text-base md:text-lg max-w-[60ch]">
              Our adventures are tailored to meet a variety of fitness levels so you can pick
              the perfect match below.
            </p>
          </div>
        </div>
      </section>

      {/* ACTIVITIES */}
      <section className="bg-gray-100 dark:bg-gray-800 py-12 transition-colors">
        <div className="font-serif text-4xl text-center mt-0 mb-8">Activities</div>
        <div className="max-w-6xl mx-auto px-4 mb-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 ">
            {[
              { src: "/cycle.webp", label: "Cycling",  },
              { src: "/hiking.webp", label: "Hiking" },
              { src: "/mountain_climb.avif", label: "Mountain Climbing" }
              
            ].map((a) => (
               <Link key={a.label} to={`/activities?activity=${a.label}`} >
              <figure
                key={a.label}
                className="relative w-80 h-56 overflow-hidden rounded-2xl shadow"
              >
                <img src={a.src} alt={a.label} className="w-full h-full object-cover" />
                <figcaption className="absolute bottom-2 left-2 bg-black/60 text-white font-extrabold px-3 py-1 rounded text-2xl">
                  {a.label}
                </figcaption>
              </figure>
            </Link>
          ))}
          </div>
          
        </div>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 ">
            {[
              { src: "/Wild_swimming.webp", label: "Wild Swimming" },
              { src: "/wildlife.webp", label: "Wild Watching"  },
              { src: "/rafting.webp", label: "Rafting" }
              
            ].map((a) => (
              <Link key={a.label} to={`/activities?activity=${a.label}`}>
              <figure
                key={a.label}
                className="relative w-80 h-56 overflow-hidden rounded-2xl shadow"
              >
                <img src={a.src} alt={a.label} className="w-full h-full object-cover" />
                <figcaption className="absolute bottom-2 left-2 bg-black/60 text-white font-extrabold px-3 py-1 rounded text-2xl">
                  {a.label}
                </figcaption>
              </figure>
              </Link>
            ))}
          </div>
          
        </div>
      </section>

      {/* FEATURES */}
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

function Feature({ iconSrc, title, text }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-24 h-24 md:w-28 md:h-28 mb-3 flex items-center justify-center">
        <img src={iconSrc} alt="" className="max-w-full max-h-full object-contain block" />
      </div>
      <h3 className="text-[13px] md:text-sm font-extrabold uppercase tracking-widest text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-[42ch]">
        {text}
      </p>
    </div>
  );
}
