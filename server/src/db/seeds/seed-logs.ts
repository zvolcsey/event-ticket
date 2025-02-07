export function logSeededBands(bandData: { id: string; name: string }[]) {
  console.log('Bands in the database:')
  bandData.forEach((band) => {
    console.log(`\u{1F3B8} ${band.name}`)
  })
}
