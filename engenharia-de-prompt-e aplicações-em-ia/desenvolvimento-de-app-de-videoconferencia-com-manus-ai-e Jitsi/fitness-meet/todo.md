# FitMeet - TODO

- [x] Configurar tema de cores (laranja/escuro fitness)
- [x] Gerar e configurar logo do app
- [x] Configurar navegação por abas (Home, Agendamento, Videoconferência, Histórico)
- [x] Adicionar ícones nas abas (icon-symbol.tsx)
- [x] Implementar tela Home com dashboard e próximo treino
- [x] Implementar contexto global de treinos (TreinosContext)
- [x] Implementar tela de Agendamento com lista e formulário
- [x] Implementar modal de criação de novo agendamento
- [x] Implementar tela de Videoconferência com Jitsi Meet via WebView
- [x] Implementar overlay de cronômetro (iniciar/pausar/zerar)
- [x] Implementar overlay de contador de repetições (+/-)
- [x] Implementar botão "Finalizar Treino" com modal de confirmação
- [x] Salvar treino concluído no histórico com AsyncStorage
- [x] Implementar tela de Histórico com lista de aulas concluídas
- [x] Implementar sistema de medalhas (bronze/prata/ouro/platina)
- [x] Implementar grid de medalhas conquistadas
- [x] Usar expo-keep-awake durante videoconferência
- [x] Revisar todos os fluxos e corrigir bugs
- [x] Salvar checkpoint final

## Bugs Encontrados

- [x] Bug: Botão "Finalizar Treino" não está respondendo ao toque na tela de videoconferência (CORRIGIDO: adicionado pointerEvents e elevation para superar captura de eventos do WebView)
