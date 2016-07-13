from django import forms
from django.forms import ModelForm
from .models import User

class DocumentForm(forms.Form):
    docfile = forms.FileField(
        label='Select a file',
        help_text='max. 42 megabytes'
    )
    description2 = forms.CharField(
        widget=forms.Textarea(attrs={'placeholder': 'Please enter the  description'}))

class loginForm(forms.Form):
    userName = forms.CharField(label='Username', max_length=100, widget=forms.TextInput(attrs={'class': "form-control", 'placeholder':"Username"}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': "form-control", 'placeholder':"Password"}))

class userRegistration(ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'password']
        #fields = '__all__'
        widgets = {
            "first_name": forms.TextInput(attrs={'placeholder': 'Jane', 'class': 'form-control'}),
            "last_name": forms.TextInput(attrs={'placeholder': 'Doe', 'class': 'form-control'}),
            "email": forms.TextInput(attrs={'placeholder': 'janedoe@socialmedia.com', 'class': 'form-control'}),
            "username": forms.TextInput(attrs={'placeholder': 'gr8User', 'class': 'form-control'}),
            "password": forms.PasswordInput(attrs={'class': "form-control", 'placeholder':"Password"})
        }

    def save(self, commit=True):
        data = self.cleaned_data
        password = data.get('password')
        user = super(userRegistration, self).save(commit)
        user.set_password(password)
        if commit == True:
            user.save()
        return user