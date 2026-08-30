from django import forms
from .models import Book

class URLForm(forms.Form):
    url = forms.CharField(label = "URL")

class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = "__all__"
