import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma";

export async function ordersRoutes(Fastify: FastifyInstance) {
  //Buscar todos os Pedidos
  Fastify.get("/orders", async (request: FastifyRequest, reply: FastifyReply) => {
      const ordersClient = await prisma.pedidos.findMany();
      reply.status(200).send(ordersClient);
    });
  //Buscar todos os pedidos de um usuário
  Fastify.get("/orders/:id", async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as PedidosTypes;
      const orderClient = await prisma.pedidos.findMany({
        where: {
          clientId: id,
        },
        include:{
          client: true,
          product: true
        }
      });
      if(orderClient){
        reply.status(200).send(orderClient);
      }else{
        return reply.status(404).send("Ordem de cliente não encontrada")
      }
    },
  );

  Fastify.get("/order/:id", async (request: FastifyRequest, reply: FastifyReply) => {
    const {id} = request.params as PedidosTypes
    const orderclient = await prisma.pedidos.findFirst({
      where:{
        id: id
      },
      include:{
        client:true,
        product:true
      }
    })
    reply.status(200).send(orderclient);
  });

  //Criar novo pedido com o usuário e eus produtos
  Fastify.post("/order",async (request: FastifyRequest, reply: FastifyReply) => {
    const { clientID, productsIDs} = request.body as PedidosTypes

    const clienteSelecionado = await prisma.client.findFirst({
      where: {
        id: clientID,
      },
    });

    //Transformar todo o json da lista de produtos em um array contendo apenas os ids de referencia da tabela de produtos
    const productsIDsVetor = productsIDs.map((p) => p.id)

    const productsInOrder = await prisma.product.findMany({
      where: {
        id: {
          in: productsIDsVetor,
        },
      },
    });

      if (!clienteSelecionado) {
        return reply.status(404).send("O usuário não contém registros em nosso banco");
      }
      if (productsInOrder.length !== productsIDs.length) {
        return reply.status(404).send("Algum dos produtos não existe em nosso sistema");
      }

      let valorTotal = productsInOrder.reduce(
        (valorIntegral, product) => valorIntegral + product.price,0);

      const newOrderClient = await prisma.pedidos.create({
        data: {
          clientId: clientID,
          totalValue: valorTotal,
          product: {
            connect: productsIDsVetor.map((id) => ({ id })),
          }
        },
        include: {
          product: true,
        },
      });

      if (newOrderClient){ 
        return reply.status(201).send("Pedido criado com sucesso")
      }else{
        return reply.status(400).send("O pedido não foi efeituado corretamente")
      }

    },
  );

}

/*
Padrão de formulário para os pedidos:
{
  "name": "id do name",
  products: [
  {"id": "id do produto"},
  {"id": "id do produto"},
  {"id": "id do produto"}
  ]
}
*/ 