import { supabase } from './supabase';

export async function setupRLS() {
  try {
    // Enable RLS on products table
    const { error: enableRLSError } = await supabase.rpc('enable_rls', {
      table_name: 'products'
    });

    if (enableRLSError) {
      console.error('Error enabling RLS:', enableRLSError);
      return;
    }

    // Create policy for reading products (public access)
    const { error: readPolicyError } = await supabase.rpc('create_read_policy', {
      table_name: 'products',
      policy_name: 'products_read_policy',
      using_expression: 'true'
    });

    if (readPolicyError) {
      console.error('Error creating read policy:', readPolicyError);
      return;
    }

    // Create policy for inserting products (authenticated users only)
    const { error: insertPolicyError } = await supabase.rpc('create_insert_policy', {
      table_name: 'products',
      policy_name: 'products_insert_policy',
      using_expression: 'auth.role() = \'authenticated\''
    });

    if (insertPolicyError) {
      console.error('Error creating insert policy:', insertPolicyError);
      return;
    }

    // Create policy for updating products (authenticated users only)
    const { error: updatePolicyError } = await supabase.rpc('create_update_policy', {
      table_name: 'products',
      policy_name: 'products_update_policy',
      using_expression: 'auth.role() = \'authenticated\''
    });

    if (updatePolicyError) {
      console.error('Error creating update policy:', updatePolicyError);
      return;
    }

    // Create policy for deleting products (authenticated users only)
    const { error: deletePolicyError } = await supabase.rpc('create_delete_policy', {
      table_name: 'products',
      policy_name: 'products_delete_policy',
      using_expression: 'auth.role() = \'authenticated\''
    });

    if (deletePolicyError) {
      console.error('Error creating delete policy:', deletePolicyError);
      return;
    }

    console.log('RLS policies set up successfully');
  } catch (error) {
    console.error('Error setting up RLS:', error);
  }
} 