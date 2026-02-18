import { response } from 'express'
import { ReadStream } from 'fs'
import OpenaiSDK from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { ParsedChatCompletion } from 'openai/resources/beta/chat/completions'
import { z, ZodType } from 'zod'

type Message = OpenaiSDK.Chat.Completions.ChatCompletionMessageParam
type Response = OpenaiSDK.Chat.Completions.ChatCompletion

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
  history?: Message[]
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
    const {
      prompt,
      attachmentUrls,
      history,
      context,
    } = options
    
    const messages : Message[] = this.buildMessages();
    const response : Response = await this.createResponse(options, messages); 
    const content = response.choices[0].message?.content as string
    return content;
  }

  private buildMessages(options?: BuildMessageOptions): Message[] {
    const { content, context, history } = options || {};
    const messages: Message[] = [];

    const promptSystem = {
            role: 'system',
            content: `${context}`.trim(),
        }

    messages.push(promptSystem as Message)
    if(history){ messages.push(...history) }
    if(content) {
      messages.push({
        role: 'user',
        content: [ {type:'text', text: `${content}`.trim()} ]
      } as Message)
    }

    return messages 
  }

  private createResponse(options: OpenaiGenerateTextOptions, messages: Message[]): Promise<Response> {
    const { prompt } = options
    return this.api.chat.completions.create({
      model: OpenaiModel.DEFAULT,
      messages: [
        ...messages,
        {
          role: 'user',
          content: `${prompt}`.trim(),
        } as Message,
      ]
    })
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
