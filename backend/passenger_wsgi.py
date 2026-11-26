import os
import sys

# Inject virtualenv site-packages so Django and all dependencies are importable
sys.path.insert(0, '/home/dawitcdp/virtualenv/Django_Backend/3.13/lib/python3.13/site-packages')

# Add project root so Python can find the Dawit_Coffee_Export_Backend settings package
sys.path.insert(0, '/home/dawitcdp/Dawit_Coffee_Export_Backend')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Dawit_Coffee_Export_Backend.settings')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
