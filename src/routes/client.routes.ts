import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";

export async function clientRoutes(Fastify: FastifyInstance) {

  Fastify.get("/clients", async (request: FastifyRequest, reply: FastifyReply) => {
    const clients = await prisma.client.findMany()
    reply.send(clients)
  })

  Fastify.post("/client", async (req, reply) => {
    const {name, email } = req.body as clientType
    if (!name && !email){
      return reply.status(400).send("Precisa de nome e email para clientes")
    }
    await prisma.client.create({
      data:{
        name: name,
        email: email
      }
    })
    reply.status(201).send("Usuário criado com sucesso")
  })

  Fastify.get("/clients/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const {id} = request.params as clientType
    const client = await prisma.client.findFirst({
      where: {
        id:id
      }
    })
    if (client){
      return client
    }else{
      reply.status(404).send("Client not found!")
    }
  })

}