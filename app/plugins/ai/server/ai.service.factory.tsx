import { TRPCError } from '@trpc/server'
import { OpenaiProvider } from './providers/openai/openai.provider'
import { AiProvider } from './providers/provider'

export class AiServiceFactory {
  static create(providerType: 'openai' | 'gemini'): AiProvider {
    let provider: AiProvider

    switch (providerType) {
      case 'openai':
        provider = new OpenaiProvider()
        break
      default:
        throw new Error('Unsupported AI provider')
    }

    if (!provider.isActive()) {
      let message = ''
      switch (providerType) {
        case 'openai':
          message = 'Set SERVER_OPENAI_API_KEY in your .env to activate OpenAI'
          break
      }

      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message,
      })
    }

    return provider
  }
}
