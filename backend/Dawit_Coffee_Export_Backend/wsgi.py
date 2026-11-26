import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Dawit_Coffee_Export_Backend.settings')

application = get_wsgi_application()
