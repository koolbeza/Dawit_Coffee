"use client"

import { useEffect, useMemo, useState } from "react"
import { geoInterpolate, geoNaturalEarth1, geoPath } from "d3-geo"
import type { Geometry, LineString } from "geojson"

type Coordinates = [number, number]

type WorldFeature = {
  id?: string | number
  geometry: Geometry
}

type WorldGeoJson = {
  features: WorldFeature[]
}

const geoUrl = "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"

const ETHIOPIA: Coordinates = [40.4897, 9.145]

const connections: { name: string; coords: Coordinates }[] = [
  { name: "United States", coords: [-95.7129, 37.0902] },
  { name: "France", coords: [2.2137, 46.2276] },
  { name: "Germany", coords: [10.4515, 51.1657] },
  { name: "Italy", coords: [12.5674, 41.8719] },
  { name: "UAE", coords: [53.8478, 23.4241] },
  { name: "Australia", coords: [133.7751, -25.2744] },
  { name: "Russia", coords: [105.3188, 61.524] },
  { name: "Tunisia", coords: [9.5375, 33.8869] },
  { name: "Spain", coords: [-3.7492, 40.4637] },
  { name: "Netherlands", coords: [5.2913, 52.1326] },
  { name: "Belgium", coords: [4.4699, 50.5039] },
  { name: "Switzerland", coords: [8.2275, 46.8182] },
]

const WIDTH = 960
const HEIGHT = 500

type ProjectedConnection = {
  name: string
  coords: Coordinates
  x: number
  y: number
}

export default function WorldConnections() {
  const [world, setWorld] = useState<WorldGeoJson | null>(null)

  const projection = useMemo(
    () => geoNaturalEarth1().scale(170).translate([WIDTH / 2, HEIGHT / 2]),
    []
  )

  const pathGenerator = useMemo(() => geoPath(projection), [projection])

  useEffect(() => {
    let active = true

    const loadWorld = async () => {
      try {
        const res = await fetch(geoUrl)
        if (!res.ok) return
        const data = (await res.json()) as WorldGeoJson
        if (active) setWorld(data)
      } catch {
        // map renders without country outlines if CDN is unreachable
      }
    }

    void loadWorld()

    return () => {
      active = false
    }
  }, [])

  const projectPoint = (coords: Coordinates): [number, number] | null => {
    const projected = projection(coords)
    if (!projected) {
      return null
    }
    return [projected[0], projected[1]]
  }

  const linePath = (from: Coordinates, to: Coordinates): string => {
    const interpolate = geoInterpolate(from, to)
    const arcCoordinates = Array.from({ length: 30 }, (_, idx) => interpolate(idx / 29))
    const arc = {
      type: "LineString",
      coordinates: arcCoordinates,
    } as LineString
    return pathGenerator(arc) ?? ""
  }

  const labelStyle = {
    fill: "#2f2016",
    fontSize: 11,
    fontWeight: 600,
    paintOrder: "stroke",
    stroke: "#f7efe8",
    strokeWidth: 3,
    strokeLinejoin: "round",
  } as const

  const projectedConnections = useMemo<ProjectedConnection[]>(
    () =>
      connections
        .map((connection) => {
          const p = projection(connection.coords)
          if (!p) return null
          return { ...connection, x: p[0], y: p[1] }
        })
        .filter((v): v is ProjectedConnection => v !== null),
    [projection]
  )

  const labelYByName = useMemo(() => {
    const MIN_GAP = 14
    const TOP = 12
    const BOTTOM = HEIGHT - 12

    const placeSide = (items: ProjectedConnection[]) => {
      const sorted = [...items].sort((a, b) => a.y - b.y)
      const placed = sorted.map((item) => ({
        name: item.name,
        y: Math.max(TOP, Math.min(BOTTOM, item.y - 8)),
      }))

      for (let i = 1; i < placed.length; i++) {
        if (placed[i].y - placed[i - 1].y < MIN_GAP) {
          placed[i].y = placed[i - 1].y + MIN_GAP
        }
      }

      for (let i = placed.length - 2; i >= 0; i--) {
        if (placed[i + 1].y > BOTTOM) {
          placed[i + 1].y = BOTTOM
        }
        if (placed[i + 1].y - placed[i].y < MIN_GAP) {
          placed[i].y = placed[i + 1].y - MIN_GAP
        }
      }

      for (const p of placed) {
        p.y = Math.max(TOP, Math.min(BOTTOM, p.y))
      }

      return placed
    }

    const left = projectedConnections.filter((c) => c.x <= WIDTH / 2)
    const right = projectedConnections.filter((c) => c.x > WIDTH / 2)

    const map = new Map<string, number>()
    for (const p of placeSide(left)) map.set(p.name, p.y)
    for (const p of placeSide(right)) map.set(p.name, p.y)

    return map
  }, [projectedConnections])

  return (
    <div className="h-[500px] w-full bg-[#023732]">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-full w-full" role="img" aria-label="World export connections map">
        {world?.features.map((feature, index) => {
          const d = pathGenerator(feature.geometry)
          if (!d) {
            return null
          }

          return <path key={feature.id ?? index} d={d} fill="#e5e5e5" stroke="#444" strokeWidth={0.6} />
        })}

        {connections.map((connection) => (
          <path
            key={connection.name}
            d={linePath(ETHIOPIA, connection.coords)}
            fill="none"
            stroke="yellow"
            strokeWidth={2}
            strokeLinecap="round"
            strokeOpacity={0.9}
          />
        ))}

        {(() => {
          const point = projectPoint(ETHIOPIA)
          if (!point) {
            return null
          }

          return (
            <g>
              <circle cx={point[0]} cy={point[1]} r={6} fill="#2f9e44" />
              <text x={point[0] + 10} y={point[1] - 10} style={labelStyle}>
                Ethiopia (Origin)
              </text>
            </g>
          )
        })()}

        {projectedConnections.map((connection) => {
          return (
            <g key={`${connection.name}-marker`}>
              <circle cx={connection.x} cy={connection.y} r={4} fill="#a0522d" />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
