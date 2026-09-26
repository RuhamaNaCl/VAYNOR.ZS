document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.querySelector('#admin-products');
  if (tableBody) {
    const client = window.vaynorSupabase;
    if (!client) {
      tableBody.innerHTML = '<tr><td colspan="4">Supabase did not load. Refresh the page.</td></tr>';
    } else {
      tableBody.innerHTML = '<tr><td colspan="4">Loading products…</td></tr>';
      const { data, error } = await client.from('products')
        .select('id,name,category,price,is_active')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Could not load products:', error);
        tableBody.innerHTML = `<tr><td colspan="4">Could not load products: ${error.message}</td></tr>`;
      } else if (!data || data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4">No products yet. Use “Add product” to create one.</td></tr>';
      } else {
        const safe = (value) => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
        tableBody.innerHTML = data.map(item => `<tr><td>${safe(item.name)}${item.is_active ? '' : ' <small>(Draft)</small>'}</td><td>${safe(item.category || '—')}</td><td>${typeof window.money === 'function' ? window.money(item.price) : `৳${Number(item.price).toFixed(2)}`}</td><td>${item.is_active ? 'Published' : 'Draft'}</td></tr>`).join('');
      }
    }
  }
  const ordersBody = document.querySelector('#admin-orders');
  if (ordersBody) {
    const orders = JSON.parse(localStorage.getItem('vaynor_orders') || '[]');
    ordersBody.innerHTML = orders.length
      ? orders.map(order => `<tr><td>${String(order.id ?? '')}</td><td>${String(order.date ?? '')}</td><td>${typeof window.money === 'function' ? window.money(order.total) : String(order.total ?? '')}</td><td>${String(order.status ?? '')}</td></tr>`).join('')
      : '<tr><td colspan="4">No demo orders yet</td></tr>';
  }
});
