/**
 * Test Supabase Connection
 * Run this in browser console: window.testSupabase()
 */

import { supabase } from '../lib/supabase';

export const testSupabaseConnection = async () => {
  console.log('🧪 Testing Supabase Connection...\n');
  
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
  
  console.log('1. Environment Check:');
  console.log('   URL:', supabaseUrl ? '✅ Set' : '❌ Not set');
  console.log('   Key:', supabaseKey ? '✅ Set' : '❌ Not set');
  console.log('');
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Supabase not configured. Check your .env file.');
    return;
  }
  
  console.log('2. Testing portfolio_data table:');
  try {
    // Try UUID first (your table uses UUID)
    let { data, error } = await supabase
      .from('portfolio_data')
      .select('*')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .maybeSingle();
    
    // If UUID fails, try integer (for different table structures)
    if (error && error.code !== 'PGRST116') {
      const result = await supabase
        .from('portfolio_data')
        .select('*')
        .eq('id', 1)
        .maybeSingle();
      data = result.data;
      error = result.error;
    }
    
    if (error) {
      console.log('   ❌ Error:', error.message);
      console.log('   Code:', error.code);
    } else if (data) {
      console.log('   ✅ Data found!');
      console.log('   Structure:', {
        hasHero: !!data.hero,
        hasAbout: !!data.about,
        hasContact: !!data.contact,
        hasSocial: !!data.social,
        heroType: typeof data.hero,
        aboutType: typeof data.about
      });
      console.log('   Hero name:', data.hero?.name || data.hero?.name || 'N/A');
      console.log('   About heading:', data.about?.heading || 'N/A');
    } else {
      console.log('   ⚠️ No data found - run SQL migration');
    }
  } catch (err) {
    console.log('   ❌ Exception:', err.message);
  }
  console.log('');
  
  console.log('3. Testing projects table:');
  try {
    const { data, error, count } = await supabase
      .from('projects')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.log('   ❌ Error:', error.message);
    } else {
      console.log(`   ✅ Found ${data?.length || count || 0} projects`);
    }
  } catch (err) {
    console.log('   ❌ Exception:', err.message);
  }
  console.log('');
  
  console.log('4. Testing skills table:');
  try {
    const { data, error, count } = await supabase
      .from('skills')
      .select('*', { count: 'exact' });
    
    if (error) {
      console.log('   ❌ Error:', error.message);
    } else {
      console.log(`   ✅ Found ${data?.length || count || 0} skills`);
    }
  } catch (err) {
    console.log('   ❌ Exception:', err.message);
  }
  console.log('');
  
  console.log('✅ Test complete!');
};

if (typeof window !== 'undefined') {
  window.testSupabase = testSupabaseConnection;
  console.log('💡 Test function available at: window.testSupabase()');
}

