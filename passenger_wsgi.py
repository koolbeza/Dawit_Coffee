import os
import sys


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

os.environ.setdefault(
    'DJANGO_SETTINGS_MODULE',
    'Dawit_Coffee_Export_Backend.settings',
)

from django.core.wsgi import get_wsgi_application


application = get_wsgi_application()
