import fetch from 'node-fetch';

export class PdfProvider {
    private apiKey: string | undefined;
    private apiUrl: string;

    constructor() {
        this.initialize()
    }
    
    private initialize(): void {
        try {
          const apiKey = process.env.SERVER_PDF_API_KEY;
          const apiUrl = process.env.SERVER_PDF_API_URL;
    
          if (!apiKey) {
            console.log(`Set SERVER_PDF_API_KEY and SERVER_PDF_API_URL in your .env to activate PDF provider.`)
            return
          }
    
          this.apiKey = apiKey;
          this.apiUrl = apiUrl;
    
          console.log(`PDF provider is active.`);
        } catch (error) {
          console.error(`PDF provider failed to start.`);
        }
    }

    isActive(): boolean {
        if (this.apiKey && this.apiUrl) {
            return true;
        } else {
            return false;
        }
    }

    async generatePdfFromHtml(conversation: { role?: 'user' | 'assistant'; content?: string }[], title?: string): Promise<string> {
        if (!this.isActive()) throw new Error('PDF provider is not configured.');

        const templateId = process.env.PDF_TEMPLATE_ID;
        if (!templateId) throw new Error('Missing PDF template.');

        const createPdfResponse = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                document: {
                    document_template_id: templateId,
                    status: 'pending',
                    payload: {
                        title: title ?? 'Legal Assistant Conversation',
                        messages: conversation,
                    },
                    meta: {
                        _filename: (title ?? 'conversation') + '.pdf'
                    }
                }
            })
        });

        if (!createPdfResponse.ok) {
            const text = await createPdfResponse.text().catch(() => '');
            throw new Error(`PDF prodiver create error ${createPdfResponse.status}: ${text}`);
        }

        const created = await createPdfResponse.json();

        const docId = created?.document?.id;
        // Break into separate function from here down, KISS
        if (!docId) throw new Error('PDF provider did not return a document ID.');
        const checkUrl = `${this.apiUrl}/${docId}`;

        let downloadUrl: string | null = null;

        for (let attempt = 0; attempt < 10; attempt++) {
            await new Promise(res => setTimeout(res, 500));

            const statusResponse = await fetch(checkUrl, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            if (!statusResponse.ok) {
                const text = await statusResponse.text().catch(() => '');
                throw new Error(`PDF provider status error ${statusResponse.status}: ${text}`);
            }

            const statusJson = await statusResponse.json();
            downloadUrl = statusJson?.document?.download_url ?? null;

            if (downloadUrl) break;
        }

        if (!downloadUrl) throw new Error('PDF provider did not generate the PDF in time.');

        return downloadUrl;
    }
}