import random
from django.urls import reverse_lazy
import string
from django.shortcuts import render,redirect,get_object_or_404
from .models import URLshort,Book
from .forms import URLForm
from django.http import HttpResponse
import datetime
from .forms import BookForm
from django.views.generic import ListView, DetailView, CreateView, UpdateView, DeleteView
from rest_framework import viewsets
from .serializers import BookSerializer

# def urlshort(request):
#     if request.method == 'POST':
#         form = URLForm(request.POST)
#         if form.is_valid():
#             slug = ''.join(random.choice(string.ascii_letters) for _ in range(5))  # Generate slug
#             url = form.cleaned_data["url"] 
#             new_url = URLshort(url=url, slug=slug)  
#             new_url.save()
#             return redirect('/')  
#     else:
#         form = URLForm()

#     data = URLshort.objects.all()  
#     context = {'form': form, 'data': data}
#     return render(request, 'index.html', context)

# def urlRedirect(request, slugs):
#     data = get_object_or_404(URLshort, slug=slugs)
#     return redirect(data.url)

# def display_time(request):
#     datee = datetime.datetime.now()
#     html = "Time is {}".format(datee)

#     return HttpResponse(html)


# class BookListView(ListView):
#     model = Book
#     template_name = 'book1.html'  # Overriding the default template name to match yours
#     context_object_name = 'books'

# class BookDetailView(DetailView):
#     model = Book
#     template_name = 'book2.html'
#     context_object_name = 'book'  

# class BookCreateView(CreateView):
#     model = Book
#     form_class = BookForm
#     template_name = 'book3.html'
#     success_url = reverse_lazy('book_display') # Redirects here after successful save

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         context['action'] = 'Create' # Keeps your dynamic template title working
#         return context

# class BookUpdateView(UpdateView):
#     model = Book
#     form_class = BookForm
#     template_name = 'book3.html'
#     success_url = reverse_lazy('book_display')

#     def get_context_data(self, **kwargs):
#         context = super().get_context_data(**kwargs)
#         context['action'] = 'Update'
#         return context

# class BookDeleteView(DeleteView):
#     model = Book
#     template_name = 'book4.html'
#     success_url = reverse_lazy('book_display')
#     context_object_name = 'book'

    
class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

