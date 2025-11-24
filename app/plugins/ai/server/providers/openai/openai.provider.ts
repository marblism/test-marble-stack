import { ReadStream } from 'fs'
import OpenaiSDK from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { ParsedChatCompletion } from 'openai/resources/beta/chat/completions'
import { z, ZodType } from 'zod'

export type OpenaiGenerateTextOptions = {
  prompt: string
  attachmentUrls?: string[]
  history?: string[]
  context?: string
}

enum OpenaiModel {
  DEFAULT = 'gpt-4o-mini',
  JSON = 'gpt-4o-mini',
  IMAGE = 'dall-e-3',
  AUDIO_TO_TEXT = 'whisper-1',
  TEXT_TO_AUDIO = 'tts-1',
}

type BuildMessageOptions = {
  content: string
  attachmentUrls?: string[]
  history?: string[]
  context?: string
}

export class OpenaiProvider {
  private api: OpenaiSDK

  constructor() {
    this.initialize()
  }

  private initialize(): void {
    try {
      const apiKey = process.env.SERVER_OPENAI_API_KEY

      if (!apiKey) {
        console.log(`Set SERVER_OPENAI_API_KEY in your .env to activate OpenAI`)
        return
      }

      this.api = new OpenaiSDK({ apiKey })

      console.log(`Openai is active`)
    } catch (error) {
      console.error(`Openai failed to start`)
    }
  }

  isActive(): boolean {
    if (this.api) {
      return true
    } else {
      return false
    }
  }

  async generateText(options: OpenaiGenerateTextOptions): Promise<string> {
    return
  }

  async generateJson<
    SchemaType extends ZodType,
    JsonType = z.infer<SchemaType>,
  >(
    instruction: string,
    content: string,
    schema: SchemaType,
    attachmentUrls?: string[],
  ): Promise<JsonType> {
    return
  }

  async generateImage(prompt: string): Promise<string> {
    return
  }

  async fromAudioToText(readStream: ReadStream): Promise<string> {
    return
  }

  async fromTextToAudio(text: string): Promise<Buffer> {
    return
  }
}
