import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { ProductForm } from '@/components/admin/products/product-form'

export default async function NewProductPage() {
  const session = await auth()
  if (!session?.user || session.user.role !== 'ADMIN') redirect('/login')

  const categories = await db.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">New Product</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Fill in the details below to create a new product.</p>
      </div>
      <ProductForm categories={categories} />
    </div>
  )
}
