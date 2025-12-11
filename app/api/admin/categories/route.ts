import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import type { Database } from '@/lib/types/database';

type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
type StaffRole = Database['public']['Tables']['staff']['Row']['role'];

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const staffResult = await supabase
      .from('staff')
      .select('role')
      .eq('id', user.id)
      .single();

    const staff = staffResult.data as { role: StaffRole } | null;
    const staffError = staffResult.error;

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

    // @ts-ignore - Supabase type inference issue with generic Database type
    const result = await supabase
      .from('categories')
      // @ts-ignore - Supabase type inference issue with generic Database type
      .insert(insertData)
      .select()
      .single();

    const category = result.data;
    const error = result.error;

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
