import {
  GenerateContentResult,
  GoogleGenerativeAI,
  ResponseSchema,
} from '@google/generative-ai'

import { ReadStream } from 'fs'
import { toGeminiSchema } from 'gemini-zod'
import { z, ZodType } from 'zod'
import { AiProvider } from '../provider'

export type GeminiGenerateTextOptions = {
  prompt: string
  system?: { instruction: string }
  history?: string[]
  context?: string
}

enum GeminiModel {
  GEMINI_1_5_FLASH = 'gemini-1.5-flash',
  GEMINI_1_5_PRO = 'gemini-1.5-pro',
}

export enum Temperature {
  CREATIVE = 1,
  DETERMINISTIC = 0.3,
  COLD = 0.1,
}

type BuildMessageOptions = {
  content: string
  history?: string[]
  context?: string
}

export class GeminiProvider implements AiProvider {
  private generativeAI: GoogleGenerativeAI

  constructor() {
    this.initialize()
  }

  fromTextToAudio(text: string): Promise<Buffer> {
    throw new Error('Method not implemented for this provider.')
  }
  generateImage(prompt: string): Promise<string> {
    throw new Error('Method not implemented for this provider.')
  }

  private initialize(): void {
    try {
      const apiKey = process.env.SERVER_GEMINI_API_KEY

      if (!apiKey) {
        console.log(`Set SERVER_GEMINI_API_KEY in your .env to activate Gemini`)
        return
      }

      this.generativeAI = new GoogleGenerativeAI(apiKey)

      console.log(`Gemini is active`)
    } catch (error) {
      console.error(`Gemini failed to start`, error)
    }
  }

  isActive(): boolean {
    return !!this.generativeAI
  }

  async generateText(options: GeminiGenerateTextOptions): Promise<string> {
    return
  }

  async generateJson<
    SchemaType extends ZodType,
    JsonType = z.infer<SchemaType>,
  >(
    instruction: string,
    content: string,
    schema: SchemaType,
  ): Promise<JsonType> {
    return
  }

  async fromAudioToText(readStream: ReadStream): Promise<string> {
    return
  }

  private buildMessages(options: BuildMessageOptions) {
    return
  }

  private parseResponse(response: GenerateContentResult) {
    return
  }

  private parseResponseJson<JsonType = unknown>(response: any): JsonType {
    return
  }

  private async readStreamToBase64(readStream: ReadStream): Promise<string> {
    return
  }
}
