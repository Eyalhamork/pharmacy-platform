import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Verify staff authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify staff role
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (staffError || !staff) {
      return NextResponse.json({ error: 'Unauthorized - Staff only' }, { status: 403 });
    }

    // Get all products with stock info
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        id,
        name,
        generic_name,
        brand,
        stock_quantity,
        price,
        is_active,
        categories (
          name
        )
      `)
      .order('stock_quantity', { ascending: true });

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    // Calculate inventory metrics
    const totalProducts = products?.length || 0;
    const activeProducts = products?.filter(p => p.is_active).length || 0;
    const outOfStock = products?.filter(p => p.stock_quantity === 0).length || 0;
    const lowStock = products?.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 10).length || 0;
    const inStock = products?.filter(p => p.stock_quantity > 10).length || 0;

    const totalStockValue = products?.reduce((sum, p) => 
      sum + (p.stock_quantity * p.price), 0
    ) || 0;

    // Low stock items (need restocking)
    const lowStockItems = products
      ?.filter(p => p.stock_quantity <= 10)
      .map(p => ({
        id: p.id,
        name: p.name,
        generic_name: p.generic_name,
        brand: p.brand,
        category: p.categories?.name || 'Uncategorized',
        stock_quantity: p.stock_quantity,
        price: p.price,
        value: p.stock_quantity * p.price,
        status: p.stock_quantity === 0 ? 'out_of_stock' : 'low_stock',
      })) || [];

    // Out of stock items
    const outOfStockItems = products
      ?.filter(p => p.stock_quantity === 0)
      .map(p => ({
        id: p.id,
        name: p.name,
        generic_name: p.generic_name,
        brand: p.brand,
        category: p.categories?.name || 'Uncategorized',
        price: p.price,
      })) || [];

    // Category stock breakdown
    const categoryMap = new Map();
    products?.forEach((product: any) => {
      const category = product.categories?.name || 'Uncategorized';
      if (!categoryMap.has(category)) {
        categoryMap.set(category, {
          category,
          totalItems: 0,
          inStock: 0,
          lowStock: 0,
          outOfStock: 0,
          stockValue: 0,
        });
      }
      const cat = categoryMap.get(category);
      cat.totalItems++;
      cat.stockValue += product.stock_quantity * product.price;
      
      if (product.stock_quantity === 0) {
        cat.outOfStock++;
      } else if (product.stock_quantity <= 10) {
        cat.lowStock++;
      } else {
        cat.inStock++;
      }
    });

    const categoryBreakdown = Array.from(categoryMap.values())
      .sort((a, b) => b.stockValue - a.stockValue);

    // High value inventory (top 20 by value)
    const highValueItems = products
      ?.map(p => ({
        id: p.id,
        name: p.name,
        category: p.categories?.name || 'Uncategorized',
        stock_quantity: p.stock_quantity,
        price: p.price,
        value: p.stock_quantity * p.price,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 20) || [];

    return NextResponse.json({
      summary: {
        totalProducts,
        activeProducts,
        outOfStock,
        lowStock,
        inStock,
        totalStockValue,
      },
      lowStockItems,
      outOfStockItems,
      categoryBreakdown,
      highValueItems,
    });

  } catch (error) {
    console.error('Error in GET /api/staff/reports/inventory:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
