// Menu em Swung Note. No hover: oval desenhada à mão + doodle ABAIXO do link (acima era cortado pela borda da tela). CSS puro.
const DOODLES = {
  rosto: (
    <>
      <circle cx="24" cy="27" r="11" />
      <path d="M19.5 25v2.5M28.5 25v2.5M19 32q5 4.5 10 0M8 10l4 4M40 10l-4 4M24 3v6" />
    </>
  ),
  estrela: <path d="M24 5l4.5 14.5L43 24l-14.5 4.5L24 43l-4.5-14.5L5 24l14.5-4.5zM38 8c3 1 4 4 3 7" />,
  ingresso: <path d="M5 13h38v7a4 4 0 0 0 0 8v7H5v-7a4 4 0 0 0 0-8zM30 13v4M30 22v4M30 31v4M13 21h9M13 27h6" />,
  refletor: (
    <>
      <rect x="15" y="4" width="18" height="10" rx="3" />
      <path d="M17 14L8 43h32L31 14M24 22v6" />
    </>
  ),
};

const LINKS: { href: string; label: string; doodle: keyof typeof DOODLES }[] = [
  { href: "#inicio", label: "experiência", doodle: "refletor" },
  { href: "#roteiro", label: "roteiro", doodle: "rosto" },
  { href: "#areas", label: "áreas", doodle: "estrela" },
  { href: "#contato", label: "contratar", doodle: "ingresso" },
];

export default function Nav() {
  return (
    <nav
      aria-label="Principal"
      className="fixed left-1/2 top-4 z-[45] -translate-x-1/2 rounded-full bg-palco/70 px-7 py-2.5 backdrop-blur-md"
    >
      <ul className="flex items-center gap-7 font-swung text-xl md:gap-10 md:text-2xl">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="group relative inline-block px-1 transition-colors hover:text-limao focus-visible:text-limao focus-visible:outline-none"
            >
              <svg
                aria-hidden
                viewBox="0 0 48 48"
                className="absolute left-1/2 top-[calc(100%+0.1rem)] size-9 -translate-x-1/2 scale-50 -rotate-12 fill-none stroke-limao stroke-2 opacity-0 transition duration-300 [stroke-linecap:round] [stroke-linejoin:round] group-hover:scale-100 group-hover:rotate-0 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:rotate-0 group-focus-visible:opacity-100"
              >
                {DOODLES[l.doodle]}
              </svg>
              <svg
                aria-hidden
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
                className="absolute -inset-x-3 -inset-y-1 h-[calc(100%+0.5rem)] w-[calc(100%+1.5rem)] fill-none stroke-limao stroke-2 [stroke-linecap:round]"
              >
                <path
                  d="M9 23C5 9 40 4 62 5c28 1 36 9 30 20-5 11-40 13-62 11C12 35 3 29 10 17"
                  vectorEffect="non-scaling-stroke"
                  className="[stroke-dasharray:330] [stroke-dashoffset:330] transition-[stroke-dashoffset] duration-500 group-hover:[stroke-dashoffset:0] group-focus-visible:[stroke-dashoffset:0]"
                />
              </svg>
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
