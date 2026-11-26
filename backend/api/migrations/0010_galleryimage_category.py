from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_seed_products'),
    ]

    operations = [
        migrations.AddField(
            model_name='galleryimage',
            name='category',
            field=models.CharField(
                choices=[
                    ('Events', 'Events'),
                    ('Farms', 'Farms'),
                    ('Processing', 'Processing'),
                    ('Shipping', 'Shipping'),
                    ('Other', 'Other'),
                ],
                default='Events',
                max_length=50,
            ),
        ),
    ]
