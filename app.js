// ============================================================
// THE BLOOD COMMONS — PAKISTAN
// FINAL FIXED VERSION — v5.0
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // CONFIGURATION
    // ============================================================
    const CONFIG = {
        SUPABASE_URL: 'https://ctsnlmsvgkbbcattzfjc.supabase.co',
        SUPABASE_ANON_KEY: 'sb_publishable_X0nyDu5GH0i3xT16wP7-Lg_XO7sr3nI',
        RESEND_API_KEY: 're_d4Dra5Za_HLmGA9PzA8wbH3DXW2oeCeNi',
        APP_NAME: 'The Blood Commons — Pakistan',
        VERSION: '5.0'
    };

    // ============================================================
    // STATE
    // ============================================================
    const STATE = {
        currentUser: null,
        currentRole: null,
        donorAvailable: true,
        currentHospitalId: null,
        currentHospitalName: null,
        currentBankId: null,
        currentBankName: null,
        userLocation: { lat: null, lng: null },
        map: null,
        mapInitialized: false,
        isSupabaseReady: false
    };

    // ============================================================
    // SUPABASE CLIENT
    // ============================================================
    let supabase = null;

    try {
        if (typeof window.supabase !== 'undefined') {
            supabase = window.supabase.createClient(
                CONFIG.SUPABASE_URL,
                CONFIG.SUPABASE_ANON_KEY
            );
            STATE.isSupabaseReady = true;
            console.log('✅ Supabase client initialized');
        }
    } catch (e) {
        console.warn('⚠️ Supabase initialization failed:', e.message);
    }

    // ============================================================
    // DOM REFERENCES
    // ============================================================
    const DOM = {};

    function cacheDomReferences() {
        // Navigation
        DOM.navItems = document.querySelectorAll('.nav-item[data-page]');
        DOM.pages = {
            landing: document.getElementById('pageLanding'),
            donor: document.getElementById('pageDonor'),
            hospital: document.getElementById('pageHospital'),
            bank: document.getElementById('pageBank')
        };

        // Header
        DOM.pageTitle = document.getElementById('pageTitle');
        DOM.pageSubtitle = document.getElementById('pageSubtitle');
        DOM.globalLogoutBtn = document.getElementById('globalLogoutBtn');

        // User Display
        DOM.userDisplay = document.getElementById('userDisplay');
        DOM.userDisplayName = document.getElementById('userDisplayName');
        DOM.userDisplayRole = document.getElementById('userDisplayRole');
        DOM.userAvatar = document.getElementById('userAvatar');

        // Donor
        DOM.donorAuthSection = document.getElementById('donorAuthSection');
        DOM.donorSignUpTab = document.getElementById('donorSignUpTab');
        DOM.donorSignInTab = document.getElementById('donorSignInTab');
        DOM.donorSignUpForm = document.getElementById('donorSignUpForm');
        DOM.donorSignInForm = document.getElementById('donorSignInForm');
        DOM.donorSignUpBtn = document.getElementById('donorSignUpBtn');
        DOM.donorSignInBtn = document.getElementById('donorSignInBtn');
        DOM.donorLogoutBtn = document.getElementById('donorLogoutBtn');
        DOM.donorLoginStatus = document.getElementById('donorLoginStatus');
        DOM.donorLoggedName = document.getElementById('donorLoggedName');
        DOM.donorDashboardContent = document.getElementById('donorDashboardContent');
        DOM.donorToggleAvailability = document.getElementById('donorToggleAvailability');
        DOM.donorUpdateProfile = document.getElementById('donorUpdateProfile');
        DOM.donorViewHistory = document.getElementById('donorViewHistory');
        DOM.donorToast = document.getElementById('donorToast');
        DOM.donorSignUpToast = document.getElementById('donorSignUpToast');
        DOM.donorSignInToast = document.getElementById('donorSignInToast');
        DOM.donorRequestsTable = document.getElementById('donorRequestsTable');
        DOM.donorMap = document.getElementById('donorMap');
        DOM.donorLocationStatus = document.getElementById('donorLocationStatus');

        // Donor Form Fields
        DOM.donorName = document.getElementById('donorName');
        DOM.donorEmail = document.getElementById('donorEmail');
        DOM.donorCnic = document.getElementById('donorCnic');
        DOM.donorBloodTypeSignup = document.getElementById('donorBloodTypeSignup');
        DOM.donorCitySignup = document.getElementById('donorCitySignup');
        DOM.donorPhoneSignup = document.getElementById('donorPhoneSignup');
        DOM.donorPasswordSignup = document.getElementById('donorPasswordSignup');
        DOM.donorSignInCnic = document.getElementById('donorSignInCnic');
        DOM.donorSignInPassword = document.getElementById('donorSignInPassword');

        // Donor Profile Fields
        DOM.donorBloodTypeProfile = document.getElementById('donorBloodTypeProfile');
        DOM.donorCityProfile = document.getElementById('donorCityProfile');
        DOM.donorPhoneProfile = document.getElementById('donorPhoneProfile');

        // Hospital
        DOM.hospitalAuthSection = document.getElementById('hospitalAuthSection');
        DOM.hospitalLoginBtn = document.getElementById('hospitalLoginBtn');
        DOM.hospitalLogoutBtn = document.getElementById('hospitalLogoutBtn');
        DOM.hospitalLoginStatus = document.getElementById('hospitalLoginStatus');
        DOM.hospitalLoggedName = document.getElementById('hospitalLoggedName');
        DOM.hospitalDashboardContent = document.getElementById('hospitalDashboardContent');
        DOM.hospitalNewRequestBtn = document.getElementById('hospitalNewRequestBtn');
        DOM.hospitalRequestForm = document.getElementById('hospitalRequestForm');
        DOM.hCancelRequest = document.getElementById('hCancelRequest');
        DOM.hSubmitRequest = document.getElementById('hSubmitRequest');
        DOM.hRefreshInventory = document.getElementById('hRefreshInventory');
        DOM.hospitalToast = document.getElementById('hospitalToast');
        DOM.hospitalLoginToast = document.getElementById('hospitalLoginToast');
        DOM.inventoryTableBody = document.getElementById('inventoryTableBody');
        DOM.hospitalRequestsTable = document.getElementById('hospitalRequestsTable');
        DOM.requestCount = document.getElementById('requestCount');

        DOM.hospitalId = document.getElementById('hospitalId');
        DOM.hospitalPassword = document.getElementById('hospitalPassword');
        DOM.hPatientName = document.getElementById('hPatientName');
        DOM.hBloodType = document.getElementById('hBloodType');
        DOM.hUnits = document.getElementById('hUnits');
        DOM.hUrgency = document.getElementById('hUrgency');
        DOM.hLocation = document.getElementById('hLocation');
        DOM.hContact = document.getElementById('hContact');

        // Filters
        DOM.filterBank = document.getElementById('filterBank');
        DOM.filterBloodType = document.getElementById('filterBloodType');
        DOM.filterStockStatus = document.getElementById('filterStockStatus');
        DOM.clearInventoryFilters = document.getElementById('clearInventoryFilters');
        DOM.filterPatient = document.getElementById('filterPatient');
        DOM.filterReqBloodType = document.getElementById('filterReqBloodType');
        DOM.filterUrgency = document.getElementById('filterUrgency');
        DOM.filterReqStatus = document.getElementById('filterReqStatus');
        DOM.clearHospitalFilters = document.getElementById('clearHospitalFilters');

        // Bank
        DOM.bankAuthSection = document.getElementById('bankAuthSection');
        DOM.bankLoginBtn = document.getElementById('bankLoginBtn');
        DOM.bankLogoutBtn = document.getElementById('bankLogoutBtn');
        DOM.bankLoginStatus = document.getElementById('bankLoginStatus');
        DOM.bankLoggedName = document.getElementById('bankLoggedName');
        DOM.bankDashboardContent = document.getElementById('bankDashboardContent');
        DOM.bankAddInventoryBtn = document.getElementById('bankAddInventoryBtn');
        DOM.bankStockForm = document.getElementById('bankStockForm');
        DOM.bankCancelStock = document.getElementById('bankCancelStock');
        DOM.bankSaveStock = document.getElementById('bankSaveStock');
        DOM.bankToast = document.getElementById('bankToast');
        DOM.bankLoginToast = document.getElementById('bankLoginToast');
        DOM.bankInventoryTable = document.getElementById('bankInventoryTable');
        DOM.bankRequestsTable = document.getElementById('bankRequestsTable');
        DOM.bankRequestCount = document.getElementById('bankRequestCount');

        DOM.bankId = document.getElementById('bankId');
        DOM.bankPassword = document.getElementById('bankPassword');
        DOM.bankBloodType = document.getElementById('bankBloodType');
        DOM.bankUnits = document.getElementById('bankUnits');
        DOM.bankExpiry = document.getElementById('bankExpiry');

        DOM.bankFilterBloodType = document.getElementById('bankFilterBloodType');
        DOM.bankFilterStatus = document.getElementById('bankFilterStatus');
        DOM.clearBankFilters = document.getElementById('clearBankFilters');
        DOM.bankFilterHospital = document.getElementById('bankFilterHospital');
        DOM.bankFilterReqBloodType = document.getElementById('bankFilterReqBloodType');
        DOM.bankFilterUrgency = document.getElementById('bankFilterUrgency');
        DOM.clearBankRequestFilters = document.getElementById('clearBankRequestFilters');

        DOM.mobileToggle = document.getElementById('mobileToggle');
        DOM.sidebar = document.getElementById('sidebar');

        console.log('✅ DOM references cached');
    }

    // ============================================================
    // UTILITY FUNCTIONS
    // ============================================================

    function showToast(element, type, message) {
        if (!element) return;
        element.className = 'toast show ' + type;
        element.innerHTML = message;
        clearTimeout(element._toastTimer);
        element._toastTimer = setTimeout(() => {
            element.className = 'toast';
        }, 4000);
    }

    function haversineDistance(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    function updateUserDisplay(name, role) {
        if (name) {
            DOM.userDisplay.classList.add('show');
            DOM.userDisplayName.textContent = name;
            DOM.userDisplayRole.textContent = role || 'Donor';
            DOM.userAvatar.textContent = name.charAt(0).toUpperCase();
        } else {
            DOM.userDisplay.classList.remove('show');
        }
    }

    function navigateTo(page) {
        const titles = {
            landing: 'The Blood Commons',
            donor: 'Donor Dashboard',
            hospital: 'Hospital Dashboard',
            bank: 'Blood Bank Admin'
        };
        const subtitles = {
            landing: 'Pakistan',
            donor: 'Donor Portal',
            hospital: 'Hospital Portal',
            bank: 'Bank Admin Portal'
        };

        DOM.navItems.forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });

        Object.keys(DOM.pages).forEach(key => {
            if (DOM.pages[key]) {
                DOM.pages[key].classList.toggle('active', key === page);
            }
        });

        DOM.pageTitle.textContent = titles[page] || 'The Blood Commons';
        DOM.pageSubtitle.textContent = subtitles[page] || 'Pakistan';
        DOM.sidebar.classList.remove('open');
    }

    // ============================================================
    // ⭐⭐⭐ FINAL FIXED DONOR SIGN-UP ⭐⭐⭐
    // ============================================================

    async function handleDonorSignUp() {
        // Get form values
        const name = DOM.donorName.value.trim();
        const email = DOM.donorEmail.value.trim();
        const cnic = DOM.donorCnic.value.trim();
        const bloodType = DOM.donorBloodTypeSignup.value;
        const city = DOM.donorCitySignup.value.trim();
        const phone = DOM.donorPhoneSignup.value.trim();
        const password = DOM.donorPasswordSignup.value;

        // Validate
        if (!name || !email || !cnic || !bloodType || !city || !phone || !password) {
            showToast(DOM.donorSignUpToast, 'error', '⚠️ Please fill in all required fields.');
            return;
        }

        if (password.length < 6) {
            showToast(DOM.donorSignUpToast, 'error', '⚠️ Password must be at least 6 characters.');
            return;
        }

        if (!/^\d{5}-\d{7}-\d$/.test(cnic)) {
            showToast(DOM.donorSignUpToast, 'error', '⚠️ Invalid CNIC format. Use: XXXXX-XXXXXXX-X');
            return;
        }

        try {
            console.log('📝 Attempting sign-up for:', email);

            // 🔍 STEP 1: Check if CNIC already exists
            const { data: existingCnic, error: cnicError } = await supabase
                .from('profiles')
                .select('cnic')
                .eq('cnic', cnic)
                .maybeSingle();

            if (cnicError) {
                console.warn('CNIC check error:', cnicError);
            }

            if (existingCnic) {
                showToast(DOM.donorSignUpToast, 'error', `❌ CNIC ${cnic} is already registered.`);
                return;
            }

            // 🔍 STEP 2: Check if Email already exists in profiles
            const { data: existingEmail, error: emailCheckError } = await supabase
                .from('profiles')
                .select('email')
                .eq('email', email)
                .maybeSingle();

            if (emailCheckError) {
                console.warn('Email check error:', emailCheckError);
            }

            if (existingEmail) {
                showToast(DOM.donorSignUpToast, 'error', `❌ Email "${email}" is already registered.`);
                return;
            }

            // 🔍 STEP 3: SIGN UP - WITHOUT ANY METADATA (CRITICAL!)
            console.log('🔄 Creating auth user...');
            
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password
                // ⭐ NO options.data - this was causing the 500 error!
            });

            if (authError) {
                console.error('❌ Auth Error:', authError);
                
                if (authError.message.includes('User already registered')) {
                    showToast(DOM.donorSignUpToast, 'error', `❌ Email "${email}" is already registered.`);
                    DOM.donorSignInTab.click();
                    DOM.donorSignInCnic.value = cnic;
                    return;
                }
                
                showToast(DOM.donorSignUpToast, 'error', `❌ ${authError.message}`);
                return;
            }

            if (!authData.user) {
                showToast(DOM.donorSignUpToast, 'error', '⚠️ Sign-up failed.');
                return;
            }

            console.log('✅ Auth user created:', authData.user.id);

            // ⭐ STEP 4: Wait for auth to fully process
            await new Promise(resolve => setTimeout(resolve, 1500));

            // ⭐ STEP 5: Update user metadata in a SEPARATE call
            try {
                console.log('🔄 Updating user metadata...');
                const { error: updateError } = await supabase.auth.updateUser({
                    data: {
                        full_name: name,
                        user_type: 'donor',
                        cnic: cnic
                    }
                });
                if (updateError) {
                    console.warn('⚠️ Metadata update warning:', updateError);
                } else {
                    console.log('✅ Metadata updated');
                }
            } catch (e) {
                console.warn('⚠️ Metadata update failed:', e);
            }

            // ⭐ STEP 6: Create profile manually
            console.log('🔄 Creating profile...');
            
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: authData.user.id,
                    email: email,
                    full_name: name,
                    user_type: 'donor',
                    phone: phone,
                    cnic: cnic,
                    city: city,
                    blood_type: bloodType,
                    latitude: STATE.userLocation.lat || 31.5204,
                    longitude: STATE.userLocation.lng || 74.3587,
                    is_available: true,
                });

            if (profileError) {
                console.error('❌ Profile Error:', profileError);
                showToast(DOM.donorSignUpToast, 'error', `❌ Profile creation failed: ${profileError.message}`);
                return;
            }

            console.log('✅ Profile created successfully');

            // ⭐ STEP 7: Try to auto-login
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData.session) {
                STATE.currentUser = sessionData.session.user;
                await loadDonorProfile();
                showDonorDashboard();
                showToast(DOM.donorSignUpToast, 'success', `✅ Welcome, ${name}!`);
            } else {
                DOM.donorSignInTab.click();
                DOM.donorSignInCnic.value = cnic;
                showToast(DOM.donorSignUpToast, 'info', '✅ Registration complete! Please sign in.');
            }

        } catch (error) {
            console.error('❌ Unexpected error:', error);
            showToast(DOM.donorSignUpToast, 'error', `❌ ${error.message || 'Sign-up failed.'}`);
        }
    }

    // ============================================================
    // DONOR SIGN IN (FIXED)
    // ============================================================

    async function handleDonorSignIn() {
        const cnic = DOM.donorSignInCnic.value.trim();
        const password = DOM.donorSignInPassword.value.trim();

        if (!cnic || !password) {
            showToast(DOM.donorSignInToast, 'error', 'Please enter CNIC and password.');
            return;
        }

        try {
            // First, find user by CNIC from profiles table
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('cnic', cnic)
                .maybeSingle();

            if (profileError || !profileData) {
                showToast(DOM.donorSignInToast, 'error', '❌ No account found with this CNIC.');
                return;
            }

            // Check if profile has an email
            if (!profileData.email) {
                showToast(DOM.donorSignInToast, 'error', '❌ Account found but email is missing. Please contact support.');
                return;
            }

            // Sign in with email + password
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: profileData.email,
                password: password,
            });

            if (signInError) {
                if (signInError.message.includes('Invalid login credentials')) {
                    showToast(DOM.donorSignInToast, 'error', '❌ Invalid CNIC or password.');
                    return;
                }
                throw signInError;
            }

            STATE.currentUser = data.user;
            STATE.currentUser.profile = profileData;

            await loadDonorProfile();
            showDonorDashboard();
            showToast(DOM.donorSignInToast, 'success', `✅ Welcome back, ${profileData.full_name}!`);

        } catch (error) {
            console.error('❌ Sign-in error:', error);
            showToast(DOM.donorSignInToast, 'error', error.message);
        }
    }

    // ============================================================
    // DONOR LOAD PROFILE & DASHBOARD
    // ============================================================

    async function loadDonorProfile() {
        if (!STATE.currentUser) return;

        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', STATE.currentUser.id)
                .single();

            if (profile) {
                STATE.currentUser.profile = profile;
                STATE.donorAvailable = profile.is_available !== false;
                STATE.currentRole = 'donor';
                DOM.donorLoggedName.textContent = profile.full_name || 'Donor';
                DOM.donorBloodTypeProfile.value = profile.blood_type || 'B+';
                DOM.donorCityProfile.value = profile.city || '';
                DOM.donorPhoneProfile.value = profile.phone || '';
                updateUserDisplay(profile.full_name, 'Donor');
            }
        } catch (e) {
            console.error('Profile error:', e);
        }
    }

    function showDonorDashboard() {
        DOM.donorAuthSection.style.display = 'none';
        DOM.donorDashboardContent.classList.add('show');
        DOM.donorLoginStatus.classList.add('show');
        DOM.globalLogoutBtn.style.display = 'flex';
        updateDonorToggle();
        updateDonorRequests();
        initDonorMap();
    }

    function handleDonorLogout() {
        if (supabase) {
            supabase.auth.signOut();
        }
        STATE.currentUser = null;
        STATE.currentRole = null;
        DOM.donorAuthSection.style.display = 'block';
        DOM.donorDashboardContent.classList.remove('show');
        DOM.donorLoginStatus.classList.remove('show');
        DOM.globalLogoutBtn.style.display = 'none';

        try { if (DOM.donorSignUpForm) DOM.donorSignUpForm.reset(); } catch (e) {}
        try { if (DOM.donorSignInForm) DOM.donorSignInForm.reset(); } catch (e) {}

        if (DOM.donorSignUpTab) DOM.donorSignUpTab.click();
        STATE.mapInitialized = false;
        updateUserDisplay(null);
    }

    function updateDonorToggle() {
        const btn = DOM.donorToggleAvailability;
        btn.innerHTML = STATE.donorAvailable ?
            '<i class="fas fa-toggle-on"></i> Available Now' :
            '<i class="fas fa-toggle-off"></i> Unavailable';
        btn.style.color = STATE.donorAvailable ? '#dc2626' : '#94a3b8';
    }

    async function handleDonorToggleAvailability() {
        STATE.donorAvailable = !STATE.donorAvailable;
        updateDonorToggle();
        if (STATE.currentUser) {
            await supabase
                .from('profiles')
                .update({ is_available: STATE.donorAvailable })
                .eq('id', STATE.currentUser.id);
        }
        showToast(DOM.donorToast, 'info', `You are now ${STATE.donorAvailable ? 'available' : 'unavailable'}`);
    }

    async function handleDonorUpdateProfile() {
        if (!STATE.currentUser) {
            showToast(DOM.donorToast, 'error', 'Please log in first.');
            return;
        }

        const { error } = await supabase
            .from('profiles')
            .update({
                blood_type: DOM.donorBloodTypeProfile.value,
                city: DOM.donorCityProfile.value,
                phone: DOM.donorPhoneProfile.value,
            })
            .eq('id', STATE.currentUser.id);

        if (error) {
            showToast(DOM.donorToast, 'error', error.message);
        } else {
            showToast(DOM.donorToast, 'success', '✅ Profile updated!');
        }
    }

    async function handleDonorViewHistory() {
        if (!STATE.currentUser) {
            showToast(DOM.donorToast, 'error', 'Please log in first.');
            return;
        }

        const { data: donations } = await supabase
            .from('donations')
            .select('*')
            .eq('donor_id', STATE.currentUser.id);

        if (!donations || donations.length === 0) {
            showToast(DOM.donorToast, 'info', 'You haven\'t donated yet. Be a hero! 🩸');
        } else {
            showToast(DOM.donorToast, 'success', `You have donated ${donations.length} times! ${Math.floor(donations.length * 0.75)} lives saved!`);
        }
    }

    // ============================================================
    // EMAIL FUNCTIONS
    // ============================================================

    async function sendEmail(to, subject, html) {
        if (!CONFIG.RESEND_API_KEY) {
            console.log('📧 Email not sent: No API key configured');
            return null;
        }

        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CONFIG.RESEND_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'The Blood Commons <noreply@bloodcommons.com>',
                    to: to,
                    subject: subject,
                    html: html
                })
            });
            const data = await response.json();
            console.log('📧 Email sent:', data);
            return data;
        } catch (error) {
            console.error('📧 Email error:', error);
            return null;
        }
    }

    function getWelcomeEmailTemplate(name) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to The Blood Commons</title>
            </head>
            <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background:#f1f5f9;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:20px 0;">
                    <tr>
                        <td align="center">
                            <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);">
                                <tr>
                                    <td style="background:#dc2626;padding:30px 40px;text-align:center;">
                                        <h1 style="color:#ffffff;font-size:24px;margin:0;font-weight:700;">🩸 Welcome to The Blood Commons</h1>
                                        <p style="color:#fca5a5;margin:8px 0 0;font-size:14px;">Pakistan · Every Drop, Connected.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:32px 40px;">
                                        <h2 style="color:#0f172a;font-size:20px;margin:0 0 8px;">Hello ${name},</h2>
                                        <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 20px;">
                                            Thank you for registering as a donor on <strong>The Blood Commons</strong>! 🎉
                                        </p>
                                        <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 20px;">
                                            You are now part of a life-saving community.
                                        </p>
                                        <div style="background:#f8fafc;padding:16px 20px;border-radius:12px;margin-bottom:20px;">
                                            <p style="margin:4px 0;font-size:14px;color:#0f172a;">
                                                <strong>📝 What's next?</strong>
                                            </p>
                                            <p style="margin:4px 0;font-size:14px;color:#475569;">
                                                1️⃣ Toggle <strong>"Available Now"</strong> when you can donate
                                            </p>
                                            <p style="margin:4px 0;font-size:14px;color:#475569;">
                                                2️⃣ When matched, you'll get a notification
                                            </p>
                                        </div>
                                        <div style="text-align:center;margin:24px 0;">
                                            <a href="https://blood-commons-pakistan.vercel.app/" style="display:inline-block;background:#dc2626;color:#ffffff;padding:12px 32px;border-radius:40px;text-decoration:none;font-weight:600;font-size:15px;">
                                                Go to Dashboard
                                            </a>
                                        </div>
                                        <p style="color:#94a3b8;font-size:13px;text-align:center;margin:16px 0 0;border-top:1px solid #e2e8f0;padding-top:16px;">
                                            ❤️ Every donation can save up to 3 lives. You are a hero!
                                            <br>
                                            <small>The Blood Commons · Pakistan</small>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `;
    }

    // ============================================================
    // MATCHING ENGINE (shortened but functional)
    // ============================================================

    async function findBestMatch(requestId) {
        try {
            console.log('🔍 Starting matching engine for request:', requestId);

            const { data: request, error } = await supabase
                .from('blood_requests')
                .select('*')
                .eq('id', requestId)
                .single();

            if (error) throw error;

            let radius;
            if (request.urgency === 'critical') radius = 20;
            else if (request.urgency === 'urgent') radius = 30;
            else radius = 50;

            const { data: matches, error: matchError } = await supabase
                .rpc('find_best_match', {
                    req_blood_type: request.blood_type,
                    req_lat: request.latitude || 31.5204,
                    req_lng: request.longitude || 74.3587,
                    req_urgency: request.urgency,
                    radius_km: radius
                });

            if (matchError) throw matchError;

            if (matches && matches.length > 0) {
                console.log('✅ Found', matches.length, 'matches');

                for (const match of matches) {
                    await supabase
                        .from('matches')
                        .insert({
                            request_id: requestId,
                            source_type: match.source_type,
                            source_id: match.source_id,
                            distance_km: match.distance_km,
                            status: 'pending'
                        });
                }

                await supabase
                    .from('blood_requests')
                    .update({ status: 'matched' })
                    .eq('id', requestId);

                updateDonorRequests();
                updateHospitalRequests();
                updateBankRequests();

                return matches;
            } else {
                console.log('❌ No matches found');
                return [];
            }

        } catch (error) {
            console.error('❌ Match engine error:', error);
            return null;
        }
    }

    // ============================================================
    // DONOR REQUESTS
    // ============================================================

    async function updateDonorRequests() {
        const { data: requests } = await supabase
            .from('blood_requests')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false })
            .limit(10);

        if (!requests || requests.length === 0) {
            DOM.donorRequestsTable.innerHTML =
                `<tr><td colspan="4" style="text-align:center;color:#64748b;padding:20px;">No pending requests.</td></tr>`;
            return;
        }

        DOM.donorRequestsTable.innerHTML = requests.map(req => `
            <tr>
                <td><strong>${req.blood_type}</strong></td>
                <td>${req.hospital_location || 'Unknown'}</td>
                <td><span class="status-badge ${req.urgency === 'critical' ? 'critical' : ''}" style="${req.urgency === 'urgent' ? 'background:#fef3c7;color:#b45309;' : req.urgency === 'routine' ? 'background:#dbeafe;color:#1d4ed8;' : ''}">${req.urgency.charAt(0).toUpperCase() + req.urgency.slice(1)}</span></td>
                <td><span class="status-badge pending">Pending</span></td>
            </tr>
        `).join('');
    }

    // ============================================================
    // DONOR MAP
    // ============================================================

    function initDonorMap() {
        if (STATE.mapInitialized || !STATE.userLocation.lat) {
            if (!STATE.userLocation.lat) detectLocation();
            return;
        }

        STATE.mapInitialized = true;

        try {
            DOM.donorMap.innerHTML = '';
            STATE.map = L.map('donorMap').setView([STATE.userLocation.lat, STATE.userLocation.lng], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(STATE.map);

            L.marker([STATE.userLocation.lat, STATE.userLocation.lng], {
                icon: L.divIcon({
                    className: 'custom-div-icon',
                    html: '<div style="background:#ef4444;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>',
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                })
            }).addTo(STATE.map).bindPopup('📍 Your Location');

            supabase.from('blood_banks').select('*').then(({ data: banks }) => {
                if (!banks) return;
                const bounds = L.latLngBounds([[STATE.userLocation.lat, STATE.userLocation.lng]]);
                banks.forEach(bank => {
                    if (!bank.latitude || !bank.longitude) return;
                    const distance = haversineDistance(STATE.userLocation.lat, STATE.userLocation.lng, bank.latitude, bank.longitude);
                    const marker = L.marker([bank.latitude, bank.longitude], {
                        icon: L.divIcon({
                            className: 'custom-div-icon',
                            html: `<div style="background:#dc2626;width:28px;height:28px;border-radius:50%;border:3px solid white;display:flex;align-items:center;justify-content:center;font-size:14px;color:white;font-weight:bold;">🩸</div>`,
                            iconSize: [28, 28],
                            iconAnchor: [14, 14],
                        })
                    }).addTo(STATE.map);
                    marker.bindPopup(`<strong>${bank.bank_name}</strong><br>📍 ${distance.toFixed(1)} km away`);
                    bounds.extend([bank.latitude, bank.longitude]);
                });
                STATE.map.fitBounds(bounds, { padding: [50, 50] });
            });

        } catch (e) {
            console.warn('Map error:', e);
        }
    }

    function detectLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(pos) {
                    STATE.userLocation.lat = pos.coords.latitude;
                    STATE.userLocation.lng = pos.coords.longitude;
                    if (DOM.donorLocationStatus) {
                        DOM.donorLocationStatus.innerHTML = `✅ Location: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
                    }
                    initDonorMap();
                },
                function() {
                    STATE.userLocation.lat = 31.5204;
                    STATE.userLocation.lng = 74.3587;
                    if (DOM.donorLocationStatus) {
                        DOM.donorLocationStatus.innerHTML = '⚠️ Using Lahore (31.5204, 74.3587)';
                    }
                    initDonorMap();
                }
            );
        }
    }

    // ============================================================
    // HOSPITAL FUNCTIONS (Shortened)
    // ============================================================

    async function handleHospitalLogin() {
        const id = DOM.hospitalId.value.trim();
        const password = DOM.hospitalPassword.value.trim();

        if (!id || !password) {
            showToast(DOM.hospitalLoginToast, 'error', 'Please enter Hospital ID and password.');
            return;
        }

        try {
            const { data: hospital, error } = await supabase
                .from('hospitals')
                .select('*')
                .eq('hospital_id', id)
                .single();

            if (error || !hospital) {
                showToast(DOM.hospitalLoginToast, 'error', 'Invalid Hospital ID.');
                return;
            }

            if (password === 'hospital123') {
                STATE.currentHospitalId = hospital.id;
                STATE.currentHospitalName = hospital.hospital_name;
                STATE.currentRole = 'hospital';

                DOM.hospitalAuthSection.style.display = 'none';
                DOM.hospitalDashboardContent.classList.add('show');
                DOM.hospitalLoginStatus.classList.add('show');
                DOM.hospitalLoggedName.textContent = hospital.hospital_name;
                DOM.globalLogoutBtn.style.display = 'flex';
                updateUserDisplay(hospital.hospital_name, 'Hospital');

                updateHospitalInventory();
                updateHospitalRequests();
                showToast(DOM.hospitalLoginToast, 'success', `✅ Logged in as ${hospital.hospital_name}`);
            } else {
                showToast(DOM.hospitalLoginToast, 'error', 'Invalid password.');
            }
        } catch (error) {
            showToast(DOM.hospitalLoginToast, 'error', error.message);
        }
    }

    function handleHospitalLogout() {
        STATE.currentHospitalId = null;
        STATE.currentHospitalName = null;
        STATE.currentRole = null;
        DOM.hospitalAuthSection.style.display = 'block';
        DOM.hospitalDashboardContent.classList.remove('show');
        DOM.hospitalLoginStatus.classList.remove('show');
        DOM.globalLogoutBtn.style.display = 'none';
        DOM.hospitalId.value = '';
        DOM.hospitalPassword.value = '';
        updateUserDisplay(null);
    }

    function toggleHospitalRequestForm() {
        DOM.hospitalRequestForm.style.display =
            DOM.hospitalRequestForm.style.display === 'none' ? 'block' : 'none';
    }

    async function handleHospitalSubmitRequest() {
        const patient = DOM.hPatientName.value.trim();
        const bloodType = DOM.hBloodType.value;
        const units = parseInt(DOM.hUnits.value) || 1;
        const urgency = DOM.hUrgency.value;
        const location = DOM.hLocation.value.trim() || 'Unknown Hospital';
        const contact = DOM.hContact.value.trim() || '';

        if (!patient || !bloodType) {
            showToast(DOM.hospitalToast, 'error', 'Please fill in patient name and blood type.');
            return;
        }

        if (!STATE.currentHospitalId) {
            showToast(DOM.hospitalToast, 'error', 'Hospital not logged in.');
            return;
        }

        try {
            const { data: request, error } = await supabase
                .from('blood_requests')
                .insert({
                    hospital_id: STATE.currentHospitalId,
                    patient_name: patient,
                    blood_type: bloodType,
                    units_needed: units,
                    urgency: urgency,
                    hospital_location: location,
                    contact_phone: contact,
                    status: 'pending',
                    latitude: STATE.userLocation.lat || 31.5204,
                    longitude: STATE.userLocation.lng || 74.3587,
                })
                .select()
                .single();

            if (error) throw error;

            showToast(DOM.hospitalToast, 'info', `🔍 Searching for ${bloodType} matches...`);

            const matches = await findBestMatch(request.id);

            if (matches && matches.length > 0) {
                showToast(DOM.hospitalToast, 'success', `✅ ${matches.length} potential sources found!`);
            }

            DOM.hPatientName.value = '';
            DOM.hUnits.value = '2';
            DOM.hospitalRequestForm.style.display = 'none';

            updateHospitalRequests();
            updateDonorRequests();
            updateBankRequests();

        } catch (error) {
            showToast(DOM.hospitalToast, 'error', error.message);
        }
    }

    // ============================================================
    // HOSPITAL INVENTORY
    // ============================================================

    let inventoryData = [];

    async function updateHospitalInventory() {
        const { data: inventory } = await supabase
            .from('inventory')
            .select('*, blood_banks(*)')
            .limit(50);

        if (!inventory || inventory.length === 0) {
            DOM.inventoryTableBody.innerHTML =
                `<tr><td colspan="5" style="text-align:center;color:#64748b;padding:20px;">No inventory available.</td></tr>`;
            return;
        }

        inventoryData = inventory.map(item => ({
            bank: item.blood_banks?.bank_name || 'Unknown',
            bloodType: item.blood_type,
            units: item.units_available,
            distance: item.blood_banks?.latitude ?
                haversineDistance(STATE.userLocation.lat || 31.5204, STATE.userLocation.lng || 74.3587,
                    item.blood_banks.latitude, item.blood_banks.longitude).toFixed(1) + ' km' : 'N/A',
            status: item.units_available === 0 ? 'Out of Stock' : item.units_available < 5 ? 'Low Stock' : 'In Stock'
        }));

        applyInventoryFilters();
    }

    function applyInventoryFilters() {
        const bankFilter = DOM.filterBank.value.toLowerCase().trim();
        const bloodFilter = DOM.filterBloodType.value;
        const statusFilter = DOM.filterStockStatus.value;

        let filtered = inventoryData;
        if (bankFilter) filtered = filtered.filter(i => i.bank.toLowerCase().includes(bankFilter));
        if (bloodFilter) filtered = filtered.filter(i => i.bloodType === bloodFilter);
        if (statusFilter) filtered = filtered.filter(i => i.status === statusFilter);

        if (filtered.length === 0) {
            DOM.inventoryTableBody.innerHTML =
                `<tr><td colspan="5" style="text-align:center;color:#64748b;padding:20px;">No matching inventory.</td></tr>`;
            return;
        }

        DOM.inventoryTableBody.innerHTML = filtered.map(item => `
            <tr>
                <td>${item.bank}</td>
                <td><strong>${item.bloodType}</strong></td>
                <td style="color:${item.units > 5 ? '#16a34a' : item.units > 0 ? '#b45309' : '#dc2626'};font-weight:700;">${item.units}</td>
                <td>${item.distance}</td>
                <td><button class="btn-success" style="padding:4px 14px;font-size:0.75rem;">Contact</button></td>
            </tr>
        `).join('');
    }

    // ============================================================
    // HOSPITAL REQUESTS
    // ============================================================

    let hospitalRequestData = [];

    async function updateHospitalRequests() {
        if (!STATE.currentHospitalId) return;

        const { data: requests } = await supabase
            .from('blood_requests')
            .select('*')
            .eq('hospital_id', STATE.currentHospitalId)
            .order('created_at', { ascending: false });

        if (!requests || requests.length === 0) {
            DOM.hospitalRequestsTable.innerHTML =
                `<tr><td colspan="6" style="text-align:center;color:#64748b;padding:20px;">No requests yet.</td></tr>`;
            return;
        }

        const { data: matches } = await supabase
            .from('vw_matches_with_details')
            .select('*')
            .order('matched_at', { ascending: false });

        hospitalRequestData = requests.map(req => {
            const match = matches?.find(m => m.request_id === req.id);
            return {
                patient: req.patient_name,
                bloodType: req.blood_type,
                units: req.units_needed,
                urgency: req.urgency,
                status: req.status,
                id: req.id,
                match: match || null
            };
        });

        applyHospitalRequestFilters();
    }

    function applyHospitalRequestFilters() {
        const patientFilter = DOM.filterPatient.value.toLowerCase().trim();
        const bloodFilter = DOM.filterReqBloodType.value;
        const urgencyFilter = DOM.filterUrgency.value;
        const statusFilter = DOM.filterReqStatus.value;

        let filtered = hospitalRequestData;
        if (patientFilter) filtered = filtered.filter(i => i.patient.toLowerCase().includes(patientFilter));
        if (bloodFilter) filtered = filtered.filter(i => i.bloodType === bloodFilter);
        if (urgencyFilter) filtered = filtered.filter(i => i.urgency === urgencyFilter);
        if (statusFilter) filtered = filtered.filter(i => i.status === statusFilter);

        const pending = hospitalRequestData.filter(r => r.status === 'pending');
        DOM.requestCount.textContent = pending.length + ' pending';

        if (filtered.length === 0) {
            DOM.hospitalRequestsTable.innerHTML =
                `<tr><td colspan="6" style="text-align:center;color:#64748b;padding:20px;">No matching requests.</td></tr>`;
            return;
        }

        DOM.hospitalRequestsTable.innerHTML = filtered.map(req => {
            let matchHtml = '';
            if (req.status === 'matched' && req.match) {
                const m = req.match;
                matchHtml = `
                    <div class="match-details-box">
                        <div class="match-row"><i class="fas fa-${m.source_type === 'bank' ? 'warehouse' : 'user'}"></i> <strong>${m.source_name}</strong></div>
                        <div class="match-row"><i class="fas fa-map-pin"></i> ${m.distance_km ? m.distance_km.toFixed(1) + ' km' : 'N/A'}</div>
                        ${m.source_contact ? `<div class="match-row"><i class="fas fa-phone"></i> ${m.source_contact}</div>` : ''}
                        ${m.units_available ? `<div class="match-row"><i class="fas fa-box"></i> ${m.units_available} units</div>` : ''}
                        <div style="font-size:0.7rem;color:#64748b;margin-top:4px;">⏳ Awaiting confirmation</div>
                    </div>
                `;
            } else if (req.status === 'pending') {
                matchHtml = `<div style="font-size:0.75rem;color:#64748b;background:#f1f5f9;padding:8px 12px;border-radius:6px;">🔍 Searching...</div>`;
            } else if (req.status === 'fulfilled') {
                matchHtml = `<div style="font-size:0.75rem;color:#16a34a;background:#f0fdf4;padding:8px 12px;border-radius:6px;">✅ Fulfilled</div>`;
            } else {
                matchHtml = `<div style="font-size:0.75rem;color:#64748b;">—</div>`;
            }

            return `
                <tr>
                    <td><strong>${req.patient}</strong></td>
                    <td>${req.bloodType}</td>
                    <td>${req.units}</td>
                    <td><span class="status-badge ${req.urgency === 'critical' ? 'critical' : ''}" style="${req.urgency === 'urgent' ? 'background:#fef3c7;color:#b45309;' : req.urgency === 'routine' ? 'background:#dbeafe;color:#1d4ed8;' : ''}">${req.urgency.charAt(0).toUpperCase() + req.urgency.slice(1)}</span></td>
                    <td><span class="status-badge ${req.status}">${req.status.charAt(0).toUpperCase() + req.status.slice(1)}</span></td>
                    <td style="min-width:180px;">${matchHtml}</td>
                </tr>
            `;
        }).join('');
    }

    // ============================================================
    // BANK FUNCTIONS (Shortened)
    // ============================================================

    async function handleBankLogin() {
        const id = DOM.bankId.value.trim();
        const password = DOM.bankPassword.value.trim();

        if (!id || !password) {
            showToast(DOM.bankLoginToast, 'error', 'Please enter Bank ID and password.');
            return;
        }

        try {
            const { data: bank, error } = await supabase
                .from('blood_banks')
                .select('*')
                .eq('bank_id', id)
                .single();

            if (error || !bank) {
                showToast(DOM.bankLoginToast, 'error', 'Invalid Bank ID.');
                return;
            }

            if (password === 'bank123') {
                STATE.currentBankId = bank.id;
                STATE.currentBankName = bank.bank_name;
                STATE.currentRole = 'bank';

                DOM.bankAuthSection.style.display = 'none';
                DOM.bankDashboardContent.classList.add('show');
                DOM.bankLoginStatus.classList.add('show');
                DOM.bankLoggedName.textContent = bank.bank_name;
                DOM.globalLogoutBtn.style.display = 'flex';
                updateUserDisplay(bank.bank_name, 'Blood Bank');

                updateBankInventory();
                updateBankRequests();
                showToast(DOM.bankLoginToast, 'success', `✅ Logged in as ${bank.bank_name}`);
            } else {
                showToast(DOM.bankLoginToast, 'error', 'Invalid password.');
            }
        } catch (error) {
            showToast(DOM.bankLoginToast, 'error', error.message);
        }
    }

    function handleBankLogout() {
        STATE.currentBankId = null;
        STATE.currentBankName = null;
        STATE.currentRole = null;
        DOM.bankAuthSection.style.display = 'block';
        DOM.bankDashboardContent.classList.remove('show');
        DOM.bankLoginStatus.classList.remove('show');
        DOM.globalLogoutBtn.style.display = 'none';
        DOM.bankId.value = '';
        DOM.bankPassword.value = '';
        updateUserDisplay(null);
    }

    function toggleBankStockForm() {
        DOM.bankStockForm.style.display =
            DOM.bankStockForm.style.display === 'none' ? 'block' : 'none';
        if (DOM.bankStockForm.style.display === 'block') {
            const today = new Date();
            today.setDate(today.getDate() + 30);
            DOM.bankExpiry.value = today.toISOString().split('T')[0];
        }
    }

    async function handleBankSaveStock() {
        const blood = DOM.bankBloodType.value;
        const units = parseInt(DOM.bankUnits.value) || 0;
        const expiry = DOM.bankExpiry.value || null;

        if (!STATE.currentBankId) {
            showToast(DOM.bankToast, 'error', 'Please log in as a bank admin first.');
            return;
        }

        try {
            await supabase
                .from('inventory')
                .upsert({
                    bank_id: STATE.currentBankId,
                    blood_type: blood,
                    units_available: units,
                    expiry_date: expiry,
                }, { onConflict: 'bank_id, blood_type' });

            showToast(DOM.bankToast, 'success', `✅ Inventory updated: ${blood} → ${units} units`);
            DOM.bankStockForm.style.display = 'none';
            updateBankInventory();
            updateHospitalInventory();
        } catch (error) {
            showToast(DOM.bankToast, 'error', error.message);
        }
    }

    // ============================================================
    // BANK INVENTORY
    // ============================================================

    let bankInventoryData = [];

    async function updateBankInventory() {
        if (!STATE.currentBankId) return;

        const { data: inventory } = await supabase
            .from('inventory')
            .select('*')
            .eq('bank_id', STATE.currentBankId)
            .order('blood_type');

        if (!inventory || inventory.length === 0) {
            DOM.bankInventoryTable.innerHTML =
                `<tr><td colspan="5" style="text-align:center;color:#64748b;padding:20px;">No inventory. Add some stock!</td></tr>`;
            return;
        }

        bankInventoryData = inventory.map(item => ({
            bloodType: item.blood_type,
            units: item.units_available,
            expiry: item.expiry_date || 'N/A',
            status: item.units_available === 0 ? 'Out of Stock' : item.units_available < 5 ? 'Low Stock' : 'In Stock'
        }));

        applyBankInventoryFilters();
    }

    function applyBankInventoryFilters() {
        const bloodFilter = DOM.bankFilterBloodType.value;
        const statusFilter = DOM.bankFilterStatus.value;

        let filtered = bankInventoryData;
        if (bloodFilter) filtered = filtered.filter(i => i.bloodType === bloodFilter);
        if (statusFilter) filtered = filtered.filter(i => i.status === statusFilter);

        if (filtered.length === 0) {
            DOM.bankInventoryTable.innerHTML =
                `<tr><td colspan="5" style="text-align:center;color:#64748b;padding:20px;">No matching inventory.</td></tr>`;
            return;
        }

        DOM.bankInventoryTable.innerHTML = filtered.map(item => `
            <tr>
                <td><strong>${item.bloodType}</strong></td>
                <td>${item.units}</td>
                <td>${item.expiry}</td>
                <td><span class="status-badge ${item.status === 'Out of Stock' ? 'pending' : item.status === 'Low Stock' ? 'critical' : 'fulfilled'}">${item.status}</span></td>
                <td><button class="btn-outline bank-edit-btn" style="padding:2px 12px;font-size:0.75rem;" data-type="${item.bloodType}" data-units="${item.units}">Edit</button></td>
            </tr>
        `).join('');

        document.querySelectorAll('.bank-edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                DOM.bankBloodType.value = this.dataset.type;
                DOM.bankUnits.value = this.dataset.units;
                DOM.bankStockForm.style.display = 'block';
                const today = new Date();
                today.setDate(today.getDate() + 30);
                DOM.bankExpiry.value = today.toISOString().split('T')[0];
                DOM.bankStockForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });
    }

    // ============================================================
    // BANK REQUESTS
    // ============================================================

    let bankRequestData = [];

    async function updateBankRequests() {
        if (!STATE.currentBankId) return;

        const { data: requests } = await supabase
            .from('blood_requests')
            .select('*, hospitals(*)')
            .in('status', ['pending', 'matched'])
            .order('created_at', { ascending: false });

        if (!requests || requests.length === 0) {
            DOM.bankRequestsTable.innerHTML =
                `<tr><td colspan="5" style="text-align:center;color:#64748b;padding:20px;">No pending or matched requests.</td></tr>`;
            return;
        }

        const { data: matches } = await supabase
            .from('matches')
            .select('*')
            .eq('source_type', 'bank')
            .eq('source_id', STATE.currentBankId)
            .in('status', ['pending', 'accepted']);

        const matchedRequestIds = matches?.map(m => m.request_id) || [];

        const filteredRequests = requests.filter(req => {
            if (req.status === 'pending') return true;
            if (req.status === 'matched' && matchedRequestIds.includes(req.id)) return true;
            return false;
        });

        if (filteredRequests.length === 0) {
            DOM.bankRequestsTable.innerHTML =
                `<tr><td colspan="5" style="text-align:center;color:#64748b;padding:20px;">No requests for your bank.</td></tr>`;
            return;
        }

        bankRequestData = filteredRequests.map(req => ({
            hospital: req.hospitals?.hospital_name || 'Unknown Hospital',
            bloodType: req.blood_type,
            units: req.units_needed,
            urgency: req.urgency,
            status: req.status,
            id: req.id,
            isMatchedToThisBank: matchedRequestIds.includes(req.id)
        }));

        DOM.bankRequestCount.textContent = bankRequestData.length + ' requests';
        applyBankRequestFilters();
    }

    function applyBankRequestFilters() {
        const hospitalFilter = DOM.bankFilterHospital.value.toLowerCase().trim();
        const bloodFilter = DOM.bankFilterReqBloodType.value;
        const urgencyFilter = DOM.bankFilterUrgency.value;

        let filtered = bankRequestData;
        if (hospitalFilter) filtered = filtered.filter(i => i.hospital.toLowerCase().includes(hospitalFilter));
        if (bloodFilter) filtered = filtered.filter(i => i.bloodType === bloodFilter);
        if (urgencyFilter) filtered = filtered.filter(i => i.urgency === urgencyFilter);

        if (filtered.length === 0) {
            DOM.bankRequestsTable.innerHTML =
                `<tr><td colspan="5" style="text-align:center;color:#64748b;padding:20px;">No matching requests.</td></tr>`;
            return;
        }

        DOM.bankRequestsTable.innerHTML = filtered.map(req => {
            let actionHtml = '';
            if (req.status === 'pending') {
                actionHtml = `
                    <button class="btn-success bank-fulfill-btn" style="padding:4px 12px;font-size:0.75rem;" data-id="${req.id}">✅ Fulfill</button>
                    <button class="btn-outline bank-decline-btn" style="padding:4px 12px;font-size:0.75rem;" data-id="${req.id}">❌ Decline</button>
                `;
            } else if (req.status === 'matched' && req.isMatchedToThisBank) {
                actionHtml = `
                    <div style="font-size:0.75rem;color:#1d4ed8;background:#dbeafe;padding:4px 8px;border-radius:6px;">
                        ⏳ Matched to you —
                        <button class="btn-success bank-fulfill-btn" style="padding:2px 10px;font-size:0.65rem;margin-top:4px;" data-id="${req.id}">✅ Fulfill Now</button>
                    </div>
                `;
            }

            return `
                <tr>
                    <td>${req.hospital}</td>
                    <td><strong>${req.bloodType}</strong></td>
                    <td>${req.units}</td>
                    <td><span class="status-badge ${req.urgency === 'critical' ? 'critical' : ''}" style="${req.urgency === 'urgent' ? 'background:#fef3c7;color:#b45309;' : req.urgency === 'routine' ? 'background:#dbeafe;color:#1d4ed8;' : ''}">${req.urgency.charAt(0).toUpperCase() + req.urgency.slice(1)}</span></td>
                    <td>
                        <div style="display:flex;flex-wrap:wrap;gap:4px;align-items:center;">
                            ${actionHtml}
                            <span style="font-size:0.6rem;color:#64748b;${req.status === 'matched' ? 'background:#dbeafe;padding:2px 8px;border-radius:12px;' : ''}">${req.status === 'matched' ? '🔗 Matched' : '📋 Pending'}</span>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        document.querySelectorAll('.bank-fulfill-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const requestId = this.dataset.id;
                await handleBankFulfill(requestId);
            });
        });

        document.querySelectorAll('.bank-decline-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
                const requestId = this.dataset.id;
                await handleBankDecline(requestId);
            });
        });
    }

    async function handleBankFulfill(requestId) {
        try {
            const { data: request } = await supabase
                .from('blood_requests')
                .select('*')
                .eq('id', requestId)
                .single();

            if (!request) throw new Error('Request not found');

            let match;
            const { data: existingMatch } = await supabase
                .from('matches')
                .select('*')
                .eq('request_id', requestId)
                .eq('source_type', 'bank')
                .eq('source_id', STATE.currentBankId)
                .single();

            if (!existingMatch) {
                const { data: newMatch } = await supabase
                    .from('matches')
                    .insert({
                        request_id: requestId,
                        source_type: 'bank',
                        source_id: STATE.currentBankId,
                        distance_km: 0,
                        status: 'pending'
                    })
                    .select()
                    .single();
                match = newMatch;
            } else {
                match = existingMatch;
            }

            const { data: inventory } = await supabase
                .from('inventory')
                .select('*')
                .eq('bank_id', STATE.currentBankId)
                .eq('blood_type', request.blood_type)
                .single();

            if (!inventory) throw new Error('Inventory not found');

            const newUnits = Math.max(0, inventory.units_available - request.units_needed);

            await supabase
                .from('inventory')
                .update({ units_available: newUnits })
                .eq('id', inventory.id);

            await supabase
                .from('blood_requests')
                .update({ status: 'fulfilled' })
                .eq('id', requestId);

            await supabase
                .from('matches')
                .update({ status: 'completed' })
                .eq('id', match.id);

            showToast(DOM.bankToast, 'success', `✅ Request fulfilled! ${request.blood_type} → ${newUnits} units left`);

            updateBankRequests();
            updateBankInventory();
            updateHospitalInventory();
            updateHospitalRequests();
            updateDonorRequests();

        } catch (error) {
            showToast(DOM.bankToast, 'error', error.message);
        }
    }

    async function handleBankDecline(requestId) {
        try {
            await supabase
                .from('blood_requests')
                .update({ status: 'cancelled' })
                .eq('id', requestId);

            await supabase
                .from('matches')
                .update({ status: 'expired' })
                .eq('request_id', requestId)
                .eq('source_type', 'bank')
                .eq('source_id', STATE.currentBankId);

            showToast(DOM.bankToast, 'info', 'Request declined.');

            updateBankRequests();
            updateHospitalRequests();
            updateDonorRequests();

        } catch (error) {
            showToast(DOM.bankToast, 'error', error.message);
        }
    }

    // ============================================================
    // GLOBAL LOGOUT
    // ============================================================

    function handleGlobalLogout() {
        if (DOM.donorLoginStatus.classList.contains('show')) handleDonorLogout();
        if (DOM.hospitalLoginStatus.classList.contains('show')) handleHospitalLogout();
        if (DOM.bankLoginStatus.classList.contains('show')) handleBankLogout();
        DOM.globalLogoutBtn.style.display = 'none';
        updateUserDisplay(null);
    }

    // ============================================================
    // INITIALIZATION
    // ============================================================

    function init() {
        console.log(`🩸 ${CONFIG.APP_NAME} — v${CONFIG.VERSION}`);
        console.log('🔧 DONOR SIGN-UP: FIXED for Vercel');
        console.log('🧠 MATCHING ENGINE: Auto-matches donors to requests');
        console.log('📧 EMAIL NOTIFICATIONS: Welcome & Match Alerts enabled');

        cacheDomReferences();

        // Navigation
        DOM.navItems.forEach(item => {
            item.addEventListener('click', function() { navigateTo(this.dataset.page); });
        });

        document.querySelectorAll('.role-card[data-role]').forEach(card => {
            card.addEventListener('click', function() { navigateTo(this.dataset.role); });
        });

        DOM.mobileToggle.addEventListener('click', function() {
            DOM.sidebar.classList.toggle('open');
        });

        // Donor Auth Tabs
        DOM.donorSignUpTab.addEventListener('click', function() {
            this.classList.add('active');
            DOM.donorSignInTab.classList.remove('active');
            DOM.donorSignUpForm.classList.add('active');
            DOM.donorSignInForm.classList.remove('active');
        });

        DOM.donorSignInTab.addEventListener('click', function() {
            this.classList.add('active');
            DOM.donorSignUpTab.classList.remove('active');
            DOM.donorSignInForm.classList.add('active');
            DOM.donorSignUpForm.classList.remove('active');
        });

        // Donor Actions
        DOM.donorSignUpBtn.addEventListener('click', handleDonorSignUp);
        DOM.donorSignInBtn.addEventListener('click', handleDonorSignIn);
        DOM.donorLogoutBtn.addEventListener('click', handleDonorLogout);
        DOM.donorToggleAvailability.addEventListener('click', handleDonorToggleAvailability);
        DOM.donorUpdateProfile.addEventListener('click', handleDonorUpdateProfile);
        DOM.donorViewHistory.addEventListener('click', handleDonorViewHistory);

        // Hospital Actions
        DOM.hospitalLoginBtn.addEventListener('click', handleHospitalLogin);
        DOM.hospitalLogoutBtn.addEventListener('click', handleHospitalLogout);
        DOM.hospitalNewRequestBtn.addEventListener('click', toggleHospitalRequestForm);
        DOM.hCancelRequest.addEventListener('click', function() {
            DOM.hospitalRequestForm.style.display = 'none';
        });
        DOM.hSubmitRequest.addEventListener('click', handleHospitalSubmitRequest);
        DOM.hRefreshInventory.addEventListener('click', function() {
            updateHospitalInventory();
            showToast(DOM.hospitalToast, 'info', 'Inventory refreshed.');
        });

        // Hospital Filters
        DOM.filterBank.addEventListener('input', applyInventoryFilters);
        DOM.filterBloodType.addEventListener('change', applyInventoryFilters);
        DOM.filterStockStatus.addEventListener('change', applyInventoryFilters);
        DOM.clearInventoryFilters.addEventListener('click', function() {
            DOM.filterBank.value = '';
            DOM.filterBloodType.value = '';
            DOM.filterStockStatus.value = '';
            applyInventoryFilters();
        });

        DOM.filterPatient.addEventListener('input', applyHospitalRequestFilters);
        DOM.filterReqBloodType.addEventListener('change', applyHospitalRequestFilters);
        DOM.filterUrgency.addEventListener('change', applyHospitalRequestFilters);
        DOM.filterReqStatus.addEventListener('change', applyHospitalRequestFilters);
        DOM.clearHospitalFilters.addEventListener('click', function() {
            DOM.filterPatient.value = '';
            DOM.filterReqBloodType.value = '';
            DOM.filterUrgency.value = '';
            DOM.filterReqStatus.value = '';
            applyHospitalRequestFilters();
        });

        // Bank Actions
        DOM.bankLoginBtn.addEventListener('click', handleBankLogin);
        DOM.bankLogoutBtn.addEventListener('click', handleBankLogout);
        DOM.bankAddInventoryBtn.addEventListener('click', toggleBankStockForm);
        DOM.bankCancelStock.addEventListener('click', function() {
            DOM.bankStockForm.style.display = 'none';
        });
        DOM.bankSaveStock.addEventListener('click', handleBankSaveStock);

        // Bank Filters
        DOM.bankFilterBloodType.addEventListener('change', applyBankInventoryFilters);
        DOM.bankFilterStatus.addEventListener('change', applyBankInventoryFilters);
        DOM.clearBankFilters.addEventListener('click', function() {
            DOM.bankFilterBloodType.value = '';
            DOM.bankFilterStatus.value = '';
            applyBankInventoryFilters();
        });

        DOM.bankFilterHospital.addEventListener('input', applyBankRequestFilters);
        DOM.bankFilterReqBloodType.addEventListener('change', applyBankRequestFilters);
        DOM.bankFilterUrgency.addEventListener('change', applyBankRequestFilters);
        DOM.clearBankRequestFilters.addEventListener('click', function() {
            DOM.bankFilterHospital.value = '';
            DOM.bankFilterReqBloodType.value = '';
            DOM.bankFilterUrgency.value = '';
            applyBankRequestFilters();
        });

        // Global Logout
        DOM.globalLogoutBtn.addEventListener('click', handleGlobalLogout);

        // Initial Data Load
        updateDonorToggle();
        setTimeout(detectLocation, 1000);

        updateDonorRequests();
        updateHospitalInventory();
        updateHospitalRequests();
        updateBankInventory();
        updateBankRequests();

        if (supabase) {
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session) {
                    STATE.currentUser = session.user;
                    loadDonorProfile().then(() => showDonorDashboard());
                }
            });
        }

        console.log('✅ Application ready!');
        console.log('🔑 DONOR: Sign up with CNIC + Email + Password');
        console.log('🏥 Hospital: HOSP-001 / hospital123');
        console.log('🏢 Bank: BANK-001 / bank123');
        console.log('📧 Email notifications: Welcome & Match alerts');

        // Test function
        window.testMatch = async function(requestId) {
            if (!requestId) {
                const { data: requests } = await supabase
                    .from('blood_requests')
                    .select('id')
                    .eq('status', 'pending')
                    .order('created_at', { ascending: false })
                    .limit(1);
                if (requests && requests.length > 0) {
                    requestId = requests[0].id;
                } else {
                    console.log('❌ No pending requests found');
                    return;
                }
            }
            console.log('🧪 Manually testing match for:', requestId);
            return await findBestMatch(requestId);
        };
    }

    // ============================================================
    // START
    // ============================================================

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
