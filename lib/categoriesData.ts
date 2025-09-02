export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  postCount: number
  createdAt: string
  updatedAt: string
}

export const categories: Category[] = [
  {
    id: 1,
    name: "Prodüksiyon",
    slug: "produksiyon",
    description: "Müzik prodüksiyon teknikleri ve araçları",
    postCount: 12,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 2,
    name: "Grup Müziği",
    slug: "grup-muzigi",
    description: "Grup müziği ve orkestra yönetimi",
    postCount: 8,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 3,
    name: "Enstrüman",
    slug: "enstruman",
    description: "Çeşitli enstrümanlar ve çalım teknikleri",
    postCount: 15,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 4,
    name: "Müzik Teorisi",
    slug: "muzik-teorisi",
    description: "Müzik teorisi ve kompozisyon",
    postCount: 20,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 5,
    name: "Performans",
    slug: "performans",
    description: "Sahne performansı ve sunum teknikleri",
    postCount: 10,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 6,
    name: "Dijital Müzik",
    slug: "dijital-muzik",
    description: "Dijital müzik teknolojileri ve yazılımları",
    postCount: 18,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 7,
    name: "Eğitim",
    slug: "egitim",
    description: "Müzik eğitimi ve öğretim yöntemleri",
    postCount: 14,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 8,
    name: "Sağlık",
    slug: "saglik",
    description: "Müzisyen sağlığı ve korunma yöntemleri",
    postCount: 6,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 9,
    name: "Jazz",
    slug: "jazz",
    description: "Jazz müziği ve tarihi",
    postCount: 9,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 10,
    name: "Hukuk",
    slug: "hukuk",
    description: "Müzik hukuku ve telif hakları",
    postCount: 4,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 11,
    name: "Kültür",
    slug: "kultur",
    description: "Müzik kültürü ve tarihi",
    postCount: 11,
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  }
]

export const getCategoryNames = (): string[] => {
  return categories.map(cat => cat.name)
}

export const addCategory = (name: string, description?: string): Category => {
  const newCategory: Category = {
    id: Math.max(...categories.map(c => c.id)) + 1,
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ş]/g, 's').replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c'),
    description,
    postCount: 0,
    createdAt: new Date().toISOString().split('T')[0],
    updatedAt: new Date().toISOString().split('T')[0]
  }
  
  categories.push(newCategory)
  return newCategory
}

export const deleteCategory = (id: number): boolean => {
  const index = categories.findIndex(cat => cat.id === id)
  if (index > -1) {
    categories.splice(index, 1)
    return true
  }
  return false
}

export const updateCategory = (id: number, updates: Partial<Category>): Category | null => {
  const category = categories.find(cat => cat.id === id)
  if (category) {
    Object.assign(category, { ...updates, updatedAt: new Date().toISOString().split('T')[0] })
    return category
  }
  return null
}
