from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0012_gallery_video'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='image',
            field=models.FileField(blank=True, null=True, upload_to='products/'),
        ),
        migrations.AlterField(
            model_name='certification',
            name='image',
            field=models.FileField(blank=True, null=True, upload_to='certifications/'),
        ),
        migrations.AlterField(
            model_name='galleryimage',
            name='image',
            field=models.FileField(blank=True, default='', upload_to='gallery/'),
        ),
        migrations.AlterField(
            model_name='galleryvideo',
            name='thumbnail',
            field=models.FileField(blank=True, null=True, upload_to='gallery/thumbnails/'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='logo',
            field=models.FileField(blank=True, null=True, upload_to='profile/'),
        ),
    ]
