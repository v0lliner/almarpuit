/*
  # Create Storage Bucket for Images

  1. New Storage Bucket
    - Creates a new public storage bucket named 'images'
    - Enables public access for reading images
    - Restricts upload/delete operations to authenticated users only

  2. Security
    - Adds policies for authenticated users to upload and manage files
    - Adds policy for public read access
*/

-- Create a new storage bucket for images
insert into storage.buckets (id, name, public)
values ('images', 'images', true);

-- Allow public access to images
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'images' );

-- Allow authenticated users to upload files
create policy "Authenticated users can upload images"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'images' );

-- Allow authenticated users to update their uploaded files
create policy "Authenticated users can update images"
on storage.objects for update
to authenticated
using ( bucket_id = 'images' );

-- Allow authenticated users to delete their uploaded files
create policy "Authenticated users can delete images"
on storage.objects for delete
to authenticated
using ( bucket_id = 'images' );