from django.db import migrations

PRODUCTS = [
    {
        "product_name": "Yirgacheffe Grade 1 Washed",
        "product_origin": "Yirgacheffe",
        "altitude": "1,700 – 2,200 masl",
        "process": "Washed",
        "flavor_notes": "Jasmine, Bergamot, Lemon, Stone Fruit, Black Tea",
        "description": (
            "From the misty highlands of Yirgacheffe, this Grade 1 washed lot is celebrated worldwide "
            "for its delicate floral aromatics and bright citrus acidity. Meticulously hand-picked and "
            "wet-processed at local washing stations, it delivers a clean, tea-like cup with a silky body "
            "and a long, sweet finish. A flagship of Ethiopian specialty coffee."
        ),
    },
    {
        "product_name": "Guji Grade 1 Natural",
        "product_origin": "Guji",
        "altitude": "1,800 – 2,400 masl",
        "process": "Natural",
        "flavor_notes": "Blueberry, Dark Chocolate, Red Wine, Tropical Fruit, Vanilla",
        "description": (
            "Sun-dried on raised beds in the Guji highlands, this natural lot captures the bold, "
            "fruit-forward character that has made Guji one of Ethiopia's most sought-after origins. "
            "Expect an intensely aromatic cup with notes of ripe blueberry, dark chocolate, and a "
            "wine-like richness. Full body with a velvety mouthfeel and a lingering sweet finish."
        ),
    },
    {
        "product_name": "Sidama Grade 1 Washed",
        "product_origin": "Sidama",
        "altitude": "1,500 – 2,200 masl",
        "process": "Washed",
        "flavor_notes": "Peach, Apricot, Lemon Verbena, Milk Chocolate, Caramel",
        "description": (
            "Sourced from the fertile highlands of Sidama, this Grade 1 washed coffee offers a beautifully "
            "balanced cup with stone-fruit sweetness and a smooth, creamy body. Grown under native shade trees "
            "by smallholder farmers and wet-processed at certified washing stations, it consistently scores "
            "above 87 on the SCA cupping scale."
        ),
    },
    {
        "product_name": "Harrar Grade 4 Natural",
        "product_origin": "Harrar",
        "altitude": "1,400 – 2,000 masl",
        "process": "Natural",
        "flavor_notes": "Wild Berry, Mocha, Cardamom, Dark Honey, Dried Fig",
        "description": (
            "One of Ethiopia's oldest and most distinctive coffees, Harrar is dry-processed using centuries-old "
            "traditions in the eastern highlands. This Grade 4 natural delivers a wild, wine-like complexity "
            "with mocha depth and exotic spice. Prized by specialty roasters for its unpredictable, adventurous "
            "character and heavy body."
        ),
    },
    {
        "product_name": "Limu Grade 1 Washed",
        "product_origin": "Limu",
        "altitude": "1,400 – 1,900 masl",
        "process": "Washed",
        "flavor_notes": "Citrus, Spice, Floral, Mild Berry, Honey",
        "description": (
            "Limu is one of Ethiopia's most consistent and reliable specialty origins. This Grade 1 washed "
            "lot is grown in the lush forests of the Jimma zone and wet-processed for exceptional clarity. "
            "The cup profile is gently complex — bright citrus with a hint of spice, floral undertones, "
            "and a clean honey sweetness. Ideal for filter and pour-over preparations."
        ),
    },
    {
        "product_name": "Teppi Grade 1 Washed",
        "product_origin": "Tepi",
        "altitude": "1,000 – 1,800 masl",
        "process": "Washed",
        "flavor_notes": "Green Apple, Jasmine, Mild Citrus, Caramel, Light Cocoa",
        "description": (
            "Teppi coffees come from the wild coffee forests of southwestern Ethiopia, where Coffea arabica "
            "grows in its natural habitat. This washed Grade 1 lot is bright and clean with a light-to-medium "
            "body, gentle floral notes, and a delicate caramel sweetness. An excellent single-origin offering "
            "for roasters seeking a unique forest terroir."
        ),
    },
    {
        "product_name": "Telila Special Grade 1 Natural",
        "product_origin": "Sidama, Guji",
        "altitude": "1,800 – 2,200 masl",
        "process": "Natural",
        "flavor_notes": "Strawberry, Hibiscus, Dark Chocolate, Brown Sugar, Bergamot",
        "description": (
            "The Telila Special is our signature house blend — a premium natural lot combining the finest "
            "beans from Sidama and Guji origins. Carefully selected by our Licensed Q-Grader and sun-dried "
            "on raised beds for 21–28 days, it produces an extraordinarily sweet, fruit-forward cup. "
            "This exclusive lot represents the pinnacle of what DDTCEC has to offer the global specialty market."
        ),
    },
]


def seed_products(apps, schema_editor):
    Product = apps.get_model("api", "Product")
    for p in PRODUCTS:
        Product.objects.get_or_create(
            product_name=p["product_name"],
            defaults={
                "product_origin": p["product_origin"],
                "altitude": p["altitude"],
                "process": p["process"],
                "flavor_notes": p["flavor_notes"],
                "description": p["description"],
            },
        )


def unseed_products(apps, schema_editor):
    Product = apps.get_model("api", "Product")
    names = [p["product_name"] for p in PRODUCTS]
    Product.objects.filter(product_name__in=names).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0008_seed_ethiopian_origins"),
    ]

    operations = [
        migrations.RunPython(seed_products, unseed_products),
    ]
