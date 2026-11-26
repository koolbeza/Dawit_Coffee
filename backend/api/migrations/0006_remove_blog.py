from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_merge_20260321_1915'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Blog',
        ),
    ]
