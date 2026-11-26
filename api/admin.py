from django.contrib import admin
from .models import Product, Certification, GalleryImage, GalleryVideo, Profile


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'product_origin', 'process', 'created_at')
    search_fields = ('product_name', 'product_origin', 'flavor_notes')
    list_filter = ('process',)
    ordering = ('-created_at',)


@admin.register(Certification)
class CertificationAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ('caption', 'category', 'order')
    list_filter = ('category',)
    ordering = ('order',)


@admin.register(GalleryVideo)
class GalleryVideoAdmin(admin.ModelAdmin):
    list_display = ('caption', 'category', 'order', 'created_at')
    list_filter = ('category',)
    ordering = ('order',)


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'owner_name', 'city', 'country')

    def has_add_permission(self, request):
        # Only allow one profile
        return not Profile.objects.exists()
