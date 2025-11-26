import { useEffect, useRef, useState } from "react";
import { Api } from "~/core/trpc";
import { Typography, Divider, Layout, List, Input, Button, Avatar, Spin, Row, Col } from 'antd';
import { UserOutlined, RobotOutlined, FilePdfOutlined } from '@ant-design/icons';
import { Utility } from "~/core/helpers/utility";

type ChatMessage = { role: 'user' | 'assistant'; content: string };

export default function ChatRoute() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const sendMessageMutation = Api.chat.sendMessage.useMutation();
    const generatePdfMutation = Api.chat.generatePdf.useMutation();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        const rawText = input.trim();
        if (!rawText) return;

        const userMessage: ChatMessage = { role: 'user', content: rawText };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        let assistantResponse: string = 'Unable to get AI response.';

        try {
            const prompt = Utility.sanitiseText(rawText);
            const response = await sendMessageMutation.mutateAsync({
                message: prompt,
            });
            assistantResponse = response.response;
        } catch (error) {
            console.error('AI request failed.', error);
            assistantResponse = 'Unable to reach AI. Try again later.';
        } finally {
            setMessages((prev) => [...prev, { role: 'assistant', content: assistantResponse }]);
            setLoading(false);
        }
    };

    const handleCreatePdf = async () => {
        setLoading(true);

        let pdfDownloadUrl: string = 'Unable to generate PDF.';

        try {
            const response = await generatePdfMutation.mutateAsync({
                conversation: messages,
            });
            pdfDownloadUrl = response.pdfDownloadUrl;
        } catch (error) {
            console.error('PDF generation failed.', error);
            pdfDownloadUrl = 'Unable to generate PDF. Try again later.';
        } finally {
            setMessages((prev) => [...prev, { role: 'assistant', content: pdfDownloadUrl }]);
            setLoading(false);
        }
    }

    return (
        <Layout style={{ height: '100vh', padding: 24 }}>
            <div
            style={{
                background: '#fff',
                padding: '16px 24px',
                borderRadius: 6,
                marginBottom: 16,
            }}
            >
                <Typography.Title level={3} style={{ margin: 0 }}>
                    AI Legal Assistant
                </Typography.Title>
                <Typography.Text type="secondary">
                    Ask questions and export as PDF
                </Typography.Text>
            </div>

            <Layout.Content style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: 12, background: '#fafafa', borderRadius: 6 }}>
                    <List
                        dataSource={messages}
                        renderItem={(msg: ChatMessage, idx) => (
                            <List.Item key={idx} style={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                                <List.Item.Meta
                                    avatar={
                                        msg.role === 'user' ? (
                                        <Avatar icon={<UserOutlined />} />
                                        ) : (
                                        <Avatar icon={<RobotOutlined />} />
                                        )
                                    }
                                    description={
                                        <div
                                        style={{
                                            maxWidth: '75%',
                                            padding: '10px 14px',
                                            borderRadius: 8,
                                            background: msg.role === 'user' ? '#e6f7ff' : '#fff',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                        }}
                                        >
                                        {msg.content}
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                    <div ref={messagesEndRef} />
                </div>

                <div style={{ marginTop: 12 }}>
                <Row gutter={8} align="middle">
                    <Col flex="auto">
                        <Input
                            placeholder="Type your question for the legal assistant..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={loading}
                            allowClear
                            suffix={loading ? <Spin /> : null}
                        />
                    </Col>

                    <Col>
                        <Button type="primary" onClick={handleSendMessage} loading={loading}>
                            Send
                        </Button>
                    </Col>

                    <Col>
                        <Button icon={<FilePdfOutlined />} onClick={handleCreatePdf} loading={loading}>
                            PDF
                        </Button>
                    </Col>
                </Row>
                </div>
            </Layout.Content>
        </Layout>
    );
}





