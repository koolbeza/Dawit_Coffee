from django.db import migrations

ETHIOPIAN_ORIGINS = [
    "Yirgacheffe", "Sidama", "Guji", "Harrar", "Limu", "Jimma", "Kaffa",
    "Illubabor", "Bench Maji", "Tepi", "Bebeka", "Gimbi (Lekempti)", "Nekemte",
    "Wolega", "Shakiso", "Hambela", "Gedeo", "Borena", "Dawro",
    "West Hararghe", "East Hararghe", "Arsi", "Bale", "Sheka", "Majang",
]


def seed_origins(apps, schema_editor):
    Origin = apps.get_model("api", "Origin")
    for name in ETHIOPIAN_ORIGINS:
        Origin.objects.get_or_create(name=name)


def unseed_origins(apps, schema_editor):
    Origin = apps.get_model("api", "Origin")
    Origin.objects.filter(name__in=ETHIOPIAN_ORIGINS).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0007_add_origin_model"),
    ]

    operations = [
        migrations.RunPython(seed_origins, reverse_code=unseed_origins),
    ]
