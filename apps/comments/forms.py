from django import forms
from .models import Comment

class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['username', 'email', 'homepage', 'text', 'image', 'file']
        widgets = {
            'text': forms.Textarea(attrs={'placeholder': 'Comment'}),
        }