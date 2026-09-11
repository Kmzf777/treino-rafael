import type { ExercicioResolvido } from '@/data'
import { urlBusca, urlYouTube } from '@/lib/formato'
import { cn } from '@/lib/utils'
import { PranchaFigura } from './PranchaFigura'
import { Dialog, DialogClose, DialogContent, DialogTitle } from './ui/dialog'

/**
 * A tela principal do produto: bottom sheet abaixo de 640px, modal centrado
 * acima. Toda a mecânica de acessibilidade — focus trap, inert no fundo,
 * Escape, retorno de foco, aria — vem do Dialog do Base UI; aqui só mudam as
 * classes responsivas.
 *
 * O iframe é DESMONTADO ao fechar, não escondido: `habilitado={aberto}` derruba
 * o player no mesmo tick em que o sheet começa a sair, antes da animação.
 */

/**
 * Cue de risco articular. Com a nota lateral de aviso (`SecaoEditorial`), é um
 * dos dois lugares onde --tijolo aparece.
 *
 * A regra é POSICIONAL, não de vocabulário: só é aviso o cue que ABRE dizendo o
 * que não fazer, ou o que fazer se doer. Procurar a palavra "dor" em qualquer
 * posição pintava de vermelho a instrução principal do agachamento — "Desça
 * abaixo da linha do quadril, dentro do que o joelho aceita sem dor." — onde
 * "sem dor" é o objetivo, não o alerta. Vermelho na frase mais importante da
 * tela desvaloriza os avisos de verdade.
 *
 * Conferido nos 121 cues do plano: 11 marcados (9%), todos de proibição
 * ("Não deixe o joelho cair para dentro…") ou de condição de dor ("Se incomodar
 * o joelho operado…"). Ver a spec: --tijolo deve viver em ~12 linhas do app.
 */
const RISCO = /^(não|nunca|nada de|sem |evite|pare\b|se sentir|se incomodar|se doer)/i

type Props = { exercicio: ExercicioResolvido; aberto: boolean; onFechar: () => void }

const ROTULO = 'font-mono text-[11px] uppercase tracking-[0.08em] text-tinta-2'

const CHIP =
  'inline-flex min-h-11 items-center rounded-chip border border-fio px-3.5 text-[15px] text-tinta-2 transition-colors hover:border-tinta-2 hover:text-tinta'

export function SheetExercicio({ exercicio, aberto, onFechar }: Props) {
  const outrosVideos = exercicio.alternativos.length > 0 || exercicio.busca != null

  return (
    <Dialog
      open={aberto}
      onOpenChange={(valor) => {
        if (!valor) onFechar()
      }}
    >
      <DialogContent
        showCloseButton={false}
        // O Base UI já marca o #root com aria-hidden enquanto o sheet está
        // aberto; o aria-modal é o atributo que o padrão de diálogo modal pede.
        aria-modal="true"
        // Backdrop sólido, sem blur: o material grosso vira cinza sujo atrás de
        // uma superfície que cobre 90% da tela.
        overlayClassName="bg-black/40 backdrop-blur-none supports-backdrop-filter:backdrop-blur-none dark:bg-black/60"
        className={cn(
          'flex flex-col gap-0 overflow-hidden bg-papel p-0 text-[17px] text-tinta ring-0',
          // Entrada mais longa que a saída, de propósito: abrir é convite, fechar é
          // saída de cena. Curva de sheet do iOS.
          'duration-[420ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-closed:duration-[280ms]',
          // Abaixo de 640px: bottom sheet colado no rodapé.
          'top-auto right-0 bottom-0 left-0 max-h-[92dvh] w-full max-w-none translate-x-0 translate-y-0',
          'rounded-none rounded-t-sheet border-x-0 border-t border-b-0 border-fio',
          'max-sm:data-open:zoom-in-100 max-sm:data-open:slide-in-from-bottom',
          'max-sm:data-closed:zoom-out-100 max-sm:data-closed:slide-out-to-bottom',
          // A partir de 640px: modal centrado.
          'sm:top-1/2 sm:right-auto sm:bottom-auto sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2',
          'sm:max-h-[88dvh] sm:w-[calc(100%-2rem)] sm:max-w-[640px] sm:rounded-modal sm:border sm:border-fio',
        )}
      >
        <header className="flex-none border-b border-fio px-5 pt-3 pb-4">
          <div aria-hidden="true" className="mx-auto mb-3 h-[5px] w-9 rounded-full bg-fio sm:hidden" />

          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-mono text-[13px] font-medium tabular-nums text-carimbo">
                {exercicio.numero}
              </p>
              <DialogTitle className="mt-1 font-display text-[20px] leading-[1.25] font-medium tracking-[-0.017em] text-tinta">
                {exercicio.nome}
              </DialogTitle>
            </div>

            <DialogClose
              className={cn(
                '-mt-1 -mr-2 inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center px-2',
                'font-mono text-[11px] tracking-[0.08em] text-tinta-2 uppercase transition-colors hover:text-tinta',
              )}
            >
              Fechar
            </DialogClose>
          </div>

          <p className="mt-2 font-mono text-[13px] leading-[1.4] tabular-nums text-tinta-2">
            <span className="text-tinta">{exercicio.prescricao}</span>
            {' · '}
            {exercicio.meta.equipamento}
            {' · '}
            {exercicio.meta.musculoPrimario}
            {exercicio.unilateral && ' · unilateral'}
          </p>
        </header>

        {/* min-h-0: sem ele o `min-height:auto` do item flex impede o encolhimento
            e a lista de cues estoura o max-h em vez de rolar.

            tabIndex=0 é o que a WCAG 2.1.1 cobre para conteúdo rolável: só há
            três focáveis aqui dentro, e sem uma parada de tabulação no próprio
            contêiner quem usa teclado não alcança as setas/PageDown para ler os
            cues e o "Por que está no plano". */}
        <div
          role="group"
          tabIndex={0}
          aria-label="Conteúdo do exercício"
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pt-5 pb-[max(24px,env(safe-area-inset-bottom))]"
        >
          {/* A key remonta a prancha ao trocar de exercício com o sheet aberto
              (deep link direto de um id para outro). Sem ela, o estado interno
              de "já pedi o vídeo" vaza do exercício anterior e o novo abre com
              o player pedido sem ninguém ter tocado em "Ver execução". */}
          <PranchaFigura
            key={exercicio.id}
            numero={exercicio.numero}
            nome={exercicio.nome}
            video={exercicio.video}
            duracao={exercicio.duracaoVideo}
            inicio={exercicio.recorte?.inicio}
            fim={exercicio.recorte?.fim}
            habilitado={aberto}
          />

          <ol className="mt-7 list-none space-y-4 p-0">
            {exercicio.cues.map((cue, i) => {
              const risco = RISCO.test(cue)
              return (
                <li key={cue} className="grid grid-cols-[44px_1fr] gap-2">
                  <span
                    className={cn(
                      'font-mono text-[13px] leading-none font-medium tracking-normal tabular-nums',
                      risco ? 'text-tijolo' : 'text-tinta-2',
                    )}
                  >
                    {exercicio.numero}.{i + 1}
                  </span>
                  <span
                    className={cn(
                      'max-w-[60ch] text-[17px] leading-[1.47]',
                      risco ? 'text-tijolo' : 'text-tinta',
                    )}
                  >
                    {risco && <span className="sr-only">Atenção: </span>}
                    {cue}
                  </span>
                </li>
              )
            })}
          </ol>

          <section className="mt-7 border-t border-fio pt-4">
            <h3 className={ROTULO}>Por que está no plano</h3>
            <p className="mt-2 max-w-[60ch] text-[15px] leading-[1.47] text-tinta-2">
              {exercicio.meta.porQue}
            </p>
          </section>

          {outrosVideos && (
            <section className="mt-6 border-t border-fio pt-4">
              <h3 className={ROTULO}>Outras versões</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {exercicio.alternativos.map((alt) => (
                  <a
                    key={alt.video}
                    href={urlYouTube(alt.video, alt.inicio)}
                    target="_blank"
                    rel="noopener"
                    className={CHIP}
                  >
                    {alt.nome}
                  </a>
                ))}
                {exercicio.busca && (
                  <a href={urlBusca(exercicio.busca)} target="_blank" rel="noopener" className={CHIP}>
                    Outros vídeos
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                )}
              </div>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
