import { arrayShuffle } from "array-shuffle"
import arretLignesJson from "./arrets-lignes-with-icon.json"

export type ArretLigneWithIcon = {
  icon: string
} & ArretLigne

export type LineWithIcon = {
  id: string
  route_long_name: string
  icon: string
}

export type ArretLigne = {
  id: string
  route_long_name: string
  stop_id: string
  stop_name: string
  stop_lon: string
  stop_lat: string
  operationalname: string
  shortname: string
  bookingrules: string | null
  mode: string
  pointgeo: PointGeo
  nom_commune: string
  code_insee: string
}

type PointGeo = {
  lon: number
  lat: number
}

export const arretsLignes = (arretLignesJson as unknown as ArretLigneWithIcon[])

export const lines = arretsLignes.map(e => {return {
  route_long_name: e.route_long_name,
  icon: e.icon,
  id: e.id,
}}).filter((e, index, self) =>
  index === self.findIndex((t) => t.id === e.id)
)

export const getRandomLineIcon = (previousLine?: string): LineWithIcon => {
  const randomLine = lines.filter(e => e.route_long_name !== previousLine).map(e => ({route_long_name: e.route_long_name, icon: e.icon, id: e.id}))
  return randomLine[Math.floor(Math.random() * randomLine.length)] ?? {route_long_name: '', icon: ''}
}

export const getThreeOtherRandomLineIcons = (lineToAvoid?: LineWithIcon | ArretLigneWithIcon): LineWithIcon[] => {
  console.log("Previous line: ", lineToAvoid?.route_long_name, " - ", lineToAvoid?.id)
  const stopId = lineToAvoid && "stop_id" in lineToAvoid ? lineToAvoid.stop_id : undefined
  const lineIdsAtSameStop = new Set(
    stopId
      ? arretsLignes
          .filter((arretLigne) => arretLigne.stop_id === stopId)
          .map((arretLigne) => arretLigne.id)
      : []
  )
  const randomLines = lines.filter((line) => {
    if (lineToAvoid?.id && line.id === lineToAvoid.id) return false
    return !lineIdsAtSameStop.has(line.id)
  })

  console.log("Lines at same stop: ", lineIdsAtSameStop.size)

  // create the list of lines that share the same stop

 
  
  // randomize the lines
  arrayShuffle(randomLines);

 console.log("Random lines: ", randomLines.slice(0, 3).map(e => e.route_long_name))
  
  return randomLines.slice(0, 3).map(e => ({route_long_name: e.route_long_name, icon: e.icon, id: e.id}))
}
  
export const getRandomArret = (previousArret?: string): ArretLigneWithIcon => {
  const randomArret = arretsLignes[Math.floor(Math.random() * arretsLignes.length)]
  if (previousArret && randomArret.id === previousArret) {
    return getRandomArret(previousArret)
  }
  console.log("Random arret: ", randomArret.stop_name, " - ", randomArret.id)
  return randomArret
}