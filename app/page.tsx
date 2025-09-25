"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Upgrade {
  id: string
  name: string
  description: string
  baseCost: number
  currentCost: number
  owned: number
  multiplier: number
  icon: string
  type: "pps" | "cpc" // points per second or clicks per click
}

interface TRexSkin {
  id: string
  name: string
  cost: number
  owned: boolean
  emoji: string
  description: string
}

export default function TRexClicker() {
  const [points, setPoints] = useState(0)
  const [clickMultiplier, setClickMultiplier] = useState(1)
  const [clickStreak, setClickStreak] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [pointsPerSecond, setPointsPerSecond] = useState(0)
  const [clickPower, setClickPower] = useState(1) // Added base click power
  const [selectedSkin, setSelectedSkin] = useState("🦕")
  const [showClickEffect, setShowClickEffect] = useState(false)

  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    // Early PPS Upgrades
    {
      id: "claws",
      name: "Garras Afiadas",
      description: "Garras mais afiadas para caçar melhor",
      baseCost: 15,
      currentCost: 15,
      owned: 0,
      multiplier: 1,
      icon: "🦴",
      type: "pps",
    },
    {
      id: "roar",
      name: "Rugido Poderoso",
      description: "Um rugido que intimida as presas",
      baseCost: 100,
      currentCost: 100,
      owned: 0,
      multiplier: 5,
      icon: "🔊",
      type: "pps",
    },
    {
      id: "speed",
      name: "Velocidade Jurássica",
      description: "Corre mais rápido que qualquer presa",
      baseCost: 500,
      currentCost: 500,
      owned: 0,
      multiplier: 25,
      icon: "💨",
      type: "pps",
    },

    // CPC Upgrades
    {
      id: "bite_force",
      name: "Força da Mordida",
      description: "Cada mordida é mais poderosa",
      baseCost: 250,
      currentCost: 250,
      owned: 0,
      multiplier: 1,
      icon: "🦷",
      type: "cpc",
    },
    {
      id: "hunting_instinct",
      name: "Instinto de Caça",
      description: "Melhora a precisão dos ataques",
      baseCost: 1000,
      currentCost: 1000,
      owned: 0,
      multiplier: 3,
      icon: "🎯",
      type: "cpc",
    },
    {
      id: "alpha_dominance",
      name: "Dominância Alpha",
      description: "Cada clique demonstra superioridade",
      baseCost: 5000,
      currentCost: 5000,
      owned: 0,
      multiplier: 10,
      icon: "👑",
      type: "cpc",
    },

    // Mid-tier PPS Upgrades
    {
      id: "pack",
      name: "Matilha de T-Rex",
      description: "Outros T-Rex se juntam à caçada",
      baseCost: 2000,
      currentCost: 2000,
      owned: 0,
      multiplier: 100,
      icon: "🦖",
      type: "pps",
    },
    {
      id: "territory",
      name: "Território Dominado",
      description: "Controla uma vasta área de caça",
      baseCost: 10000,
      currentCost: 10000,
      owned: 0,
      multiplier: 500,
      icon: "🌿",
      type: "pps",
    },
    {
      id: "prehistoric_valley",
      name: "Vale Pré-Histórico",
      description: "Um vale inteiro cheio de presas",
      baseCost: 50000,
      currentCost: 50000,
      owned: 0,
      multiplier: 2500,
      icon: "🏔️",
      type: "pps",
    },
    {
      id: "dino_empire",
      name: "Império Dinossauro",
      description: "Governa todos os dinossauros",
      baseCost: 250000,
      currentCost: 250000,
      owned: 0,
      multiplier: 12500,
      icon: "🏛️",
      type: "pps",
    },

    // High-tier CPC Upgrades
    {
      id: "prehistoric_rage",
      name: "Fúria Pré-Histórica",
      description: "Cada clique libera fúria ancestral",
      baseCost: 25000,
      currentCost: 25000,
      owned: 0,
      multiplier: 25,
      icon: "😤",
      type: "cpc",
    },
    {
      id: "meteor_power",
      name: "Poder do Meteoro",
      description: "Absorveu energia do meteoro que extinguiu os dinossauros",
      baseCost: 100000,
      currentCost: 100000,
      owned: 0,
      multiplier: 100,
      icon: "☄️",
      type: "cpc",
    },

    // Ultra high-tier PPS Upgrades (millions per second)
    {
      id: "time_portal",
      name: "Portal do Tempo",
      description: "Caça em múltiplas eras simultaneamente",
      baseCost: 1000000,
      currentCost: 1000000,
      owned: 0,
      multiplier: 50000,
      icon: "🌀",
      type: "pps",
    },
    {
      id: "multiverse_rex",
      name: "T-Rex Multiversal",
      description: "Existe em todas as realidades",
      baseCost: 5000000,
      currentCost: 5000000,
      owned: 0,
      multiplier: 250000,
      icon: "🌌",
      type: "pps",
    },
    {
      id: "cosmic_predator",
      name: "Predador Cósmico",
      description: "Caça planetas inteiros",
      baseCost: 25000000,
      currentCost: 25000000,
      owned: 0,
      multiplier: 1000000,
      icon: "🪐",
      type: "pps",
    },
    {
      id: "universal_apex",
      name: "Ápice Universal",
      description: "O predador supremo de todo o universo",
      baseCost: 100000000,
      currentCost: 100000000,
      owned: 0,
      multiplier: 5000000,
      icon: "🌟",
      type: "pps",
    },

    // Ultimate CPC Upgrades
    {
      id: "reality_bite",
      name: "Mordida da Realidade",
      description: "Cada clique quebra a própria realidade",
      baseCost: 10000000,
      currentCost: 10000000,
      owned: 0,
      multiplier: 1000,
      icon: "💥",
      type: "cpc",
    },
    {
      id: "infinite_hunger",
      name: "Fome Infinita",
      description: "Nunca se satisfaz, sempre quer mais",
      baseCost: 50000000,
      currentCost: 50000000,
      owned: 0,
      multiplier: 5000,
      icon: "♾️",
      type: "cpc",
    },
  ])

  const [skins, setSkins] = useState<TRexSkin[]>([
    {
      id: "default",
      name: "T-Rex Clássico",
      cost: 0,
      owned: true,
      emoji: "🦕",
      description: "O T-Rex original",
    },
    {
      id: "fierce",
      name: "T-Rex Feroz",
      cost: 500,
      owned: false,
      emoji: "🦖",
      description: "Mais agressivo e intimidador",
    },
    {
      id: "king",
      name: "Rei dos Dinossauros",
      cost: 2500,
      owned: false,
      emoji: "👑",
      description: "O soberano da era jurássica",
    },
    {
      id: "fire",
      name: "T-Rex de Fogo",
      cost: 10000,
      owned: false,
      emoji: "🔥",
      description: "Poder elemental do fogo",
    },
    {
      id: "ice",
      name: "T-Rex Glacial",
      cost: 50000,
      owned: false,
      emoji: "🧊",
      description: "Sobreviveu à era do gelo",
    },
    {
      id: "cyber",
      name: "Cyber T-Rex",
      cost: 250000,
      owned: false,
      emoji: "🤖",
      description: "Evolução tecnológica",
    },
    {
      id: "cosmic",
      name: "T-Rex Cósmico",
      cost: 1000000,
      owned: false,
      emoji: "🌟",
      description: "Transcendeu para o cosmos",
    },
  ])

  useEffect(() => {
    const totalPPS = upgrades.reduce((total, upgrade) => {
      if (upgrade.type === "pps") {
        return total + upgrade.owned * upgrade.multiplier
      }
      return total
    }, 0)
    setPointsPerSecond(totalPPS)
  }, [upgrades])

  useEffect(() => {
    const totalCPC = upgrades.reduce((total, upgrade) => {
      if (upgrade.type === "cpc") {
        return total + upgrade.owned * upgrade.multiplier
      }
      return total
    }, 1) // Start with base 1
    setClickPower(totalCPC)
  }, [upgrades])

  // Passive income generation
  useEffect(() => {
    if (pointsPerSecond > 0) {
      const interval = setInterval(() => {
        setPoints((prev) => prev + pointsPerSecond)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [pointsPerSecond])

  // Click streak timer
  useEffect(() => {
    const now = Date.now()
    if (now - lastClickTime > 2000 && clickStreak > 0) {
      setClickStreak(0)
      setClickMultiplier(1)
    }
  }, [lastClickTime, clickStreak])

  const handleTRexClick = useCallback(() => {
    const now = Date.now()
    setLastClickTime(now)

    // Build click streak
    if (now - lastClickTime < 2000) {
      setClickStreak((prev) => Math.min(prev + 1, 10))
    } else {
      setClickStreak(1)
    }

    // Calculate multiplier based on streak
    const newMultiplier = Math.min(1 + clickStreak * 0.2, 3)
    setClickMultiplier(newMultiplier)

    const pointsToAdd = Math.floor(clickPower * newMultiplier)
    setPoints((prev) => prev + pointsToAdd)

    // Visual effect
    setShowClickEffect(true)
    setTimeout(() => setShowClickEffect(false), 300)
  }, [lastClickTime, clickStreak, clickPower])

  const buyUpgrade = (upgradeId: string) => {
    setUpgrades((prev) =>
      prev.map((upgrade) => {
        if (upgrade.id === upgradeId && points >= upgrade.currentCost) {
          setPoints((currentPoints) => currentPoints - upgrade.currentCost)
          const newCost = Math.floor(upgrade.currentCost * 1.5)
          return {
            ...upgrade,
            owned: upgrade.owned + 1,
            currentCost: newCost,
          }
        }
        return upgrade
      }),
    )
  }

  const buySkin = (skinId: string) => {
    const skin = skins.find((s) => s.id === skinId)
    if (skin && !skin.owned && points >= skin.cost) {
      setPoints((currentPoints) => currentPoints - skin.cost)
      setSkins((prev) => prev.map((s) => (s.id === skinId ? { ...s, owned: true } : s)))
    }
  }

  const selectSkin = (skinEmoji: string) => {
    setSelectedSkin(skinEmoji)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + "B"
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(1) + "K"
    return Math.floor(num).toString()
  }

  return (
    <div className="min-h-screen jungle-pattern p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-primary mb-2">🦕 T-REX CLICKER 🦖</h1>
          <p className="text-xl text-muted-foreground">Domine a Era Jurássica!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <Card className="bg-card/80 backdrop-blur">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary">{formatNumber(points)}</div>
                    <div className="text-sm text-muted-foreground">Pontos de Caça</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary">{formatNumber(pointsPerSecond)}/s</div>
                    <div className="text-sm text-muted-foreground">Por Segundo</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">{clickStreak}</div>
                    <div className="text-sm text-muted-foreground">Sequência</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{clickMultiplier.toFixed(1)}x</div>
                    <div className="text-sm text-muted-foreground">Multiplicador</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* T-Rex Clicker */}
            <Card className="bg-card/80 backdrop-blur">
              <CardContent className="p-8 text-center">
                <div className="mb-4">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Clique no T-Rex! Sequência: {clickStreak}/10
                  </Badge>
                </div>

                {clickStreak > 0 && (
                  <div className="mb-4">
                    <Progress value={(clickStreak / 10) * 100} className="h-3" />
                    <p className="text-sm text-muted-foreground mt-2">Continue clicando para manter o multiplicador!</p>
                  </div>
                )}

                <Button
                  onClick={handleTRexClick}
                  className={`text-9xl p-8 h-auto bg-transparent hover:bg-transparent border-4 border-primary rounded-full transition-all duration-300 ${
                    showClickEffect ? "click-ripple" : ""
                  } ${clickMultiplier > 1 ? "multiplier-glow" : ""} trex-glow`}
                  size="lg"
                >
                  {selectedSkin}
                </Button>

                <div className="mt-4">
                  <p className="text-lg text-muted-foreground">
                    +{formatNumber(Math.floor(clickPower * clickMultiplier))} pontos por clique
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Poder base: {formatNumber(clickPower)} | Multiplicador: {clickMultiplier.toFixed(1)}x
                  </p>
                  {clickMultiplier > 1 && <p className="text-sm text-primary font-bold">🔥 MULTIPLICADOR ATIVO! 🔥</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upgrades & Skins */}
          <div className="space-y-6">
            {/* Upgrades */}
            <Card className="bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-primary">🦴 Upgrades Jurássicos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                {upgrades.map((upgrade) => (
                  <div
                    key={upgrade.id}
                    onClick={() => points >= upgrade.currentCost && buyUpgrade(upgrade.id)}
                    className={`upgrade-shine p-3 rounded-lg border transition-all duration-300 cursor-pointer select-none ${
                      points >= upgrade.currentCost
                        ? "border-primary bg-primary/10 hover:bg-primary/20 active:bg-primary/30"
                        : "border-muted bg-muted/20 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{upgrade.icon}</span>
                        <div>
                          <div className="font-semibold text-sm">{upgrade.name}</div>
                          <div className="text-xs text-muted-foreground">Possuído: {upgrade.owned}</div>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded text-xs font-bold ${
                          points >= upgrade.currentCost
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {formatNumber(upgrade.currentCost)}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{upgrade.description}</p>
                    <p className="text-xs text-primary">
                      {upgrade.type === "pps"
                        ? `+${formatNumber(upgrade.multiplier)}/s cada`
                        : `+${formatNumber(upgrade.multiplier)} por clique cada`}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Skins */}
            <Card className="bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-primary">🎨 Skins de T-Rex</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {skins.map((skin) => (
                  <div
                    key={skin.id}
                    onClick={() => {
                      if (skin.owned) {
                        selectSkin(skin.emoji)
                      } else if (points >= skin.cost) {
                        buySkin(skin.id)
                      }
                    }}
                    className={`p-3 rounded-lg border transition-all duration-300 cursor-pointer select-none ${
                      skin.owned
                        ? "border-primary bg-primary/10 hover:bg-primary/20"
                        : points >= skin.cost
                          ? "border-secondary bg-secondary/10 hover:bg-secondary/20 active:bg-secondary/30"
                          : "border-muted bg-muted/20 cursor-not-allowed opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{skin.emoji}</span>
                        <div>
                          <div className="font-semibold text-sm">{skin.name}</div>
                          <div className="text-xs text-muted-foreground">{skin.description}</div>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded text-xs font-bold ${
                          skin.owned
                            ? selectedSkin === skin.emoji
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                            : points >= skin.cost
                              ? "bg-secondary text-secondary-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {skin.owned ? (selectedSkin === skin.emoji ? "Ativo" : "Usar") : formatNumber(skin.cost)}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
