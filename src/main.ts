import fastify from "fastify"
import { clientRoutes } from "./routes/client.routes";
import { productRoutes } from "./routes/product.routes";
import { ordersRoutes } from "./routes/pedidos.routes";

const Fastify = fastify({
    logger: true
})

Fastify.register(clientRoutes);
Fastify.register(productRoutes)
Fastify.register(ordersRoutes)

Fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})