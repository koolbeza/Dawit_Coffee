from urllib.parse import quote
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate

ALLOWED_IMAGE_TYPES = {'image/jpeg', 'image/png', 'image/webp', 'image/gif'}
ALLOWED_VIDEO_TYPES = {'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'}
MAX_UPLOAD_BYTES = 20 * 1024 * 1024  # 20 MB

def _check_file(f, allowed_types):
    if f.size > MAX_UPLOAD_BYTES:
        return 'File too large (max 20 MB).'
    if hasattr(f, 'content_type') and f.content_type not in allowed_types:
        return f'File type not allowed: {f.content_type}.'
    return None

from ..models import Product, Certification, GalleryImage, GalleryVideo, Profile, Origin
from ..serializers import (
    ProductSerializer, CertificationSerializer,
    GalleryImageSerializer, GalleryVideoSerializer, ProfileSerializer, OriginSerializer,
)

WHATSAPP_NUMBER = "251911207323"


@api_view(['GET'])
def health_check(request):
    return Response({'status': 'ok', 'db': 'connected'})


@api_view(['GET'])
def product_list(request):
    products = Product.objects.all().order_by('-created_at')
    serializer = ProductSerializer(products, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def product_detail(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = ProductSerializer(product, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def product_create(request):
    f = request.FILES.get('image_file')
    if f:
        err = _check_file(f, ALLOWED_IMAGE_TYPES)
        if err:
            return Response({'error': err}, status=status.HTTP_400_BAD_REQUEST)
    serializer = ProductSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@parser_classes([JSONParser, MultiPartParser, FormParser])
def product_update(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    f = request.FILES.get('image_file')
    if f:
        err = _check_file(f, ALLOWED_IMAGE_TYPES)
        if err:
            return Response({'error': err}, status=status.HTTP_400_BAD_REQUEST)
    serializer = ProductSerializer(product, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def product_delete(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    product.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def inquiry_send(request):
    name = request.data.get('name', '')
    email = request.data.get('email', '')
    company = request.data.get('company', '')
    message = request.data.get('message', '')
    text = (
        f"New Inquiry from DDTCEC Website\n"
        f"Name: {name}\n"
        f"Email: {email}\n"
        f"Company: {company or 'N/A'}\n"
        f"Message: {message}"
    )
    wa_url = f"https://wa.me/{WHATSAPP_NUMBER}?text={quote(text)}"
    return Response({'url': wa_url})


@api_view(['GET'])
def gallery_list(request):
    images = GalleryImage.objects.all()
    serializer = GalleryImageSerializer(images, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def gallery_detail(request, pk):
    try:
        image = GalleryImage.objects.get(pk=pk)
    except GalleryImage.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = GalleryImageSerializer(image, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def gallery_create(request):
    serializer = GalleryImageSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser])
def gallery_update(request, pk):
    try:
        image = GalleryImage.objects.get(pk=pk)
    except GalleryImage.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    new_order = request.data.get('order')
    if new_order is not None:
        new_order = int(new_order)
        if new_order != image.order:
            GalleryImage.objects.filter(order=new_order).exclude(pk=pk).update(order=image.order)
    serializer = GalleryImageSerializer(image, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def gallery_delete(request, pk):
    try:
        image = GalleryImage.objects.get(pk=pk)
    except GalleryImage.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    image.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def gallery_video_list(request):
    videos = GalleryVideo.objects.all()
    serializer = GalleryVideoSerializer(videos, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def gallery_video_create(request):
    serializer = GalleryVideoSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser])
def gallery_video_update(request, pk):
    try:
        video = GalleryVideo.objects.get(pk=pk)
    except GalleryVideo.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    new_order = request.data.get('order')
    if new_order is not None:
        new_order = int(new_order)
        if new_order != video.order:
            GalleryVideo.objects.filter(order=new_order).exclude(pk=pk).update(order=video.order)
    serializer = GalleryVideoSerializer(video, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def gallery_video_delete(request, pk):
    try:
        video = GalleryVideo.objects.get(pk=pk)
    except GalleryVideo.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    video.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def certification_list(request):
    certs = Certification.objects.all()
    serializer = CertificationSerializer(certs, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def certification_detail(request, pk):
    try:
        cert = Certification.objects.get(pk=pk)
    except Certification.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = CertificationSerializer(cert, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def certification_create(request):
    serializer = CertificationSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser])
def certification_update(request, pk):
    try:
        cert = Certification.objects.get(pk=pk)
    except Certification.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = CertificationSerializer(cert, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def certification_delete(request, pk):
    try:
        cert = Certification.objects.get(pk=pk)
    except Certification.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    cert.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def profile_get(request):
    profile = Profile.objects.first()
    if not profile:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    serializer = ProfileSerializer(profile, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def profile_create(request):
    existing = Profile.objects.first()
    if existing:
        serializer = ProfileSerializer(existing, data=request.data, partial=True, context={'request': request})
    else:
        serializer = ProfileSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser])
def profile_update(request):
    profile = Profile.objects.first()
    if not profile:
        serializer = ProfileSerializer(data=request.data, context={'request': request})
    else:
        serializer = ProfileSerializer(profile, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@parser_classes([JSONParser])
def admin_change_password(request):
    from django.contrib.auth.models import User
    old_password = request.data.get('old_password', '')
    new_password = request.data.get('new_password', '')
    if not old_password or not new_password:
        return Response({'error': 'Both old and new passwords are required.'}, status=status.HTTP_400_BAD_REQUEST)
    if len(new_password) < 6:
        return Response({'error': 'New password must be at least 6 characters.'}, status=status.HTTP_400_BAD_REQUEST)
    staff = User.objects.filter(is_staff=True).first()
    if not staff:
        return Response({'error': 'No admin user found.'}, status=status.HTTP_404_NOT_FOUND)
    if not staff.check_password(old_password):
        return Response({'error': 'Current password is incorrect.'}, status=status.HTTP_401_UNAUTHORIZED)
    staff.set_password(new_password)
    staff.save()
    return Response({'ok': True})


@api_view(['GET'])
def origin_list(request):
    origins = Origin.objects.all().order_by('name')
    serializer = OriginSerializer(origins, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@parser_classes([JSONParser, MultiPartParser, FormParser])
def origin_create(request):
    serializer = OriginSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def origin_delete(request, pk):
    try:
        origin = Origin.objects.get(pk=pk)
    except Origin.DoesNotExist:
        return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    origin.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def admin_login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    from django.contrib.auth.models import User
    try:
        user_obj = User.objects.get(email=email)
        username = user_obj.username
    except User.DoesNotExist:
        username = None
    user = authenticate(request, username=username, password=password)
    if user is not None:
        if user.is_staff:
            return Response({
                "message": "Login successful",
                "user": {"username": user.username, "email": user.email, "is_staff": user.is_staff},
            })
        return Response({"detail": "User is not an admin"}, status=status.HTTP_403_FORBIDDEN)
    return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def admin_logout(request):
    return Response({"message": "Logout successful"})
