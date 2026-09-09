import { useMemo, useState } from 'react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { TODOS_EXERCICIOS, type ExercicioResolvido } from '@/data'

/** Tira acento e caixa: "Glúteo médio" e "gluteo medio" viram a mesma coisa. */
const semAcento = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

/**
 * Índice montado uma vez, no carregamento do módulo. Cada exercício vira uma
 * única string já sem acento com nome + músculo primário + secundários +
 * equipamento, que é onde a busca precisa acertar.
 */
const INDICE = TODOS_EXERCICIOS.map((exercicio) => ({
  exercicio,
  chave: semAcento(
    [
      exercicio.nome,
      exercicio.meta.musculoPrimario,
      ...exercicio.meta.musculosSecundarios,
      exercicio.meta.equipamento,
    ].join(' '),
  ),
}))

/**
 * Cada palavra digitada precisa aparecer no índice ("panturrilha maquina" acha
 * a panturrilha sentada). A ordem do resultado é a ordem do protocolo, nunca um
 * ranking: a lista é um índice impresso, não um feed.
 */
function filtrar(termo: string): ExercicioResolvido[] {
  const palavras = semAcento(termo).split(/\s+/).filter(Boolean)
  if (palavras.length === 0) return INDICE.map((linha) => linha.exercicio)
  return INDICE.filter((linha) => palavras.every((p) => linha.chave.includes(p))).map(
    (linha) => linha.exercicio,
  )
}

/**
 * O CommandInput do shadcn embrulha o campo num InputGroup com moldura, fundo e
 * cantos arredondados — uma caixinha, exatamente o que a direção "Protocolo"
 * não tem. Aqui a caixa é neutralizada e o único dispositivo que sobra é o
 * filete de 1px que o wrapper abaixo desenha. Os seletores de descendente têm
 * especificidade maior que as classes do próprio InputGroup, então vencem
 * inclusive as marcadas com `!`.
 */
const CAMPO_SEM_CAIXA = [
  '[&_[data-slot=command-input-wrapper]]:p-0',
  '[&_[data-slot=input-group]]:h-14!',
  '[&_[data-slot=input-group]]:rounded-none!',
  '[&_[data-slot=input-group]]:border-transparent!',
  '[&_[data-slot=input-group]]:bg-transparent!',
  '[&_[data-slot=input-group]]:px-5',
  // seletor mais longo de propósito: o CommandInput manda um `pl-2!` no addon
  '[&_[data-slot=input-group]>[data-slot=input-group-addon]]:pl-0!',
  '[&_[data-slot=input-group-addon]]:text-tinta-2!',
  '[&_[data-slot=input-group-addon]>svg]:opacity-100',
].join(' ')

type Props = {
  aberta: boolean
  onFechar: () => void
  onEscolher: (exercicio: ExercicioResolvido) => void
}

export function Busca({ aberta, onFechar, onEscolher }: Props) {
  const [termo, setTermo] = useState('')
  const [estavaAberta, setEstavaAberta] = useState(aberta)

  // Fechou, esqueceu: reabrir a paleta sempre parte do índice inteiro. Ajuste
  // de estado em render (o padrão do React para prop que mudou), não em effect:
  // effect aqui pintaria uma vez a lista velha antes de limpar.
  if (aberta !== estavaAberta) {
    setEstavaAberta(aberta)
    if (!aberta) setTermo('')
  }

  const resultados = useMemo(() => filtrar(termo), [termo])

  return (
    <CommandDialog
      open={aberta}
      onOpenChange={(aberto) => {
        if (!aberto) onFechar()
      }}
      title="Buscar exercício"
      description="Busque por nome, músculo ou equipamento e abra o exercício."
      className="top-[10vh] rounded-[20px]! border border-fio bg-papel p-0 text-tinta ring-0 sm:max-w-[560px]"
    >
      <Command
        label="Buscar exercício"
        shouldFilter={false}
        className={`rounded-none! bg-papel p-0 text-tinta ${CAMPO_SEM_CAIXA}`}
      >
        <div className="border-b border-fio">
          <CommandInput
            value={termo}
            onValueChange={setTermo}
            placeholder="Buscar exercício, músculo ou equipamento…"
            className="text-[17px] leading-none tracking-[-0.013em] text-tinta placeholder:text-tinta-2"
          />
        </div>

        <CommandList className="max-h-[min(60vh,26rem)] scroll-py-0">
          <CommandEmpty className="px-5 py-10 text-left text-[15px] text-tinta-2">
            Nenhum exercício encontrado.
          </CommandEmpty>

          <CommandGroup className="p-0 text-tinta">
            {resultados.map((exercicio) => (
              <CommandItem
                key={exercicio.id}
                value={exercicio.id}
                onSelect={() => onEscolher(exercicio)}
                className={[
                  // linha de índice: filete separando, nunca caixa envolvendo
                  'min-h-[52px] cursor-pointer gap-3 rounded-none border-t border-fio px-5 py-3',
                  'first:border-t-0 in-data-[slot=dialog-content]:rounded-none!',
                  'data-selected:bg-papel-2 data-selected:text-tinta',
                  // indicador ativo: um traço de 2px em --carimbo na margem
                  'before:absolute before:top-0 before:left-0 before:h-full before:w-[2px]',
                  'before:bg-carimbo before:opacity-0 before:transition-opacity before:duration-150',
                  'data-selected:before:opacity-100',
                  // o CommandItem do shadcn injeta um ícone de check no fim da linha
                  '[&>svg]:hidden',
                ].join(' ')}
              >
                <span className="w-9 shrink-0 font-mono text-[12px] tracking-[0.04em] tabular-nums text-carimbo">
                  {exercicio.numero}
                </span>
                <span className="min-w-0 flex-1 truncate text-[17px] leading-[1.294] tracking-[-0.013em] text-tinta">
                  {exercicio.nome}
                </span>
                <span className="max-w-[38%] shrink-0 truncate font-mono text-[11px] tracking-[0.06em] text-tinta-2 uppercase">
                  {exercicio.meta.musculoPrimario}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>

        <div className="flex items-baseline justify-between gap-4 border-t border-fio px-5 py-3 font-mono text-[11px] tracking-[0.06em] text-tinta-2 uppercase">
          <span className="tabular-nums">
            {resultados.length} de {TODOS_EXERCICIOS.length} exercícios
          </span>
          <span className="hidden shrink-0 sm:inline">↑↓ navegar · ↵ abrir · esc fechar</span>
        </div>
      </Command>
    </CommandDialog>
  )
}
