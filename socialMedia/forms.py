from django import forms

class DocumentForm(forms.Form):
    docfile = forms.FileField(
        label='Select a file',
        help_text='max. 42 megabytes'
    )
    description2 = forms.CharField(
        widget=forms.Textarea(attrs={'placeholder': 'Please enter the  description'}))