
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

app.post("/analisar", async (req, res) => {
  const { comentarios } = req.body;

  const prompt = `
Você é um analista de redes sociais. Abaixo estão comentários reais de um post no Instagram:

${comentarios.join("\n")}

Analise e retorne:
- Porcentagem estimada de elogios, críticas e perguntas
- As 5 palavras mais frequentes
- Um insight sobre o público
- Uma sugestão de conteúdo com base nos comentários

Formato da resposta:
{
  \"elogios\": \"xx%\",
  \"criticas\": \"xx%\",
  \"perguntas\": \"xx%\",
  \"palavras\": [\"palavra1\", \"palavra2\", ...],
  \"insight\": \"...\",
  \"sugestao\": \"...\"
}
`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const resposta = completion.choices[0].message.content;
    res.send(JSON.parse(resposta));
  } catch (err) {
    console.error(err);
    res.status(500).send({ erro: "Erro ao gerar análise com IA" });
  }
});

module.exports = app;
