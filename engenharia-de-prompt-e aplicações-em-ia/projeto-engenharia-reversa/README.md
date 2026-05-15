# ⚙️ Engenharia Reversa Assistida por IA e Vibecoding

## 📝 Descrição do Projeto
Este projeto documenta a experiência de atuar na posição de Desenvolvedor de Software assistido por IA. O objetivo principal foi reconstruir um aplicativo funcional a partir da observação exclusiva de sua interface externa, sem visualizar o código-fonte original ou fornecer o link para a IA. O alvo escolhido para a engenharia reversa foi o site Simulador de Dilema Ético (Moral Machine).

A dinâmica (Vibecoding) exigiu a transferência do esforço da escrita sintática para a descrição lógica e funcional. O projeto foi dividido em três fases: análise da interface original, configuração do modelo com instruções de sistema (System Instructions) e validação iterativa da construção do código.

## 🚀 Tecnologias e Técnicas Utilizadas
* **Plataforma de IA:** Google AI Studio (Modelo Gemini).
* **Linguagens Base:** HTML, CSS e JavaScript.
* **Vibecoding (Prompting Estruturado):** Uso de sintaxe XML (como `<vibecoding_initialization>` e `<role_definition>`) para parametrizar o modelo como um Desenvolvedor Full-Stack Senior especializado em Engenharia Reversa.
* **Técnicas de Refinamento:** * *Erro e Contraste:* Apontar exatamente onde ocorreu a falha e fornecer a regra correta.
  * *Negative Prompting:* Comandos de negação para evitar inclusão de bibliotecas ou explicações indesejadas.
  * *Few-Shot e Chain of Thought:* Uso de exemplos e exigência de explicação passo a passo antes da geração do código final.
## 📊 Resultados e Aprendizados (Reflexão Crítica)
Durante a experiência, foram utilizados dois prompts de auxílio principais para guiar a IA na reconstrução do dilema ético. A atividade levantou reflexões profundas sobre o papel do desenvolvedor no cenário atual:

* **Impacto na Formação do Engenheiro Júnior:** Com o Desenvolvimento Assistido por IA, o profissional sai puramente da parte de escrita de código e passa para a arquitetura do sistema e auditoria do código, precisando validar com rigor aquilo que foi criado.
* **O Limite Ético (Plágio vs. Prototipagem):** A facilidade de replicar interfaces levanta dilemas de direitos autorais. Concluiu-se que a prática deixa de ser uma ferramenta de aprendizado e passa a ser plágio digital a partir do ponto em que se torna apenas um "copia e cola", sem que haja uma melhoria ou inovação sobre aquilo que foi usado como referência.
* **Ações Mitigadoras:** Para proteger a inovação original sem frear o avanço das ferramentas generativas, sugerimos a utilização de ferramentas de detecção de similaridade de código, a criação de premiações para códigos inovadores e o investimento contínuo no aprimoramento lógico dos desenvolvedores.

## 🔧 Como Executar
1. **Analisa:** Acesse um webapp de referência, mapeando seus componentes visuais, layout (ex: sidebar fixa, navbar superior) e *core features*
2. **Configura:** No Google AI Studio, utilize o prompt base em XML `<vibecoding_initialization>`.
3. **Restrições:** Aplique as regras de execução (`<execution_rules>`), exigindo que a IA inicie apenas pela estrutura de pastas, não gere o código todo de uma vez e solicite validação após cada componente.
4. **Constrói e Valida:** Teste o componente gerado. Se houver falhas, utilize o prompt de correção seguindo o resumo ideal: Identifique a falha ("Você falhou em [X]"), instrua a correção ("A regra correta é [Y]"), defina o formato e aplique exclusões ("Não faça [W]").

## ⏭️ Próximos Passos
A evolução deste projeto e a implementação das funcionalidades avançadas estão documentadas na pasta subsequente:
* [do clone ao produto mínimo viável (mvp+)](https://github.com/marcelofg7/Portifolio_Marcelo_Fagundes/tree/2b8a5e7a1f35c37a19c78f37e90198cec7969381/engenharia%20de%20prompt%20e%20aplica%C3%A7%C3%B5es%20em%20ia/do%20clone%20ao%20produto%20m%C3%ADnimo%20vi%C3%A1vel%20(mvp%2B))

---
[Voltar ao início](https://github.com/marcelofg7/portfolio-marcelo-fagundes-de-oliveira-vieira)
