import { useState } from "react"

interface CalcButton {
  label: string
  action: () => void
  style?: string
  active?: boolean
  wide?: boolean
}

export default function App() {
  const [display, setDisplay] = useState("0")
  const [prev, setPrev] = useState<number | null>(null)
  const [op, setOp] = useState<string | null>(null)
  const [reset, setReset] = useState(false)

  // Todas as funções declaradas ANTES de serem usadas
  const inputDigit = (d: string) => {
    if (reset) { setDisplay(d); setReset(false); return }
    setDisplay(display === "0" ? d : display + d)
  }

  const inputDot = () => {
    if (reset) { setDisplay("0."); setReset(false); return }
    if (!display.includes(".")) setDisplay(display + ".")
  }

  const calculate = (a: number, b: number, operator: string): number => {
    switch (operator) {
      case "+": return a + b
      case "-": return a - b
      case "×": return a * b
      case "÷": return b !== 0 ? a / b : 0
      default: return b
    }
  }

  const handleOp = (nextOp: string) => {
    const val = parseFloat(display)
    if (prev !== null && op && !reset) {
      const result = calculate(prev, val, op)
      setDisplay(String(parseFloat(result.toPrecision(10))))
      setPrev(result)
    } else {
      setPrev(val)
    }
    setOp(nextOp)
    setReset(true)
  }

  const handleEquals = () => {
    if (prev === null || !op) return
    const val = parseFloat(display)
    const result = calculate(prev, val, op)
    setDisplay(String(parseFloat(result.toPrecision(10))))
    setPrev(null)
    setOp(null)
    setReset(true)
  }

  const clear = () => { setDisplay("0"); setPrev(null); setOp(null); setReset(false) }
  const toggleSign = () => setDisplay(String(parseFloat(display) * -1))
  const percent = () => setDisplay(String(parseFloat(display) / 100))

  // Layout estilo iPhone
  const buttons: CalcButton[][] = [
    [
      { label: "C", action: clear, style: "func" },
      { label: "+/-", action: toggleSign, style: "func" },
      { label: "%", action: percent, style: "func" },
      { label: "÷", action: () => handleOp("÷"), style: "op", active: op === "÷" && reset },
    ],
    [
      { label: "7", action: () => inputDigit("7") },
      { label: "8", action: () => inputDigit("8") },
      { label: "9", action: () => inputDigit("9") },
      { label: "×", action: () => handleOp("×"), style: "op", active: op === "×" && reset },
    ],
    [
      { label: "4", action: () => inputDigit("4") },
      { label: "5", action: () => inputDigit("5") },
      { label: "6", action: () => inputDigit("6") },
      { label: "-", action: () => handleOp("-"), style: "op", active: op === "-" && reset },
    ],
    [
      { label: "1", action: () => inputDigit("1") },
      { label: "2", action: () => inputDigit("2") },
      { label: "3", action: () => inputDigit("3") },
      { label: "+", action: () => handleOp("+"), style: "op", active: op === "+" && reset },
    ],
    [
      { label: "0", action: () => inputDigit("0"), wide: true },
      { label: ".", action: inputDot },
      { label: "=", action: handleEquals, style: "op" },
    ],
  ]

  const btnStyle = (s?: string, active?: boolean) => {
    if (s === "func") return "bg-[#a5a5a5] text-black active:bg-[#d9d9d9]"
    if (s === "op") return active ? "bg-white text-[#ff9f0a]" : "bg-[#ff9f0a] text-white active:bg-[#fcc580]"
    return "bg-[#333333] text-white active:bg-[#737373]"
  }

  const fontSize = display.length > 8 ? "text-4xl" : display.length > 6 ? "text-5xl" : "text-6xl"

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-xs">
        {/* Display */}
        <div className="text-right px-4 pb-3 pt-8">
          <div className={`${fontSize} font-light text-white tracking-tight truncate`}>
            {display}
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3 px-2">
          {buttons.map((row, ri) => (
            <div key={ri} className="flex gap-3 justify-center">
              {row.map((b, bi) => (
                <button
                  key={bi}
                  onClick={b.action}
                  className={`
                    ${b.wide ? "w-[152px]" : "w-[72px]"} h-[72px] rounded-full
                    ${btnStyle(b.style, b.active)}
                    text-2xl font-normal transition-all select-none
                    ${b.wide ? "text-left pl-7" : ""}
                  `}
                >
                  {b.label}
                </button>
              ))}
            </div>
          ))}
        </div>

        <p className="text-center text-[10px] text-zinc-700 mt-6">Synerium Factory</p>
      </div>
    </div>
  )
}
