from django.urls import path
from . import views

urlpatterns = [
    # Health
    path('', views.health_check),

    # Products
    path('api/products', views.product_list),
    path('api/products/create', views.product_create),
    path('api/products/update/<int:pk>', views.product_update),
    path('api/products/delete/<int:pk>', views.product_delete),
    path('api/products/<int:pk>', views.product_detail),

    # Inquiries
    path('api/inquiries/send', views.inquiry_send),

    # Gallery
    path('api/gallery', views.gallery_list),
    path('api/gallery/create', views.gallery_create),
    path('api/gallery/update/<int:pk>', views.gallery_update),
    path('api/gallery/delete/<int:pk>', views.gallery_delete),
    path('api/gallery/<int:pk>', views.gallery_detail),

    # Gallery Videos
    path('api/gallery-videos', views.gallery_video_list),
    path('api/gallery-videos/create', views.gallery_video_create),
    path('api/gallery-videos/update/<int:pk>', views.gallery_video_update),
    path('api/gallery-videos/delete/<int:pk>', views.gallery_video_delete),

    # Certifications
    path('api/certifications', views.certification_list),
    path('api/certifications/create', views.certification_create),
    path('api/certifications/update/<int:pk>', views.certification_update),
    path('api/certifications/delete/<int:pk>', views.certification_delete),
    path('api/certifications/<int:pk>', views.certification_detail),

    # Profile
    path('api/profile', views.profile_get),
    path('api/profile/create', views.profile_create),
    path('api/profile/update', views.profile_update),

    # Origins
    path('api/origins', views.origin_list),
    path('api/origins/create', views.origin_create),
    path('api/origins/delete/<int:pk>', views.origin_delete),

    # Auth
    path('api/auth/login', views.admin_login),
    path('api/auth/logout', views.admin_logout),
    path('api/admin/change-password', views.admin_change_password),
]
