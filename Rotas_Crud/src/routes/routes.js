const { Router } = require('express') // 
const Aluno = require('../models/Aluno')
const Curso = require('../models/Curso')
const Professor = require('../models/Professor')

const routes = new Router()

// GET - Lista alguma coisa
// POST - Criar/adicionar algo
// PUT - Atualizar algo
// DELETE - Deleta algo
// PATCH - depois

// criar uma rota
// tipo
// path
// implementacao

routes.get('/bem_vindo', (req, res) => {
    res.json({ name: 'Bem vindo' })
})

routes.post('/alunos', async (req, res) => {
    try {
        const nome = req.body.nome
        const data_nascimento = req.body.data_nascimento
        const celular = req.body.celular
    
        if(!nome) {
            return res.status(400).json({mensagem: 'O nome é obrigatório'})
        }

        // momentJs
        // date-fns

        if(!data_nascimento) {
            return res.status(400).json({mensagem: 'A data de nascimento é obrigatória'})
        }

        const aluno = await Aluno.create({
            nome: nome,
            data_nascimento: data_nascimento,
            celular: celular
        })

        res.status(201).json(aluno)

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Não possível cadastrar o aluno' })
    }
})

routes.get('/alunos', async (req, res) => {
    const alunos = await Aluno.findAll()
    res.json(alunos)
})

routes.post('/cursos', async (req, res) => {

    try {
        const nome = req.body.nome
        const duracao_horas = req.body.duracao_horas
        
        if(!nome) {
            return res.status(400).json({mensagem: "nome é obrigatório"})
        }
    
        if(!(duracao_horas >= 40 && duracao_horas <= 200)) {
            return res.status(400).json({mensagem: "A duração do curso deve ser entre 40 e 200 horas"})
        }
    
        const curso = await Curso.create({
            nome: nome,
            duracao_horas: duracao_horas
        })
    
        res.status(201).json(curso)
    
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Não possível cadastrar o curso' })
    }


  
})


routes.get('/cursos', async (req, res) => {
    const nome = req.query.nome
    const cursos = await Curso.findAll({
        where: {
            nome: nome
        }
})
    res.json(cursos)


})

routes.delete('/cursos/:id', async (req, res) => {
    const id = req.params.id

    try {

        const curso = await Curso.findByPk(id)

        if (!curso) {
            return res.status(404).json({ error: 'Curso não encontrado'})
        } 

    await Curso.destroy({
    where:{
        id: id
    }
})

    res.status(204).json({})

} catch (error) {
    console.log(error.message)

    res.status(500).json({error: 'Não foi possível excluir o curso'})
}
})

routes.put('/cursos/:id', async (req, res) => {
    const id = req.params.id
    const {nome, duracao_horas} = req.body

    if(!nome) {
        return res.status(400).json({mensagem: 'nome é obrigatório'})
    }

    if (!(duracao_horas >= 40 && duracao_horas <= 200)) {
        return res.status(400).json({ mensagem: 'A duração do curso deve ser entre 40 e 200 horas'})
    }

    try{
        await Curso.update(
            {nome, duracao_horas},
            {where: {id}}
        )
        
        const cursoAtualizado = await Curso.findByPk(id)

        res.status(200).json(cursoAtualizado)

    } catch (error) {
        console.log(error.message)
        res.status(500).json({error: 'Não foi possível atualizar  curso'})
    }
})

routes.get('/professores', async (req, res) => {
    try {
        const professores = await Professor.findAll();
        res.json(professores);
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ error: 'Erro ao buscar os professores'})
    }
})

routes.post('/professores', async (req, res) => {
    const {nome, disciplina} = req.body
    try {
        const novoProfessor = await Professor.create({nome, disciplina})
        res.status(201).json(novoProfessor)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({error: 'Erro ao adicionar o professor'})
    }
})

routes.delete ('/professores/:id', async (req, res) => {
    const id = req.params.id
    try {
        await Professor.destroy({where: {id}})
        res.status(204).json({})
    } catch (error) {
        console.log(error.message)
        res.status(500).json({error: 'Erro ao deletar o professor'})
    }
})

routes.put('/professores/:id', async (req, res) => {
    const id = req.params.id 
    const {nome, disciplina} = req.body
    try {
        const professor = await Professor.findByPk(id)
        if (!professor) {
            return res.status(404).json({error: 'Professor não encontrado'})
        }

        await Professor.update({nome, disciplina}, {where: {id}})
        const professorAtualizado = await Professor.findByPk(id)
        
        res.json(professorAtualizado)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({error: 'Erro ao atualizar o professor'})
    }
})

module.exports = routes

