// Token manager for in-memory storage fallback
// Zalo Mini App does not support localStorage/cookies reliably

class TokenManager {
  constructor() {
    this.accessToken = null;
    this.user = null;
    this.tenant = null;
  }

  setToken(token) {
    this.accessToken = token;
  }

  getToken() {
    return this.accessToken;
  }

  setUser(user) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }

  setTenant(tenant) {
    this.tenant = tenant;
  }

  getTenant() {
    return this.tenant;
  }

  clear() {
    this.accessToken = null;
    this.user = null;
    this.tenant = null;
  }
}

export const tokenManager = new TokenManager();
