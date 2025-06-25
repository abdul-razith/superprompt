
import { pipeline } from '@huggingface/transformers';

export class ModelManager {
  private static instance: ModelManager;
  private textGenerator: any = null;
  private classifier: any = null;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): ModelManager {
    if (!ModelManager.instance) {
      ModelManager.instance = new ModelManager();
    }
    return ModelManager.instance;
  }

  public async initializeModels() {
    if (this.isInitialized) return;
    
    console.log('Initializing AI models...');
    
    try {
      // Initialize text generation model with WebGPU acceleration
      console.log('Loading text generation model...');
      this.textGenerator = await pipeline(
        'text-generation',
        'Xenova/gpt2',
        { 
          device: 'webgpu',
          dtype: 'fp16'
        }
      );
      console.log('✅ Text generator initialized with WebGPU');
    } catch (error) {
      console.warn('WebGPU not available for text generation, using CPU:', error);
      try {
        this.textGenerator = await pipeline(
          'text-generation',
          'Xenova/gpt2',
          { device: 'cpu' }
        );
        console.log('✅ Text generator initialized with CPU');
      } catch (fallbackError) {
        console.warn('Using DistilGPT-2 as fallback:', fallbackError);
        this.textGenerator = await pipeline(
          'text-generation',
          'Xenova/distilgpt2'
        );
      }
    }

    try {
      // Initialize classification model for prompt analysis
      console.log('Loading classification model...');
      this.classifier = await pipeline(
        'text-classification',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
        { device: 'webgpu' }
      );
      console.log('✅ Classifier initialized');
    } catch (error) {
      console.warn('Using CPU for classifier:', error);
      this.classifier = await pipeline(
        'text-classification',
        'Xenova/distilbert-base-uncased-finetuned-sst-2-english'
      );
    }

    this.isInitialized = true;
    console.log('🚀 AI models ready for processing!');
  }

  public getTextGenerator() {
    return this.textGenerator;
  }

  public getClassifier() {
    return this.classifier;
  }

  public isReady(): boolean {
    return this.isInitialized;
  }
}

export const modelManager = ModelManager.getInstance();
