// app/api/search/suggestions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

interface SuggestionProduct {
  id: string;
  name: string;
  generic_name: string | null;
  brand_name: string | null;
  image_url: string | null;
  price: number;
  requires_prescription: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const limit = 5; // Show only 5 suggestions

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const supabase = await createClient();

    // Get product name suggestions
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, generic_name, brand_name, image_url, price, requires_prescription')
      .eq('is_available', true)
      .or(`name.ilike.*${query}*,generic_name.ilike.*${query}*,brand_name.ilike.*${query}*`)
      .limit(limit);

    if (error) {
      console.error('Suggestions error:', error);
      return NextResponse.json({ suggestions: [] });
    }

    const suggestions = ((products as SuggestionProduct[]) || []).map((product) => ({
      id: product.id,
      name: product.name,
      genericName: product.generic_name,
      brandName: product.brand_name,
      image: product.image_url,
      price: product.price,
      requiresPrescription: product.requires_prescription,
    }));

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Suggestions error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}