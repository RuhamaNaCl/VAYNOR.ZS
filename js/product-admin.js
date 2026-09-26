(() => {
  const form = document.getElementById('product-form');
  if (!form) return;
  const fileInput = document.getElementById('product-image');
  const preview = document.getElementById('image-preview');
  const message = document.getElementById('product-message');
  const submit = document.getElementById('save-product');
  let previewUrl = null;

  fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    previewUrl = null;
    preview.hidden = true;
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      fileInput.value = '';
      message.textContent = 'Please choose a JPG, PNG, or WebP image.';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      fileInput.value = '';
      message.textContent = 'Image must be 5 MB or smaller.';
      return;
    }
    previewUrl = URL.createObjectURL(file);
    preview.src = previewUrl;
    preview.hidden = false;
    message.textContent = '';
  });

  function makeSlug(value) {
    return value.toLowerCase().trim().normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '').slice(0, 120) || 'product';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const client = window.vaynorSupabase;
    if (!client) { message.textContent = 'Supabase client did not load. Refresh and try again.'; return; }
    const file = fileInput.files && fileInput.files[0];
    if (!file) { message.textContent = 'Please select a product image.'; return; }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      message.textContent = 'Choose a JPG, PNG, or WebP image up to 5 MB.'; return;
    }
    const name = document.getElementById('product-name').value.trim();
    const price = Number(document.getElementById('product-price').value);
    const compareRaw = document.getElementById('product-compare').value;
    const stock = Number(document.getElementById('product-stock').value);
    if (!name || !Number.isFinite(price) || price < 0 || !Number.isInteger(stock) || stock < 0) {
      message.textContent = 'Check the product name, price, and stock quantity.'; return;
    }
    submit.disabled = true;
    submit.textContent = 'Uploading…';
    message.textContent = 'Uploading image and saving product. Please wait…';
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const imagePath = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
    try {
      const { error: uploadError } = await client.storage.from('product-images').upload(imagePath, file, {
        cacheControl: '3600', upsert: false, contentType: file.type
      });
      if (uploadError) throw uploadError;
      const { data: publicData } = client.storage.from('product-images').getPublicUrl(imagePath);
      const baseSlug = makeSlug(name);
      const slug = `${baseSlug}-${Date.now().toString(36)}`;
      const payload = {
        name, slug, price,
        compare_at_price: compareRaw === '' ? null : Number(compareRaw),
        description: document.getElementById('product-description').value.trim() || null,
        category: document.getElementById('product-category').value.trim() || null,
        stock, image_url: publicData.publicUrl, image_path: imagePath,
        is_active: document.getElementById('product-active').checked
      };
      const { error: insertError } = await client.from('products').insert(payload);
      if (insertError) {
        // Keep the image from becoming an orphan if the database insert fails.
        await client.storage.from('product-images').remove([imagePath]);
        throw insertError;
      }
      message.textContent = 'Product saved successfully!';
      form.reset();
      document.getElementById('product-stock').value = '0';
      document.getElementById('product-active').checked = true;
      preview.hidden = true;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      previewUrl = null;
      if (typeof window.toast === 'function') window.toast('Product saved successfully');
    } catch (error) {
      console.error('VAYNOR product save error:', error);
      message.textContent = `Could not save product: ${error.message || 'Please check Storage and Database policies.'}`;
    } finally {
      submit.disabled = false;
      submit.textContent = 'Upload image & save product';
    }
  });
})();
