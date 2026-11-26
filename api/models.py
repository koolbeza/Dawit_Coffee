from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver


def _delete_file(instance, field_name):
    field = getattr(instance, field_name)
    if field and field.name:
        field.storage.delete(field.name)


class Origin(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    product_name = models.CharField(max_length=255)
    product_origin = models.CharField(max_length=255)
    altitude = models.CharField(max_length=100, blank=True)
    process = models.CharField(max_length=100, blank=True)
    flavor_notes = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.product_name


class Certification(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='certifications/', null=True, blank=True)

    def __str__(self):
        return self.name


class GalleryImage(models.Model):
    CATEGORY_CHOICES = [
        ('Events', 'Events'),
        ('Farms', 'Farms'),
        ('Processing', 'Processing'),
        ('Shipping', 'Shipping'),
        ('Other', 'Other'),
    ]

    image = models.ImageField(upload_to='gallery/')
    caption = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default='Events',
    )

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.caption or f'Gallery image {self.id}'


class GalleryVideo(models.Model):
    CATEGORY_CHOICES = [
        ('Events', 'Events'),
        ('Farms', 'Farms'),
        ('Processing', 'Processing'),
        ('Shipping', 'Shipping'),
        ('Other', 'Other'),
    ]

    video_file = models.FileField(upload_to='gallery/videos/', null=True, blank=True)
    video_url = models.URLField(max_length=500, blank=True)
    thumbnail = models.ImageField(upload_to='gallery/thumbnails/', null=True, blank=True)
    caption = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Events')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.caption or f'Gallery video {self.id}'


class Profile(models.Model):
    company_name = models.CharField(max_length=255, blank=True)
    tagline = models.CharField(max_length=500, blank=True)
    founded_year = models.CharField(max_length=10, blank=True)
    owner_name = models.CharField(max_length=255, blank=True)
    owner_bio = models.TextField(blank=True)
    phone_1 = models.CharField(max_length=30, blank=True)
    phone_2 = models.CharField(max_length=30, blank=True)
    email_1 = models.EmailField(blank=True)
    email_2 = models.EmailField(blank=True)
    po_box = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    logo = models.ImageField(upload_to='profile/', null=True, blank=True)

    def __str__(self):
        return self.company_name or 'Company Profile'


@receiver(post_delete, sender=Product)
def delete_product_image(sender, instance, **kwargs):
    _delete_file(instance, 'image')


@receiver(post_delete, sender=Certification)
def delete_certification_image(sender, instance, **kwargs):
    _delete_file(instance, 'image')


@receiver(post_delete, sender=GalleryImage)
def delete_gallery_image(sender, instance, **kwargs):
    _delete_file(instance, 'image')


@receiver(post_delete, sender=GalleryVideo)
def delete_gallery_video(sender, instance, **kwargs):
    _delete_file(instance, 'video_file')
    _delete_file(instance, 'thumbnail')


@receiver(post_delete, sender=Profile)
def delete_profile_logo(sender, instance, **kwargs):
    _delete_file(instance, 'logo')
