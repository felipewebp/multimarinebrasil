# MultiMarine do Brasil — site em evolução

Site institucional da unidade **MultiMarine do Brasil em Macaé/RJ**, criado para unir apresentação institucional, catálogo de cursos, geração de leads e relacionamento com alunos e empresas.

> **Status:** desenvolvimento ativo. Este repositório é também o diário público da evolução do projeto.

## Para quem estiver visitando este repositório

Este projeto está em desenvolvimento ativo e deliberadamente não representa ainda a operação comercial final da MultiMarine. As telas e fluxos atuais servem para validar a experiência digital antes da reunião de levantamento com o cliente. Parte das integrações é simulada no front-end e está preparada para receber CRM, banco de dados, autenticação, certificados e EAD quando essas regras forem definidas.

**Já existe:** catálogo, filtros, orientação por objetivo, Minha Trilha, WhatsApp contextual, atribuição inicial de origem, páginas SEO, jornada offshore e briefing corporativo.

**Em desenvolvimento:** refinamento visual, conversão, conteúdo local, SEO de intenção e preparação da futura camada de gestão.

**Depois do levantamento com o cliente:** conectar o que realmente existir no processo de matrícula, atendimento, pagamentos, certificados, EAD e gestão corporativa — sem inventar funcionalidades operacionais que a empresa não utilize.

## O que já foi construído

### Experiência do visitante
- Home institucional com posicionamento offshore/industrial.
- Catálogo com **270 cursos sincronizados** a partir do catálogo público atual.
- Busca por curso, profissão e área.
- Filtros por área e tipo de formação.
- Bloco de **destaques/mais procurados por área**, baseado em sinais públicos de mercado — não representa ranking interno de vendas da MultiMarine.
- Páginas individuais de cursos.
- Retorno ao catálogo preservando busca, filtros e posição de rolagem.
- Jornada Offshore.
- Página comercial para Empresas.
- WhatsApp contextual.
- Popup de captação otimizado para mobile.
- **Orientador de Qualificação em 60 segundos**, com recomendações iniciais e encaminhamento para WhatsApp.
- **Minha Trilha**: o visitante pode selecionar até 5 cursos e enviar a seleção para orientação no WhatsApp.
- **Atribuição de origem**: campanhas/UTMs, primeira página e contexto da visita acompanham o contato no WhatsApp.

### Estrutura comercial
O projeto está sendo organizado para trabalhar dois fluxos diferentes:

**Pessoa / aluno:** objetivo → área → formação → dúvida → atendimento → matrícula.

**Empresa:** demanda → equipe → treinamento → proposta → execução.

Nesta fase, alguns recursos são propositalmente **front-end/simulados**, porque ainda não houve uma reunião de levantamento com o cliente para confirmar o processo real de matrícula, CRM, emissão de certificados, plataforma EAD e operação comercial.

## Identidade visual
A logo oficial fornecida pela MultiMarine é a referência da marca. A implementação está sendo ajustada para manter a aparência original em diferentes tamanhos e evitar distorções.

## O que está sendo mexido agora

1. Consolidação da identidade visual e da logo oficial em todas as páginas.
2. Padronização do rodapé, contato, endereço e localização; o mapa fica compacto e carregado de forma preguiçosa para não pesar o site.
3. Refinamento responsivo para desktop, tablet e celular.
4. Evolução da jornada de conversão: catálogo → orientação → trilha → WhatsApp.
5. Revisão contínua das imagens do catálogo para que representem a função/atividade do curso.
6. SEO técnico, páginas por categoria/curso e arquitetura local para Macaé.
7. Separação entre sincronização do catálogo e build das páginas SEO, evitando coletas desnecessárias a cada alteração de design.
8. Benchmark contínuo de recursos de concorrentes de Macaé e do mercado de treinamentos.

## O que vem a seguir

### Fase 1 — produto comercial
- transformar a atribuição atual do WhatsApp em uma base mensurável quando houver CRM;
- medir de onde chegam os leads;
- identificar curso/área/objetivo de cada contato;
- preparar integração com CRM;
- preparar uma futura área do aluno;
- estruturar consulta de certificados e histórico de treinamento.

### Fase 2 — empresas
- formulário inteligente de demanda;
- briefing com quantidade, local, prazo e turno;
- futura solicitação de proposta por volume e cronograma;
- proposta por volume de pessoas;
- calendário/cronograma;
- histórico de treinamentos;
- alertas de reciclagem e vencimentos;
- painel corporativo preparado para backend.

### Fase 3 — SEO e aquisição
- páginas orientadas a buscas locais e de intenção, como cursos e NRs em Macaé;
- conteúdos de apoio para dúvidas recorrentes;
- melhoria de dados estruturados;
- Search Console e acompanhamento de indexação;
- otimização de conversão por página.

## Benchmark considerado

A análise atual considera o site antigo/oficial da MultiMarine e concorrentes locais do mercado de treinamento em Macaé.

A MultiMarine hoje apresenta uma oferta ampla que mistura SST, medicina ocupacional, treinamentos, hotelaria offshore e outros serviços; o catálogo oficial atual aparece com **271 resultados** no domínio principal. O novo projeto local trabalha neste momento com 270 cursos sincronizados enquanto a origem dos catálogos é reconciliada.

Concorrentes analisados publicamente mostram recursos como prova social e avaliações, credenciamento, preços e carga horária diretamente na vitrine, suporte separado de vendas, páginas de dúvidas, EAD, in-company e, no caso de consultorias, treinamento móvel dentro da própria operação.

### Fontes de referência
- MultiMarine — catálogo: https://multimarinedobrasil.com.br/cursos/
- MultiMarine — categorias: https://multimarinedobrasil.com.br/categoria-de-cursos/
- MultiMarine — institucional: https://grupomultidobrasil.com.br/multimarinedobrasil/
- Ocean Green: https://oceangreencursos.com/
- JBRAZ Treinamentos: https://www.jbraztreinamentos.com.br/
- TM Soluções: https://www.tmsolucoes.com/

## Decisão de produto

O objetivo não é simplesmente fazer um site “mais bonito” que os anteriores.

A intenção é transformar a MultiMarine em uma **porta de entrada digital para qualificação profissional e treinamento corporativo em Macaé**, deixando mais claro o próximo passo do visitante e reduzindo a distância entre interesse e atendimento.

O diferencial planejado é combinar:

**catálogo + orientação por objetivo + Minha Trilha + contexto offshore + atendimento comercial contextualizado + futura gestão de treinamentos.**

## Observação importante

O repositório é público porque está sendo usado também como vitrine de desenvolvimento. Recursos de produção que dependam de CRM, banco de dados, autenticação, certificados ou informações internas devem ser conectados somente depois do levantamento com o cliente e da definição dos dados e permissões necessários.

## Checkpoint — 27/09/2026

**Estado salvo para a próxima sessão.** O projeto está no commit `362354bef9e820cd22cf026ad07b69a354e82aeb` da branch `main`.

### Prioridade imediata quando retomarmos
1. **Finalizar a logo oficial**: usar a imagem fornecida pelo cliente como fonte visual, eliminar distorção/escala incorreta e garantir consistência no header e nas páginas internas.
2. **Unificar o sistema institucional**: cabeçalho, rodapé, telefones, endereço de Macaé, WhatsApp, mapa e links institucionais com o mesmo padrão visual e de conteúdo.
3. **Testar o catálogo ponta a ponta**: categorias da home, filtros, busca, abertura do curso, volta preservando posição e funcionamento das URLs.
4. **Consolidar mobile/tablet/desktop** sem criar versões separadas do site: mesma base, composição específica por breakpoint.
5. **Continuar a curadoria de imagens** em lotes, priorizando coerência entre curso, profissão, equipamento e ambiente de trabalho.
6. **Auditar o funil de captação**: descobrir o que deve ser medido agora e o que ficará preparado para CRM após a reunião com o cliente.
7. **Benchmark + diferenciais**: transformar recursos encontrados nos concorrentes em backlog classificado por impacto, esforço e dependência de backend.
8. **SEO de aquisição**: páginas e conteúdos orientados a intenção local em Macaé, validação de sitemap/indexação e preparação do Search Console.
9. **Higienização técnica**: remover CSS/markup legado e duplicado, revisar gerador SEO e impedir regressões de deploy.
10. **Preparar reunião com o cliente**: criar uma pauta objetiva para descobrir origem dos leads, atendimento, matrícula, pagamento, certificados, EAD, turmas, vendas B2C/B2B e pós-venda.

### Regra de continuidade
Não considerar nenhuma funcionalidade "operacional" como real sem confirmar o processo da MultiMarine. Recursos simulados devem permanecer claramente demonstrativos e, quando fizer sentido, já deixar a interface pronta para futura integração.
