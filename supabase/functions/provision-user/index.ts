// Supabase Edge Function: Provision User
// Creates a new user account with temporary password (EHR-style provisioning)
// Admin provides: email, first_name, last_name, temp_password, org_id, role

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface ProvisionRequest {
  email: string
  first_name: string
  last_name: string
  temp_password: string
  org_id: string
  role: 'admin' | 'student'
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify request is authenticated (admin making the request)
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create client with user's token to verify they're an admin
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Verify the requesting user is an admin
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user: requestingUser }, error: authError } = await userClient.auth.getUser()
    if (authError || !requestingUser) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if requesting user is super admin or org admin
    const superAdminEmails = ['mkoepkeci@gmail.com', 'marty.koepke@practicalinformatics.org']
    const isSuperAdmin = superAdminEmails.includes(requestingUser.email?.toLowerCase() || '')

    // Parse request body
    const body: ProvisionRequest = await req.json()
    const { email, first_name, last_name, temp_password, org_id, role } = body

    // Validate required fields
    if (!email || !temp_password || !org_id || !role) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: email, temp_password, org_id, role' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate password strength (at least 6 characters)
    if (temp_password.length < 6) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 6 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // If not super admin, verify they're an admin of this org
    if (!isSuperAdmin) {
      const { data: membership, error: memberError } = await userClient
        .from('org_members')
        .select('role')
        .eq('org_id', org_id)
        .eq('user_id', requestingUser.id)
        .single()

      if (memberError || membership?.role !== 'admin') {
        return new Response(
          JSON.stringify({ error: 'You do not have admin access to this organization' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Org admins can only create students, not other admins
      if (role === 'admin') {
        return new Response(
          JSON.stringify({ error: 'Only super admins can create other admins' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Create admin client with service role (can create users)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Check if user already exists
    const { data: existingUsers } = await adminClient.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(
      u => u.email?.toLowerCase() === email.toLowerCase()
    )

    let userId: string

    if (existingUser) {
      // User exists - just add them to the org
      userId = existingUser.id

      // Check if already a member
      const { data: existingMember } = await adminClient
        .from('org_members')
        .select('id')
        .eq('org_id', org_id)
        .eq('user_id', userId)
        .single()

      if (existingMember) {
        return new Response(
          JSON.stringify({ error: 'User is already a member of this organization' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    } else {
      // Create new user with temporary password
      const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
        email,
        password: temp_password,
        email_confirm: true, // Skip email verification
        user_metadata: {
          first_name,
          last_name,
          must_change_password: true, // Flag for frontend to enforce password change
          provisioned_by: requestingUser.id,
          provisioned_at: new Date().toISOString()
        }
      })

      if (createError) {
        return new Response(
          JSON.stringify({ error: createError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      userId = newUser.user.id
    }

    // Remove any self-registered record
    await adminClient
      .from('org_members')
      .delete()
      .eq('user_id', userId)
      .is('org_id', null)

    // Add to organization
    const { error: memberError } = await adminClient
      .from('org_members')
      .insert({
        org_id,
        user_id: userId,
        role,
        status: 'active'
      })

    if (memberError) {
      return new Response(
        JSON.stringify({ error: `Failed to add to organization: ${memberError.message}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create/update user profile
    await adminClient
      .from('user_profiles')
      .upsert({
        user_id: userId,
        first_name: first_name || null,
        last_name: last_name || null,
        display_name: [first_name, last_name].filter(Boolean).join(' ') || null
      }, { onConflict: 'user_id' })

    // Get org name for response
    const { data: org } = await adminClient
      .from('organizations')
      .select('name')
      .eq('id', org_id)
      .single()

    return new Response(
      JSON.stringify({
        success: true,
        user_id: userId,
        email,
        name: [first_name, last_name].filter(Boolean).join(' '),
        role,
        org_name: org?.name,
        is_new_user: !existingUser,
        message: existingUser
          ? 'Existing user added to organization'
          : 'New user created with temporary password'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error provisioning user:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
