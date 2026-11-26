from django.urls import path
from . import views

urlpatterns = [
    path('', views.health_check),

    path('products', views.product_list),
    path('products/create', views.product_create),
    path('products/update/<int:pk>', views.product_update),
    path('products/delete/<int:pk>', views.product_delete),
    path('products/<int:pk>', views.product_detail),

    path('inquiries/send', views.inquiry_send),

    path('gallery', views.gallery_list),
    path('gallery/create', views.gallery_create),
    path('gallery/update/<int:pk>', views.gallery_update),
    path('gallery/delete/<int:pk>', views.gallery_delete),
    path('gallery/<int:pk>', views.gallery_detail),

    path('gallery-videos', views.gallery_video_list),
    path('gallery-videos/create', views.gallery_video_create),
    path('gallery-videos/update/<int:pk>', views.gallery_video_update),
    path('gallery-videos/delete/<int:pk>', views.gallery_video_delete),

    path('certifications', views.certification_list),
    path('certifications/create', views.certification_create),
    path('certifications/update/<int:pk>', views.certification_update),
    path('certifications/delete/<int:pk>', views.certification_delete),
    path('certifications/<int:pk>', views.certification_detail),

    path('profile', views.profile_get),
    path('profile/create', views.profile_create),
    path('profile/update', views.profile_update),

    path('origins', views.origin_list),
    path('origins/create', views.origin_create),
    path('origins/delete/<int:pk>', views.origin_delete),

    path('auth/login', views.admin_login),
    path('auth/logout', views.admin_logout),
    path('admin/change-password', views.admin_change_password),
]
