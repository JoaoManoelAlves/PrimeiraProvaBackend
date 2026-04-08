/*
  Warnings:

  - You are about to drop the column `productID` on the `Pedidos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pedidos" DROP CONSTRAINT "Pedidos_productID_fkey";

-- AlterTable
ALTER TABLE "Pedidos" DROP COLUMN "productID";

-- CreateTable
CREATE TABLE "_PedidosToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PedidosToProduct_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PedidosToProduct_B_index" ON "_PedidosToProduct"("B");

-- AddForeignKey
ALTER TABLE "_PedidosToProduct" ADD CONSTRAINT "_PedidosToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PedidosToProduct" ADD CONSTRAINT "_PedidosToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
