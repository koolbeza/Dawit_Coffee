from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0011_galleryimage_created_at_state'),
    ]

    operations = [
        migrations.CreateModel(
            name='GalleryVideo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('video_file', models.FileField(blank=True, null=True, upload_to='gallery/videos/')),
                ('video_url', models.URLField(blank=True, max_length=500)),
                ('thumbnail', models.ImageField(blank=True, null=True, upload_to='gallery/thumbnails/')),
                ('caption', models.CharField(blank=True, max_length=255)),
                ('order', models.PositiveIntegerField(default=0)),
                ('category', models.CharField(choices=[('Events', 'Events'), ('Farms', 'Farms'), ('Processing', 'Processing'), ('Shipping', 'Shipping'), ('Other', 'Other')], default='Events', max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['order'],
            },
        ),
        migrations.SeparateDatabaseAndState(
            state_operations=[migrations.DeleteModel(name='AdminCredential')],
            database_operations=[],
        ),
        migrations.AlterModelOptions(
            name='galleryimage',
            options={'ordering': ['order']},
        ),
        migrations.SeparateDatabaseAndState(
            state_operations=[migrations.RemoveField(model_name='certification', name='created_at')],
            database_operations=[],
        ),
        migrations.AlterField(
            model_name='product',
            name='product_origin',
            field=models.CharField(max_length=255),
        ),
    ]
