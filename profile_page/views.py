import random
import string
from django.shortcuts import render,redirect,get_object_or_404
from .models import URLshort
from .forms import URLForm

def urlshort(request):
    if request.method == 'POST':
        form = URLForm(request.POST)
        if form.is_valid():
            slug = ''.join(random.choice(string.ascii_letters) for _ in range(5))  # Generate slug
            url = form.cleaned_data["url"] 
            new_url = URLshort(url=url, slug=slug)  
            new_url.save()
            return redirect('/')  
    else:
        form = URLForm()

    data = URLshort.objects.all()  
    context = {'form': form, 'data': data}
    return render(request, 'index.html', context)

def urlRedirect(request, slugs):
    data = get_object_or_404(URLshort, slug=slugs)
    return redirect(data.url)