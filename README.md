CLEAN ARCHTECTURE PREMISES

pasta CLASS - entity

pasta database - gateway com db
    - envia request e recebe response do db
    - precisa interpretar informação que veio do db.
    - Bom fazer aqui pois é a conexão com o db. Caso o db mude, a interpretação também mudará. Ou seja, as outras camadas não serao afetadas.
pasta useCases

    - useCases interpretam os dados vindos do gateway da seguinte forma:
        - busca vazia: useCases retorna sucesso porém sem dados
        - deletar algo ja deletado: retorna erro, já deletado


