CLEAN ARCHTECTURE PREMISES

pasta CLASS - entity

pasta database - gateway com db

    - busca os dados do banco da dados e retorna cru para useCase 
pasta useCases

    - useCases interpretam os dados vindos do gateway da seguinte forma:
        - busca vazia: useCases retorna sucesso porém sem dados
        - deletar algo ja deletado: retorna erro, já deletado


