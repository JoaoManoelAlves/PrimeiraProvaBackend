import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";

export async function productRoutes(Fastify: FastifyInstance) {

  Fastify.get("/products", async (request: FastifyRequest, reply: FastifyReply) => {
    const products = await prisma.product.findMany()
    reply.send(products)
  })

  Fastify.post("/product", async (req, reply) => {
    const {name, price} = req.body as ProductType
    if (!name && !price){
      return reply.status(400).send("Precisa de nome e preco para o produto")
    }
    await prisma.product.create({
      data:{
        name: name,
        price: price
      }
    })
    reply.status(201).send("Produto criado com sucesso")
  })

  Fastify.get("/products/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const {id} = request.params as ProductType
    const product = await prisma.product.findFirst({
      where: {
        id:id
      }
    })
    if (product){
      return product
    }else{
      reply.status(404).send("Product not found!")
    }
  })

}