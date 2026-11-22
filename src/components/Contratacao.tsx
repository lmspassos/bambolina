import Placeholder from "./Placeholder";
import Reveal from "./Reveal";
import FaqMural from "./FaqMural";
import { CONTATO, CONDICOES, PRECO } from "@/data/contato";

const INCLUI = [
  "Uma experiência presencial de 2 horas",
  "Atendimento para até 30 estudantes",
  "Equipe com 5 profissionais",
  "Planejamento e organização",
  "Materiais necessários às atividades previstas",
  "Montagem, condução e encerramento",
];

const ESCOLA = [
  "Espaço coberto e adequado ao número de participantes",
  "Mesas e cadeiras, quando necessárias",
  "Acesso à energia elétrica",
  "Condições de segurança e circulação",
  "Espaço disponível antes e depois para montagem e organização",
];

const PASSOS = [
  "A instituição entra em contato com a equipe Bambolina.",
  "Alinhamos o objetivo da atividade, o número de estudantes, a data e o espaço disponível.",
  "A equipe envia a proposta comercial e confirma as condições da contratação.",
  "Após a aprovação, a data é reservada mediante pagamento de 50% do valor.",
  "Os 50% restantes são pagos antes da realização da experiência.",
  "A equipe faz o planejamento final e comparece à instituição na data combinada.",
];

const FAQ: [string, string][] = [
  ["A Bambolina é uma peça de teatro?", "Não. É uma experiência teatral imersiva e interativa. Embora use elementos do universo teatral, o objetivo principal é apresentar as diferentes áreas do teatro por meio de demonstrações, atividades e participação dos estudantes."],
  ["Os alunos precisam ter experiência com teatro?", "Não. A experiência é desenvolvida para receber estudantes com diferentes níveis de familiaridade com a linguagem teatral."],
  ["Todos os estudantes precisam participar das atividades?", "A proposta estimula a participação de todos, respeitando diferentes formas de envolvimento. As dinâmicas são planejadas para que os estudantes possam experimentar e interagir."],
  ["A Bambolina acontece dentro da escola?", "Sim. O formato é itinerante: a equipe vai até a instituição contratante e realiza a experiência no espaço disponibilizado pela escola."],
  ["Qual é a duração?", "A proposta comercial de referência prevê duas horas de experiência."],
  ["Quantos estudantes podem participar?", "O formato de referência contempla até 30 estudantes por experiência. Para grupos maiores, é necessário avaliar a divisão em sessões ou a adaptação da estrutura."],
  ["A escola precisa fornecer os materiais?", "Os materiais previstos para as atividades são levados pela equipe Bambolina. A instituição disponibiliza o espaço e a estrutura previamente acordada."],
  ["A experiência garante que o estudante descubra sua profissão?", "Não. A Bambolina não realiza testes vocacionais nem determina escolhas profissionais. O propósito é ampliar o repertório dos estudantes e proporcionar experiências que possam contribuir para o autoconhecimento e a exploração de interesses."],
  ["É possível personalizar a experiência?", "Sim. O planejamento pode considerar a faixa etária, os objetivos pedagógicos, o número de participantes e as características da instituição."],
];

const COR = ["bg-limao", "bg-rosa", "bg-laranja", "bg-azul text-creme", "bg-limao", "bg-rosa"];

export default function Contratacao() {
  return (
    <section id="contato" className="relative px-4 py-16 sm:px-16 md:py-24">
      <header className="mx-auto mb-10 max-w-3xl md:mb-16 text-center">
        <p className="font-display text-xs font-bold uppercase tracking-[0.35em] text-rosa">A contratação</p>
        <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight md:text-6xl">
          Leve a Bambolina <span className="font-swung font-normal text-limao">para sua escola.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-creme/80">
          A experiência chega até a sua instituição: a equipe leva os materiais, monta o espaço e conduz tudo.
        </p>
      </header>

      {/* Investimento + o que a escola faz */}
      <div className="mx-auto grid max-w-6xl items-start gap-8 md:grid-cols-2">
        <Reveal>
          <article className="ingresso bg-creme p-7 text-vinho shadow-2xl md:p-9">
            <p className="font-display text-xs font-bold uppercase tracking-[0.3em] text-vinho/75">Experiência Bambolina</p>
            <p className="mt-2 whitespace-nowrap font-display text-[clamp(2.1rem,4.4vw,3.75rem)] font-extrabold leading-none">{PRECO.valor}</p>
            <p className="mt-1 text-sm">Valor da proposta comercial</p>
            <p className="mt-6 font-display text-sm font-bold">O que contempla</p>
            <ul className="mt-2 space-y-2 border-t border-dashed border-vinho/40 pt-4">
              {INCLUI.map((t) => (
                <li key={t} className="flex gap-2.5 text-[0.95rem] leading-snug">
                  <span aria-hidden className="mt-1.5 size-2 shrink-0 rounded-full bg-rosa" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm">
              <strong>Local:</strong> na escola. Deslocamentos especiais, demandas adicionais e alterações de escopo podem gerar custos extras.
            </p>
          </article>
        </Reveal>

        <Reveal className="grid gap-6">
          <div>
            <h3 className="font-swung text-3xl">O que a escola oferece</h3>
            <p className="mt-2 text-creme/80">Disponibilizar o espaço físico adequado, garantir o acesso da equipe e dos materiais e organizar a participação dos estudantes conforme o planejamento.</p>
            <ul className="mt-3 space-y-1.5 text-creme/90">
              {ESCOLA.map((t) => (
                <li key={t} className="flex gap-2.5 leading-snug">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-limao" />
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-sm text-creme/60">Equipamentos especiais e necessidades técnicas específicas são alinhados previamente.</p>
          </div>

          <div className="rounded-2xl border border-creme/20 p-5">
            <h3 className="font-swung text-2xl">Condições</h3>
            <dl className="mt-3 space-y-3 text-sm">
              <Condicao titulo="Pagamento" valor="50% para reservar a data e 50% antes da realização." />
              <Condicao titulo="Cancelamento e remarcação" valor={CONDICOES.cancelamento} marca="definir política de cancelamento" />
              <Condicao titulo="Grupos com mais de 30 estudantes" valor={CONDICOES.gruposMaiores} marca="definir preço ou divisão em sessões" />
            </dl>
          </div>
        </Reveal>
      </div>

      {/* Como contratar */}
      <div className="mx-auto mt-16 max-w-6xl md:mt-24">
        <h3 className="text-center font-swung text-4xl md:text-5xl">Como contratar</h3>
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PASSOS.map((p, i) => (
            <li key={p}>
              <Reveal className="h-full">
                <div className="h-full rounded-2xl border border-creme/20 p-5">
                  <span className={`grid size-10 place-items-center rounded-full font-display text-lg font-extrabold text-palco ${COR[i]}`}>{i + 1}</span>
                  <p className="mt-3 leading-snug">{p}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      {/* FAQ: mural de abas */}
      <div className="mx-auto mt-16 max-w-6xl md:mt-24">
        <FaqMural itens={FAQ} />
      </div>

      {/* Contato */}
      <Reveal className="mx-auto mt-16 max-w-5xl md:mt-20">
        <div className="cortina rounded-3xl px-6 py-14 text-center shadow-2xl md:px-14">
          <h3 className="font-swung text-4xl leading-tight md:text-6xl">O teatro é só o começo.</h3>
          <p className="mx-auto mt-4 max-w-xl text-lg text-creme/90">
            Entre em contato para conhecer a proposta, solicitar um orçamento e agendar uma experiência.
          </p>
          <ul className="mt-9 grid gap-3 text-left sm:grid-cols-2">
            <Canal rotulo="WhatsApp" valor={CONTATO.whatsappExibicao} href={CONTATO.whatsapp && `https://wa.me/${CONTATO.whatsapp}`} marca="inserir telefone / WhatsApp" />
            <Canal rotulo="E-mail" valor={CONTATO.email} href={CONTATO.email && `mailto:${CONTATO.email}`} marca="inserir e-mail comercial" />
            <Canal rotulo="Instagram" valor={CONTATO.instagram} href={CONTATO.instagram && `https://instagram.com/${CONTATO.instagram.replace("@", "")}`} marca="inserir Instagram" />
            <Canal rotulo="Site" valor={CONTATO.site && CONTATO.site.replace(/^https?:\/\//, "")} href={CONTATO.site} marca="inserir endereço do site" />
          </ul>
        </div>
      </Reveal>

      <footer className="mx-auto mt-14 max-w-5xl text-center text-sm text-creme/50">
        <p>Bambolina | O teatro é só o começo.</p>
        <p className="mt-1">Projeto de Design VII, 2026 · Identidade visual: Júlia Morales Vitorino</p>
      </footer>
    </section>
  );
}

function Condicao({ titulo, valor, marca }: { titulo: string; valor: string | null; marca?: string }) {
  return (
    <div>
      <dt className="font-display font-bold text-limao">{titulo}</dt>
      <dd className="mt-0.5 text-creme/85">{valor ?? <Placeholder>{marca}</Placeholder>}</dd>
    </div>
  );
}

function Canal({ rotulo, valor, href, marca }: { rotulo: string; valor: string | null; href?: string | null; marca: string }) {
  const corpo = (
    <>
      <span className="block font-display text-xs font-bold uppercase tracking-[0.25em] text-limao">{rotulo}</span>
      <span className="mt-1 block text-lg font-semibold">{valor ?? <Placeholder>{marca}</Placeholder>}</span>
    </>
  );
  const base = "block rounded-2xl bg-palco/60 p-4";
  return (
    <li>
      {valor && href ? (
        <a href={href} className={`${base} transition hover:bg-palco focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-limao`}>
          {corpo}
        </a>
      ) : (
        <div className={base}>{corpo}</div>
      )}
    </li>
  );
}
