# FitMeet - Design Document

## Brand Identity
- **App Name:** FitMeet
- **Tagline:** Treino Personalizado, Onde Você Estiver
- **Primary Color:** #FF6B35 (laranja energético - fitness/energia)
- **Secondary Color:** #1A1A2E (azul escuro profundo - profissionalismo)
- **Accent Color:** #FFD700 (dourado - medalhas/conquistas)
- **Background Light:** #F8F9FA
- **Background Dark:** #0D0D1A
- **Surface Light:** #FFFFFF
- **Surface Dark:** #1A1A2E

## Screen List

1. **Home (Dashboard)** - Visão geral, próximo treino agendado, acesso rápido
2. **Agendamento** - Lista de treinos agendados + criar novo agendamento
3. **Videoconferência** - Sala Jitsi Meet com ferramentas de treino sobrepostas
4. **Histórico** - Lista de aulas concluídas com sistema de medalhas

## Primary Content and Functionality

### 1. Home Screen
- Header com saudação e avatar do usuário
- Card de destaque: próximo treino agendado (data, hora, personal trainer)
- Botão de acesso rápido "Iniciar Treino Agora"
- Resumo de estatísticas: total de treinos, streak, medalhas conquistadas
- Lista dos próximos agendamentos (2-3 itens)

### 2. Agendamento Screen
- Botão flutuante "+" para novo agendamento
- Lista de treinos agendados em cards (data, hora, tipo de treino, personal)
- Modal/Sheet para criar novo agendamento:
  - Nome do treino
  - Data e hora
  - Nome do personal trainer
  - Tipo de treino (musculação, cardio, funcional, etc.)
  - ID/Nome da sala Jitsi
- Swipe para deletar agendamento
- Status: Agendado / Em andamento / Concluído

### 3. Videoconferência Screen
- **Camada base:** WebView com Jitsi Meet (tela cheia)
- **Overlay superior:** Barra com cronômetro e contador de repetições
  - Cronômetro: display MM:SS, botões Iniciar/Pausar/Zerar
  - Contador: display numérico grande, botões "+" e "-"
- **Overlay inferior:** Botão "Finalizar Treino" (vermelho)
- Ao finalizar: modal de confirmação → salva no histórico com medalha

### 4. Histórico Screen
- Header com total de aulas e medalhas conquistadas
- FlatList de aulas concluídas em cards:
  - Data e hora
  - Duração total
  - Tipo de treino
  - Repetições totais
  - **Medalha conquistada** (bronze/prata/ouro/platina baseado em critérios)
- Seção de medalhas: grid visual de todas as medalhas desbloqueadas

## Key User Flows

### Agendar e Entrar em Treino
1. Home → tap "Agendar Treino" → Agendamento screen
2. Tap "+" → preencher formulário → salvar
3. Home → tap "Iniciar Treino" no card do próximo treino
4. Videoconferência screen abre com Jitsi Meet carregando
5. Ferramentas de treino disponíveis como overlay

### Finalizar Treino e Ganhar Medalha
1. Durante videoconferência → tap "Finalizar Treino"
2. Modal de confirmação com resumo (tempo, repetições)
3. Confirmar → salva no histórico → animação de medalha
4. Redireciona para Histórico com nova entrada

## Color Choices
- **Primary #FF6B35** - Laranja vibrante para CTAs, botões principais, ícones ativos
- **Secondary #1A1A2E** - Fundo escuro para header, tab bar no dark mode
- **Gold #FFD700** - Medalhas de ouro, conquistas especiais
- **Silver #C0C0C0** - Medalhas de prata
- **Bronze #CD7F32** - Medalhas de bronze
- **Platinum #E5E4E2** - Medalha platina (conquista máxima)
- **Success #22C55E** - Confirmações, treino concluído
- **Error #EF4444** - Botão finalizar, alertas

## Typography
- Headers: Bold, 24-32px
- Body: Regular, 14-16px
- Captions: Regular, 12px
- Timer Display: Monospace Bold, 36-48px

## Component Patterns
- Cards com border-radius 16px, sombra suave
- Botões primários: rounded-full, bg-primary
- Overlay do Jitsi: fundo semi-transparente escuro, border-radius 12px
- Medalhas: ícone circular com gradiente metálico + brilho
