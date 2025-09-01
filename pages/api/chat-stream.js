
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, sessionId, productInfo = {} } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const removeThinkTags = (text) => {
    if (!text) return text;
    return text
      .replace(/<think>[\s\S]*?<\/think>/g, '')
      .replace(/<\/?think>/g, '');
  };

  try {
    // SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    // Build messages for Ollama chat API
    const ollamaMessages = [
      {
        role: 'system',
        content: '你是智能客服助理，请用简洁中文回答用户的问题。'
      },
      {
        role: 'user',
        content: productInfo && Object.keys(productInfo).length
          ? `${message}\n\n附加商品信息: ${JSON.stringify(productInfo)}`
          : message
      }
    ];

    // Call Ollama chat streaming API
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek-r1:7b',
        messages: ollamaMessages,
        stream: true,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          top_k: 40
        }
      }),
    });

    if (!response.ok || !response.body) {
      res.write(`data: ${JSON.stringify({ error: `Ollama API error: ${response.status} ${response.statusText}` })}\n\n`);
      res.end();
      return;
    }

    let finished = false;
    let buffer = '';

    // Stream chunks from Ollama and forward as SSE
    for await (const chunk of response.body) {
      const text = typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf-8');
      buffer += text;

      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
          const parsed = JSON.parse(trimmed);

          if (parsed.done) {
            finished = true;
            res.write('data: [DONE]\n\n');
            res.end();
            return;
          }

          const content = parsed.message?.content;
          if (content) {
            const sanitized = removeThinkTags(content);
            if (sanitized) {
              res.write(`data: ${JSON.stringify({ content: sanitized })}\n\n`);
            }
          }
        } catch (e) {
          // non-JSON line, skip
        }
      }
    }

    if (!finished) {
      res.write('data: [DONE]\n\n');
      res.end();
    }
  } catch (error) {
    console.error('chat-stream proxy error:', error);
    try {
      res.write(`data: ${JSON.stringify({ error: 'AI服务暂时不可用，请稍后重试' })}\n\n`);
      res.end();
    } catch (_) {
      // ignore
    }
  }
}