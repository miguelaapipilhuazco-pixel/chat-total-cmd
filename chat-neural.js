import { pipeline } from '@xenova/transformers';
let classifier = null;
export async function inicializarPipeline() {
  try {
    classifier = await pipeline('sentiment-analysis', 'Xenova/bert-base-multilingual-uncased-sentiment');
    console.log('[NEURAL] Red Neuronal BERT compilada con exito localmente.');
  } catch (e) {}
}
export async function evaluarIntencion(message) {
  if (!classifier) return { label: 'Cargando Tensores', score: 0.0 };
  try { return await classifier(message); } catch (e) { return null; }
}