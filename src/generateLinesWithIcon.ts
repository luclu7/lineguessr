import { readFileSync, writeFileSync } from "fs"
import type { ArretLigne } from "./lines"

const arretLignesJson = readFileSync('arrets-lignes.json', 'utf8')
const arretLignes = JSON.parse(arretLignesJson) as ArretLigne[]

const referentielLignesJson = readFileSync('referentiel-des-lignes.json', 'utf8')

type ReferentielLigne = {
  id_line: string
  name_line: string
  shortname_line: string
  transportmode: string
  transportsubmode: string | null
  type: string | null
  operatorref: string
  operationalname: string
  additionaloperators: string | null
  networkname: string | null
  colourweb_hexa: string
  textcolourweb_hexa: string
  colourprint_cmjn: string
  textcolourprint_hexa: string
  accessibility: string
  audible_signs_available: string
  visual_signs_available: string
  id_groupoflines: string
  shortname_groupoflines: string
  notice_title: string | null
  notice_text: string | null
  picto: {
    thumbnail: boolean
    filename: string
  } | null,
  valid_fromdate: string
  valid_todate: string | null
  status: string
  privatecode: string
  air_conditioning: string
  id_bus_contrat: string | null
}

const referentielLignes = JSON.parse(referentielLignesJson) as ReferentielLigne[]

const getIconForLine = (id_line: string) => {
  const id_line_clean = id_line.replace('IDFM:', '').trim()
  const referentielLigne = referentielLignes.find((ligne) => ligne.id_line === id_line_clean)
  return referentielLigne?.picto?.filename
}

console.log(getIconForLine('IDFM:C01371'))

const arretLignesWithIcon = arretLignes.map((arret) => {
  const icon = getIconForLine(arret.id)
  return {
    ...arret,
    icon,
  }
})

const arretLignesWithIconWithoutBus = arretLignesWithIcon.filter(e => e.mode !== 'Bus')

const arretsLignesOnlyWithIcon = arretLignesWithIconWithoutBus.filter((arret) => !!arret.icon)

if (arretsLignesOnlyWithIcon.filter((arret) => !arret.icon).length > 0) {
  console.error("Arrets without icon: ", arretsLignesOnlyWithIcon.filter((arret) => !arret.icon).map(e => e.stop_name + " on " + e.route_long_name))
  process.exit(1)
}

console.log(`Arrets without icon: ${arretsLignesOnlyWithIcon.filter((arret) => !arret.icon).length}`)
console.log(`Arrets with icon: ${arretsLignesOnlyWithIcon.filter((arret) => arret.icon).length}`)

writeFileSync('arrets-lignes-with-icon.json', JSON.stringify(arretsLignesOnlyWithIcon, null, 2))
