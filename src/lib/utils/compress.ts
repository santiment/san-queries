export async function compressData(json: any[] | Record<string, any>) {
  console.log({ json })
  const stream = new Blob([JSON.stringify(json)], {
    type: 'application/json',
  }).stream()

  const compressedReadableStream = stream.pipeThrough(new window.CompressionStream('gzip'))

  const compressedResponse = new Response(compressedReadableStream)

  // Get response Blob
  const blob = await compressedResponse.blob()
  // Get the ArrayBuffer
  const buffer = await blob.arrayBuffer()

  // convert ArrayBuffer to base64 encoded string
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}
