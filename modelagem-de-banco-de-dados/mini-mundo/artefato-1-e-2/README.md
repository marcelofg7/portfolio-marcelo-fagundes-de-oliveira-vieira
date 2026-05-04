# 💊 Canal de Pedidos de Farmácia (Sistema de Coleta)
 
## 📝 Descrição do Projeto

Este projeto consiste em um sistema especializado na otimização e controle da coleta de pedidos de delivery em farmácias. O objetivo principal é aumentar a precisão na separação de itens e garantir que medicamentos controlados passem pela devida conferência técnica antes do despacho, mitigando erros e garantindo a segurança do paciente.
 
Desenvolvido como o **Artefato 01 (Minimundo)** da Sprint 1, o sistema gerencia todo o fluxo operacional: desde a notificação de um novo pedido até a baixa definitiva no estoque por meio da leitura de código de barras. A ferramenta implementa a lógica FIFO (First In, First Out) por lote e validade, assegurando a rotação correta dos medicamentos e evitando desperdícios.
 
![Dashboard Principal - Farmácia](https://newr7-r7-prod.web.arc-cdn.net/resizer/v2/54FCSO5E4NNRBAURZZK5VPNLZY.jpg?auth=6140a8026b01361fb659c2f3ad6fc08bc3926aacdb9829d68e99ca465a288abf&width=1600&height=1067)

*Figura 1: Interface de monitoramento de pedidos e status de validação técnica.*
 
## 🚀 Tecnologias Utilizadas

* **Linguagem:** SQL (Modelagem de Banco de Dados Relacional).
* **Regras de Negócio:** Metodologia FIFO, Intercambialidade de Medicamentos.
* **Legislação Aplicada:** Portaria 344/98 e RDC 44/2009 (Controle de psicotrópicos).
* **Ferramentas:** Modelagem Entidade-Relacionamento (ER).
 
## 📊 Resultados e Aprendizados

A estruturação deste minimundo permitiu o mapeamento crítico de processos logísticos e regulatórios.

* **Rastreabilidade Total:** O sistema foi projetado para criar um histórico de validação que vincula cada farmacêutico ao medicamento aprovado, garantindo conformidade com a legislação vigente.
* **Logística Ágil:** Mapeamento de posição física (corredor/prateleira) no banco de dados para reduzir o tempo de coleta do balconista.
* **Validação por Dados:** A obrigatoriedade do escaneamento de código de barras para liberação do pedido assegura que a quantidade e o item separado correspondam 100% ao solicitado.
 
## 🗃️ Modelo Entidade-Relacionamento (ER)

Abaixo está a modelagem estruturada do banco de dados desenvolvida a partir do levantamento de requisitos do minimundo:

```mermaid
erDiagram
    CLIENTE ||--o{ PEDIDO : "realiza"
    CLIENTE {
        int id_cliente PK
        string nome
        string cpf
    }

    PEDIDO ||--o{ ITEM_PEDIDO : "contem"
    PEDIDO ||--o| ENTREGA : "gera"
    PEDIDO {
        int id_pedido PK
        int id_cliente FK
        datetime data_pedido
        string status
    }

    PRODUTO ||--o{ ITEM_PEDIDO : "pertence"
    PRODUTO ||--o{ REGISTRO_VALIDACAO : "requer"
    PRODUTO {
        int id_produto PK
        string nome
        string codigo_barras
        boolean requer_prescricao
        string corredor
        string prateleira
        string lote
        date validade
    }

    ITEM_PEDIDO {
        int id_pedido PK, FK
        int id_produto PK, FK
        int quantidade_solicitada
        int quantidade_separada
    }

    COLABORADOR ||--o{ REGISTRO_VALIDACAO : "aprova"
    COLABORADOR ||--o{ PEDIDO : "separa"
    COLABORADOR {
        int id_colaborador PK
        string nome
        string cargo "Balconista / Farmacêutico"
    }

    REGISTRO_VALIDACAO {
        int id_validacao PK
        int id_colaborador FK
        int id_produto FK
        int id_pedido FK
        datetime data_validacao
        string status_aprovacao
    }

    ENTREGA {
        int id_entrega PK
        int id_pedido FK
        string tipo_retirada "Motoboy / Cliente"
        string status
    }

[Voltar ao início](https://github.com/marcelofg7/Portifolio_Marcelo_Fagundes)
