from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.views.static import serve
from django.urls import re_path

urlpatterns = [
    path('', include('api.urls')),
    path('admin/', admin.site.urls),
    # Serve uploaded media files in both dev and production
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]
