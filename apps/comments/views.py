from typing import Any
from django.db.models.query import QuerySet
from django.views.generic import ListView

from apps.comments.models import Comment
from apps.comments.forms import CommentForm


class CommentListView(ListView):
    model = Comment
    template_name = "comments/index.html"
    context_object_name = "comments"
    paginate_by = 25

    def get_queryset(self) -> QuerySet[Any]:
        queryset = Comment.objects.filter(parent=None).prefetch_related("children")
        params = self.request.GET
        username = params.get("username")
        email = params.get("email")
        sort_by = params.get("sort_by")
        date_order = params.get("date_order", "desc")

        if username:
            queryset = queryset.filter(username=username)
        if email:
            queryset = queryset.filter(email=email)
        if sort_by:
            queryset = queryset.order_by(sort_by)
        elif date_order == "asc":
            queryset = queryset.order_by("created_at")
        else:
            queryset = queryset.order_by("-created_at")

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["form"] = CommentForm()
        return context
