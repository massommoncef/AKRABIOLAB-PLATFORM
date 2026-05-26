import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from products.models import Category, Product
from inventory.models import RawMaterial, Packaging

def seed():
    # 1. Categories
    cat_cosm = Category.objects.get_or_create(name="Cosmétique Fabrication")[0]
    cat_mat = Category.objects.get_or_create(name="Matières Premières")[0]
    cat_parf = Category.objects.get_or_create(name="Parfumerie")[0]

    # 2. Raw Materials
    eth_local = RawMaterial.objects.get_or_create(name="Ethanol Local (Algérie)", unit="L", unit_cost=150)[0]
    eth_imp = RawMaterial.objects.get_or_create(name="Ethanol Importation", unit="L", unit_cost=280)[0]
    oil_p = RawMaterial.objects.get_or_create(name="Huile pour Parfum", unit="KG", unit_cost=4500)[0]

    # 3. Packaging
    bot_1l = Packaging.objects.get_or_create(type="BOTTLE", size="1L", unit_cost=25)[0]

    # 4. Products
    products = [
        {"name": "Ethanol 96% Local", "cat": cat_mat, "mat": eth_local, "qty": 1.0, "price": 450, "img": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=500"},
        {"name": "Ethanol 99% Importé", "cat": cat_mat, "mat": eth_imp, "qty": 1.0, "price": 850, "img": "https://images.unsplash.com/photo-1603123853880-a92fafb7809f?q=80&w=500"},
        {"name": "Huile de Romarin Pure", "cat": cat_cosm, "mat": None, "qty": 0, "price": 1200, "img": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=500"},
        {"name": "Iode (Yood) Solution", "cat": cat_cosm, "mat": None, "qty": 0, "price": 950, "img": "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=500"},
        {"name": "Vitamine E Liquide", "cat": cat_cosm, "mat": None, "qty": 0, "price": 3500, "img": "https://images.unsplash.com/photo-1626716493137-b67fe9501e76?q=80&w=500"},
        {"name": "Essence Parfumée", "cat": cat_parf, "mat": oil_p, "qty": 0.1, "price": 5500, "img": "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=500"},
    ]

    for p in products:
        Product.objects.get_or_create(
            name=p["name"],
            category=p["cat"],
            base_material=p["mat"],
            material_quantity_per_unit=p["qty"],
            packaging=bot_1l,
            unit_price=p["price"],
            image_url=p["img"],
            description=f"Qualité supérieure pour fabrication {p['cat'].name.lower()}."
        )
    print("Database seeded successfully with Akrabiolab products.")

if __name__ == "__main__":
    seed()
