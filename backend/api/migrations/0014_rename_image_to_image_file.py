from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_filefield_images'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product',
            old_name='image',
            new_name='image_file',
        ),
        migrations.RenameField(
            model_name='certification',
            old_name='image',
            new_name='image_file',
        ),
    ]
