export function readPdfAsBase64(file: File): Promise<string> {
  if (file.type !== 'application/pdf') {
    throw new Error('Il file deve essere un PDF')
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // result is "data:application/pdf;base64,<data>" — strip the prefix
      const base64 = result.split(',')[1]
      if (!base64) reject(new Error('Errore nella lettura del PDF'))
      else resolve(base64)
    }
    reader.onerror = () => reject(new Error('Impossibile leggere il file'))
    reader.readAsDataURL(file)
  })
}
