import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect, notFound } from 'next/navigation'
import { ProductForm } from '@/components/admin/products/product-form'
import { serializeProductDetail } from '@/lib/serialize'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login')

  const { id } = await params
  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { id },
      include: { variants: true },
    }),
    db.category.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
  ])

  if (!product) notFound()

  const initialData = serializeProductDetail(product)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{product.name}</p>
      </div>
      <ProductForm categories={categories} initialData={initialData} />
    </div>
  )
}
