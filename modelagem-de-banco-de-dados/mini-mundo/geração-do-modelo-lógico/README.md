# 💾 Modelação Lógica, Integridade e LGPD - Canal de Pedidos de Farmácia

## 📝 Descrição do Projeto
Esta etapa do projeto consiste na transição do Modelo Concetual para o **Modelo Lógico de Tabelas**, utilizando ferramentas como o MySQL Workbench para a estruturação técnica da base de dados. O foco principal é a implementação de regras de integridade referencial e a adoção de boas práticas de segurança e governança de dados, em estrita conformidade com a **Lei Geral de Proteção de Dados (LGPD)**.

O sistema da farmácia lida com informações sensíveis de saúde e identificação de clientes, o que exige uma arquitetura robusta que minimize redundâncias e proteja a privacidade dos utilizadores durante os processos de separação e validação de medicamentos.

## 🚀 Tecnologias e Boas Práticas de Modelação
* **Ferramentas:** MySQL Workbench / BRModelo.
* **Linguagem:** SQL (DDL - Data Definition Language).
* **Padrão de Nomenclatura:** Tabelas nomeadas no singular e atributos descritivos separados por *underline* (ex: `registo_validacao`, `id_colaborador`).
* **Otimização:** Uso de tipos numéricos (`INT`) para chaves primárias e tipos de dados otimizados para cada campo, garantindo performance nas consultas.
* **Normalização:** Estrutura refinada até à **3ª Forma Normal (3FN)** para assegurar a integridade e evitar anomalias de dados.

## ⚖️ Tratamento de Dados Sensíveis (LGPD)
Dado que o projeto envolve a gestão de **medicamentos controlados** e **receituário médico** (dados de saúde), foram aplicadas as seguintes diretrizes de mitigação de riscos:
* **Minimização da Recolha:** Armazenamos apenas os dados estritamente necessários para a finalidade da aplicação (separação e conferência farmacêutica).
* **Tratamento de Dados de Saúde:** Informações sobre diagnósticos e históricos médicos vinculados ao `registo_validacao` são tratadas com segurança reforçada.
* **Sugestão de Segurança:** Recomenda-se a utilização de encriptação em campos de dados pessoais sensíveis e a pseudonimização de identificadores em ambientes de teste.

## 📊 Resultados: Modelo Lógico e Integridade
O modelo lógico foi desenhado para garantir que cada registo seja único e que as relações entre as entidades sejam consistentes:
* **Chaves e Restrições:** Implementação de `PRIMARY KEYS` (PK) em todas as tabelas e `FOREIGN KEYS` (FK) para manter a ligação entre Clientes, Pedidos e Produtos.
* **Integridade Referencial:** Definição de regras de `ON DELETE` e `ON UPDATE` para evitar registos órfãos, especialmente na relação entre `Pedido` e `Item_Pedido`.
* **Validação de Dados:** Uso de restrições `NOT NULL` para campos obrigatórios e `UNIQUE` para identificadores únicos (como o CPF do cliente).


## 📜 Script SQL (DDL)
O script de criação da base de dados contempla a estrutura completa, garantindo a integridade desde a fundação. Abaixo está um exemplo da aplicação destas regras:

```sql
-- Exemplo de implementação de integridade referencial
CREATE TABLE registo_validacao (
    id_registro INT PRIMARY KEY AUTO_INCREMENT,
    id_produto INT NOT NULL,
    id_farmaceutico INT NOT NULL,
    data_validacao DATETIME NOT NULL,
    status_validacao VARCHAR(20),
    FOREIGN KEY (id_produto) REFERENCES produto(id_produto) ON DELETE CASCADE,
    FOREIGN KEY (id_farmaceutico) REFERENCES colaborador(id_colaborador) ON DELETE RESTRICT
);

[Voltar ao início](https://github.com/marcelofg7/Portifolio_Marcelo_Fagundes)
