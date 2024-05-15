from django.contrib import admin
from django.urls import path
from django.conf.urls.static import static

from apps.comments.views import CommentListView
from config import settings


urlpatterns = [
    path('/admin/', admin.site.urls),
    path('', CommentListView.as_view(), name='comment-list'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) \
  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
