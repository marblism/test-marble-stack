import { Trpc } from '@/core/trpc/base'
import { z } from 'zod'
import { OpenaiProvider  } from '@/plugins/ai/server/providers/openai/openai.provider';
import { Utility } from '@/core/helpers/utility';
import { LEGAL_ASSISTANT_CONTEXT } from '~/core/helpers/prompts/legalAssistant';
import { PdfProvider } from '~/plugins/pdf/pdf.provider';

const openaiProvider = new OpenaiProvider();
const pdfProvider = new PdfProvider();

export const ChatRouter = Trpc.createRouter({
    sendMessage: Trpc.procedure
    .input(z.object({ message: z.string().min(1, 'Message cannot be empty.').max(2000) }))
    .mutation(async ({ ctx, input }) => {
        if (!openaiProvider.isActive()) {
            console.error('AI provider is not active. Check SERVER_OPENAI_API_KEY.')
            throw new Error('AI provider is not available. Contact admin.');
        }

        const prompt: string = Utility.sanitiseText(input.message);

        await ctx.database.message.create({
            data: {
                role: 'user',
                content: prompt,
                userId: ctx.session.user.id,
            }
        });

        let aiResponse: string;

        try {
            aiResponse = await openaiProvider.generateText({
                prompt: prompt,
                context: LEGAL_ASSISTANT_CONTEXT, 
            });
        } catch (error) {
            console.error('OpenAI request failed.', error);
            aiResponse = 'Sorry, the AI failed to generate a response. Please try again.';
        }

        await ctx.database.message.create({
            data: {
                role: 'assistant',
                content: aiResponse,
                userId: ctx.session.user.id,
            }
        });

        return { response: aiResponse?.toString().trim() || 'No response from AI.' };
    }),
    generatePdf: Trpc.procedure
    .input(z.object({ conversation: z.array(z.object({ role: z.enum(['user','assistant']), content: z.string() })) , title: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
        const { conversation, title } = input;
        const pdfDownloadUrl: string = await pdfProvider.generatePdfFromProvider(conversation, title);
        
        return { pdfDownloadUrl: pdfDownloadUrl };
    }),
});