import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Verify admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (staffError || !staff || !['manager', 'admin'].includes(staff.role)) {
      return NextResponse.json({ error: 'Unauthorized - Manager/Admin only' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { name, slug } = body;

    // Validate
    if (!name || !slug) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, slug' 
      }, { status: 400 });
    }

    // Update category
    const { data: category, error } = await supabase
      .from('categories')
      .update({
        name,
        slug,
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      
      // Check for unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json({ 
          error: 'A category with this slug already exists' 
        }, { status: 400 });
      }
      
      return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }

    return NextResponse.json({ category });

  } catch (error) {
    console.error('Error in PUT /api/admin/categories/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    
    // Verify admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (staffError || !staff || staff.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 403 });
    }

    // Check if category has products
    const { data: products, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', params.id)
      .limit(1);

    if (checkError) {
      console.error('Error checking products:', checkError);
      return NextResponse.json({ error: 'Failed to check category usage' }, { status: 500 });
    }

    if (products && products.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete category that has products. Move or delete products first.' 
      }, { status: 400 });
    }

    // Delete category
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Error deleting category:', error);
      return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Category deleted successfully' });

  } catch (error) {
    console.error('Error in DELETE /api/admin/categories/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
