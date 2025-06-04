// src/stores/global.js 
import axios from 'axios';
import { defineStore } from 'pinia';
function clearToken() {
    localStorage.removeItem('token');
    sessionStorage.removeItem('is_check_usr');
    document.cookie.split(";").forEach(function (c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
}
export const useGlobalStore = defineStore('global', {
    state: () => ({
        profile: null,
        token: localStorage.getItem('token') || '',
        is_remember: true,
        mdl_logout: null,
        isLoading: false,
        isAuthenticated: false
    }),
    getters: {
        getUser: (state) => state.profile,
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
                this.clearAuthentication();
                alert('No authorization')
            } else if (err.response && err.response.status === 403) {
                this.clearAuthentication();
                if (router) {
                    await router.push('/login')
                } else if (window.router) {
                    await window.router.push('/login')
                }
            }
        },
        clearAuthentication() {
            this.profile = null;
            this.token = '';
            this.isAuthenticated = false;
            clearToken();
        },
        clearAuthData() {
            this.clearAuthentication();
        },
        async fetchUserProfile() {
            try {
                this.isLoading = true;
                if (!this.token) {
                    this.profile = null;
                    this.isAuthenticated = false;
                    return;
                }
                const response = await axios.get('/api/web/auth/me', this.getAxiosHeader());
                if (response.data.result) {
                    this.profile = response.data.data;
                    this.isAuthenticated = true;
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
                await this.onCheckError(error);
                return null;
            } finally {
                this.isLoading = false;
            }
        },
        updateProfile(profileData) {
            if (profileData) {
                this.profile = profileData;
                this.isAuthenticated = true;
            } else {
                this.profile = null;
                this.isAuthenticated = false;
            }
        },
        updateToken(token) {
            const oldToken = this.token;
            this.token = token;
            if (token) {
                localStorage.setItem('token', token);
                this.isAuthenticated = true;
                if (token !== oldToken) {
                    this.fetchUserProfile();
                }
            } else {
                localStorage.removeItem('token');
                this.isAuthenticated = false;
                this.profile = null;
            }
        },
        async logout() {
            try {
                if (this.token) {
                    await axios.post('/api/web/auth/logout', {}, this.getAxiosHeader())
                        .catch(error => {
                            console.warn('API logout failed, but continuing with local logout:', error);
                        });
                }
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                this.profile = null;
                this.token = '';
                this.isAuthenticated = false;
                clearToken();
            }
        },
        async initApp() {
            if (this.token) {
                try {
                    await this.fetchUserProfile();
                } catch (error) {
                    console.error('Error during app initialization:', error);
                    this.clearAuthentication();
                }
            } else {
                this.isAuthenticated = false;
            }
        }
    }
});