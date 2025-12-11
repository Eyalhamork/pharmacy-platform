import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/lib/types/database';

type Staff = Pick<Database['public']['Tables']['staff']['Row'], 'role'>;
type Category = Database['public']['Tables']['categories']['Row'];
type CategoryInsert = Database['public']['Tables']['categories']['Insert'];

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const { data: staff, error: staffError } = (await supabase
      .from('staff')
      .select('role')
      .eq('id', user.id)
      .single()) as { data: Staff | null; error: any };

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

    // Create category
    const insertData: CategoryInsert = {
      name,
      slug,
    };

    const { data: category, error } = (await supabase
      .from('categories')
      .insert(insertData)
      .select()
      .single()) as { data: Category | null; error: any };

    if (error) {
      console.error('Error creating category:', error);
      
      // Check for unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json({ 
          error: 'A category with this slug already exists' 
        }, { status: 400 });
      }
      
      return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }

    return NextResponse.json({ category }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/admin/categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
