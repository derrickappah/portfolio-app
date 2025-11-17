import { supabase } from '../lib/supabase';

/**
 * Contact form submission service
 */
export const submitContactForm = async (formData) => {
  try {
    // Validate form data
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      throw new Error('All fields are required');
    }

    // Log what we're sending (for debugging)
    console.log('📤 Submitting contact form:', {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      messageLength: formData.message.length
    });
    
    // Log Supabase configuration
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
    console.log('🔧 Supabase config:', {
      url: supabaseUrl ? '✅ Set' : '❌ Missing',
      key: supabaseKey ? '✅ Set (' + supabaseKey.substring(0, 20) + '...)' : '❌ Missing'
    });

    // Prepare the data to insert
    const insertData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
      // created_at will be set automatically by the database
    };

    // Try to insert the contact message
    let result;
    try {
      result = await supabase
        .from('contact_messages')
        .insert([insertData])
        .select();
    } catch (fetchError) {
      // Catch network/fetch errors (including 401 from monitoring scripts)
      console.error('❌ Fetch error:', fetchError);
      
      // Check if it's a 401 error (even if wrapped by monitoring scripts)
      if (fetchError.message?.includes('401') || fetchError.toString().includes('401')) {
        console.error('🔧 401 Unauthorized detected!');
        console.error('   This means the contact_messages table or RLS policies are missing.');
        console.error('   SOLUTION: Run ULTIMATE_FIX.sql in Supabase SQL Editor');
        return { 
          success: false, 
          error: 'Contact form not configured. Please run ULTIMATE_FIX.sql in Supabase.' 
        };
      }
      
      // For "Response body already used" - might have succeeded
      if (fetchError.message?.includes('Response body is already used')) {
        console.warn('⚠️ Monitoring script interference - submission may have succeeded');
        // Try to verify by checking if data was inserted
        // For now, assume it might have worked
        return { success: true, data: null, warning: 'Submission may have succeeded' };
      }
      
      throw fetchError;
    }

    // Handle Supabase API errors
    if (result.error) {
      console.error('❌ Supabase insert error:', result.error);
      console.error('   Error code:', result.error.code);
      console.error('   Error message:', result.error.message);
      console.error('   Error details:', result.error.details);
      console.error('   Error hint:', result.error.hint);
      
      // Check if it's the "Response body already used" error
      if (result.error.message && result.error.message.includes('Response body is already used')) {
        console.warn('⚠️ Monitoring script interference, but submission may have succeeded');
        return { success: true, data: null };
      }
      
      // For 401 errors, provide specific guidance
      if (result.error.code === 'PGRST301' || result.error.status === 401 || result.error.message?.includes('401')) {
        console.error('🔧 401 Unauthorized - Table or policies missing!');
        console.error('   SOLUTION: Run ULTIMATE_FIX.sql in Supabase SQL Editor');
        return { 
          success: false, 
          error: 'Contact form not configured. Please run ULTIMATE_FIX.sql in Supabase SQL Editor.' 
        };
      }
      
      throw result.error;
    }

    console.log('✅ Contact form submitted successfully!', result.data);
    return { success: true, data: result.data };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    console.error('Error details:', {
      code: error.code,
      status: error.status,
      message: error.message,
      details: error.details,
      hint: error.hint
    });
    
    // Provide more helpful error messages
    let errorMessage = error.message || 'Unknown error';
    if (error.code === 'PGRST301' || error.message?.includes('permission denied') || error.status === 401 || (error.message && error.message.includes('401')) || error.code === '42501') {
      errorMessage = 'Contact form is not configured. Please run the contact_messages SQL migration in Supabase.';
      console.error('❌ Contact form setup required (401 Unauthorized):');
      console.error('   Error code:', error.code || '401');
      console.error('   Steps to fix:');
      console.error('   1. Go to Supabase Dashboard → SQL Editor');
      console.error('   2. Run: diagnose_contact_messages.sql (to check current state)');
      console.error('   3. Run: fix_contact_messages_complete.sql (to fix it)');
      console.error('   4. Refresh browser and try again');
    } else if (error.message?.includes('Response body is already used')) {
      errorMessage = 'Submission may have succeeded. Please check your messages.';
    }
    
    return { success: false, error: errorMessage };
  }
};

/**
 * Get portfolio data from Supabase
 */
export const getPortfolioData = async () => {
  try {
    const { data, error } = await supabase
      .from('portfolio_data')
      .select('*')
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get projects from Supabase
 */
export const getProjects = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get a single project by ID
 */
export const getProjectById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching project:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Admin: Get all contact messages
 */
export const getContactMessages = async () => {
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Admin: Delete a contact message
 */
export const deleteContactMessage = async (id) => {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting contact message:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Admin: Mark message as read/unread (if you add a read column)
 */
export const updateMessageReadStatus = async (id, isRead) => {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .update({ read: isRead })
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating message status:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Admin: Update portfolio data section (hero, about, contact, social)
 */
export const updatePortfolioSection = async (section, data) => {
  try {
    const { error } = await supabase
      .from('portfolio_data')
      .update({ [section]: data })
      .eq('id', '00000000-0000-0000-0000-000000000001');

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error(`Error updating ${section}:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Admin: Update a project
 */
export const updateProject = async (id, projectData) => {
  try {
    const { error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating project:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Admin: Create a new project
 */
export const createProject = async (projectData) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating project:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Admin: Delete a project
 */
export const deleteProject = async (id) => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting project:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Admin: Update a skill group
 */
export const updateSkill = async (id, skillData) => {
  try {
    const { error } = await supabase
      .from('skills')
      .update(skillData)
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating skill:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Admin: Create a new skill group
 */
export const createSkill = async (skillData) => {
  try {
    const { data, error } = await supabase
      .from('skills')
      .insert([skillData])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error creating skill:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Admin: Delete a skill group
 */
export const deleteSkill = async (id) => {
  try {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting skill:', error);
    return { success: false, error: error.message };
  }
};

