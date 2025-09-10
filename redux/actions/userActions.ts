import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "@/config";

export interface RegisterPayload {
  name: string;
  surname: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  email: string;
  verificationCode: number;
}

export interface ResetPasswordPayload {
  email: string;
  passwordToken: number;
  newPassword: string;
}

export interface EditProfilePayload {
  name: string;
  email: string;
  password: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  phoneNumber?: string;
  picture?: string;
  bio?: string;
  skills?: string[];
  theme?: string;
}

export interface CreateListingPayload {
  title: string;
  description: string;
  category: string;
  location: string;
  image?: string;
  experience: string;
  instrument?: string;
  type?: string;
}

export interface UpdateListingPayload {
  title?: string;
  description?: string;
  category?: string;
  location?: string;
  image?: string;
  experience?: string;
  instrument?: string;
  type?: string;
  status?: string;
}

export interface CreateCategoryPayload {
  name: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  active?: boolean;
}

export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
  page?: string;
  limit?: string;
  [key: string]: string | undefined;
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
}

export interface StartConversationPayload {
  recipientId: string;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  sender?: {
    _id: string;
    name: string;
    surname: string;
    picture?: string;
  };
}

export interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  otherParticipant: {
    _id: string;
    name: string;
    surname: string;
    picture?: string;
  };
}

export const register = createAsyncThunk(
  "user/register",
  async (payload: RegisterPayload, thunkAPI) => {
    try {
      const { data } = await axios.post(`${server}/auth/register`, payload);
      localStorage.setItem("accessToken", data.user.token);
      return data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (payload: LoginPayload, thunkAPI) => {
    try {
      const { data } = await axios.post(`${server}/auth/login`, payload);
      localStorage.setItem("accessToken", data.user.token);
      return data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const { data } = await axios.get(`${server}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data.user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

export const logout = createAsyncThunk("user/logout", async (_, thunkAPI) => {
  try {
    const token = localStorage.getItem("accessToken");
    const { data } = await axios.get(`${server}/auth/logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.removeItem("accessToken");
    return data.message;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});

export const verifyEmail = createAsyncThunk(
  "user/verifyEmail",
  async (payload: VerifyEmailPayload, thunkAPI) => {
    try {
      const { data } = await axios.post(`${server}/auth/verify-email`, payload);
      return data.message;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const againEmail = createAsyncThunk(
  "user/againEmail",
  async (email: string, thunkAPI) => {
    try {
      await axios.post(`${server}/auth/again-email`, { email });
      return;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email: string, thunkAPI) => {
    try {
      const { data } = await axios.post(`${server}/auth/forgot-password`, { email });
      return data.message;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (payload: ResetPasswordPayload, thunkAPI) => {
    try {
      const { data } = await axios.post(`${server}/auth/reset-password`, payload);
      return data.message;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const editProfile = createAsyncThunk(
  "user/editProfile",
  async (formData: EditProfilePayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${server}/auth/edit-profile`,
        formData,
        config
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Listing Actions
export const createListing = createAsyncThunk(
  "user/createListing",
  async (formData: CreateListingPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      }
      
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${server}/listings`,
        formData,
        config
      );
      return response.data;
    } catch (error: any) {
      console.error("Create listing error:", error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || "Sunucu hatası";
        
        if (status === 401) {
          return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        } else if (status === 403) {
          return thunkAPI.rejectWithValue("Bu işlem için yetkiniz yok.");
        } else if (status === 404) {
          return thunkAPI.rejectWithValue("İstenen kaynak bulunamadı.");
        } else if (status === 400) {
          return thunkAPI.rejectWithValue(message);
        } else {
          return thunkAPI.rejectWithValue(`Sunucu hatası (${status}): ${message}`);
        }
      } else if (error.request) {
        return thunkAPI.rejectWithValue("Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.");
      } else {
        return thunkAPI.rejectWithValue(error.message || "Bilinmeyen bir hata oluştu.");
      }
    }
  }
);

export const getAllListings = createAsyncThunk(
  "user/getAllListings",
  async (params: any = {}, thunkAPI) => {
    try {
      // Filter out undefined values before creating URLSearchParams
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
      ) as Record<string, string>;
      const queryString = new URLSearchParams(filteredParams).toString();
      const url = `${server}/listings${queryString ? `?${queryString}` : ''}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const getUserListings = createAsyncThunk(
  "user/getUserListings",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${server}/listings/user/me`,
        config
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const updateListing = createAsyncThunk(
  "user/updateListing",
  async ({ id, formData }: { id: string; formData: UpdateListingPayload }, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      }
      
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${server}/listings/${id}`,
        formData,
        config
      );
      return response.data;
    } catch (error: any) {
      console.error("Update listing error:", error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || "Sunucu hatası";
        
        if (status === 401) {
          return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        } else if (status === 403) {
          return thunkAPI.rejectWithValue("Bu işlem için yetkiniz yok.");
        } else if (status === 404) {
          return thunkAPI.rejectWithValue("İlan bulunamadı.");
        } else if (status === 400) {
          return thunkAPI.rejectWithValue(message);
        } else {
          return thunkAPI.rejectWithValue(`Sunucu hatası (${status}): ${message}`);
        }
      } else if (error.request) {
        return thunkAPI.rejectWithValue("Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.");
      } else {
        return thunkAPI.rejectWithValue(error.message || "Bilinmeyen bir hata oluştu.");
      }
    }
  }
);

export const deleteListing = createAsyncThunk(
  "user/deleteListing",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete(
        `${server}/listings/${id}`,
        config
      );
      return { id, message: response.data.message };
    } catch (error: any) {
      console.error("Delete listing error:", error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || "Sunucu hatası";
        
        if (status === 401) {
          return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        } else if (status === 403) {
          return thunkAPI.rejectWithValue("Bu işlem için yetkiniz yok.");
        } else if (status === 404) {
          return thunkAPI.rejectWithValue("İlan bulunamadı.");
        } else if (status === 400) {
          return thunkAPI.rejectWithValue(message);
        } else {
          return thunkAPI.rejectWithValue(`Sunucu hatası (${status}): ${message}`);
        }
      } else if (error.request) {
        return thunkAPI.rejectWithValue("Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.");
      } else {
        return thunkAPI.rejectWithValue(error.message || "Bilinmeyen bir hata oluştu.");
      }
    }
  }
);

export const toggleListingStatus = createAsyncThunk(
  "user/toggleListingStatus",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(
        `${server}/listings/${id}/toggle-status`,
        {},
        config
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Admin listing management actions
export const getPendingListings = createAsyncThunk(
  "user/getPendingListings",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${server}/listings/admin/pending`,
        config
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const approveListing = createAsyncThunk(
  "user/approveListing",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(
        `${server}/listings/${id}/approve`,
        {},
        config
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const rejectListing = createAsyncThunk(
  "user/rejectListing",
  async ({ id, reason }: { id: string; reason: string }, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(
        `${server}/listings/${id}/reject`,
        { reason },
        config
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Category Actions
export const createCategory = createAsyncThunk(
  "user/createCategory",
  async (formData: CreateCategoryPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      }
      
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${server}/listing-categories`,
        formData,
        config
      );
      return response.data;
    } catch (error: any) {
      console.error("Create category error:", error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || "Sunucu hatası";
        
        if (status === 401) {
          return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        } else if (status === 403) {
          return thunkAPI.rejectWithValue("Bu işlem için yetkiniz yok.");
        } else if (status === 404) {
          return thunkAPI.rejectWithValue("İstenen kaynak bulunamadı.");
        } else if (status === 400) {
          return thunkAPI.rejectWithValue(message);
        } else {
          return thunkAPI.rejectWithValue(`Sunucu hatası (${status}): ${message}`);
        }
      } else if (error.request) {
        return thunkAPI.rejectWithValue("Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.");
      } else {
        return thunkAPI.rejectWithValue(error.message || "Bilinmeyen bir hata oluştu.");
      }
    }
  }
);

export const getAllCategories = createAsyncThunk(
  "user/getAllCategories",
  async (params: any = {}, thunkAPI) => {
    try {
      // Filter out undefined values before creating URLSearchParams
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined)
      ) as Record<string, string>;
      const queryString = new URLSearchParams(filteredParams).toString();
      const url = `${server}/listing-categories${queryString ? `?${queryString}` : ''}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const updateCategory = createAsyncThunk(
  "user/updateCategory",
  async ({ id, formData }: { id: string; formData: UpdateCategoryPayload }, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      }
      
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${server}/listing-categories/${id}`,
        formData,
        config
      );
      return response.data;
    } catch (error: any) {
      console.error("Update category error:", error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || "Sunucu hatası";
        
        if (status === 401) {
          return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        } else if (status === 403) {
          return thunkAPI.rejectWithValue("Bu işlem için yetkiniz yok.");
        } else if (status === 404) {
          return thunkAPI.rejectWithValue("Kategori bulunamadı.");
        } else if (status === 400) {
          return thunkAPI.rejectWithValue(message);
        } else {
          return thunkAPI.rejectWithValue(`Sunucu hatası (${status}): ${message}`);
        }
      } else if (error.request) {
        return thunkAPI.rejectWithValue("Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.");
      } else {
        return thunkAPI.rejectWithValue(error.message || "Bilinmeyen bir hata oluştu.");
      }
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "user/deleteCategory",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete(
        `${server}/listing-categories/${id}`,
        config
      );
      return { id, message: response.data.message };
    } catch (error: any) {
      console.error("Delete category error:", error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || "Sunucu hatası";
        
        if (status === 401) {
          return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        } else if (status === 403) {
          return thunkAPI.rejectWithValue("Bu işlem için yetkiniz yok.");
        } else if (status === 404) {
          return thunkAPI.rejectWithValue("Kategori bulunamadı.");
        } else if (status === 400) {
          return thunkAPI.rejectWithValue(message);
        } else {
          return thunkAPI.rejectWithValue(`Sunucu hatası (${status}): ${message}`);
        }
      } else if (error.request) {
        return thunkAPI.rejectWithValue("Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.");
      } else {
        return thunkAPI.rejectWithValue(error.message || "Bilinmeyen bir hata oluştu.");
      }
    }
  }
);

export const toggleCategoryStatus = createAsyncThunk(
  "user/toggleCategoryStatus",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      }
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(
        `${server}/listing-categories/${id}/toggle-status`,
        {},
        config
      );
      return response.data;
    } catch (error: any) {
      console.error("Toggle category status error:", error);
      
      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.message || error.response.data?.error || "Sunucu hatası";
        
        if (status === 401) {
          return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        } else if (status === 403) {
          return thunkAPI.rejectWithValue("Bu işlem için yetkiniz yok.");
        } else if (status === 404) {
          return thunkAPI.rejectWithValue("Kategori bulunamadı.");
        } else if (status === 400) {
          return thunkAPI.rejectWithValue(message);
        } else {
          return thunkAPI.rejectWithValue(`Sunucu hatası (${status}): ${message}`);
        }
      } else if (error.request) {
        return thunkAPI.rejectWithValue("Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.");
      } else {
        return thunkAPI.rejectWithValue(error.message || "Bilinmeyen bir hata oluştu.");
      }
    }
  }
);

// User Management Actions (Admin only)
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (params: Record<string, string> = {}, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const queryString = new URLSearchParams(params).toString();
      const url = `${server}/auth/users${queryString ? `?${queryString}` : ''}`;
      const response = await axios.get(url, config);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.delete(
        `${server}/auth/users/${id}`,
        config
      );
      return { id, message: response.data.message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Messaging Actions
export const getConversations = createAsyncThunk(
  "user/getConversations",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${server}/messages/conversations`, config);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const getMessages = createAsyncThunk(
  "user/getMessages",
  async ({ conversationId, page = 1, limit = 50 }: { conversationId: string; page?: number; limit?: number }, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${server}/messages/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
        config
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  "user/sendMessage",
  async (payload: SendMessagePayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${server}/messages/send`,
        payload,
        config
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const startConversation = createAsyncThunk(
  "user/startConversation",
  async (payload: StartConversationPayload, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${server}/messages/conversations/start`,
        payload,
        config
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const markAsRead = createAsyncThunk(
  "user/markAsRead",
  async (conversationId: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.patch(
        `${server}/messages/conversations/${conversationId}/read`,
        {},
        config
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

export const getUnreadCount = createAsyncThunk(
  "user/getUnreadCount",
  async (_, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${server}/messages/unread-count`, config);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get all instruments (public - no authentication required)
export const getAllInstruments = createAsyncThunk(
  "user/getAllInstruments",
  async (params: { active?: boolean } = {}, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.active !== undefined) {
        queryParams.append('active', params.active.toString());
      }
      
      const response = await axios.get(`${server}/instruments?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Update Theme Action
export const updateTheme = createAsyncThunk(
  "user/updateTheme",
  async (theme: string, thunkAPI) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return thunkAPI.rejectWithValue("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
      }
      
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `${server}/auth/edit-profile`,
        { theme },
        config
      );
      return { theme, message: response.data.message };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Clear Error Action
export const clearError = createAsyncThunk(
  "user/clearError",
  async () => {
    return null;
  }
);

