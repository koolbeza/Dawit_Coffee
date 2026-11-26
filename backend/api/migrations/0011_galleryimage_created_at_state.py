from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):
    """
    The api_galleryimage table already has a created_at column in the database
    (added by a previous migration that was later removed from the model).
    This migration only updates Django's migration state — no SQL is executed.
    """

    dependencies = [
        ('api', '0010_galleryimage_category'),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            state_operations=[
                migrations.AddField(
                    model_name='galleryimage',
                    name='created_at',
                    field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
                    preserve_default=False,
                ),
            ],
            database_operations=[],
        ),
    ]
