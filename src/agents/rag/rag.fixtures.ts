import { RagDocument } from './rag.types';

export const ragSampleDocuments: RagDocument[] = [
  {
    id: 'doc-ollama',
    title: 'Ollama local',
    source: 'local://ollama',
    content:
      'Ollama permite rodar modelos localmente e é útil para privacidade, custo baixo e controle local.',
  },
  {
    id: 'doc-rag',
    title: 'RAG',
    source: 'local://rag',
    content:
      'RAG combina recuperação de contexto com geração de resposta e indexação semântica.',
  },
  {
    id: 'doc-validation',
    title: 'Validação',
    source: 'local://validation',
    content: 'Agentes confiáveis precisam validar entrada, saída e execução.',
  },
];
