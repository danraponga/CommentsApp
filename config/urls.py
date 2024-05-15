from django.contrib import admin
from django.urls import path

from apps.comments.views import CommentListView


urlpatterns = [
    path('/admin/', admin.site.urls),
    path('', CommentListView.as_view(), name='comment-list'),
]
