# ia-agents

API de agentes de IA construída com Express + TypeScript + Ollama.

---

## Sumário

- [Configuração](#configuração)
- [Estrutura de agentes](#estrutura-de-agentes)
- [Endpoints](#endpoints)
  - [Playground](#playground)
  - [Classifier](#classifier)
  - [Router](#router)
  - [Technical Assistant](#technical-assistant)
  - [Chat](#chat)
    - [Chat com Memória](#chat-com-memória)
  - [Tool Executor](#tool-executor)
  - [Reliability](#reliability)

---

## Configuração

Copie o `.env` e ajuste os valores:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/ia_agents
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b
```

```bash
yarn install
yarn dev
```

---

## Estrutura de agentes

Cada agente vive em `src/agents/<nome>/` e segue a mesma convenção:

| Arquivo | Responsabilidade |
|---|---|
| `*.agent.ts` | Orquestra: monta prompt → chama LLM → valida resposta |
| `*.prompt.ts` | Constrói as strings de prompt e system message |
| `*.schema.ts` | Schema Zod da resposta esperada do LLM |
| `*.types.ts` | Tipos TypeScript do domínio do agente |

Os controllers em `src/controllers/` são finos — só tratam HTTP e delegam para o agente.

---

## Endpoints

Todos os endpoints são `POST` e esperam `Content-Type: application/json`.

Base URL: `http://localhost:3000/agents`

---

### Playground

Endpoint livre para testar prompts diretamente com o LLM sem estrutura definida.

**`POST /agents/playground`**

```json
{
  "prompt": "Explique o que é uma closure em JavaScript",
  "system": "Você é um professor de programação"
}
```

> `system` é opcional. Se omitido, usa `"Você é um assistente técnico objetivo."`.

**Resposta**

```json
{
  "content": "Uma closure é...",
  "model": "ollama"
}
```

---

### Classifier

Classifica a intenção de uma mensagem em uma de três categorias: `question`, `task` ou `chat`.

**`POST /agents/classifier`**

```json
{
  "message": "Como faço para conectar ao banco de dados com Prisma?"
}
```

**Resposta**

```json
{
  "label": "question",
  "confidence": 0.97,
  "reason": "O usuário está perguntando como realizar uma ação técnica específica."
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `label` | `question` \| `task` \| `chat` | Categoria da mensagem |
| `confidence` | `number` (0–1) | Grau de certeza do LLM |
| `reason` | `string` | Justificativa da classificação |

---

### Router

Classifica a mensagem e roteia para a ação correspondente. Combina classifier + roteamento em uma só chamada.

**`POST /agents/router`**

```json
{
  "message": "Crie um script para fazer backup do banco"
}
```

**Resposta**

```json
{
  "input": "Crie um script para fazer backup do banco",
  "classification": {
    "label": "task",
    "confidence": 0.91,
    "reason": "O usuário está pedindo a criação de algo concreto."
  },
  "route": {
    "action": "create_task",
    "sourceLabel": "task"
  },
  "execution": "Executando fluxo de criação de tarefa"
}
```

| Label | Action |
|---|---|
| `question` | `answer_question` |
| `task` | `create_task` |
| `chat` | `reply_chat` |

---

### Technical Assistant

Responde dúvidas técnicas com estrutura detalhada: título, resumo, passos e alertas.

**`POST /agents/runTechnicalAssistant`**

```json
{
  "question": "Como funciona o event loop no Node.js?",
  "context": "Estou estudando performance em aplicações backend"
}
```

> `context` é opcional.

**Resposta**

```json
{
  "title": "Event Loop no Node.js",
  "summary": "O event loop é o mecanismo que permite ao Node.js executar operações não-bloqueantes...",
  "steps": [
    "Entenda que Node.js é single-threaded",
    "O event loop processa callbacks da fila após operações assíncronas",
    "Fases: timers → I/O → idle → poll → check → close"
  ],
  "warnings": [
    "Bloquear o event loop com operações síncronas pesadas trava toda a aplicação"
  ],
  "nextPromptSuggestion": "Qual a diferença entre microtasks e macrotasks no event loop?"
}
```

---

**`POST /agents/runTechnicalAssistantBatch`**

Processa múltiplas perguntas em paralelo.

```json
{
  "questions": [
    { "question": "O que é hoisting em JavaScript?" },
    { "question": "Como funciona o prototype chain?", "context": "Foco em herança" }
  ]
}
```

**Resposta**: array com o mesmo formato de `/runTechnicalAssistant`.

---

### Chat

Agente conversacional com memória de sessão. O histórico é mantido em memória enquanto o servidor estiver rodando.

**`POST /agents/chat`**

```json
{
  "sessionId": "usuario-123",
  "message": "O que é uma promise em JavaScript?"
}
```

> `sessionId` é livre — você define o valor. A sessão é criada automaticamente se não existir.

**Resposta**

```json
{
  "sessionId": "usuario-123",
  "response": "Uma promise representa um valor que pode estar disponível agora, no futuro ou nunca..."
}
```

---

**`POST /agents/chat/batch`**

Envia múltiplas mensagens em sequência na mesma sessão. As mensagens são processadas em ordem, mantendo o histórico entre elas.

```json
{
  "sessionId": "usuario-123",
  "messages": [
    "O que é uma promise?",
    "E async/await, como se relaciona?"
  ]
}
```

**Resposta**

```json
{
  "sessionId": "usuario-123",
  "responses": [
    "Uma promise representa...",
    "Async/await é uma sintaxe que simplifica o uso de promises..."
  ]
}
```

---

### Chat com Memória

Versão avançada do chat com três camadas de contexto: memória longa (resumo persistido), memória curta (tópicos recentes) e contexto recuperado (histórico formatado). Após cada resposta, o LLM atualiza automaticamente o resumo da sessão.

**Fluxo interno**

```
Mensagem → appendMessage → buildRetrievedContext (resumo + tópicos + histórico)
         → generateText → appendMessage (resposta)
         → buildSessionMemory (LLM atualiza resumo) → updateSessionMemory
```

---

**`POST /agents/chat/persistent`**

```json
{
  "sessionId": "usuario-123",
  "message": "Como funciona o event loop?"
}
```

**Resposta**

```json
{
  "sessionId": "usuario-123",
  "response": "O event loop é o mecanismo que permite ao Node.js...",
  "memory": {
    "summary": "Usuário está estudando conceitos fundamentais do Node.js, com foco em event loop.",
    "lastTopics": ["event loop", "Node.js", "assíncrono"]
  }
}
```

---

**`GET /agents/chat/session/:sessionId/memory`**

Consulta o estado atual da memória de uma sessão sem enviar nova mensagem.

```
GET /agents/chat/session/usuario-123/memory
```

**Resposta**

```json
{
  "sessionId": "usuario-123",
  "summary": "Usuário está estudando conceitos fundamentais do Node.js, com foco em event loop.",
  "lastTopics": ["event loop", "Node.js", "assíncrono"],
  "totalMessages": 6
}
```

| Campo | Descrição |
|---|---|
| `summary` | Resumo gerado pelo LLM da conversa até o momento |
| `lastTopics` | Até 5 tópicos recentes identificados pelo LLM |
| `totalMessages` | Total de mensagens na sessão (user + assistant) |

---

### Tool Executor

Agente que analisa a mensagem, seleciona automaticamente a ferramenta mais adequada via LLM e a executa.

**Ferramentas disponíveis**

| Tool | Quando é usada |
|---|---|
| `answer_technical_question` | Perguntas técnicas sobre código e tecnologia |
| `summarize_content` | Pedidos de resumo de conteúdo |
| `generate_study_plan` | Pedidos de plano de estudo sobre um tema |

---

**`POST /agents/tools/execute`**

```json
{
  "message": "Me explica como funciona índice no PostgreSQL",
  "allowedTools": ["answer_technical_question", "summarize_content"]
}
```

> `allowedTools` é opcional. Se omitido, todas as ferramentas estão disponíveis.

**Resposta — tool executada**

```json
{
  "input": "Me explica como funciona índice no PostgreSQL",
  "executed": true,
  "selection": {
    "toolName": "answer_technical_question",
    "confidence": 0.94,
    "reason": "O usuário faz uma pergunta técnica sobre banco de dados."
  },
  "execution": {
    "toolName": "answer_technical_question",
    "success": true,
    "output": "Índices no PostgreSQL\n\nUm índice é uma estrutura..."
  }
}
```

**Resposta — tool bloqueada por `allowedTools`**

```json
{
  "input": "Crie um plano de estudo sobre Docker",
  "executed": false,
  "selection": {
    "toolName": "generate_study_plan",
    "confidence": 0.88,
    "reason": "O usuário quer um plano de estudo."
  },
  "clarification": "A ferramenta selecionada não está permitida neste contexto."
}
```

**Resposta — confiança insuficiente (< 0.65)**

```json
{
  "input": "oi tudo bem",
  "executed": false,
  "selection": {
    "toolName": "summarize_content",
    "confidence": 0.31,
    "reason": "Mensagem ambígua sem intenção clara."
  },
  "clarification": "Não houve confiança suficiente para executar uma ferramenta."
}
```

---

**`POST /agents/tools/execute/audit`**

Igual ao `/tools/execute`, mas inclui um bloco `audit` com resumo da decisão do agente.

```json
{
  "message": "Quero aprender TypeScript do zero"
}
```

**Resposta**

```json
{
  "input": "Quero aprender TypeScript do zero",
  "executed": true,
  "selection": {
    "toolName": "generate_study_plan",
    "confidence": 0.92,
    "reason": "O usuário quer aprender um tema do zero, indicando necessidade de plano de estudo."
  },
  "execution": {
    "toolName": "generate_study_plan",
    "success": true,
    "output": "Plano de Estudo: TypeScript..."
  },
  "audit": {
    "selectedTool": "generate_study_plan",
    "executed": true,
    "confidence": 0.92,
    "blockedReason": undefined
  }
}
```

---

### Reliability

Versão resiliente do Technical Assistant com retry automático, fallback local e auditoria de confiabilidade. Tenta gerar a resposta até duas vezes antes de recorrer ao fallback.

**Fluxo interno**

```
1ª tentativa → prompt normal
     ↓ falhou
2ª tentativa → prompt estrito (só JSON, sem texto extra)
     ↓ falhou
Fallback local → resposta simplificada sem chamar o LLM
```

**`POST /agents/reliability/technical-assistant`**

```json
{
  "question": "Como funciona o garbage collector no Node.js?",
  "context": "Estou otimizando uso de memória em produção"
}
```

> `context` é opcional.

**Resposta — sucesso na 1ª tentativa**

```json
{
  "ok": true,
  "data": {
    "title": "Garbage Collector no Node.js",
    "summary": "O Node.js usa o V8, que implementa um GC geracional...",
    "steps": [
      "Entenda a divisão entre Young Generation e Old Generation",
      "Objetos de curta duração ficam no Young Generation",
      "O Major GC (Mark-Sweep) coleta objetos de longa duração"
    ],
    "warnings": [
      "Closures podem manter referências vivas sem querer"
    ],
    "nextPromptSuggestion": "Como identificar memory leaks no Node.js com heap snapshots?"
  },
  "attempts": 1,
  "usedFallback": false,
  "audit": {
    "attempts": 1,
    "usedFallback": false,
    "finalStage": "primary"
  }
}
```

**Resposta — sucesso após retry**

```json
{
  "ok": true,
  "data": { "..." },
  "attempts": 2,
  "usedFallback": false,
  "audit": {
    "attempts": 2,
    "usedFallback": false,
    "finalStage": "retry"
  }
}
```

**Resposta — fallback local ativado**

```json
{
  "ok": true,
  "data": {
    "title": "Resposta simplificada",
    "summary": "Não foi possível gerar a estrutura completa com segurança para a pergunta: ...",
    "steps": [
      "Reformule a pergunta de maneira mais específica",
      "Peça um exemplo menor e mais objetivo",
      "Tente novamente com menos contexto ambíguo"
    ],
    "warnings": ["A resposta foi gerada por fallback local"],
    "nextPromptSuggestion": "Explique essa mesma dúvida em formato mais simples e com um exemplo curto"
  },
  "attempts": 2,
  "usedFallback": true,
  "audit": {
    "attempts": 2,
    "usedFallback": true,
    "finalStage": "fallback"
  }
}
```

**Resposta — erro de input**

```json
{
  "ok": false,
  "error": "A pergunta precisa ter pelo menos 12 caracteres",
  "stage": "input",
  "attempts": 0
}
```

| `finalStage` | Significado |
|---|---|
| `primary` | Respondido na 1ª tentativa |
| `retry` | Respondido na 2ª tentativa com prompt estrito |
| `fallback` | LLM falhou nas duas tentativas, resposta local usada |
| `input-error` | Entrada inválida, LLM não foi chamado |
