# 💻 Sistema de Gestão com IA e Engenharia de Software (Bubble)
 
## 📝 Descrição do Projeto
Este projeto consiste no desenvolvimento de uma aplicação web de gestão utilizando a Inteligência Artificial do Bubble como acelerador. O objetivo principal é atuar de forma crítica sobre o "rascunho" gerado pela IA, aplicando rigorosamente fundamentos de engenharia de software para garantir segurança, escalabilidade e governança.
 
A construção evidenciou que plataformas visuais aceleram o desenvolvimento inicial, mas exigem intervenção humana especializada para refatorar lógicas falhas, mapear relacionamentos corretamente, estruturar o layout com Flexbox e implementar proteções arquiteturais de privacidade que a ferramenta não prevê nativamente.
 
![Dashboard da Aplicação](IMAGEM_1_AQUI)
*Figura 1: Interface principal do sistema gerado e refatorado no Bubble.*
 
## 🚀 Tecnologias Utilizadas
* **Plataforma Low-Code:** Bubble.io
* **Acelerador:** Inteligência Artificial nativa do Bubble (Geração de Blueprint)
* **Conceitos Aplicados:** Privacy by Design, Modelagem Relacional, Prevenção OWASP, Anti-Shadow IT.
 
## 📊 Resultados e Aprendizados
O projeto atendeu a todos os critérios de segurança, isolamento de dados e usabilidade em ambiente de teste.
* **Segurança e Isolamento (Privacy by Design):** As regras genéricas (Publicly visible) criadas pela IA foram deletadas para evitar exposição acidental de dados no lado do cliente. Foi implementada a condição restrita `This Creator is Current User` (aba Data > Privacy), garantindo que um usuário logado não consiga visualizar informações de terceiros.
* **Governança e Manutenibilidade:** Aplicação de práticas de Anti-Shadow IT. Os Workflows foram organizados por paleta de cores (ex: Verde para sucesso, Vermelho para deleção) e inteiramente documentados com o recurso *Notes*, eliminando a existência de códigos "caixa preta".
* **Otimização e Prevenção de Hardcode:** Os textos manuais nas lógicas do sistema foram substituídos por *Option Sets* para garantir escalabilidade. As buscas no banco de dados foram otimizadas diretamente nos *Repeating Groups* para minimizar o consumo de WUs (Workload Units).
* **Estratégia de Saída (Mitigação de Vendor Lock-in):** Como o Bubble retém a posse do código-fonte gerado, estabeleceu-se uma estratégia de extração de dados através da habilitação da Data API. Isso possibilita o resgate de todas as tabelas (Usuários, Entidades, etc.) em formato JSON para uma eventual migração futura para arquiteturas tradicionais como Node.js e React.
 
![Regras de Privacidade do Bubble](IMAGEM_2_AQUI)
*Figura 2: Comprovação da regra de segurança aplicada na aba Data > Privacy.*
 
## 🔧 Como Executar
1. Acesse o link da aplicação: [Versão de Teste Bubble (Debug Mode)](https://marcelofdov-48824.bubbleapps.io/version-test?debug_mode=true).
2. Cadastre um novo usuário e insira dados no sistema para validar a estabilidade da interface responsiva.
3. Para atestar a segurança e o isolamento do banco de dados, abra uma guia anônima, crie um segundo usuário e confirme que os dados criados pela primeira conta estão invisíveis.
 
![Modelagem e Workflows](IMAGEM_3_AQUI)
*Figura 3: Rascunho da modelagem de banco de dados e organização por cores dos Workflows.*
 
---
[Voltar ao início](https://github.com/seu-usuario/seu-usuario)
