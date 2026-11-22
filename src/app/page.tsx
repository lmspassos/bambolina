import Hero from "@/components/Hero";
import Roteiro from "@/components/Roteiro";
import Areas from "@/components/Areas";
import Habilidades from "@/components/Habilidades";
import Galeria from "@/components/Galeria";
import Contratacao from "@/components/Contratacao";

export default function Home() {
  return (
    <main id="conteudo">
      <Hero />
      <Roteiro />
      <Areas />
      <Habilidades />
      <Galeria />
      <Contratacao />
    </main>
  );
}
