// src/stores/global.js - Fixed implementation with improved authentication handling
import axios from 'axios';
import { defineStore } from 'pinia';
// Utility function to clear token and related storage
function clearToken() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('is_check_usr');
    // Clear any cookies that might store authentication data
    document.cookie.split(";").forEach(function (c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    // console.log('All tokens cleared');
}

export const useGlobalStore = defineStore('global', {
    state: () => ({
        profile: null,
        token: localStorage.getItem('token') || '',
        is_remember: true,
        mdl_logout: null,
        isLoading: false,
        // Add an explicit authentication state flag
        isAuthenticated: false
    }),

    getters: {
        getUser: (state) => state.profile,

        // FIXED: Improved authenticated check that ensures both token and profile exist
        getIsAuthenticated: (state) => {
            const hasToken = !!state.token;
            const hasProfile = !!state.profile;
            return hasToken && hasProfile;
        },

        getUserInitials: (state) => {
            if (!state.profile) return '';

            const firstNameInitial = state.profile.first_name ? state.profile.first_name.charAt(0).toUpperCase() : '';
            const lastNameInitial = state.profile.last_name ? state.profile.last_name.charAt(0).toUpperCase() : '';

            return `${firstNameInitial}${lastNameInitial}`;
        },

        getUserFullName: (state) => {
            if (!state.profile) return '';
            return `${state.profile.first_name} ${state.profile.last_name}`;
        },

        // FIXED: Added an explicit isLogin getter for compatibility
        isLogin: (state) => !!state.token && !!state.profile
    },

    actions: {
        getAxiosHeader() {
            return {
                headers: {
                    Authorization: `Bearer ${this.token}`
                }
            }
        },

        async onCheckError(err, router = null) {
            if (err.code === 'ERR_NETWORK') {
                alert('Error connection! Please check internet connection, then try again.')
            } else if (err.response && err.response.status === 401) {
                // console.log('Unauthorized access, clearing authentication');
                this.clearAuthentication();
                alert('No authorization')
            } else if (err.response && err.response.status === 403) {
                // console.log('Forbidden access, clearing authentication');
                this.clearAuthentication();

                if (router) {
                    await router.push('/login')
                } else if (window.router) {
                    await window.router.push('/login')
                }
            }
        },

        // FIXED: Added method to clear all authentication data
        clearAuthentication() {
            this.profile = null;
            this.token = '';
            this.isAuthenticated = false;
            clearToken();
        },

        // FIXED: New method that combines clearAuthData for compatibility
        clearAuthData() {
            this.clearAuthentication();
        },

        async fetchUserProfile() {
            try {
                this.isLoading = true;
                // Check if we have a token
                if (!this.token) {
                    // console.log('No token available, clearing profile');
                    this.profile = null;
                    this.isAuthenticated = false;
                    return;
                }
                // console.log('Fetching user profile with token:', !!this.token);
                const response = await axios.get('/api/web/auth/me', this.getAxiosHeader());
                if (response.data.result) {
                    // console.log('User profile fetched successfully');
                    // Store the profile data
                    this.profile = response.data.data;
                    // Update authentication state
                    this.isAuthenticated = true;
                    // Use a more reactive approach by returning the profile
                    return this.profile;
                } else {
                    console.error('Failed to fetch user profile:', response.data.message);
                    this.profile = null;
                    this.isAuthenticated = false;
                    this.clearAuthentication();
                    return null;
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                this.profile = null;
                this.isAuthenticated = false;
                // Handle error with onCheckError
                await this.onCheckError(error);
                return null;
            } finally {
                this.isLoading = false;
            }
        },
        updateProfile(profileData) {
            if (profileData) {
                // console.log('Updating profile with new data');
                this.profile = profileData;
                this.isAuthenticated = true;
            } else {
                // console.log('Clearing profile data');
                this.profile = null;
                this.isAuthenticated = false;
            }
        },
        // Modify the updateToken method to trigger profile fetch
        updateToken(token) {
            // console.log('Updating token:', !!token);
            const oldToken = this.token;
            this.token = token;

            if (token) {
                localStorage.setItem('token', token);
                this.isAuthenticated = true;
                if (token !== oldToken) {
                    // console.log('Token changed, fetching new profile');
                    this.fetchUserProfile();
                }
            } else {
                localStorage.removeItem('token');

                // Clear authentication state
                this.isAuthenticated = false;
                this.profile = null;
            }
        },


        // FIXED: Improved logout method with proper cleanup
        async logout() {
            // console.log('Logging out...');
            try {
                if (this.token) {
                    await axios.post('/api/web/auth/logout', {}, this.getAxiosHeader())
                        // .then(response => {
                        //     // console.log('Logout API response:', response.data);
                        // })
                        .catch(error => {
                            console.warn('API logout failed, but continuing with local logout:', error);
                        });
                }
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                // console.log('Clearing all authentication data');
                this.profile = null;
                this.token = '';
                this.isAuthenticated = false;

                // Clear all tokens
                clearToken();
            }
        },

        async initApp() {
            // console.log('Initializing app and checking authentication...');
            if (this.token) {
                try {
                    await this.fetchUserProfile();
                } catch (error) {
                    console.error('Error during app initialization:', error);
                    this.clearAuthentication();
                }
            } else {
                // console.log('No token found, user is not authenticated');
                this.isAuthenticated = false;
            }
        }
    }
});