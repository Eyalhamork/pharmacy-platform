import { createServerClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    
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

    // Fetch product
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Error fetching product:', error);
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });

  } catch (error) {
    console.error('Error in GET /api/staff/products/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    
    // Verify staff authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify staff role (only managers and admins can edit products)
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (staffError || !staff) {
      return NextResponse.json({ error: 'Unauthorized - Staff only' }, { status: 403 });
    }

    if (!['manager', 'admin'].includes(staff.role)) {
      return NextResponse.json({ error: 'Unauthorized - Manager/Admin only' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const {
      name,
      generic_name,
      brand,
      category_id,
      description,
      usage_instructions,
      dosage_info,
      warnings,
      price,
      stock_quantity,
      requires_prescription,
      image_url,
      is_active
    } = body;

    // Validate required fields
    if (!name || !price || !category_id) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, price, category_id' 
      }, { status: 400 });
    }

    // Update product
    const { data: product, error: updateError } = await supabase
      .from('products')
      .update({
        name,
        generic_name: generic_name || null,
        brand: brand || null,
        category_id,
        description: description || null,
        usage_instructions: usage_instructions || null,
        dosage_info: dosage_info || null,
        warnings: warnings || null,
        price: parseFloat(price),
        stock_quantity: stock_quantity !== undefined ? parseInt(stock_quantity) : undefined,
        requires_prescription: requires_prescription || false,
        image_url: image_url || null,
        is_active: is_active !== undefined ? is_active : true,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating product:', updateError);
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }

    return NextResponse.json({ product });

  } catch (error) {
    console.error('Error in PUT /api/staff/products/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    
    // Verify staff authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify staff role (only admins can delete products)
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (staffError || !staff) {
      return NextResponse.json({ error: 'Unauthorized - Staff only' }, { status: 403 });
    }

    if (staff.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    // Check if product has any order items
    const { data: orderItems, error: checkError } = await supabase
      .from('order_items')
      .select('id')
      .eq('product_id', params.id)
      .limit(1);

    if (checkError) {
      console.error('Error checking order items:', checkError);
      return NextResponse.json({ error: 'Failed to check product usage' }, { status: 500 });
    }

    // If product has been ordered, deactivate instead of delete
    if (orderItems && orderItems.length > 0) {
      const { data: product, error: deactivateError } = await supabase
        .from('products')
        .update({ 
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', params.id)
        .select()
        .single();

      if (deactivateError) {
        console.error('Error deactivating product:', deactivateError);
        return NextResponse.json({ error: 'Failed to deactivate product' }, { status: 500 });
      }

      return NextResponse.json({ 
        message: 'Product has order history and was deactivated instead of deleted',
        product 
      });
    }

    // Delete product
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', params.id);

    if (deleteError) {
      console.error('Error deleting product:', deleteError);
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Error in DELETE /api/staff/products/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
